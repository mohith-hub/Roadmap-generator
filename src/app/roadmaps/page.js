"use client"; // Explicitly mark as Client Component

import { useState, useEffect, Suspense } from "react";
import { useRouter, usePathname, useSearchParams } from "next/navigation";
import { Home as HomeIcon, Book, Video, FileText, ArrowLeft, GitBranch, Search } from "lucide-react";
import { webDevelopment } from "../../app/domains/webDevelopment"; // Corrected path
import { machineLearning } from "../../app/domains/machineLearning";
import { cybersecurity } from "../../app/domains/cybersecurity";
import { iot } from "../../app/domains/iot";
import { dataScience } from "../../app/domains/dataScience";

// Define domains object at the top
const domains = {
  "Web Development": webDevelopment,
  "Machine Learning": machineLearning,
  Cybersecurity: cybersecurity,
  IoT: iot,
  "Data Science": dataScience,
};

export const dynamic = "force-dynamic"; // Force dynamic rendering to bypass prerendering

export default function RoadmapsPage() {
  return (
    <Suspense fallback={<div className="flex items-center justify-center flex-1 h-screen bg-[#0C0950] text-[#FBE4D6]">Loading...</div>}>
      <Roadmap />
    </Suspense>
  );
}

function Roadmap() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams(); // Client-side hook requiring <Suspense>
  const domainParam = searchParams.get("domain")?.replace(/-/g, " ");

  // Normalize domainParam to match the case of domains keys
  const normalizeDomain = (domain) => {
    const normalized = domain?.toLowerCase().replace(/\s+/g, " ");
    return Object.keys(domains).find((key) =>
      key.toLowerCase().replace(/\s+/g, " ") === normalized
    ) || "Web Development";
  };

  // Derive selectedDomain from query param or default to "Web Development"
  const [selectedDomain, setSelectedDomain] = useState(() => {
    return normalizeDomain(domainParam);
  });

  // Update selectedDomain and filteredRepos when query param changes
  useEffect(() => {
    const newDomain = normalizeDomain(searchParams.get("domain")?.replace(/-/g, " "));
    if (newDomain !== selectedDomain) {
      setSelectedDomain(newDomain);
      setFilteredRepos(domains[newDomain].gitHubLinks);
      setSearchQuery("");
    }
  }, [searchParams, selectedDomain]);

  const [filteredRepos, setFilteredRepos] = useState(domains[selectedDomain].gitHubLinks);
  const [searchQuery, setSearchQuery] = useState("");

  const handleSearch = (event) => {
    const query = event.target.value.toLowerCase();
    setSearchQuery(query);
    setFilteredRepos(domains[selectedDomain].gitHubLinks.filter((repo) => repo.name.toLowerCase().includes(query)));
  };

  // Sidebar (static content, no client-side dependency)
  const sidebar = (
    <aside className="w-64 bg-[#ffff00] shadow-lg p-4 flex flex-col justify-between border-r border-[#0C0950]">
      <div>
        <h2 className="text-xl font-bold text-[#161179] mb-4">Dashboard</h2>
        <nav className="space-y-4">
          <button
            onClick={() => router.push("/")}
            className="flex items-center space-x-2 text-[#161179] hover:text-[#726bff] w-full text-left py-2"
          >
            <HomeIcon className="w-5 h-5 text-[#161179]" />
            <span className="text-base">Home</span>
          </button>
          <button
            onClick={() => router.push("/roadmaps")}
            className="flex items-center space-x-2 text-[#161179] hover:text-[#726bff] w-full text-left py-2"
          >
            <Book className="w-5 h-5 text-[#161180]" />
            <span className="text-base">Roadmaps</span>
          </button>
        </nav>
      </div>
      <button
        onClick={() => router.push("/")}
        className="flex items-center space-x-2 text-[#161179] hover:text-[#726bff] w-full text-left py-2"
      >
        <ArrowLeft className="w-5 h-5 text-[#161179]" />
        <span className="text-base">Back</span>
      </button>
    </aside>
  );

  // Main content that depends on searchParams-derived state
  const mainContent = (
    <main className="flex-1 p-4 md:p-10 bg-[#ffffff]">
      <div className="flex flex-col h-full">
        {/* Title */}
        <div className="p-4">
          <h1 className="text-2xl md:text-4xl font-bold text-[#ffb384] mb-4 capitalize">{selectedDomain} Roadmap</h1>
        </div>

        {/* Sections (three columns) */}
        <div className="flex-1 grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6 h-full">
          {/* GitHub Repositories */}
          <div className="bg-[#161179] p-4 rounded-lg shadow-md flex flex-col min-h-0">
            <h2 className="text-xl md:text-2xl font-semibold text-[#FBE4D6] flex items-center mb-2">
              <GitBranch className="w-5 md:w-6 h-5 md:h-6 mr-2 text-[#FBE4D6]" />
              GitHub Repositories
            </h2>
            <div className="relative mb-2">
              <input
                type="text"
                placeholder="Search repositories..."
                value={searchQuery}
                onChange={handleSearch}
                className="w-full p-2 border rounded-md pl-9 placeholder-[#FBE4D6] focus:border-[#161179] bg-[#161179] text-[#FBE4D6] text-sm md:text-base"
              />
              <Search className="absolute left-2 top-2 w-4 h-4 text-[#FBE4D6]" />
            </div>
            <div className="flex-1 overflow-y-auto space-y-2" style={{ maxHeight: "calc(100vh - 250px)" }}>
              {filteredRepos.length > 0 ? (
                filteredRepos.map((repo) => (
                  <a
                    key={repo.name}
                    href={repo.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block p-2 bg-[#FBE4D6] rounded text-[#161179] text-sm md:text-base hover:bg-[#D4C4B4]"
                  >
                    <h3 className="font-medium">{repo.name}</h3>
                    <p className="text-xs md:text-sm">{repo.description}</p>
                  </a>
                ))
              ) : (
                <p className="text-[#FBE4D6] text-sm">No repositories found.</p>
              )}
            </div>
          </div>

          {/* YouTube Tutorials */}
          <div className="bg-[#161179] p-4 rounded-lg shadow-md flex flex-col min-h-0">
            <h2 className="text-xl md:text-2xl font-semibold text-[#FBE4D6] flex items-center mb-2">
              <Video className="w-5 md:w-6 h-5 md:h-6 mr-2 text-[#FBE4D6]" />
              YouTube Tutorials
            </h2>
            <ul className="flex-1 overflow-y-auto space-y-2" style={{ maxHeight: "calc(100vh - 250px)" }}>
              {domains[selectedDomain].youtubeLinks.map((video) => (
                <li key={video.title}>
                  <a
                    href={video.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block p-2 bg-[#FBE4D6] rounded text-[#161179] text-sm md:text-base hover:bg-[#D4C4B4]"
                  >
                    {video.title}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Medium Articles */}
          <div className="bg-[#161179] p-4 rounded-lg shadow-md flex flex-col min-h-0">
            <h2 className="text-xl md:text-2xl font-semibold text-[#FBE4D6] flex items-center mb-2">
              <Book className="w-5 md:w-6 h-5 md:h-6 mr-2 text-[#FBE4D6]" />
              Medium Articles
            </h2>
            <ul className="flex-1 overflow-y-auto space-y-2" style={{ maxHeight: "calc(100vh - 250px)" }}>
              {domains[selectedDomain].mediumLinks.map((article) => (
                <li key={article.title}>
                  <a
                    href={article.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block p-2 bg-[#FBE4D6] rounded text-[#161179] text-sm md:text-base hover:bg-[#D4C4B4]"
                  >
                    {article.title}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </main>
  );

  // Combine static sidebar with dynamic main content inside Suspense
  return (
    <div className="flex flex-row h-screen bg-[#0C0950]">
      {sidebar}
      {mainContent}
    </div>
  );
}