"use client";
import React, { useMemo, useState, useEffect, useRef, Suspense } from "react";
import ReactFlow, {
  ReactFlowProvider,
  useReactFlow,
  Controls,
  Background,
  Position,
  Handle,
  BezierEdge,
} from "reactflow";
import "reactflow/dist/style.css";
import dagre from "dagre";
import { useRouter } from "next/navigation";

// Define getLayoutedElements function
const getLayoutedElements = (nodes, edges) => {
  const dagreGraph = new dagre.graphlib.Graph();
  dagreGraph.setDefaultEdgeLabel(() => ({}));

  dagreGraph.setGraph({ rankdir: "TB", nodesep: 50, edgesep: 50, ranksep: 100 });

  nodes.forEach((node) => {
    dagreGraph.setNode(node.id, { width: 220, height: 80 });
  });

  edges.forEach((edge) => {
    dagreGraph.setEdge(edge.source, edge.target);
  });

  dagre.layout(dagreGraph);

  nodes.forEach((node) => {
    const nodeWithPosition = dagreGraph.node(node.id);
    node.targetPosition = Position.Top;
    node.sourcePosition = Position.Bottom;
    node.position = {
      x: nodeWithPosition.x - 110,
      y: nodeWithPosition.y - 40,
    };
    return node;
  });

  return { nodes, edges };
};

