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
import { useProjectStatuses } from "@/hooks/useStatus";
import { cn } from "@/lib/utils";
import { useColorThemeStore } from "@/store/colorThemeStore";
import StatusNode from "./StatusNode";
import EntryNode from "./EntryNode";
import ExitNode from "./ExitNode";

const nodeTypes = {
  status: StatusNode,
  entry: EntryNode,
  exit: ExitNode,
};

export default function WorkflowDiagram() {
  const [searchParams] = useSearchParams();
  const projectId = searchParams.get("project");
  const { colorTheme } = useColorThemeStore();

  const { data: transitions, loading: transitionsLoading } = useProjectWorkflow(
    projectId ? parseInt(projectId) : null
  );

  const { data: statuses, loading: statusesLoading } = useProjectStatuses(
    projectId ? parseInt(projectId) : null
  );

  const nodes: Node[] = useMemo(() => {
    if (!statuses || !Array.isArray(statuses) || statuses.length === 0)
      return [];

    const statusNodes = statuses.map((status, index) => ({
      id: String(status.id),
      type: "status" as const,
      data: {
        name: status.name,
        key: status.key,
        category: status.category,
      },
      position: {
        x: 350 + index * 300,
        y: 100,
      },
    }));

    const entryNode: Node = {
      id: "entry",
      type: "entry",
      data: { label: "Ticket créé" },
      position: { x: 0, y: 100 },
    };

    const exitNode: Node = {
      id: "exit",
      type: "exit",
      data: { label: "Ticket résolu" },
      position: { x: 350 + statuses.length * 300, y: 100 },
    };

    return [entryNode, ...statusNodes, exitNode];
  }, [statuses]);

  // ✅ Création des edges avec connexions entrée/sortie
  const edges: Edge[] = useMemo(() => {
    if (!transitions || transitions.length === 0 || !statuses) return [];

    const transitionEdges: Edge[] = transitions.map((transition) => ({
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

    const todoStatus = statuses.find((s) => s.key === "TODO");
    if (todoStatus) {
      transitionEdges.push({
        id: "entry-to-todo",
        source: "entry",
        target: String(todoStatus.id),
        type: "smoothstep",
        animated: true,
        style: {
          stroke: "#10b981",
          strokeWidth: 3,
          strokeDasharray: "5,5",
        },
        markerEnd: {
          type: MarkerType.ArrowClosed,
          color: "#10b981",
        },
      });
    }

    const doneStatus = statuses.find((s) => s.key === "DONE");
    if (doneStatus) {
      transitionEdges.push({
        id: "done-to-exit",
        source: String(doneStatus.id),
        target: "exit",
        type: "smoothstep",
        animated: true,
        style: {
          stroke: "#a855f7",
          strokeWidth: 3,
          strokeDasharray: "5,5",
        },
        markerEnd: {
          type: MarkerType.ArrowClosed,
          color: "#a855f7",
        },
      });
    }

    return transitionEdges;
  }, [transitions, statuses]);

  const [nodesState, setNodesState, onNodesChange] = useNodesState([]);
  const [edgesState, setEdgesState, onEdgesChange] = useEdgesState([]);

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
        nodeTypes={nodeTypes}
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
