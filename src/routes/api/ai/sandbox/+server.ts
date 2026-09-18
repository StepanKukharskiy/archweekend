import type { RequestHandler } from '@sveltejs/kit';
import { json, error } from '@sveltejs/kit';
import { env } from '$env/dynamic/private';
import { creditStore } from '$lib/server/recovery-credits';

const TOGETHER_BASE = 'https://api.together.xyz/v1';

const DEFAULT_TEXT_MODEL = 'openai/gpt-oss-120b';
const DEFAULT_IMAGE_MODEL = 'black-forest-labs/FLUX.2-pro';

function getSizeForAspect(aspect: string) {
  // Sizes compatible with FLUX-style models on Together
  switch (aspect) {
    case 'landscape':
      return { width: 1344, height: 768 }; // ~16:9
    case 'portrait':
      return { width: 768, height: 1344 }; // ~9:16
    case 'square':
    default:
      return { width: 1024, height: 1024 };
  }
}

function getSizeForGemini(aspect: string) {
  // Gemini models require exact width/height dimensions from the supported list
  // Supported values: '1024x1024', '2048x2048', '4096x4096', '1264x848', '2528x1696', 
  // '5096x3392', '5056x3392', '848x1264', '1696x2528', '3392x5096', '3392x5056', etc.
  switch (aspect) {
    case 'landscape':
      return { width: 2528, height: 1696 }; // 3:2 aspect ratio (supported)
    case 'portrait':
      return { width: 1696, height: 2528 }; // 2:3 aspect ratio (supported)
    case 'square':
    default:
      return { width: 2048, height: 2048 }; // 1:1 aspect ratio (supported)
  }
}

