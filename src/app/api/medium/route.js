export async function GET(req) {
  const { searchParams } = new URL(req.url);
  const topic = searchParams.get("topic");

  if (!topic) {
    return Response.json({ error: "Topic query parameter is required" }, { status: 400 });
  }

  const response = await fetch(`https://api.rss2json.com/v1/api.json?rss_url=https://medium.com/feed/tag/${topic}`);
  const data = await response.json();

  return Response.json(data.items);
}
