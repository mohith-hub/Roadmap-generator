export async function GET(req) {
  const { searchParams } = new URL(req.url);
  const topic = searchParams.get("topic");

  if (!topic) {
    return Response.json({ error: "Topic query parameter is required" }, { status: 400 });
  }

  const API_KEY = process.env.YOUTUBE_API_KEY;
  const response = await fetch(
    `https://www.googleapis.com/youtube/v3/search?part=snippet&q=${topic}+tutorial&type=video&maxResults=5&videoEmbeddable=true&key=${API_KEY}`
  );
  const data = await response.json();

  // Extract only necessary details and remove autoplay-related data
  const videos = data.items.map(video => ({
    id: video.id.videoId,
    title: video.snippet.title,
    url: `https://www.youtube.com/watch?v=${video.id.videoId}`, // Standard YouTube URL
  }));

  return Response.json(videos);
}
