// Test-only provider stub. Never enabled by the production start command.
const originalFetch = globalThis.fetch;
globalThis.fetch = async (input, init) => {
 if (String(input).startsWith('https://api.together.xyz/v1/')) {
  const payload = JSON.parse(init.body);
  const prompt = payload.prompt || payload.messages?.at(-1)?.content;
  if (prompt === 'FAIL_TEST') return new Response('Test provider error',{status:500});
  return Response.json(String(input).includes('/images/') ? {data:[{url:'https://example.com/mock-image.png'}]} : {choices:[{message:{content:'Mock reply'}}]});
 }
 return originalFetch(input,init);
};
