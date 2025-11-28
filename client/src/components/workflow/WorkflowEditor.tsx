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
  type Edge,
  type Connection,
  type Node,
} from "@xyflow/react";
import "@xyflow/react/dist/style.css";
import {
  useProjectWorkflow,
  useCreateTransition,
  useDeleteTransition,
  useValidateWorkflow,
} from "@/hooks/useProjectWorkflow";
import { useStatusActions, useProjectStatuses } from "@/hooks/useStatus";
import { Plus, CheckCircle2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { useColorThemeStore } from "@/store/colorThemeStore";
import { usePermissions } from "@/hooks/usePermissions";
import { TransitionModal } from "./TransitionModal";
import { CreateStatusModal } from "./CreateStatusModal";
import { EditStatusModal } from "./EditStatusModal";
import { ValidationDialog } from "./ValidationDialog";
import StatusNode from "./StatusNode";
import EntryNode from "./EntryNode";
import ExitNode from "./ExitNode";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import type { Status } from "@/api/services/statusService";
import type { WorkflowValidation } from "@/api/services/workflowService";
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

export default function WorkflowEditor() {
  const [searchParams] = useSearchParams();
  const projectId = searchParams.get("project");
  const { colorTheme } = useColorThemeStore();
  const { canManageProject } = usePermissions();
  const reactFlowInstance = useReactFlow();

  const [refreshKey, setRefreshKey] = useState(0);

  const [isTransitionModalOpen, setIsTransitionModalOpen] = useState(false);
  const [isCreateStatusModalOpen, setIsCreateStatusModalOpen] = useState(false);
  const [isEditStatusModalOpen, setIsEditStatusModalOpen] = useState(false);
  const [selectedStatus, setSelectedStatus] = useState<Status | null>(null);
  const [nodeToDelete, setNodeToDelete] = useState<string | null>(null);
  const [edgeToDelete, setEdgeToDelete] = useState<string | null>(null);
  const [validationResult, setValidationResult] =
    useState<WorkflowValidation | null>(null);
  const [isValidationDialogOpen, setIsValidationDialogOpen] = useState(false);

  const [pendingConnection, setPendingConnection] = useState<{
    source: string;
    target: string;
    fromStatus?: Status;
    toStatus?: Status;
  } | null>(null);

  const {
    data: transitions,
    loading: transitionsLoading,
    refetch: refetchTransitions,
  } = useProjectWorkflow(projectId ? parseInt(projectId) : null);

  const {
    data: statuses,
    loading: statusesLoading,
    refetch: refetchStatuses,
  } = useProjectStatuses(projectId ? parseInt(projectId) : null);

  const { create: createTransition } = useCreateTransition();
  const { remove: deleteTransition } = useDeleteTransition();

  const {
    create: createStatus,
    update: updateStatus,
    remove: removeStatus,
  } = useStatusActions();

  const { validate: validateWorkflow, loading: validationLoading } =
    useValidateWorkflow();

  const handleDeleteEdgeClick = useCallback((edgeId: string) => {
    if (edgeId === "entry-to-todo" || edgeId === "done-to-exit") {
      toast.error("Impossible de supprimer les connexions entrée/sortie");
      return;
    }
    setEdgeToDelete(edgeId);
  }, []);

  const confirmDeleteEdge = async () => {
    if (edgeToDelete) {
      try {
        await deleteTransition(Number(edgeToDelete));
        toast.success("Transition supprimée");
        refetchTransitions();
      } catch (error) {
        toast.error("Erreur lors de la suppression");
      } finally {
        setEdgeToDelete(null);
      }
    }
  };

  // Context menu handlers
  const handleEditNodeClick = useCallback(
    (statusId: string) => {
      const status = statuses?.find((s) => String(s.id) === statusId);
      if (status) {
        setSelectedStatus(status);
        setIsEditStatusModalOpen(true);
      }
    },
    [statuses]
  );

  const handleDeleteNodeClick = useCallback((statusId: string) => {
    setNodeToDelete(statusId);
  }, []);

  const confirmDelete = async () => {
    if (nodeToDelete) {
      await handleDeleteStatus(nodeToDelete);
      setNodeToDelete(null);
    }
  };

  const nodes: Node[] = useMemo(() => {
    if (!statuses || statuses.length === 0) return [];

    const statusNodes = statuses.map((status, index) => ({
      id: String(status.id),
      type: "status" as const,
      data: {
        name: status.name,
        key: status.key,
        category: status.category,
        colorTheme,
        onEdit: () => handleEditNodeClick(String(status.id)),
        onDelete: () => handleDeleteNodeClick(String(status.id)),
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
      position: { x: statuses.length * 300 + 350, y: 100 },
    };

    return [entryNode, ...statusNodes, exitNode];
  }, [
    statuses,
    colorTheme,
    handleEditNodeClick,
    handleDeleteNodeClick,
    refreshKey,
  ]);

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
  }, [transitions, statuses, refreshKey]);

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

      const existingTransition = transitions?.find(
        (t) =>
          (t.from_status_id === parseInt(params.source) &&
            t.to_status_id === parseInt(params.target)) ||
          (t.from_status_id === parseInt(params.target) &&
            t.to_status_id === parseInt(params.source))
      );

      if (existingTransition) {
        toast.error(
          "Une transition existe déjà entre ces deux statuts (dans un sens ou l'autre)"
        );
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
    [projectId, statuses, transitions]
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

  const handleValidateWorkflow = async () => {
    if (!projectId) return;

    const result = await validateWorkflow(parseInt(projectId));
    if (result) {
      setValidationResult(result);
      setIsValidationDialogOpen(true);
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
    project_id?: number;
  }) => {
    try {
      await createStatus(data);
      toast.success("Statut créé avec succès");
      await refetchStatuses();
      await refetchTransitions();

      setRefreshKey((prev) => prev + 1);

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
      await refetchTransitions();
      setSelectedStatus(null);
      setIsEditStatusModalOpen(false);

      setRefreshKey((prev) => prev + 1);

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

      setRefreshKey((prev) => prev + 1);

      setTimeout(() => {
        reactFlowInstance.fitView({ padding: 0.2, duration: 300 });
      }, 100);
    } catch (error: any) {
      toast.error(error.message || "Erreur lors de la suppression");
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
            onClick={handleValidateWorkflow}
            disabled={validationLoading}
          >
            <CheckCircle2 className="mr-2 h-4 w-4" />
            {validationLoading ? "Validation..." : "Valider le workflow"}
          </Button>
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
          onEdgeClick={(_, edge) => handleDeleteEdgeClick(edge.id)}
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
        open={!!edgeToDelete}
        onOpenChange={() => setEdgeToDelete(null)}
      >
        <AlertDialogContent className={`theme-${colorTheme}`}>
          <AlertDialogHeader>
            <AlertDialogTitle>Supprimer cette transition ?</AlertDialogTitle>
            <AlertDialogDescription>
              Cette action est irréversible. La transition sera définitivement
              supprimée du workflow.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Annuler</AlertDialogCancel>
            <AlertDialogAction
              onClick={confirmDeleteEdge}
              className="bg-red-600 hover:bg-red-700"
            >
              Supprimer
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* ✅ AlertDialog pour supprimer un statut (déjà existant) */}
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
      <ValidationDialog
        isOpen={isValidationDialogOpen}
        onClose={() => setIsValidationDialogOpen(false)}
        validation={validationResult}
        colorTheme={colorTheme}
      />
    </>
  );
}
