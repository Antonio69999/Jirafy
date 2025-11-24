import { useMemo, useCallback } from "react";
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
import { Button } from "@/components/ui/button";
import { Trash2, Plus } from "lucide-react";
import { cn } from "@/lib/utils";
import { useColorThemeStore } from "@/store/colorThemeStore";

export default function WorkflowEditor() {
  const [searchParams] = useSearchParams();
  const projectId = searchParams.get("project");
  const { colorTheme } = useColorThemeStore();

  const {
    data: transitions,
    loading: transitionsLoading,
    refetch,
  } = useProjectWorkflow(projectId ? parseInt(projectId) : null);
  const { data: statuses, loading: statusesLoading } = useAvailableStatuses();

  const { create: createTransition, loading: creating } = useCreateTransition();
  const { remove: deleteTransition, loading: deleting } = useDeleteTransition();

  // Création des nœuds (statuts)
  const nodes: Node[] = useMemo(() => {
    if (!statuses || !Array.isArray(statuses) || statuses.length === 0)
      return [];
    return statuses.map((status, index) => ({
      id: String(status.id),
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
      },
    }));
  }, [statuses]);

  // Création des edges (transitions)
  const edges: Edge[] = useMemo(() => {
    if (!transitions.length) return [];
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
      data: {
        transitionId: transition.id,
      },
    }));
  }, [transitions]);

  const [nodesState, , onNodesChange] = useNodesState(nodes);
  const [edgesState, setEdgesState, onEdgesChange] = useEdgesState(edges);

  // Ajout d'une transition par drag & drop
  const onConnect = useCallback(
    async (params: Connection) => {
      if (!projectId || !params.source || !params.target) return;
      // Demander le nom de la transition (simple prompt pour l'exemple)
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
    async (edge: FlowEdge) => {
      if (!edge.id) return;
      if (!window.confirm("Supprimer cette transition ?")) return;
      await deleteTransition(Number(edge.id));
      refetch();
    },
    [deleteTransition, refetch]
  );

  // Ajout d'un bouton de suppression sur chaque edge
  const edgeTypes = useMemo(
    () => ({
      default: (edge: any) => (
        <g>
          <foreignObject width={40} height={40} x={-20} y={-20}>
            <Button
              size="icon"
              variant="ghost"
              className="absolute -top-2 -right-2 z-10"
              onClick={() => handleDeleteEdge(edge)}
            >
              <Trash2 className="w-4 h-4 text-destructive" />
            </Button>
          </foreignObject>
        </g>
      ),
    }),
    [handleDeleteEdge]
  );

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

  return (
    <div
      className={cn(
        "h-[calc(100vh-12rem)] rounded-lg border",
        `theme-${colorTheme}`
      )}
    >
      <ReactFlow
        nodes={nodesState}
        edges={edgesState}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        fitView
        // edgeTypes={edgeTypes} // Pour custom, à activer si tu veux un bouton sur l'edge
      >
        <Background variant={BackgroundVariant.Dots} />
        <Controls />
      </ReactFlow>
      <div className="p-2 text-xs text-muted-foreground">
        <Plus className="inline w-4 h-4 mr-1" />
        Glissez-déposez entre deux statuts pour créer une transition. Cliquez
        sur une flèche pour la supprimer.
      </div>
    </div>
  );
}