// TreeRoadmapComponent definition
const TreeRoadmapComponent = ({ roadmap, selectedDomain, userData, onUserDataChange }) => {
  const reactFlowWrapper = useRef(null);
  const { setViewport, fitView, getNodes } = useReactFlow();
  const [expandedParent, setExpandedParent] = useState(null);
  const [selectedChild, setSelectedChild] = useState(null);
  const rootNodeId = "root-node";
  const [isRoadmapGenerated, setIsRoadmapGenerated] = useState(false);
  const router = useRouter();

  const processedRoadmap = roadmap || [];

  const calculatedHeight = processedRoadmap.length * 120 + 400;
  const roadmapHeight = Math.max(calculatedHeight, 800);

  useEffect(() => {
    if (isRoadmapGenerated && processedRoadmap.length > 0) {
      const nodes = getNodes();
      if (nodes.length > 0) {
        fitView({
          padding: 0.1,
          minZoom: 0.4,
          maxZoom: 1.5,
          duration: 500,
        });
      }
    }
  }, [isRoadmapGenerated, processedRoadmap, getNodes, fitView]);

  const generateNodesAndEdges = () => {
    let id = 1;
    let tempNodes = [];
    let tempEdges = [];

    if (!processedRoadmap || processedRoadmap.length === 0) return { nodes: [], edges: [] };

    tempNodes.push({
      id: rootNodeId,
      data: { label: selectedDomain },
      type: "customNode",
    });

    let lastParentId = rootNodeId;

    processedRoadmap.forEach((section, index) => {
      const sectionId = `node-${id++}`;
      tempNodes.push({
        id: sectionId,
        data: { label: section.title },
        type: "customNode",
      });

      tempEdges.push({ id: `edge-${lastParentId}-${sectionId}`, source: lastParentId, target: sectionId });
      lastParentId = sectionId;

      if (Array.isArray(section.children) && expandedParent === sectionId) {
        const stackDirection = index % 2 === 0 ? "right" : "left";

        const parentNode = tempNodes.find((n) => n.id === sectionId);
        const parentX = parentNode?.position?.x || 0;
        const parentY = parentNode?.position?.y || 0;

        const stackBoxId = `stack-box-${sectionId}`;
        tempNodes.push({
          id: stackBoxId,
          data: {
            label: (
              <div
                onMouseLeave={() => setExpandedParent(null)}
                style={{ padding: "10px", textAlign: "left", background: "#FBE4D6", borderRadius: "6px" }}
              >
                {section.children.map((child, childIndex) => (
                  <div
                    key={`${child.title}-${childIndex}`}
                    onClick={() => setSelectedChild(child)}
                    style={{
                      background: "#FBE4D6",
                      padding: "6px 12px",
                      marginBottom: "4px",
                      borderRadius: "6px",
                      border: "1px solid #261FB3",
                      cursor: "pointer",
                      transition: "background 0.3s ease",
                    }}
                    onMouseEnter={(e) => (e.target.style.background = "#f0f0f0")}
                    onMouseLeave={(e) => (e.target.style.background = "#FBE4D6")}
                  >
                    {child.title}
                  </div>
                ))}
                <button
                  onClick={() => setExpandedParent(null)}
                  style={{
                    marginTop: "4px",
                    padding: "2px 8px",
                    background: "#FBE4D6",
                    color: "#FBE4D6",
                    border: "none",
                    borderRadius: "5px",
                    cursor: "pointer",
                    fontSize: "10px",
                    fontWeight: "bold",
                    display: "block",
                    textAlign: "center",
                    width: "auto",
                  }}
                >
                  Back
                </button>
              </div>
            ),
          },
          type: "childNode",
          position: {
            x: stackDirection === "right" ? parentX + 250 : parentX - 250,
            y: parentY,
          },
        });

        tempEdges.push({ id: `edge-${sectionId}-${stackBoxId}`, source: sectionId, target: stackBoxId });
      }
    });

    const { nodes, edges } = getLayoutedElements(tempNodes, tempEdges);
    return { nodes, edges };
  };

  const { nodes, edges } = useMemo(generateNodesAndEdges, [processedRoadmap, expandedParent, selectedDomain]);

  const CustomNode = ({ id, data }) => (
    <div
      onMouseEnter={() => setExpandedParent(id)}
      style={{
        cursor: "pointer",
        padding: "12px 16px",
        borderRadius: "8px",
        background: "#FBE4D6",
        textAlign: "center",
        fontWeight: "bold",
        boxShadow: "none",
        fontSize: "14px",
        border: "none",
        outline: "none",
        minWidth: "220px",
        color: "#161179",
      }}
    >
      {data.label}
      <Handle type="source" position={Position.Bottom} />
      <Handle type="target" position={Position.Top} />
    </div>
  );

  const ChildNode = ({ data }) => {
    const [isHovered, setIsHovered] = useState(false);

    return (
      <div
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        style={{
          background: isHovered ? "#FBE4D6" : "#FBE4D6",
          border: "2px solid #261FB3",
          padding: "10px",
          textAlign: "left",
          fontWeight: "bold",
          borderRadius: "6px",
          minWidth: "220px",
          color: "#0C0950",
          transition: "background 0.3s ease",
        }}
      >
        {data.label}
        <Handle type="target" position={Position.Left} />
      </div>
    );
  };

  const SideWindow = ({ child, userData, onUserDataChange }) => {
    const [localLinks, setLocalLinks] = useState(userData.links || []);
    const [newLink, setNewLink] = useState("");
    const [localFiles, setLocalFiles] = useState(userData.files || []);

    const handleAddLink = (e) => {
      e.preventDefault();
      if (newLink.trim() && !localLinks.includes(newLink)) {
        const updatedLinks = [...localLinks, newLink];
        setLocalLinks(updatedLinks);
        setNewLink("");
        onUserDataChange({ ...userData, links: updatedLinks });
      }
    };

    const handleFileUpload = (e) => {
      const files = Array.from(e.target.files);
      if (files.length > 0) {
        const filePromises = files.map((file) => {
          return new Promise((resolve) => {
            const reader = new FileReader();
            reader.onload = (event) => {
              resolve({ name: file.name, data: event.target.result });
            };
            reader.readAsDataURL(file);
          });
        });

        Promise.all(filePromises).then((fileDataArray) => {
          const updatedFiles = [...localFiles, ...fileDataArray];
          setLocalFiles(updatedFiles);
          onUserDataChange({ ...userData, files: updatedFiles });
        });
      }
    };

    useEffect(() => {
      setLocalLinks(userData.links || []);
      setLocalFiles(userData.files || []);
    }, [userData]);

    if (!child) return null;

    const allResources = [
      ...child.resources.map((resource) => ({ url: resource, isUserAdded: false })),
      ...localLinks.map((link) => ({ url: link, isUserAdded: true })),
    ];
    const resourceLinks = allResources
      .map((resource, index) => (
        <a
          key={index}
          href={resource.url}
          target="_blank"
          rel="noopener noreferrer"
          style={{
            color: resource.isUserAdded ? "#28a745" : "#007BFF",
            textDecoration: "none",
            wordBreak: "break-all",
            display: "inline-block",
            maxWidth: "100%",
          }}
        >
          {resource.url.replace(/https?:\/\//, "").replace(/\/$/, "")}
        </a>
      ))
      .reduce((prev, curr, index) => [
        prev,
        index > 0 && index < allResources.length - 1 ? ", " : index === allResources.length - 1 ? ", and " : "",
        curr,
      ]);

    return (
      <div
        style={{
          position: "fixed",
          top: "10px",
          right: "10px",
          width: "90vw", // Responsive width for mobile
          maxWidth: "300px", // Limit max width on larger screens
          maxHeight: "80vh", // Limit height to 80% of viewport height
          background: "#FBE4D6",
          border: "2px solid #261FB3",
          borderRadius: "8px",
          padding: "15px",
          boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
          zIndex: 1000,
          fontFamily: "Arial, sans-serif",
          overflowY: "auto", // Enable vertical scrolling
          color: "#0C0950",
        }}
      >
        <h3 style={{ fontSize: "16px", fontWeight: "bold", marginBottom: "10px" }}>{child.title}</h3>
        <p style={{ marginBottom: "15px", fontSize: "14px", color: "#0C0950" }}>{child.explanation}</p>
        <h4 style={{ fontSize: "14px", fontWeight: "bold", marginBottom: "10px" }}>Free Resources:</h4>
        <p style={{ margin: "0", wordWrap: "break-word", fontSize: "12px" }}>
          Learn more at {resourceLinks}.
        </p>

        <form onSubmit={handleAddLink} style={{ marginTop: "15px" }}>
          <input
            type="text"
            value={newLink}
            onChange={(e) => setNewLink(e.target.value)}
            placeholder="Add your own link"
            style={{
              width: "100%",
              padding: "5px",
              marginBottom: "5px",
              border: "1px solid #261FB3",
              borderRadius: "4px",
              background: "#FBE4D6",
              color: "#261FB3",
              fontSize: "12px",
            }}
          />
          <button
            type="submit"
            style={{
              padding: "5px 10px",
              background: "#261FB3",
              color: "#FBE4D6",
              border: "none",
              borderRadius: "4px",
              cursor: "pointer",
              fontSize: "12px",
            }}
          >
            Add Link
          </button>
        </form>

        <div style={{ marginTop: "10px" }}>
          <label style={{ fontSize: "12px", marginBottom: "5px", display: "block", color: "#0C0950" }}>Upload File:</label>
          <label
            htmlFor="file-upload"
            style={{
              display: "inline-block",
              padding: "6px 12px",
              background: "#261FB3",
              color: "#FBE4D6",
              border: "none",
              borderRadius: "4px",
              cursor: "pointer",
              fontSize: "12px",
              transition: "background 0.3s ease",
            }}
            onMouseEnter={(e) => (e.target.style.background = "#161179")}
            onMouseLeave={(e) => (e.target.style.background = "#261FB3")}
          >
            Choose File
          </label>
          <input
            id="file-upload"
            type="file"
            onChange={handleFileUpload}
            multiple
            style={{
              opacity: 0,
              position: "absolute",
              width: "0",
              height: "0",
              overflow: "hidden",
            }}
          />
          {localFiles.length > 0 && (
            <div>
              <h4 style={{ fontSize: "14px", fontWeight: "bold", margin: "10px 0 5px", color: "#0C0950" }}>Your Files:</h4>
              {localFiles.map((file, index) => (
                <div key={index} style={{ marginBottom: "5px" }}>
                  <a
                    href={file.data}
                    download={file.name}
                    style={{
                      color: "#261FB3",
                      textDecoration: "none",
                      wordBreak: "break-all",
                      display: "inline-block",
                      maxWidth: "100%",
                      fontSize: "12px",
                    }}
                    onMouseEnter={(e) => (e.target.style.textDecoration = "underline")}
                    onMouseLeave={(e) => (e.target.style.textDecoration = "none")}
                  >
                    {file.name}
                  </a>
                </div>
              ))}
            </div>
          )}
        </div>

        <button
          onClick={() => setSelectedChild(null)}
          style={{
            marginTop: "15px",
            padding: "5px 10px",
            background: "#161179",
            color: "#FBE4D6",
            border: "none",
            borderRadius: "5px",
            cursor: "pointer",
            fontSize: "12px",
            fontWeight: "bold",
            width: "100%",
          }}
        >
          Close
        </button>
      </div>
    );
  };

  const handleRecenter = () => {
    const nodes = getNodes();
    if (nodes.length > 0) {
      fitView({
        padding: 0.1,
        minZoom: 0.4,
        maxZoom: 1.5,
        duration: 500,
      });
    }
  };

  const handleBackToHome = () => {
    router.push("/");
  };

  return (
    <Suspense fallback={<div>Loading roadmap...</div>}>
      <div
        ref={reactFlowWrapper}
        style={{
          height: `${roadmapHeight}px`,
          width: "100%",
          background: "#0C0950",
          overflow: "auto",
          padding: "10px",
          position: "relative",
        }}
        onWheel={(e) => e.stopPropagation()}
      >
        <button
          onClick={handleRecenter}
          style={{
            position: "absolute",
            top: "10px",
            left: "50%",
            transform: "translateX(-50%)",
            padding: "8px 16px",
            background: "#261FB3",
            color: "#FBE4D6",
            border: "none",
            borderRadius: "4px",
            cursor: "pointer",
            fontSize: "14px",
            zIndex: 1001,
          }}
        >
          Recenter
        </button>

        <button
          onClick={handleBackToHome}
          style={{
            position: "fixed",
            bottom: "20px",
            right: "20px",
            padding: "8px 16px",
            background: "#261FB3",
            color: "#FBE4D6",
            border: "none",
            borderRadius: "4px",
            cursor: "pointer",
            fontSize: "14px",
            zIndex: 1001,
          }}
        >
          Back to Home
        </button>

        <ReactFlow
          nodes={nodes}
          edges={edges}
          edgeTypes={{ default: BezierEdge }}
          nodeTypes={{ customNode: CustomNode, childNode: ChildNode }}
          panOnScroll={true}
          panOnDrag={true}
          minZoom={0.4}
          maxZoom={1.5}
          defaultViewport={{ zoom: 0.8, x: 0, y: 50 }}
          style={{ background: "#0C0950" }}
        >
          <Controls position="top-right" />
          <Background color="#0C0950" />
        </ReactFlow>
        <SideWindow child={selectedChild} userData={userData} onUserDataChange={onUserDataChange} />
      </div>
    </Suspense>
  );
};

const TreeRoadmap = ({ roadmap, selectedDomain, userData, onUserDataChange }) => (
  <ReactFlowProvider>
    <TreeRoadmapComponent
      roadmap={roadmap}
      selectedDomain={selectedDomain}
      userData={userData}
      onUserDataChange={onUserDataChange}
    />
  </ReactFlowProvider>
);

export default TreeRoadmap;