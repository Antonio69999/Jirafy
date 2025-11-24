import { useMemo, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import {
  ReactFlow,
  Controls,
  Background,
  useNodesState,
  useEdgesState,
  MarkerType,
  BackgroundVariant,
  type Edge,
  type Node,
} from "@xyflow/react";
import "@xyflow/react/dist/style.css";
import { useProjectWorkflow } from "@/hooks/useProjectWorkflow";
import { useAvailableStatuses } from "@/hooks/useStatus";
import { cn } from "@/lib/utils";
import { useColorThemeStore } from "@/store/colorThemeStore";

export default function WorkflowDiagram() {
  const [searchParams] = useSearchParams();
  const projectId = searchParams.get("project");
  const { colorTheme } = useColorThemeStore();

  const { data: transitions, loading: transitionsLoading } = useProjectWorkflow(
    projectId ? parseInt(projectId) : null
  );

  const { data: statuses, loading: statusesLoading } = useAvailableStatuses(
    projectId ? parseInt(projectId) : undefined
  );
  // Création des nœuds
  const nodes: Node[] = useMemo(() => {
    if (!statuses || !Array.isArray(statuses) || statuses.length === 0)
      return [];

    return statuses.map((status, index) => ({
      id: String(status.id),
      type: "default",
      data: {
        label: (
          <div className="px-4 py-2">
            <div className="font-semibold">{status.name}</div>
            <div className="text-xs text-muted-foreground">{status.key}</div>
          </div>
        ),
      },
      position: {
        x: (index % 3) * 250,
        y: Math.floor(index / 3) * 150,
      },
      style: {
        background: "var(--card)",
        border: "2px solid var(--border)",
        borderRadius: "8px",
        color: "var(--foreground)",
        padding: "10px",
      },
    }));
  }, [statuses]);

  // Création des edges
  const edges: Edge[] = useMemo(() => {
    if (!transitions || transitions.length === 0) return [];

    return transitions.map((transition) => ({
      id: String(transition.id),
      source: String(transition.from_status_id),
      target: String(transition.to_status_id),
      label: transition.name,
      type: "smoothstep",
      animated: true,
      markerEnd: {
        type: MarkerType.ArrowClosed,
        color: "var(--primary)",
      },
      style: {
        stroke: "var(--primary)",
        strokeWidth: 2,
      },
      labelStyle: {
        fill: "var(--foreground)",
        fontWeight: 600,
      },
      labelBgStyle: {
        fill: "var(--card)",
        fillOpacity: 0.9,
      },
    }));
  }, [transitions]);

  const [nodesState, setNodesState, onNodesChange] = useNodesState([]);
  const [edgesState, setEdgesState, onEdgesChange] = useEdgesState([]);

  // ✅ Synchroniser les states
  useEffect(() => {
    setNodesState(nodes);
  }, [nodes, setNodesState]);

  useEffect(() => {
    setEdgesState(edges);
  }, [edges, setEdgesState]);

  if (!projectId) {
    return (
      <div className="flex items-center justify-center h-[calc(100vh-12rem)]">
        <p className="text-muted-foreground">
          Sélectionnez un projet pour voir son workflow
        </p>
      </div>
    );
  }

  if (transitionsLoading || statusesLoading) {
    return (
      <div className="flex items-center justify-center h-[calc(100vh-12rem)]">
        <p className="text-muted-foreground">Chargement du workflow...</p>
      </div>
    );
  }

  return (
    <div
      className={cn(
        "h-[calc(100vh-12rem)] w-full rounded-lg border",
        `theme-${colorTheme}`
      )}
    >
      <ReactFlow
        nodes={nodesState}
        edges={edgesState}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        fitView
        minZoom={0.5}
        maxZoom={1.5}
        nodesDraggable={false}
        nodesConnectable={false}
        elementsSelectable={false}
      >
        <Background variant={BackgroundVariant.Dots} gap={12} size={1} />
        <Controls showInteractive={false} />
      </ReactFlow>
    </div>
  );
}
