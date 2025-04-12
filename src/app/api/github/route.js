export async function GET(req) {
  const { searchParams } = new URL(req.url);
  const topic = searchParams.get("topic");

  if (!topic) {
    return new Response(JSON.stringify({ error: "Topic query parameter is required" }), { status: 400 });
  }

  const token = process.env.GITHUB_TOKEN; // Optional token from environment variables
  try {
    const response = await fetch(`https://api.github.com/search/repositories?q=topic:${topic}&sort=stars`, {
      headers: {
        Authorization: token ? `token ${token}` : '',
        Accept: "application/vnd.github.v3+json",
      },
    });
    if (!response.ok) throw new Error(`GitHub API error: ${response.statusText}`);
    const data = await response.json();
    return new Response(JSON.stringify(data.items || []), { status: 200 });
  } catch (error) {
    console.error("GitHub API Error:", error.message);
    return new Response(JSON.stringify([]), { status: 500 });
  }
}