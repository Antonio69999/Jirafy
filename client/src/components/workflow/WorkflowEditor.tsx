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
  useReactFlow,
  Handle,
  Position,
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
import { useAvailableStatuses, useStatusActions } from "@/hooks/useStatus";
import {
  Plus,
  Edit2,
  Trash2,
  Circle,
  ArrowRight,
  CheckCircle2,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useColorThemeStore } from "@/store/colorThemeStore";
import { usePermissions } from "@/hooks/usePermissions";
import { TransitionModal } from "./TransitionModal";
import { CreateStatusModal } from "./CreateStatusModal";
import { EditStatusModal } from "./EditStatusModal";
import StatusNode from "./StatusNode";
import EntryNode from "./EntryNode";
import ExitNode from "./ExitNode";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import type { Status } from "@/api/services/statusService";
import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuSeparator,
  ContextMenuTrigger,
} from "@/components/ui/context-menu";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

const nodeTypes = {
  status: StatusNode,
  entry: EntryNode,
  exit: ExitNode,
};

// ✅ Déplacer les helper functions EN DEHORS du composant
const getCategoryColor = (category: string): string => {
  switch (category) {
    case "todo":
      return "#3b82f6";
    case "in_progress":
      return "#f59e0b";
    case "done":
      return "#10b981";
    default:
      return "#6b7280";
  }
};

const getCategoryIcon = (category: string) => {
  switch (category) {
    case "todo":
      return <Circle className="w-4 h-4" />;
    case "in_progress":
      return <ArrowRight className="w-4 h-4" />;
    case "done":
      return <CheckCircle2 className="w-4 h-4" />;
    default:
      return <Circle className="w-4 h-4" />;
  }
};

const getCategoryLabel = (category: string): string => {
  switch (category) {
    case "todo":
      return "À faire";
    case "in_progress":
      return "En cours";
    case "done":
      return "Terminé";
    default:
      return "";
  }
};

