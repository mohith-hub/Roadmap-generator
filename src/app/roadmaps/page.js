"use client";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Home as HomeIcon, Map } from "lucide-react";

export default function Dashboard() {
  const router = useRouter();
  const roadmaps = ["Web Development", "Machine Learning", "Cybersecurity", "IoT", "Data Science"];
  const [selectedRoadmap, setSelectedRoadmap] = useState(null);

  return (
    <div className="flex flex-col md:flex-row h-screen bg-[#0C0950]">
      <aside className="w-full md:w-64 bg-[#ffff00] shadow-lg p-4 md:p-5 flex flex-col justify-between border-r border-[#0C0950]">
        <div>
          <h2 className="text-xl md:text-2xl font-bold text-[#161179] mb-4 md:mb-6">Dashboard</h2>
          <nav className="space-y-3 md:space-y-4">
            <button
              onClick={() => router.push("/")}
              className="flex items-center space-x-2 text-[#161179] hover:text-[#726bff] w-full text-left py-2"
            >
              <HomeIcon className="w-5 h-5 text-[#161179]" />
              <span className="text-sm md:text-base">Home</span>
            </button>
            <button
              onClick={() => router.push("/roadmaps")}
              className="flex items-center space-x-2 text-[#161179] hover:text-[#726bff] w-full text-left py-2"
            >
              <Map className="w-5 h-5 text-[#161179]" />
              <span className="text-sm md:text-base">Roadmaps</span>
            </button>
          </nav>
        </div>
      </aside>

      <main className="flex-1 p-4 md:p-10 bg-white">
        <h1 className="text-2xl md:text-3xl font-bold text-[#161179]">Select Your Career Path</h1>
        <p className="text-[#161179] mb-4 md:mb-6 text-sm md:text-base">
          Choose a roadmap to explore or create your own roadmap using the roadmap section.
        </p>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-3 md:gap-6">
          {roadmaps.map((roadmap) => (
            <div
              key={roadmap}
              className={`p-4 md:p-6 rounded-lg shadow-md transition cursor-pointer ${
                selectedRoadmap === roadmap
                  ? "bg-[#0C0950] text-[#FBE4D6]"
                  : "bg-[#0C0950] text-[#FBE4D6] hover:shadow-[0_0_15px_5px_rgba(200,140,100,0.7)]"
              }`}
              onClick={() => {
                setSelectedRoadmap(roadmap);
                router.push(`/roadmap/${roadmap.toLowerCase().replace(/\s+/g, "-")}`);
              }}
            >
              <h2 className="text-lg md:text-xl font-semibold text-[#FBE4D6]">{roadmap}</h2>
              <p className={`text-xs md:text-sm ${selectedRoadmap === roadmap ? "text-[#FBE4D6]" : "text-[#FBE4D6]"}`}>
                Click to explore learning resources.
              </p>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}