import { useAuthStore } from "@/store/authStore";
import type { Project } from "@/types/project";
import type { Team } from "@/types/team";

export function usePermissions() {
  const { user } = useAuthStore();

  // ==================== PROJETS ====================

  const canCreateProject = (): boolean => {
    if (!user) return false;
    if (user.role === "super_admin") return true;
    if (user.role === "admin") return true;
    if (user.role === "customer") return false; 
    return user.teams?.some((team) => team.pivot.role === "owner") || false;
  };

  const canEditProject = (project?: Project): boolean => {
    if (!user) return false;
    if (user.role === "customer") return false; 
    if (user.role === "super_admin" || user.role === "admin") return true;

    if (project && user.teams) {
      return user.teams.some(
        (team) =>
          team.id === project.team_id &&
          ["owner", "admin"].includes(team.pivot.role)
      );
    }

    return false;
  };

  const canDeleteProject = (): boolean => {
    if (!user) return false;
    if (user.role === "customer") return false;
    return user.role === "super_admin" || user.role === "admin";
  };

  const canManageProjectMembers = (project?: Project): boolean => {
    if (!user) return false;
    if (user.role === "customer") return false;
    if (user.role === "super_admin" || user.role === "admin") return true;

    if (project && user.teams) {
      return user.teams.some(
        (team) =>
          team.id === project.team_id &&
          ["owner", "admin"].includes(team.pivot.role)
      );
    }

    return false;
  };

  // ==================== ÉQUIPES ====================

  const canCreateTeam = (): boolean => {
    if (!user) return false;
    if (user.role === "customer") return false; 
    return user.role === "super_admin" || user.role === "admin";
  };

  const canEditTeam = (team?: Team): boolean => {
    if (!user) return false;
    if (user.role === "customer") return false; 
    if (user.role === "super_admin" || user.role === "admin") return true;

    if (team && user.teams) {
      return user.teams.some(
        (t) => t.id === team.id && ["owner", "admin"].includes(t.pivot.role)
      );
    }

    return false;
  };

  const canDeleteTeam = (): boolean => {
    if (!user) return false;
    if (user.role === "customer") return false;
    return user.role === "super_admin" || user.role === "admin";
  };

  const canManageTeamMembers = (team?: Team): boolean => {
    if (!user) return false;
    if (user.role === "customer") return false; 
    if (user.role === "super_admin" || user.role === "admin") return true;

    if (team && user.teams) {
      return user.teams.some(
        (t) => t.id === team.id && ["owner", "admin"].includes(t.pivot.role)
      );
    }

    return false;
  };

  // ==================== TICKETS ====================

  const canCreateIssue = (project?: Project): boolean => {
    if (!user) return false;
    if (user.role === "customer") {
      // Vérifier que le client a accès au projet via son organisation
      // TODO: Vérifier via organization_projects
      return true; // Pour l'instant, on autorise
    }
    return true; 
  };

  const canEditIssue = (issue?: any): boolean => {
    if (!user) return false;

    if (user.role === "customer") return false;

    if (user.role === "super_admin" || user.role === "admin") return true;

    // Reporter ou assignee peut modifier
    if (issue) {
      return issue.reporter_id === user.id || issue.assignee_id === user.id;
    }

    return false;
  };

  const canDeleteIssue = (): boolean => {
    if (!user) return false;
    if (user.role === "customer") return false;
    return user.role === "super_admin" || user.role === "admin";
  };

  const canAssignIssue = (): boolean => {
    if (!user) return false;
    if (user.role === "customer") return false;
    return true; 
  };

  // ==================== LABELS ====================

  const canCreateLabel = (projectId?: number): boolean => {
    if (!user) return false;
    if (user.role === "customer") return false; 

    if (!projectId) {
      return user.role === "super_admin" || user.role === "admin";
    }

    return true;
  };

  // ==================== VUES ====================

  const canViewProjects = (): boolean => {
    if (!user) return false;
    return true;
  };

  const canViewTeams = (): boolean => {
    if (!user) return false;
    if (user.role === "customer") return false; 
    return true;
  };

  const canViewDashboard = (): boolean => {
    if (!user) return false;
    if (user.role === "customer") return false; 
    return true;
  };

  return {
    // Projets
    canCreateProject,
    canEditProject,
    canDeleteProject,
    canManageProjectMembers,
    canViewProjects,

    // Équipes
    canCreateTeam,
    canEditTeam,
    canDeleteTeam,
    canManageTeamMembers,
    canViewTeams,

    // Tickets
    canCreateIssue,
    canEditIssue,
    canDeleteIssue,
    canAssignIssue,

    // Labels
    canCreateLabel,

    // Vues
    canViewDashboard,

    user,
  };
}
