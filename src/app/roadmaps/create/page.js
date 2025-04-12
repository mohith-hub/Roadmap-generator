"use client";
import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import TreeRoadmap from "./TreeRoadmap"; // Corrected relative import
import roadmapData from "./roadmapData"; // Corrected relative import

export default function CreateRoadmap() {
  const router = useRouter();
  const [selectedDomain, setSelectedDomain] = useState("");
  const [roadmap, setRoadmap] = useState(null); // Explicitly null until generated
  const [error, setError] = useState("");
  const [userData, setUserData] = useState({ links: [], files: [] });
  const [showSavedRoadmaps, setShowSavedRoadmaps] = useState(false);
  const [savedRoadmaps, setSavedRoadmaps] = useState([]);

  // Load saved roadmaps from localStorage on mount
  useEffect(() => {
    const savedDomains = Object.keys(localStorage)
      .filter((key) => key.startsWith("roadmapData_"))
      .map((key) => key.replace("roadmapData_", ""));
    setSavedRoadmaps(savedDomains);
  }, []);

  const handleGenerateRoadmap = () => {
    if (!selectedDomain) {
      setError("Please select a domain!");
      return;
    }

    setError("");
    setRoadmap(roadmapData[selectedDomain] || []); // Set roadmap only on button click
    setUserData({ links: [], files: [] });
    localStorage.removeItem(`roadmapData_${selectedDomain}`);
  };

  const handleSaveRoadmap = () => {
    if (selectedDomain && (userData.links.length > 0 || userData.files.length > 0)) {
      const roadmapToSave = {
        originalRoadmap: roadmap || [], // Ensure originalRoadmap is saved
        userLinks: userData.links,
        userFiles: userData.files,
      };
      localStorage.setItem(`roadmapData_${selectedDomain}`, JSON.stringify(roadmapToSave));
      alert("Roadmap saved successfully!");
      
      // Update the list of saved roadmaps and show the saved section
      setSavedRoadmaps((prev) => [...new Set([...prev, selectedDomain])]);
      setShowSavedRoadmaps(true);
      setSelectedDomain(""); // Reset selected domain
      setRoadmap(null); // Reset roadmap
      setUserData({ links: [], files: [] }); // Reset user data
    }
  };

  const handleLoadSavedRoadmap = (domain) => {
    const savedData = localStorage.getItem(`roadmapData_${domain}`);
    if (savedData) {
      const parsedData = JSON.parse(savedData);
      setRoadmap(parsedData.originalRoadmap);
      setUserData({ links: parsedData.userLinks, files: parsedData.userFiles });
      setSelectedDomain(domain);
      setShowSavedRoadmaps(false); // Hide saved section after loading
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-[#0C0950] p-4">
      <h1 className="text-2xl md:text-3xl font-bold text-[#FBE4D6] mb-4 md:mb-6">Create Your Roadmap</h1>

      <select
        value={selectedDomain}
        onChange={(e) => setSelectedDomain(e.target.value)}
        className="px-4 py-3 md:px-4 md:py-2 border border-[#FBE4D6] rounded-md shadow-sm focus:ring focus:ring-[#FBE4D6] mb-4 md:mb-6 text-[#FBE4D6] bg-[#161179] text-base md:text-lg w-full max-w-xs"
      >
        <option value="" disabled hidden>
          Select a Domain
        </option>
        {Object.keys(roadmapData).map((domain) => (
          <option key={domain} value={domain} className="text-[#FBE4D6] bg-[#161179]">
            {domain}
          </option>
        ))}
      </select>

      <button
        onClick={handleGenerateRoadmap}
        className="px-6 py-3 md:px-6 md:py-3 bg-[#161179] text-[#FBE4D6] font-semibold rounded-lg shadow-md hover:bg-[#ffff00] hover:text-[#161179] transition mb-4 md:mb-6 text-base md:text-lg"
      >
        Generate Roadmap
      </button>

      {error && <p className="text-[#FBE4D6] font-semibold text-base mb-4">{error}</p>}

      {roadmap && roadmap.length > 0 && (
        <div className="bg-[#ffff00] p-4 md:p-6 rounded-lg shadow-md w-full max-w-3xl border border-[#FBE4D6] text-[#FBE4D6] mb-6">
          <h2 className="text-xl md:text-2xl font-bold text-[#161179] mb-3 md:mb-4">{selectedDomain} Roadmap</h2>
          <TreeRoadmap
            roadmap={roadmap}
            selectedDomain={selectedDomain}
            userData={userData}
            onUserDataChange={(newData) => setUserData(newData)}
          />
          {(userData.links.length > 0 || userData.files.length > 0) && (
            <button
              onClick={handleSaveRoadmap}
              className="mt-4 px-6 py-3 bg-[#161179] text-[#FBE4D6] font-semibold rounded-lg shadow-md hover:bg-[#ffff00] hover:text-[#161179] transition text-base md:text-lg"
            >
              Save Roadmap
            </button>
          )}
        </div>
      )}

      {showSavedRoadmaps && (
        <div className="bg-[#FBE4D6] p-4 md:p-6 rounded-lg shadow-md w-full max-w-3xl border border-[#FBE4D6] text-[#FBE4D6]">
          <h2 className="text-xl md:text-2xl font-bold text-[#161179] mb-3 md:mb-4">Saved Roadmaps</h2>
          {savedRoadmaps.length > 0 ? (
            <ul className="space-y-4">
              {savedRoadmaps.map((domain) => (
                <li key={domain} className="p-2 bg-[#161179] rounded-md">
                  <button
                    onClick={() => handleLoadSavedRoadmap(domain)}
                    className="text-[#FBE4D6] hover:text-[#ffff00] text-sm md:text-base"
                  >
                    {domain}
                  </button>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-[#FBE4D6] font-semibold text-base">No saved roadmaps yet.</p>
          )}
        </div>
      )}
    </div>
  );
}