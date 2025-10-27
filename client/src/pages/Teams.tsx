import { SearchBar } from "@/components/layout/SearchBar";
import { PageContainer } from "@/components/pages/PageContainer";
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
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { cn } from "@/lib/utils";
import { useColorThemeStore } from "@/store/colorThemeStore";
import { Plus, Users, Settings } from "lucide-react";
import { useTranslation } from "react-i18next";
import { useState, useMemo } from "react";
import { useTeams, useDeleteTeam } from "@/hooks/useTeam";
import type { Team } from "@/types/team";
import CreateTeamModal from "@/components/modals/CreateTeamModal";
import EditTeamModal from "@/components/modals/EditTeamModal";
import TeamMembersModal from "@/components/modals/TeamMembersModal";
import { toast } from "sonner";

export default function Teams() {
  const { t } = useTranslation();
  const { colorTheme } = useColorThemeStore();

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;

  // États modales
  const [createOpen, setCreateOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [membersOpen, setMembersOpen] = useState(false);
  const [selectedTeam, setSelectedTeam] = useState<Team | null>(null);

  // Récupération API
  const {
    data: teamsData,
    loading,
    error,
    refetch,
  } = useTeams({
    page: currentPage,
    per_page: itemsPerPage,
  });

  const { remove: deleteTeam } = useDeleteTeam();

  // Transformation pour affichage
  const teams = useMemo(() => {
    if (!teamsData?.data) return [];
    return teamsData.data;
  }, [teamsData]);

  const totalPages = Math.ceil((teamsData?.total || 0) / itemsPerPage);

  // Handlers
  const handleCreateSuccess = (team: Team) => {
    setCreateOpen(false);
    refetch();
    toast.success(t("team.actions.createSuccess") || "Équipe créée");
  };

  const handleEditSuccess = (team: Team) => {
    setEditOpen(false);
    setSelectedTeam(null);
    refetch();
    toast.success(t("team.actions.updateSuccess") || "Équipe mise à jour");
  };

  const handleEdit = (team: Team) => {
    setSelectedTeam(team);
    setEditOpen(true);
  };

  const handleManageMembers = (team: Team) => {
    setSelectedTeam(team);
    setMembersOpen(true);
  };

  const handleDelete = async (team: Team) => {
    if (
      !confirm(
        t("team.actions.deleteConfirm") ||
          `Êtes-vous sûr de vouloir supprimer "${team.name}" ?`
      )
    ) {
      return;
    }

    const success = await deleteTeam(team.id);
    if (success) {
      toast.success(t("team.actions.deleteSuccess") || "Équipe supprimée");
      refetch();
    }
  };

  const getPageNumbers = () => {
    const pages: (number | string)[] = [];
    if (totalPages <= 7) {
      for (let i = 1; i <= totalPages; i++) pages.push(i);
    } else {
      if (currentPage <= 3) {
        pages.push(1, 2, 3, 4, "...", totalPages);
      } else if (currentPage >= totalPages - 2) {
        pages.push(
          1,
          "...",
          totalPages - 3,
          totalPages - 2,
          totalPages - 1,
          totalPages
        );
      } else {
        pages.push(
          1,
          "...",
          currentPage - 1,
          currentPage,
          currentPage + 1,
          "...",
          totalPages
        );
      }
    }
    return pages;
  };

  if (loading && !teams.length) {
    return (
      <PageContainer title={t("app.sidebar.teams") || "Teams"}>
        <div className="flex items-center justify-center h-64">
          <p className="text-muted-foreground">
            {t("app.common.loading") || "Chargement..."}
          </p>
        </div>
      </PageContainer>
    );
  }

  if (error) {
    return (
      <PageContainer title={t("app.sidebar.teams") || "Teams"}>
        <div className="text-red-500">
          {t("common.error") || "Une erreur est survenue"}: {error.message}
        </div>
      </PageContainer>
    );
  }

  return (
    <>
      <PageContainer title={t("app.sidebar.teams") || "Teams"}>
        <div className="mb-4 text-sm text-muted-foreground">
          {t("teams.description") ||
            "Gérez vos équipes et leurs membres. Les équipes permettent d'organiser les projets et de gérer les permissions."}
        </div>

        <div className="flex justify-between items-center mb-5">
          <SearchBar
            placeholder={t("teams.search") || "Rechercher une équipe..."}
          />
          <Button
            onClick={() => setCreateOpen(true)}
            className={cn(
              "bg-[var(--primary)] text-[var(--primary-foreground)] hover:bg-[var(--primary-hover)]",
              `theme-${colorTheme}`
            )}
          >
            <Plus className="mr-2 h-4 w-4" />
            {t("teams.actions.create") || "Créer une équipe"}
          </Button>
        </div>

        <ScrollArea className="h-[calc(100vh-20rem)]">
          <Table>
            <TableCaption>
              {t("teams.table.caption") || "Liste des équipes"}
            </TableCaption>
            <TableHeader>
              <TableRow>
                <TableHead>{t("teams.table.name") || "Nom"}</TableHead>
                <TableHead>{t("teams.table.slug") || "Slug"}</TableHead>
                <TableHead>{t("teams.table.members") || "Membres"}</TableHead>
                <TableHead>{t("teams.table.projects") || "Projets"}</TableHead>
                <TableHead className="text-right w-[250px]">
                  {t("teams.table.actions") || "Actions"}
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {teams.length > 0 ? (
                teams.map((team) => (
                  <TableRow key={team.id}>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center">
                          <Users className="h-4 w-4 text-primary" />
                        </div>
                        <div>
                          <p className="font-medium">{team.name}</p>
                          {team.description && (
                            <p className="text-xs text-muted-foreground truncate max-w-[300px]">
                              {team.description}
                            </p>
                          )}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <code className="text-xs bg-muted px-2 py-1 rounded">
                        {team.slug}
                      </code>
                    </TableCell>
                    <TableCell>{team.members_count || 0}</TableCell>
                    <TableCell>{team.projects_count || 0}</TableCell>
                    <TableCell className="text-right flex gap-2 justify-end">
                      <Button
                        onClick={() => handleManageMembers(team)}
                        variant="outline"
                        size="sm"
                      >
                        <Users className="mr-2 h-4 w-4" />
                        {t("teams.actions.members") || "Membres"}
                      </Button>
                      <Button
                        onClick={() => handleEdit(team)}
                        variant="outline"
                        size="sm"
                      >
                        <Settings className="mr-2 h-4 w-4" />
                        {t("common.edit") || "Modifier"}
                      </Button>
                      <Button
                        onClick={() => handleDelete(team)}
                        variant="destructive"
                        size="sm"
                      >
                        {t("common.delete") || "Supprimer"}
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={5} className="text-center h-24">
                    {t("teams.table.empty") || "Aucune équipe trouvée"}
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </ScrollArea>

        {/* Pagination */}
        {teams.length > 0 && (
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
                    {page === "..." ? (
                      <span className="px-4">...</span>
                    ) : (
                      <PaginationLink
                        onClick={() => setCurrentPage(page as number)}
                        isActive={currentPage === page}
                        className={cn(
                          "cursor-pointer",
                          `theme-${colorTheme}`,
                          currentPage === page &&
                            "bg-[var(--primary)] text-[var(--primary-foreground)]"
                        )}
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
      <CreateTeamModal
        isOpen={createOpen}
        onClose={setCreateOpen}
        onSuccess={handleCreateSuccess}
      />

      {selectedTeam && (
        <>
          <EditTeamModal
            isOpen={editOpen}
            onClose={setEditOpen}
            onSuccess={handleEditSuccess}
            team={selectedTeam}
          />

          <TeamMembersModal
            isOpen={membersOpen}
            onClose={setMembersOpen}
            team={selectedTeam}
            onMemberAdded={refetch}
            onMemberRemoved={refetch}
          />
        </>
      )}
    </>
  );
}
