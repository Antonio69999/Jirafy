import { PageContainer } from "@/components/pages/PageContainer";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";

import { useTranslation } from "react-i18next";
import { Plus, Star } from "lucide-react";
import { useState, useMemo } from "react";
import { useColorThemeStore } from "@/store/colorThemeStore";
import { cn } from "@/lib/utils";
import { SearchBar } from "@/components/layout/SearchBar";
import { Button } from "@/components/ui/button";
import ProjectCreateModal from "@/components/modals/CreateProjectModal";
import ProjectEditModal from "@/components/modals/EditProjectModal";
import { useProjects } from "@/hooks/useProject";
import type { Project as ApiProject } from "@/types/project";
import { usePermissions } from "@/hooks/usePermissions";

// Type pour les projets affichés
type DisplayProject = {
  id: string;
  name: string;
  type: string;
  lead: string;
  starred: boolean;
  originalData: ApiProject;
};

export default function Projects() {
  const { t } = useTranslation();
  const { colorTheme } = useColorThemeStore();
  const { canCreateProject, canEditProject, canDeleteProject } =
    usePermissions();

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;

  // États modales
  const [createOpen, setCreateOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [editingProject, setEditingProject] = useState<ApiProject | null>(null);

  // Récupération API
  const {
    data: projectsData,
    loading,
    error,
    refetch,
  } = useProjects({
    page: currentPage,
    per_page: itemsPerPage,
  });

  // Transformation pour affichage
  const projects: DisplayProject[] = useMemo(() => {
    if (!projectsData?.data) return [];
    return projectsData.data.map((project) => ({
      id: String(project.id),
      name: project.name,
      type: project.key || "-",
      lead: project.lead?.name || "-",
      starred: false, // TODO favoris
      originalData: project,
    }));
  }, [projectsData]);

  const totalPages = projectsData?.last_page || 1;
  const currentProjects = projects;

  const getPageNumbers = () => {
    const pageNumbers = [];
    const maxVisiblePages = 5;
    pageNumbers.push(1);

    if (totalPages <= maxVisiblePages) {
      for (let i = 2; i <= totalPages; i++) pageNumbers.push(i);
    } else {
      if (currentPage > 3) pageNumbers.push("ellipsis1");
      const startPage = Math.max(2, currentPage - 1);
      const endPage = Math.min(totalPages - 1, currentPage + 1);
      for (let i = startPage; i <= endPage; i++) pageNumbers.push(i);
      if (currentPage < totalPages - 2) pageNumbers.push("ellipsis2");
      if (totalPages > 1) pageNumbers.push(totalPages);
    }

    return pageNumbers;
  };

  // Actions
  const toggleStar = (id: string) => console.log(`Toggle star ${id}`);

  const handleDelete = (project: ApiProject) => {
    if (canDeleteProject()) {
      // TODO: delete API
      console.log("Suppression projet:", project.id);
      refetch();
    }
  };

  const handleEdit = (project: ApiProject) => {
    if (canEditProject(project)) {
      setEditingProject(project);
      setEditOpen(true);
    }
  };

  const handleCreateSuccess = () => {
    refetch();
    setCreateOpen(false);
  };

  const handleEditSuccess = () => {
    refetch();
    setEditOpen(false);
    setEditingProject(null);
  };

  const starColorClass = () => {
    const themeColorMap = {
      blue: "fill-blue-400 text-blue-400",
      yellow: "fill-yellow-400 text-yellow-400",
      purple: "fill-purple-400 text-purple-400",
      red: "fill-red-400 text-red-400",
      pink: "fill-pink-400 text-pink-400",
      orange: "fill-orange-400 text-orange-400",
      green: "fill-green-400 text-green-400",
    };
    return themeColorMap[colorTheme] || "fill-yellow-400 text-yellow-400";
  };

  if (loading) {
    return (
      <PageContainer title={t("app.sidebar.projects") || "Projects"}>
        <div className="flex justify-center items-center h-64 text-muted-foreground">
          {t("common.loading") || "Chargement..."}
        </div>
      </PageContainer>
    );
  }

  if (error) {
    return (
      <PageContainer title={t("app.sidebar.projects") || "Projects"}>
        <div className="flex justify-center items-center h-64 text-red-500">
          {t("common.error") || "Une erreur est survenue"}: {error.message}
        </div>
      </PageContainer>
    );
  }

  return (
    <>
      <PageContainer title={t("app.sidebar.projects") || "Projects"}>
        <div className="flex justify-between items-center mb-4">
          <SearchBar placeholder={t("project.search.placeholder")} />
          {canCreateProject() && (
            <Button
              onClick={() => setCreateOpen(true)}
              className={cn(
                "bg-[var(--primary)] text-[var(--primary-foreground)] hover:bg-[var(--primary-hover)]",
                `theme-${colorTheme}`
              )}
            >
              <Plus className="mr-2 h-4 w-4" />
              {t("project.actions.create") || "Créer un projet"}
            </Button>
          )}
        </div>

        <ScrollArea className="h-[calc(100vh-18rem)]">
          <Table>
            <TableCaption>
              {t("project.table.caption") || "Liste des projets"}
            </TableCaption>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[40px]"></TableHead>
                <TableHead>{t("project.table.name")}</TableHead>
                <TableHead>{t("project.table.type")}</TableHead>
                <TableHead>{t("project.table.lead")}</TableHead>
                <TableHead className="text-right w-[200px]">
                  {t("project.table.actions")}
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {currentProjects.length > 0 ? (
                currentProjects.map((project) => (
                  <TableRow key={project.id}>
                    {/* Favoris */}
                    <TableCell>
                      <button onClick={() => toggleStar(project.id)}>
                        <Star
                          className={cn(
                            "h-4 w-4",
                            project.starred
                              ? starColorClass()
                              : "text-muted-foreground"
                          )}
                        />
                      </button>
                    </TableCell>
                    {/* Nom */}
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <img
                          src={`https://robohash.org/${project.id}`}
                          alt={`${project.name} logo`}
                          className="h-7 w-7 rounded-sm"
                        />
                        {project.name}
                      </div>
                    </TableCell>
                    <TableCell>{project.type}</TableCell>
                    <TableCell>{project.lead}</TableCell>
                    {/* Actions conditionnées */}
                    <TableCell className="text-right flex gap-2 justify-end">
                      {canEditProject(project.originalData) && (
                        <Button
                          onClick={() => handleEdit(project.originalData)}
                          variant="outline"
                          size="sm"
                        >
                          {t("app.common.edit") || "Modifier"}
                        </Button>
                      )}
                      {canDeleteProject() && (
                        <Button
                          onClick={() => handleDelete(project.originalData)}
                          variant="destructive"
                          size="sm"
                        >
                          {t("app.common.delete") || "Supprimer"}
                        </Button>
                      )}
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={5} className="text-center h-24">
                    {t("project.table.empty") || "Aucun projet trouvé"}
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </ScrollArea>

        {/* Pagination */}
        {projects.length > 0 && (
          <div className="mt-4 flex justify-center">
            <Pagination>
              <PaginationContent>
                <PaginationItem>
                  <PaginationPrevious
                    onClick={() =>
                      currentPage > 1 && setCurrentPage(currentPage - 1)
                    }
                    className={cn(
                      currentPage === 1
                        ? "pointer-events-none opacity-50"
                        : "cursor-pointer hover:text-[var(--primary)]",
                      `theme-${colorTheme}`
                    )}
                  />
                </PaginationItem>

                {getPageNumbers().map((page, idx) => (
                  <PaginationItem key={idx}>
                    {page === "ellipsis1" || page === "ellipsis2" ? (
                      <PaginationEllipsis />
                    ) : (
                      <PaginationLink
                        onClick={() => setCurrentPage(Number(page))}
                        isActive={currentPage === page}
                      >
                        {page}
                      </PaginationLink>
                    )}
                  </PaginationItem>
                ))}

                <PaginationItem>
                  <PaginationNext
                    onClick={() =>
                      currentPage < totalPages &&
                      setCurrentPage(currentPage + 1)
                    }
                    className={cn(
                      currentPage === totalPages
                        ? "pointer-events-none opacity-50"
                        : "cursor-pointer hover:text-[var(--primary)]",
                      `theme-${colorTheme}`
                    )}
                  />
                </PaginationItem>
              </PaginationContent>
            </Pagination>
          </div>
        )}
      </PageContainer>

      {/* Modales */}
      <ProjectCreateModal
        isOpen={createOpen}
        onClose={() => setCreateOpen(false)}
        onSuccess={handleCreateSuccess}
      />
      {editingProject && (
        <ProjectEditModal
          isOpen={editOpen}
          onClose={() => {
            setEditOpen(false);
            setEditingProject(null);
          }}
          onSuccess={handleEditSuccess}
          project={editingProject}
        />
      )}
    </>
  );
}
