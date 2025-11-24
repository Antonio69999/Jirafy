import { useMemo, useCallback, useEffect, useState } from "react";
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
} from "@xyflow/react";
import "@xyflow/react/dist/style.css";
import {
  useProjectWorkflow,
  useCreateTransition,
  useDeleteTransition,
} from "@/hooks/useProjectWorkflow";
import { useAvailableStatuses } from "@/hooks/useStatus";
import { Plus, Edit, Trash2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { useColorThemeStore } from "@/store/colorThemeStore";
import { usePermissions } from "@/hooks/usePermissions";
import { TransitionModal } from "./TransitionModal";
import StatusNode from "./StatusNode";
import EntryNode from "./EntryNode";
import ExitNode from "./ExitNode";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

// ✅ Définir les types de nœuds personnalisés
const nodeTypes = {
  status: StatusNode,
  entry: EntryNode,
  exit: ExitNode,
};

export default function WorkflowEditor() {
  const [searchParams] = useSearchParams();
  const projectId = searchParams.get("project");
  const { colorTheme } = useColorThemeStore();
  const { canManageProject } = usePermissions();

  const [isTransitionModalOpen, setIsTransitionModalOpen] = useState(false);
  const [pendingConnection, setPendingConnection] = useState<{
    source: string;
    target: string;
    fromStatus?: any;
    toStatus?: any;
  } | null>(null);

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

  // ✅ Création des nœuds avec entrée/sortie
 const nodes: Node[] = useMemo(() => {
  if (!statuses || !Array.isArray(statuses) || statuses.length === 0)
    return [];

  // ✅ Layout amélioré : disposition horizontale
  const statusNodes = statuses.map((status, index) => ({
    id: String(status.id),
    type: "status" as const,
    data: {
      name: status.name,
      key: status.key,
      category: status.category,
    },
    position: {
      x: 350 + index * 300, // ✅ Augmenter l'espacement horizontal (300px au lieu de 250px)
      y: 100, // ✅ Tous sur la même ligne (pas de Math.floor pour éviter les étages)
    },
  }));

  // ✅ Nœud d'entrée (plus à gauche)
  const entryNode: Node = {
    id: "entry",
    type: "entry",
    data: { label: "Ticket créé" },
    position: { x: 0, y: 100 }, // ✅ Aligné avec les autres
  };

  // ✅ Nœud de sortie (plus à droite)
  const exitNode: Node = {
    id: "exit",
    type: "exit",
    data: { label: "Ticket résolu" },
    position: { x: 350 + statuses.length * 300, y: 100 }, // ✅ Aligné avec les autres
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

    // ✅ Connexion entrée → premier statut (TODO)
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

    // ✅ Connexion dernier statut (DONE) → sortie
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
    console.log("🔄 Updating nodes state:", nodes);
    setNodesState(nodes);
  }, [nodes, setNodesState]);

  useEffect(() => {
    console.log("🔄 Updating edges state:", edges);
    setEdgesState(edges);
  }, [edges, setEdgesState]);

  // ✅ Gérer la connexion avec modal
  const onConnect = useCallback(
    (params: Connection) => {
      if (!projectId || !params.source || !params.target) return;

      // Empêcher les connexions depuis/vers entrée/sortie
      if (
        params.source === "entry" ||
        params.target === "exit" ||
        params.source === "exit" ||
        params.target === "entry"
      ) {
        toast.error("Impossible de modifier les connexions entrée/sortie");
        return;
      }

      const fromStatus = statuses?.find((s) => String(s.id) === params.source);
      const toStatus = statuses?.find((s) => String(s.id) === params.target);

      setPendingConnection({
        source: params.source,
        target: params.target,
        fromStatus,
        toStatus,
      });
      setIsTransitionModalOpen(true);
    },
    [projectId, statuses]
  );

  // ✅ Créer la transition depuis la modal
  const handleCreateTransition = async (data: {
    name: string;
    description?: string;
  }) => {
    if (!pendingConnection || !projectId) return;

    try {
      await createTransition({
        project_id: parseInt(projectId),
        from_status_id: parseInt(pendingConnection.source),
        to_status_id: parseInt(pendingConnection.target),
        name: data.name,
        description: data.description,
      });

      toast.success("Transition créée avec succès");
      refetch();
    } catch (error) {
      toast.error("Erreur lors de la création de la transition");
    } finally {
      setPendingConnection(null);
    }
  };

  // Suppression d'une transition
  const handleDeleteEdge = useCallback(
    async (edgeId: string) => {
      // Empêcher la suppression des edges entrée/sortie
      if (edgeId === "entry-to-todo" || edgeId === "done-to-exit") {
        toast.error("Impossible de supprimer les connexions entrée/sortie");
        return;
      }

      if (!window.confirm("Supprimer cette transition ?")) return;
      try {
        await deleteTransition(Number(edgeId));
        toast.success("Transition supprimée");
        refetch();
      } catch (error) {
        toast.error("Erreur lors de la suppression");
      }
    },
    [deleteTransition, refetch]
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
    <>
      <div
        className={cn(
          "h-[calc(100vh-12rem)] w-full rounded-lg border relative",
          `theme-${colorTheme}`
        )}
      >
        {/* ✅ Boutons d'action en haut à droite */}
        <div className="absolute top-4 right-4 z-10 flex gap-2">
          <Button
            size="sm"
            variant="outline"
            className="bg-card/80 backdrop-blur"
            onClick={() => toast.info("Fonctionnalité bientôt disponible")}
          >
            <Plus className="mr-2 h-4 w-4" />
            Ajouter un statut
          </Button>
          <Button
            size="sm"
            variant="outline"
            className="bg-card/80 backdrop-blur"
            onClick={() => toast.info("Fonctionnalité bientôt disponible")}
          >
            <Edit className="mr-2 h-4 w-4" />
            Éditer un statut
          </Button>
          <Button
            size="sm"
            variant="outline"
            className="bg-card/80 backdrop-blur text-destructive hover:text-destructive"
            onClick={() => toast.info("Fonctionnalité bientôt disponible")}
          >
            <Trash2 className="mr-2 h-4 w-4" />
            Supprimer un statut
          </Button>
        </div>

        <ReactFlow
          nodes={nodesState}
          edges={edgesState}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          onConnect={onConnect}
          onEdgeClick={(_, edge) => handleDeleteEdge(edge.id)}
          nodeTypes={nodeTypes} // ✅ Utiliser les nœuds personnalisés
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

        <div className="absolute bottom-4 left-4 p-3 text-xs text-muted-foreground bg-card/90 backdrop-blur rounded-lg border shadow-sm">
          <div className="flex items-center gap-2 mb-2">
            <Plus className="h-4 w-4" />
            <span className="font-medium">Comment utiliser :</span>
          </div>
          <ul className="space-y-1 ml-6 text-xs">
            <li>
              • Glissez-déposez entre deux statuts pour créer une transition
            </li>
            <li>• Cliquez sur une flèche pour la supprimer</li>
            <li>
              • Les flèches en pointillés sont automatiques (entrée/sortie)
            </li>
          </ul>
        </div>
      </div>

      {/* ✅ Modal de création de transition */}
      <TransitionModal
        isOpen={isTransitionModalOpen}
        onClose={() => {
          setIsTransitionModalOpen(false);
          setPendingConnection(null);
        }}
        onSubmit={handleCreateTransition}
        fromStatusName={pendingConnection?.fromStatus?.name}
        toStatusName={pendingConnection?.toStatus?.name}
      />
    </>
  );
}
