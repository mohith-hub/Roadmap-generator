export async function GET(req) {
  const { searchParams } = new URL(req.url);
  const topic = searchParams.get("topic");

  if (!topic) {
    return new Response(JSON.stringify({ error: "Topic query parameter is required" }), { status: 400 });
  }

  const API_KEY = process.env.YOUTUBE_API_KEY;
  if (!API_KEY) {
    return new Response(JSON.stringify({ error: "YouTube API key is missing" }), { status: 500 });
  }

  try {
    const response = await fetch(
      `https://www.googleapis.com/youtube/v3/search?part=snippet&q=${encodeURIComponent(topic)}+tutorial&type=video&maxResults=5&videoEmbeddable=true&key=${API_KEY}`
    );
    if (!response.ok) throw new Error(`YouTube API error: ${response.statusText}`);
    const data = await response.json();
    const videos = data.items.map(video => ({
      id: video.id.videoId,
      title: video.snippet.title,
      url: `https://www.youtube.com/watch?v=${video.id.videoId}`,
    }));
    return new Response(JSON.stringify(videos), { status: 200 });
  } catch (error) {
    console.error("YouTube API Error:", error.message);
    return new Response(JSON.stringify([]), { status: 500 });
  }
}