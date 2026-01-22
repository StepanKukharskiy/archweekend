import type { RequestHandler } from '@sveltejs/kit';
import { error } from '@sveltejs/kit';

export const GET: RequestHandler = async ({ url, fetch }) => {
  const imageUrl = url.searchParams.get('url');
  
  if (!imageUrl) {
    throw error(400, 'Missing image URL parameter');
  }

  try {
    // Fetch the image from Together AI
    const response = await fetch(imageUrl);
    
    if (!response.ok) {
      throw error(500, 'Failed to fetch image from Together AI');
    }

    // Get the image as a buffer
    const imageBuffer = await response.arrayBuffer();
    
    // Determine content type from response or default to png
    const contentType = response.headers.get('content-type') || 'image/png';

    // Return the image with proper headers
    return new Response(imageBuffer, {
      headers: {
        'Content-Type': contentType,
        'Content-Disposition': `attachment; filename="ai-image.png"`,
        'Cache-Control': 'no-cache'
      }
    });
  } catch (e) {
    console.error('Image proxy error:', e);
    throw error(500, 'Failed to proxy image');
  }
};
