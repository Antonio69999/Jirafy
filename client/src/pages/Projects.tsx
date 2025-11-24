import { useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { Plus, Star, Users } from "lucide-react";
import { cn } from "@/lib/utils";
import { useColorThemeStore } from "@/store/colorThemeStore";
import { useProjects } from "@/hooks/useProject";
import { usePermissions } from "@/hooks/usePermissions";

import { Button } from "@/components/ui/button";
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

import { PageContainer } from "@/components/pages/PageContainer";
import { SearchBar } from "@/components/layout/SearchBar";
import CreateProjectModal from "@/components/modals/CreateProjectModal";
import EditProjectModal from "@/components/modals/EditProjectModal";
import ProjectMembersModal from "@/components/modals/ProjectMembersModal";

import type { Project as ApiProject } from "@/types/project";

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

  //  Hook de permissions
  const {
    canCreateProject,
    canEditProject,
    canDeleteProject,
    canManageProjectMembers,
  } = usePermissions();

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;

  const [createOpen, setCreateOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [membersOpen, setMembersOpen] = useState(false);
  const [editingProject, setEditingProject] = useState<ApiProject | null>(null);
  const [selectedProject, setSelectedProject] = useState<ApiProject | null>(
    null
  );

  const {
    data: projectsData,
    loading,
    error,
    refetch,
  } = useProjects({
    page: currentPage,
    per_page: itemsPerPage,
  });

  const projects: DisplayProject[] = useMemo(() => {
    if (!projectsData?.data) return [];
    return projectsData.data.map((p) => ({
      id: String(p.id),
      name: p.name,
      type: "Software",
      lead: p.lead?.name || "Non assigné",
      starred: false,
      originalData: p,
    }));
  }, [projectsData]);

  const totalPages = Math.ceil((projectsData?.total || 0) / itemsPerPage);
  const currentProjects = projects;

  const toggleStar = (id: string) => {
    console.log("Toggle star for project:", id);
  };

  const starColorClass = () =>
    `fill-[var(--primary)] text-[var(--primary)] theme-${colorTheme}`;

  const handleEdit = (project: ApiProject) => {
    setEditingProject(project);
    setEditOpen(true);
  };

  const handleDelete = async (project: ApiProject) => {
    if (!confirm(t("project.actions.deleteConfirm") || "Êtes-vous sûr ?")) {
      return;
    }
    console.log("Delete project:", project.id);
  };

  const handleManageMembers = (project: ApiProject) => {
    setSelectedProject(project);
    setMembersOpen(true);
  };

  const handleSuccess = () => {
    refetch();
    setCreateOpen(false);
    setEditOpen(false);
  };

  if (loading) {
    return (
      <PageContainer title={t("app.sidebar.projects") || "Projects"}>
        <div className="flex justify-center items-center h-64">
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

          {/*  Masquer le bouton "Créer un projet" si pas de permission */}
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
                <TableHead className="text-right w-[250px]">
                  {t("project.table.actions")}
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {currentProjects.length > 0 ? (
                currentProjects.map((project) => (
                  <TableRow key={project.id}>
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
                    <TableCell className="text-right">
                      <div className="flex gap-2 justify-end">
                        {/*  Bouton "Membres" : toujours visible si l'utilisateur peut voir le projet */}
                        {canManageProjectMembers(project.originalData) && (
                          <Button
                            onClick={() =>
                              handleManageMembers(project.originalData)
                            }
                            variant="outline"
                            size="sm"
                          >
                            <Users className="mr-2 h-4 w-4" />
                            {t("project.actions.members") || "Membres"}
                          </Button>
                        )}

                        {/*  Bouton "Modifier" : masqué si pas de permission */}
                        {canEditProject(project.originalData) && (
                          <Button
                            onClick={() => handleEdit(project.originalData)}
                            variant="outline"
                            size="sm"
                          >
                            {t("common.edit") || "Modifier"}
                          </Button>
                        )}

                        {/*  Bouton "Supprimer" : masqué si pas de permission */}
                        {canDeleteProject() && (
                          <Button
                            onClick={() => handleDelete(project.originalData)}
                            variant="destructive"
                            size="sm"
                          >
                            {t("common.delete") || "Supprimer"}
                          </Button>
                        )}
                      </div>
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
                      currentPage === 1 && "pointer-events-none opacity-50"
                    )}
                  />
                </PaginationItem>

                {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                  (page) =>
                    Math.abs(page - currentPage) <= 2 ? (
                      <PaginationItem key={page}>
                        <PaginationLink
                          onClick={() => setCurrentPage(page)}
                          isActive={currentPage === page}
                        >
                          {page}
                        </PaginationLink>
                      </PaginationItem>
                    ) : page === 1 || page === totalPages ? (
                      <PaginationItem key={page}>
                        <PaginationEllipsis />
                      </PaginationItem>
                    ) : null
                )}

                <PaginationItem>
                  <PaginationNext
                    onClick={() =>
                      currentPage < totalPages &&
                      setCurrentPage(currentPage + 1)
                    }
                    className={cn(
                      currentPage === totalPages &&
                        "pointer-events-none opacity-50"
                    )}
                  />
                </PaginationItem>
              </PaginationContent>
            </Pagination>
          </div>
        )}
      </PageContainer>

      {/* Modales */}
      {canCreateProject() && (
        <CreateProjectModal
          isOpen={createOpen}
          onClose={setCreateOpen}
          onSuccess={handleSuccess}
        />
      )}

      {editingProject && canEditProject(editingProject) && (
        <EditProjectModal
          isOpen={editOpen}
          onClose={setEditOpen}
          onSuccess={handleSuccess}
          project={editingProject}
        />
      )}

      {selectedProject && (
        <ProjectMembersModal
          isOpen={membersOpen}
          onClose={setMembersOpen}
          project={selectedProject}
        />
      )}
    </>
  );
}