export default function WorkflowEditor() {
  const [searchParams] = useSearchParams();
  const projectId = searchParams.get("project");
  const { colorTheme } = useColorThemeStore();
  const { canManageProject } = usePermissions();
  const reactFlowInstance = useReactFlow();

  const [isTransitionModalOpen, setIsTransitionModalOpen] = useState(false);
  const [isCreateStatusModalOpen, setIsCreateStatusModalOpen] = useState(false);
  const [isEditStatusModalOpen, setIsEditStatusModalOpen] = useState(false);
  const [selectedStatus, setSelectedStatus] = useState<Status | null>(null);
  const [nodeToDelete, setNodeToDelete] = useState<string | null>(null);

  const [pendingConnection, setPendingConnection] = useState<{
    source: string;
    target: string;
    fromStatus?: any;
    toStatus?: any;
  } | null>(null);

  const {
    data: transitions,
    loading: transitionsLoading,
    refetch: refetchTransitions,
  } = useProjectWorkflow(projectId ? parseInt(projectId) : null);

  const {
    data: statuses,
    loading: statusesLoading,
    error: statusesError,
    refetch: refetchStatuses,
  } = useAvailableStatuses(projectId ? parseInt(projectId) : undefined);

  const { create: createTransition } = useCreateTransition();
  const { remove: deleteTransition } = useDeleteTransition();

  const {
    create: createStatus,
    update: updateStatus,
    remove: removeStatus,
  } = useStatusActions();

  // Context menu handlers
  const handleEditNodeClick = (statusId: string) => {
    const status = statuses?.find((s) => String(s.id) === statusId);
    if (status) {
      setSelectedStatus(status);
      setIsEditStatusModalOpen(true);
    }
  };

  const handleDeleteNodeClick = (statusId: string) => {
    setNodeToDelete(statusId);
  };

  const confirmDelete = async () => {
    if (nodeToDelete) {
      await handleDeleteStatus(nodeToDelete);
      setNodeToDelete(null);
    }
  };

  // ✅ Maintenant useMemo peut utiliser les fonctions helper
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
        contextMenu: (
          <ContextMenu>
            <ContextMenuTrigger asChild>
              <div
                className={cn(
                  "px-4 py-3 rounded-lg border-2 transition-all min-w-[180px]",
                  "bg-card shadow-md cursor-context-menu"
                )}
                style={{ borderColor: getCategoryColor(status.category) }}
              >
                <Handle
                  type="target"
                  position={Position.Left}
                  className="opacity-0"
                />

                <div className="flex items-center gap-2 mb-1">
                  <div style={{ color: getCategoryColor(status.category) }}>
                    {getCategoryIcon(status.category)}
                  </div>
                  <div className="font-semibold text-foreground">
                    {status.name}
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <div className="text-xs text-muted-foreground">
                    {status.key}
                  </div>
                  <div
                    className="text-xs font-medium px-2 py-0.5 rounded"
                    style={{
                      backgroundColor: `${getCategoryColor(status.category)}20`,
                      color: getCategoryColor(status.category),
                    }}
                  >
                    {getCategoryLabel(status.category)}
                  </div>
                </div>

                <Handle
                  type="source"
                  position={Position.Right}
                  className="opacity-0"
                />
              </div>
            </ContextMenuTrigger>

            <ContextMenuContent className={`theme-${colorTheme}`}>
              <ContextMenuItem
                onClick={() => handleEditNodeClick(String(status.id))}
              >
                <Edit2 className="mr-2 h-4 w-4" />
                Modifier
              </ContextMenuItem>
              <ContextMenuSeparator />
              <ContextMenuItem
                onClick={() => handleDeleteNodeClick(String(status.id))}
                className="text-red-600"
              >
                <Trash2 className="mr-2 h-4 w-4" />
                Supprimer
              </ContextMenuItem>
            </ContextMenuContent>
          </ContextMenu>
        ),
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
  }, [statuses, colorTheme]); // ✅ Ajouter colorTheme dans les deps

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

  const onConnect = useCallback(
    (params: Connection) => {
      if (!projectId || !params.source || !params.target) return;

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
      refetchTransitions();
    } catch (error) {
      toast.error("Erreur lors de la création de la transition");
    } finally {
      setPendingConnection(null);
    }
  };

  const handleDeleteEdge = useCallback(
    async (edgeId: string) => {
      if (edgeId === "entry-to-todo" || edgeId === "done-to-exit") {
        toast.error("Impossible de supprimer les connexions entrée/sortie");
        return;
      }

      if (!window.confirm("Supprimer cette transition ?")) return;
      try {
        await deleteTransition(Number(edgeId));
        toast.success("Transition supprimée");
        refetchTransitions();
      } catch (error) {
        toast.error("Erreur lors de la suppression");
      }
    },
    [deleteTransition, refetchTransitions]
  );

  const handleCreateStatus = async (data: {
    key: string;
    name: string;
    category: string;
  }) => {
    try {
      await createStatus(data);
      toast.success("Statut créé avec succès");
      await refetchStatuses();
      setTimeout(() => {
        reactFlowInstance.fitView({ padding: 0.2, duration: 300 });
      }, 100);
    } catch (error) {
      toast.error("Erreur lors de la création du statut");
    }
  };

  const handleUpdateStatus = async (updates: {
    key?: string;
    name?: string;
    category?: string;
  }) => {
    if (!selectedStatus) return;

    try {
      await updateStatus(selectedStatus.id, updates);
      toast.success("Statut modifié avec succès");
      await refetchStatuses();
      setSelectedStatus(null);
      setIsEditStatusModalOpen(false);
      setTimeout(() => {
        reactFlowInstance.fitView({ padding: 0.2, duration: 300 });
      }, 100);
    } catch (error) {
      toast.error("Erreur lors de la modification du statut");
    }
  };

  const handleDeleteStatus = async (statusId: string) => {
    try {
      await removeStatus(Number(statusId));
      toast.success("Statut supprimé");
      await refetchStatuses();
      await refetchTransitions();
      setTimeout(() => {
        reactFlowInstance.fitView({ padding: 0.2, duration: 300 });
      }, 100);
    } catch (error) {
      toast.error("Erreur lors de la suppression");
    }
  };

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

  return (
    <>
      <div
        className={cn(
          "h-[calc(100vh-12rem)] w-full rounded-lg border relative",
          `theme-${colorTheme}`
        )}
      >
        <div className="absolute top-4 right-4 z-10 flex gap-2">
          <Button
            size="sm"
            variant="outline"
            className="bg-card/80 backdrop-blur"
            onClick={() => setIsCreateStatusModalOpen(true)}
          >
            <Plus className="mr-2 h-4 w-4" />
            Ajouter un statut
          </Button>
        </div>

        <ReactFlow
          nodes={nodesState}
          edges={edgesState}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          onConnect={onConnect}
          onEdgeClick={(_, edge) => handleDeleteEdge(edge.id)}
          nodeTypes={nodeTypes}
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
            <li>• Clic droit sur un statut pour modifier/supprimer</li>
          </ul>
        </div>
      </div>

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

      <CreateStatusModal
        isOpen={isCreateStatusModalOpen}
        onClose={() => setIsCreateStatusModalOpen(false)}
        onSubmit={handleCreateStatus}
        projectId={projectId ? parseInt(projectId) : undefined}
      />

      <EditStatusModal
        isOpen={isEditStatusModalOpen}
        onClose={() => {
          setIsEditStatusModalOpen(false);
          setSelectedStatus(null);
        }}
        onSubmit={handleUpdateStatus}
        status={selectedStatus}
      />

      <AlertDialog
        open={!!nodeToDelete}
        onOpenChange={() => setNodeToDelete(null)}
      >
        <AlertDialogContent className={`theme-${colorTheme}`}>
          <AlertDialogHeader>
            <AlertDialogTitle>Êtes-vous sûr ?</AlertDialogTitle>
            <AlertDialogDescription>
              Cette action est irréversible. Les issues utilisant ce statut
              devront être migrées vers un autre statut.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Annuler</AlertDialogCancel>
            <AlertDialogAction
              onClick={confirmDelete}
              className="bg-red-600 hover:bg-red-700"
            >
              Supprimer
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
