export async function GET(req) {
  const { searchParams } = new URL(req.url);
  const topic = searchParams.get("topic");

  if (!topic) {
    return new Response(JSON.stringify({ error: "Topic query parameter is required" }), { status: 400 });
  }

  const RSS2JSON_API_KEY = process.env.RSS2JSON_API_KEY;
  if (!RSS2JSON_API_KEY) {
    return new Response(JSON.stringify({ error: "RSS2JSON API key is missing" }), { status: 500 });
  }

  try {
    const response = await fetch(
      `https://api.rss2json.com/v1/api.json?rss_url=https://medium.com/feed/tag/${encodeURIComponent(topic)}&api_key=${RSS2JSON_API_KEY}`
    );
    if (!response.ok) throw new Error(`Medium API error: ${response.statusText}`);
    const data = await response.json();
    return new Response(JSON.stringify(data.items || []), { status: 200 });
  } catch (error) {
    console.error("Medium API Error:", error.message);
    return new Response(JSON.stringify([]), { status: 500 });
  }
}