export const POST: RequestHandler = async ({ request, locals, url }) => {
  // Check authentication
  if (!locals.user) {
    throw error(401, 'Authentication required. Please sign in to use AI sandbox.');
  }

  if (request.headers.get('origin') !== url.origin) throw error(403, 'Invalid request origin.');
  const recovery = locals.user.access === 'recovery';

  const togetherApiKey = env.TOGETHER_API_KEY;

  if (!togetherApiKey) {
    console.error('Missing TOGETHER_API_KEY in environment');
    throw error(500, 'Together AI API key is not configured on the server.');
  }

  const body = await request.json().catch(() => null);

  if (!body || (body.mode !== 'text' && body.mode !== 'image')) {
    throw error(400, 'Invalid request body. Expected { mode: "text" | "image", prompt?: string, imageUrls?: string[] }.');
  }

  const mode = body.mode as 'text' | 'image';
  const prompt = (body.prompt as string | undefined) || '';
  const textModel = (body.textModel as string | undefined) || DEFAULT_TEXT_MODEL;
  const imageModel = (body.imageModel as string | undefined) || DEFAULT_IMAGE_MODEL;
  const aspect = (body.aspectRatio as string | undefined) || 'square';
  const imageUrls = body.imageUrls as string[] | undefined; // base64 encoded images (may include data URL prefix)

  if (typeof prompt !== 'string' || prompt.length > 32000) throw error(400, 'Invalid prompt.');
  if (imageUrls && (!Array.isArray(imageUrls) || imageUrls.length > 4 || imageUrls.some((image) => typeof image !== 'string' || image.length > 8_000_000))) throw error(400, 'Invalid reference images.');
  if (mode === 'text' && !['openai/gpt-oss-120b', 'meta-llama/Llama-4-Maverick-17B-128E-Instruct-FP8'].includes(textModel)) throw error(400, 'Unsupported text model.');
  if (mode === 'image' && !['black-forest-labs/FLUX.2-pro', 'google/gemini-3-pro-image'].includes(imageModel)) throw error(400, 'Unsupported image model.');

  // Validate: text mode needs prompt, image mode needs either prompt or imageUrls
  if (mode === 'text' && !prompt.trim()) {
    throw error(400, 'Text mode requires a prompt.');
  }
  if (mode === 'image' && !prompt.trim() && (!imageUrls || imageUrls.length === 0)) {
    throw error(400, 'Image mode requires either a prompt or selected images.');
  }

  // Determine credit cost
  const creditCost = mode === 'text' ? 1 : 5;

  let reservation: ReturnType<ReturnType<typeof creditStore>['reserve']> = null;
  let currentCredits = 0;
  if (recovery) {
    try {
      const store = creditStore(env);
      currentCredits = store.balance(locals.user.email);
      reservation = store.reserve(locals.user.email, creditCost);
    } catch {
      throw error(503, 'Учёт кредитов временно недоступен. Попробуйте позднее.');
    }
    if (!reservation) throw error(402, `Недостаточно кредитов. Нужно ${creditCost}, доступно ${currentCredits}.`);
  } else {
    try {
      const userRecord = await locals.pb.collection('users').getOne(locals.user.id);
      currentCredits = userRecord.credits ?? 0;
    } catch { throw error(503, 'Failed to fetch user data.'); }
    if (currentCredits < creditCost) throw error(402, `Insufficient credits. You need ${creditCost} credit(s) but only have ${currentCredits}.`);
  }

  async function finishCredits() {
    if (reservation) {
      reservation.commit();
      return reservation.balance();
    }
    const balance = currentCredits - creditCost;
    await locals.pb.collection('users').update(locals.user!.id, { credits: balance });
    return balance;
  }

  // Helper to strip data URL prefix from base64 strings
  function stripDataUrlPrefix(base64: string): string {
    // Remove "data:image/...;base64," prefix if present
    const match = base64.match(/^data:image\/[^;]+;base64,(.+)$/);
    return match ? match[1] : base64;
  }

  try {
    if (mode === 'text') {
      const res = await fetch(`${TOGETHER_BASE}/chat/completions`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${togetherApiKey}`
        },
        signal: AbortSignal.timeout(120000),
        body: JSON.stringify({
          model: textModel,
          messages: [
            {
              role: 'system',
              content:
                'You are an AI assistant helping architects explore ideas. Respond clearly and concisely.'
            },
            { role: 'user', content: prompt }
          ],
          max_tokens: 8192,
          temperature: 0.7
        })
      });

      if (!res.ok) {
        const errText = await res.text();
        console.error('Together text error', res.status, errText);
        throw error(500, 'Together AI text generation failed.');
      }

      const data = await res.json();
      const text = data.choices?.[0]?.message?.content;
      if (typeof text !== 'string' || !text) throw error(502, 'Empty generation result.');
      
      const newCredits = await finishCredits();
      return json({ mode, text, credits: newCredits });
    }

    // image
    const bodyPayload: Record<string, unknown> = {
      model: imageModel,
      prompt: prompt || '',
      response_format: 'url'
    };

    // Handle aspect ratio differently for Gemini vs FLUX models
    if (imageModel.includes('gemini') || imageModel.includes('google/')) {
      // Gemini models require exact width/height dimensions
      const size = getSizeForGemini(aspect);
      bodyPayload.width = size.width;
      bodyPayload.height = size.height;
      
      // Try reference_images with data URLs (same approach as FLUX)
      if (imageUrls && imageUrls.length > 0) {
        // Together AI reference_images expects data URLs (with prefix) not raw base64
        bodyPayload.reference_images = imageUrls; // Keep original data URLs
        
      }
    } else if (imageModel.startsWith('black-forest-labs/')) {
      // FLUX models use width/height numbers
      const size = getSizeForAspect(aspect);
      bodyPayload.width = size.width;
      bodyPayload.height = size.height;
      
      // FLUX image editing - Together AI might use different parameters
      if (imageUrls && imageUrls.length > 0) {
        // Together AI reference_images might expect data URLs (with prefix) not raw base64
        // Try keeping the data URL format first
        bodyPayload.reference_images = imageUrls; // Keep original data URLs
        
      }
    }

    const res = await fetch(`${TOGETHER_BASE}/images/generations`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${togetherApiKey}`
      },
      signal: AbortSignal.timeout(120000),
      body: JSON.stringify(bodyPayload)
    });

    if (!res.ok) {
      const errText = await res.text();
      console.error('Together image error', res.status, errText);
      throw error(500, 'Together AI image generation failed.');
    }

    const data = await res.json();
    const imageUrl = data.data?.[0]?.url;
    if (typeof imageUrl !== 'string' || !imageUrl) throw error(502, 'Empty generation result.');
    
    const newCredits = await finishCredits();
    return json({ mode, imageUrl, credits: newCredits });
    
  } catch (e) {
    try { reservation?.refund(); } catch { console.error('Credit refund failed; operator review required'); }
    console.error('AI sandbox request failed');
    throw error(500, 'AI sandbox request failed.');
  }
};


