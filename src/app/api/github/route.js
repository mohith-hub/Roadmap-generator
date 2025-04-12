export async function GET(req) {
  const { searchParams } = new URL(req.url);
  const topic = searchParams.get("topic");

  if (!topic) {
    return Response.json({ error: "Topic query parameter is required" }, { status: 400 });
  }

  const response = await fetch(`https://api.github.com/search/repositories?q=${topic}+language:javascript&sort=stars`);
  const data = await response.json();

  return Response.json(data.items);
}
