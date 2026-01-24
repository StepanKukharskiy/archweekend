import type { RequestHandler } from '@sveltejs/kit';
import { json, error } from '@sveltejs/kit';
import { TOGETHER_API_KEY } from '$env/static/private';

const TOGETHER_BASE = 'https://api.together.xyz/v1';

const DEFAULT_TEXT_MODEL = 'meta-llama/Meta-Llama-3.1-70B-Instruct-Turbo';
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

export const POST: RequestHandler = async ({ request, locals }) => {
  // Check authentication
  if (!locals.user) {
    throw error(401, 'Authentication required. Please sign in to use AI sandbox.');
  }

  const togetherApiKey = TOGETHER_API_KEY;

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

  // Validate: text mode needs prompt, image mode needs either prompt or imageUrls
  if (mode === 'text' && !prompt.trim()) {
    throw error(400, 'Text mode requires a prompt.');
  }
  if (mode === 'image' && !prompt.trim() && (!imageUrls || imageUrls.length === 0)) {
    throw error(400, 'Image mode requires either a prompt or selected images.');
  }

  // Determine credit cost
  const creditCost = mode === 'text' ? 1 : 5;

  // Fetch current user data to get credits
  let userRecord;
  try {
    userRecord = await locals.pb.collection('users').getOne(locals.user.id);
  } catch (err) {
    console.error('Error fetching user data:', err);
    throw error(500, 'Failed to fetch user data.');
  }

  const currentCredits = userRecord.credits ?? 0;

  // Check if user has enough credits
  if (currentCredits < creditCost) {
    throw error(402, `Insufficient credits. You need ${creditCost} credit(s) but only have ${currentCredits}.`);
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
          max_tokens: 512,
          temperature: 0.7
        })
      });

      if (!res.ok) {
        const errText = await res.text();
        console.error('Together text error', res.status, errText);
        throw error(500, 'Together AI text generation failed.');
      }

      const data = await res.json();
      const text = data.choices?.[0]?.message?.content ?? '';
      
      // Deduct credits after successful generation
      const newCredits = currentCredits - creditCost;
      try {
        await locals.pb.collection('users').update(locals.user.id, { credits: newCredits });
      } catch (err) {
        console.error('Error updating credits:', err);
        // Continue even if credit update fails, but log the error
      }
      
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
        
        // Log to verify image is being sent
        console.log('Sending reference_images to Gemini:', {
          imageCount: imageUrls.length,
          firstImageLength: imageUrls[0]?.length || 0,
          firstImagePreview: imageUrls[0]?.substring(0, 80) + '...',
          prompt: prompt,
          payloadKeys: Object.keys(bodyPayload)
        });
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
        
        // Log to verify image is being sent
        console.log('Sending reference_images to FLUX (with data URL prefix):', {
          imageCount: imageUrls.length,
          firstImageLength: imageUrls[0]?.length || 0,
          firstImagePreview: imageUrls[0]?.substring(0, 80) + '...',
          prompt: prompt,
          payloadKeys: Object.keys(bodyPayload)
        });
      }
    }

    const res = await fetch(`${TOGETHER_BASE}/images/generations`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${togetherApiKey}`
      },
      body: JSON.stringify(bodyPayload)
    });

    if (!res.ok) {
      const errText = await res.text();
      console.error('Together image error', res.status, errText);
      console.error('Request payload:', JSON.stringify(bodyPayload, null, 2));
      throw error(500, 'Together AI image generation failed.');
    }

    const data = await res.json();
    const imageUrl = data.data?.[0]?.url ?? '';
    console.log('imageUrl from Together:', imageUrl);
    
    // Deduct credits after successful generation
    const newCredits = currentCredits - creditCost;
    try {
      await locals.pb.collection('users').update(locals.user.id, { credits: newCredits });
    } catch (err) {
      console.error('Error updating credits:', err);
      // Continue even if credit update fails, but log the error
    }
    
    return json({ mode, imageUrl, credits: newCredits });
    
  } catch (e) {
    console.error('AI sandbox error', e);
    throw error(500, 'AI sandbox request failed.');
  }
};


