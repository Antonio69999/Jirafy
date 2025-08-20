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
import { ProjectActionMenu } from "@/components/menus/ProjectActionMenu";
import { Plus, Star } from "lucide-react";
import { useState, useMemo } from "react";
import { useColorThemeStore } from "@/store/colorThemeStore";
import { cn } from "@/lib/utils";
import { SearchBar } from "@/components/layout/SearchBar";
import { Button } from "@/components/ui/button";

// Type pour les projets
type Project = {
  id: string;
  name: string;
  type: string;
  lead: string;
  starred: boolean;
};

export default function Projects() {
  const { t } = useTranslation();
  const { colorTheme } = useColorThemeStore();

  // État pour les projets (vide par défaut)
  const [projects, setProjects] = useState<Project[]>([]);

  // Configuration de la pagination
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;
  const totalPages = Math.ceil(projects.length / itemsPerPage);

  // Projets affichés sur la page actuelle
  const currentProjects = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return projects.slice(startIndex, startIndex + itemsPerPage);
  }, [projects, currentPage]);

  const getPageNumbers = () => {
    const pageNumbers = [];
    const maxVisiblePages = 5;

    pageNumbers.push(1);

    if (totalPages <= maxVisiblePages) {
      for (let i = 2; i <= totalPages; i++) {
        pageNumbers.push(i);
      }
    } else {
      if (currentPage > 3) {
        pageNumbers.push("ellipsis1");
      }

      const startPage = Math.max(2, currentPage - 1);
      const endPage = Math.min(totalPages - 1, currentPage + 1);

      for (let i = startPage; i <= endPage; i++) {
        pageNumbers.push(i);
      }

      if (currentPage < totalPages - 2) {
        pageNumbers.push("ellipsis2");
      }

      if (totalPages > 1) {
        pageNumbers.push(totalPages);
      }
    }

    return pageNumbers;
  };

  const toggleStar = (id: string) => {
    setProjects(
      projects.map((project: Project) =>
        project.id === id ? { ...project, starred: !project.starred } : project
      )
    );
  };

  const handleArchive = (id: string) => {
    console.log(`Archive project ${id}`);
  };

  const handleDelete = (id: string) => {
    console.log(`Delete project ${id}`);
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

  return (
    <PageContainer title={t("app.sidebar.projects") || "Projects"}>
      <div className="flex justify-between items-center mb-4">
        <div>
          <SearchBar placeholder={t("project.search.placeholder")} />
        </div>
        <Button
          className={cn(
            "bg-[var(--primary)] text-[var(--primary-foreground)] hover:bg-[var(--primary-hover)]",
            `theme-${colorTheme}`
          )}
        >
          <Plus className="mr-2 h-4 w-4" />
          {t("project.actions.create") || "Créer un projet"}
        </Button>
      </div>
      <ScrollArea className="h-[calc(100vh-18rem)]">
        <Table>
          <TableCaption>
            {t("project.table.caption") || "Liste des projets"}
          </TableCaption>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[40px]"></TableHead>
              <TableHead className="w-[200px]">
                {t("project.table.name")}
              </TableHead>
              <TableHead className="w-[150px]">
                {t("project.table.type")}
              </TableHead>
              <TableHead>{t("project.table.lead")}</TableHead>
              <TableHead className="text-right w-[100px]">
                {t("project.table.actions")}
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {currentProjects.length > 0 ? (
              currentProjects.map((project) => (
                <TableRow
                  key={project.id}
                  className={cn(
                    project.starred
                      ? `hover:bg-[var(--hover-bg)] theme-${colorTheme}`
                      : ""
                  )}
                >
                  <TableCell className="w-[40px]">
                    <button
                      onClick={() => toggleStar(project.id)}
                      className={cn(
                        "hover:text-[var(--primary)] focus:outline-none transition-all",
                        `theme-${colorTheme}`
                      )}
                    >
                      <Star
                        className={cn(
                          "h-4 w-4 transition-colors",
                          project.starred
                            ? starColorClass()
                            : "text-muted-foreground"
                        )}
                      />
                      <span className="sr-only">
                        {project.starred
                          ? "Remove from favorites"
                          : "Add to favorites"}
                      </span>
                    </button>
                  </TableCell>
                  <TableCell
                    className={cn(
                      "font-medium",
                      project.starred ? "text-[var(--primary)]" : ""
                    )}
                  >
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
                    <ProjectActionMenu
                      projectId={project.id}
                      onArchive={handleArchive}
                      onDelete={handleDelete}
                    />
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={5} className="h-24 text-center">
                  {t("project.table.empty") || "Aucun projet trouvé"}
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </ScrollArea>
      {/* Pagination - Affichée seulement s'il y a des projets */}
      {projects.length > 0 && (
        <div className="mt-4 flex justify-center">
          <Pagination>
            <PaginationContent>
              {/* Bouton précédent */}
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

              {/* Numéros de page */}
              {getPageNumbers().map((page, index) => (
                <PaginationItem key={index}>
                  {page === "ellipsis1" || page === "ellipsis2" ? (
                    <PaginationEllipsis />
                  ) : (
                    <PaginationLink
                      onClick={() => setCurrentPage(Number(page))}
                      isActive={currentPage === page}
                      className={cn(
                        "cursor-pointer",
                        `theme-${colorTheme}`,
                        currentPage === page
                          ? "bg-[var(--primary)] text-[var(--primary-foreground)]"
                          : "hover:text-[var(--primary)]"
                      )}
                    >
                      {page}
                    </PaginationLink>
                  )}
                </PaginationItem>
              ))}

              {/* Bouton suivant */}
              <PaginationItem>
                <PaginationNext
                  onClick={() =>
                    currentPage < totalPages && setCurrentPage(currentPage + 1)
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
  );
}
