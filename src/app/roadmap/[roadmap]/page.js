"use client";
import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { Home as HomeIcon, Book, Video, FileText, ArrowLeft, GitBranch, Search } from "lucide-react";

export default function Roadmap() {
  const { roadmap } = useParams();
  const router = useRouter();
  const [repos, setRepos] = useState([]);
  const [filteredRepos, setFilteredRepos] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [videos, setVideos] = useState([]);
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!roadmap) return;

    setLoading(true);
    setError(null);

    Promise.all([
      fetch(`/api/github?topic=${roadmap}`)
        .then((res) => {
          if (!res.ok) throw new Error(`GitHub API error: ${res.status}`);
          return res.json().catch(() => []);
        }),
      fetch(`/api/youtube?topic=${roadmap}`)
        .then((res) => {
          if (!res.ok) throw new Error(`YouTube API error: ${res.status}`);
          return res.json().catch(() => []);
        }),
      fetch(`/api/medium?topic=${roadmap}`)
        .then((res) => {
          if (!res.ok) throw new Error(`Medium API error: ${res.status}`);
          return res.json().catch(() => []);
        }),
    ])
      .then(([githubData, youtubeData, mediumData]) => {
        setRepos(githubData || []);
        setFilteredRepos(githubData || []);
        setVideos(youtubeData || []);
        setArticles(mediumData || []);
      })
      .catch((err) => {
        console.error("Error fetching data:", err.message);
        setError("Failed to load data. Please try again later or check the roadmap name.");
        setRepos([]);
        setFilteredRepos([]);
        setVideos([]);
        setArticles([]);
      })
      .finally(() => setLoading(false));
  }, [roadmap]);

  const handleSearch = (event) => {
    const query = event.target.value.toLowerCase();
    setSearchQuery(query);
    setFilteredRepos(repos.filter((repo) => repo.name.toLowerCase().includes(query)));
  };

  return (
    <div className="flex flex-col h-screen bg-[#0C0950]">
      {/* Sidebar */}
      <aside className="w-full md:w-64 bg-[#ffff00] shadow-lg p-4 flex flex-col justify-between border-r border-[#0C0950]">
        <div>
          <h2 className="text-xl md:text-2xl font-bold text-[#161179] mb-4">Dashboard</h2>
          <nav className="space-y-3 md:space-y-4">
            <button
              onClick={() => router.push("/")}
              className="flex items-center space-x-2 text-[#161179] hover:text-[#726bff] w-full text-left py-2"
            >
              <HomeIcon className="w-5 h-5 text-[#161179]" />
              <span className="text-sm md:text-base">Home</span>
            </button>
            <button className="flex items-center space-x-2 text-[#161179] hover:text-[#726bff] w-full text-left py-2">
              <Book className="w-5 h-5 text-[#161180]" />
              <span className="text-sm md:text-base">Roadmaps</span>
            </button>
          </nav>
        </div>
        <button
          onClick={() => router.push("/")}
          className="flex items-center space-x-2 text-[#161179] hover:text-[#726bff] w-full text-left py-2"
        >
          <ArrowLeft className="w-5 h-5 text-[#161179]" />
          <span className="text-sm md:text-base">Back</span>
        </button>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-4 md:p-10 bg-white">
        {loading ? (
          <div className="flex flex-col items-center justify-center h-full">
            <div className="w-10 h-10 md:w-12 md:h-12 border-4 border-[#161179] border-t-transparent rounded-full animate-spin"></div>
            <p className="mt-2 md:mt-4 text-base md:text-lg text-[#161179]">Loading roadmap...</p>
          </div>
        ) : error ? (
          <div className="flex flex-col items-center justify-center h-full text-[#161179]">
            <p className="text-base md:text-lg">{error}</p>
            <button
              onClick={() => router.push("/roadmaps")}
              className="mt-4 px-4 py-2 bg-[#161179] text-[#FBE4D6] rounded hover:bg-[#ffff00] transition text-sm md:text-base"
            >
              Back to Roadmaps
            </button>
          </div>
        ) : (
          <>
            <h1 className="text-2xl md:text-4xl font-bold text-[#161179] mb-4 md:mb-6 capitalize">{roadmap} Roadmap</h1>

            <div className="grid grid-cols-1 gap-4 md:grid-cols-3 md:gap-6">
              {/* GitHub Repositories */}
              <div className="bg-[#0C0950] p-4 md:p-6 rounded-lg shadow-md flex-1 h-[400px] md:h-[500px] overflow-hidden border border-[#FBE4D6]">
                <h2 className="text-xl md:text-2xl font-semibold text-[#FBE4D6] flex items-center">
                  <GitBranch className="w-5 md:w-6 h-5 md:h-6 mr-2 text-[#FBE4D6]" />
                  GitHub Repositories
                </h2>
                <div className="relative mt-2 md:mt-4">
                  <input
                    type="text"
                    placeholder="Search repositories..."
                    value={searchQuery}
                    onChange={handleSearch}
                    className="w-full p-2 md:p-2 border rounded-md pl-9 md:pl-10 placeholder-[#FBE4D6] focus:border-[#161179] bg-[#161179] text-[#FBE4D6] text-sm md:text-base"
                  />
                  <Search className="absolute left-2 md:left-3 top-2 md:top-3 w-4 md:w-5 h-4 md:h-5 text-[#FBE4D6]" />
                </div>
                <div className="mt-2 md:mt-4 space-y-2 overflow-y-auto h-[300px] md:h-[400px] scrollbar-thin scrollbar-thumb-[#161179] scrollbar-track-[#0C0950]">
                  {filteredRepos.length > 0 ? (
                    filteredRepos.map((repo) => (
                      <a
                        key={repo.id}
                        href={repo.html_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="block p-2 md:p-3 bg-[#ffff00] rounded hover:bg-[#FBE4D6] transition text-[#161179] text-sm md:text-base"
                      >
                        <h3 className="font-medium">{repo.name}</h3>
                        <p className="text-xs md:text-sm">{repo.description || "No description available"}</p>
                      </a>
                    ))
                  ) : (
                    <p className="text-[#FBE4D6] text-sm">No repositories found.</p>
                  )}
                </div>
              </div>

              {/* YouTube Videos */}
              <div className="bg-[#0C0950] p-4 md:p-6 rounded-lg shadow-md flex-1 h-[400px] md:h-[500px] overflow-hidden border border-[#FBE4D6]">
                <h2 className="text-xl md:text-2xl font-semibold text-[#FBE4D6] flex items-center">
                  <Video className="w-5 md:w-6 h-5 md:h-6 mr-2 text-[#FBE4D6]" />
                  YouTube Tutorials
                </h2>
                <ul className="mt-2 md:mt-4 space-y-2 overflow-y-auto h-[300px] md:h-[400px] scrollbar-thin scrollbar-thumb-[#161179] scrollbar-track-[#0C0950]">
                  {videos.length > 0 ? (
                    videos.map((video) => (
                      <li key={video.id}>
                        <a
                          href={video.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-[#161179] hover:text-[#161179] font-medium transition block p-2 md:p-3 bg-[#ffff00] rounded hover:bg-[#FBE4D6] text-sm md:text-base"
                        >
                          {video.title}
                        </a>
                      </li>
                    ))
                  ) : (
                    <p className="text-[#FBE4D6] text-sm">No YouTube videos found.</p>
                  )}
                </ul>
              </div>

              {/* Medium Articles */}
              <div className="bg-[#0C0950] p-4 md:p-6 rounded-lg shadow-md flex-1 h-[400px] md:h-[500px] overflow-hidden border border-[#FBE4D6]">
                <h2 className="text-xl md:text-2xl font-semibold text-[#FBE4D6] flex items-center">
                  <Book className="w-5 md:w-6 h-5 md:h-6 mr-2 text-[#FBE4D6]" />
                  Medium Articles
                </h2>
                <ul className="mt-2 md:mt-4 space-y-2 overflow-y-auto h-[300px] md:h-[400px] scrollbar-thin scrollbar-thumb-[#161179] scrollbar-track-[#0C0950]">
                  {articles.length > 0 ? (
                    articles.map((article) => (
                      <li key={article.guid}>
                        <a
                          href={article.link}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-[#FBE4D6] hover:text-[#ffff00] font-medium transition block p-2 md:p-3 bg-[#ffff00] rounded hover:bg-[#FBE4D6] text-sm md:text-base"
                        >
                          {article.title}
                        </a>
                      </li>
                    ))
                  ) : (
                    <p className="text-[#FBE4D6] text-sm">No Medium articles found.</p>
                  )}
                </ul>
              </div>
            </div>
          </>
        )}
      </main>
    </div>
  );
}