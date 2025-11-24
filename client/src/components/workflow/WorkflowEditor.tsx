import { useMemo, useCallback, useEffect } from "react";
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
  type Connection,
  type Node,
  type Edge as FlowEdge,
} from "@xyflow/react";
import "@xyflow/react/dist/style.css";
import {
  useProjectWorkflow,
  useCreateTransition,
  useDeleteTransition,
} from "@/hooks/useProjectWorkflow";
import { useAvailableStatuses } from "@/hooks/useStatus";
import { Plus } from "lucide-react";
import { cn } from "@/lib/utils";
import { useColorThemeStore } from "@/store/colorThemeStore";
import { usePermissions } from "@/hooks/usePermissions";

export default function WorkflowEditor() {
  const [searchParams] = useSearchParams();
  const projectId = searchParams.get("project");
  const { colorTheme } = useColorThemeStore();
  const { canManageProject } = usePermissions();

  const {
    data: transitions,
    loading: transitionsLoading,
    refetch,
  } = useProjectWorkflow(projectId ? parseInt(projectId) : null);

 const { data: statuses, loading: statusesLoading } = useAvailableStatuses(
    projectId ? parseInt(projectId) : undefined
  );
  
  const { create: createTransition } = useCreateTransition();
  const { remove: deleteTransition } = useDeleteTransition();

  // Création des nœuds (statuts)
  const nodes: Node[] = useMemo(() => {
    if (!statuses || !Array.isArray(statuses) || statuses.length === 0)
      return [];

    console.log("📦 Creating nodes from statuses:", statuses);

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

  // Création des edges (transitions)
  const edges: Edge[] = useMemo(() => {
    if (!transitions || transitions.length === 0) return [];

    console.log("🔗 Creating edges from transitions:", transitions);

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

  // ✅ Initialiser les states ReactFlow
  const [nodesState, setNodesState, onNodesChange] = useNodesState([]);
  const [edgesState, setEdgesState, onEdgesChange] = useEdgesState([]);

  // ✅ Mettre à jour les states quand les données changent
  useEffect(() => {
    console.log("🔄 Updating nodes state:", nodes);
    setNodesState(nodes);
  }, [nodes, setNodesState]);

  useEffect(() => {
    console.log("🔄 Updating edges state:", edges);
    setEdgesState(edges);
  }, [edges, setEdgesState]);

  // Ajout d'une transition par drag & drop
  const onConnect = useCallback(
    async (params: Connection) => {
      if (!projectId || !params.source || !params.target) return;
      const name = window.prompt("Nom de la transition ?");
      if (!name) return;

      await createTransition({
        project_id: parseInt(projectId),
        from_status_id: parseInt(params.source),
        to_status_id: parseInt(params.target),
        name,
      });

      refetch();
    },
    [projectId, createTransition, refetch]
  );

  // Suppression d'une transition
  const handleDeleteEdge = useCallback(
    async (edgeId: string) => {
      if (!window.confirm("Supprimer cette transition ?")) return;
      await deleteTransition(Number(edgeId));
      refetch();
    },
    [deleteTransition, refetch]
  );

  // États de chargement et permissions
  if (!projectId) {
    return (
      <div className="flex items-center justify-center h-[calc(100vh-12rem)]">
        <p className="text-muted-foreground">
          Sélectionnez un projet pour éditer son workflow
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

  if (!canManageProject({ id: parseInt(projectId) })) {
    return (
      <div className="flex items-center justify-center h-[calc(100vh-12rem)]">
        <p className="text-muted-foreground">
          Vous n'avez pas la permission de modifier ce workflow.
        </p>
      </div>
    );
  }

  console.log("🎨 Rendering ReactFlow with:", {
    nodesCount: nodesState.length,
    edgesCount: edgesState.length,
  });

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
        onConnect={onConnect}
        onEdgeClick={(_, edge) => handleDeleteEdge(edge.id)}
        fitView
        minZoom={0.5}
        maxZoom={1.5}
        defaultEdgeOptions={{
          type: "smoothstep",
          animated: true,
        }}
      >
        <Background variant={BackgroundVariant.Dots} gap={12} size={1} />
        <Controls />
      </ReactFlow>

      <div className="absolute bottom-4 left-4 p-2 text-xs text-muted-foreground bg-card/80 rounded border">
        <Plus className="inline w-4 h-4 mr-1" />
        Glissez-déposez entre deux statuts pour créer une transition. Cliquez
        sur une flèche pour la supprimer.
      </div>
    </div>
  );
}
