import { useAuthStore } from "@/store/authStore";

export function usePermissions() {
  const { user } = useAuthStore();

  const canCreateProject = () => {
    if (!user) return false;

    // Super admin peut tout faire
    if (user.role === "super_admin") return true;

    // Admin peut créer des projets
    if (user.role === "admin") return true;

    // Team owners peuvent créer des projets
    return user.teams?.some((team) => team.pivot.role === "owner") || false;
  };

  const canEditProject = (project?: any) => {
    if (!user) return false;

    if (user.role === "super_admin" || user.role === "admin") {
      return true;
    }

    // Vérifier si l'utilisateur est owner/admin de l'équipe du projet
    if (project && user.teams) {
      return user.teams.some(
        (team) =>
          team.id === project.team_id &&
          ["owner", "admin"].includes(team.pivot.role)
      );
    }

    return false;
  };

  const canDeleteProject = () => {
    if (!user) return false;
    

    // Seuls les super_admin et admin peuvent supprimer
    return user.role === "super_admin" || user.role === "admin";
  };

  return {
    canCreateProject,
    canEditProject,
    canDeleteProject,
    user,
  };
}
