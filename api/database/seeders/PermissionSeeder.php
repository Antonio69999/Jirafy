<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class PermissionSeeder extends Seeder
{
    public function run(): void
    {
        // 1. Créer les permissions
        $permissions = [
            // Issues
            ['name' => 'issue.create', 'entity' => 'issue', 'action' => 'create', 'description' => 'Créer une issue'],
            ['name' => 'issue.view', 'entity' => 'issue', 'action' => 'view', 'description' => 'Voir une issue'],
            ['name' => 'issue.update', 'entity' => 'issue', 'action' => 'update', 'description' => 'Modifier une issue'],
            ['name' => 'issue.delete', 'entity' => 'issue', 'action' => 'delete', 'description' => 'Supprimer une issue'],
            ['name' => 'issue.assign', 'entity' => 'issue', 'action' => 'assign', 'description' => 'Assigner une issue'],

            // Workflow
            ['name' => 'workflow.transition', 'entity' => 'workflow', 'action' => 'transition', 'description' => 'Changer le statut d\'une issue'],
            ['name' => 'workflow.manage', 'entity' => 'workflow', 'action' => 'manage', 'description' => 'Gérer les workflows du projet'],

            // Projects
            ['name' => 'project.view', 'entity' => 'project', 'action' => 'view', 'description' => 'Voir un projet'],
            ['name' => 'project.update', 'entity' => 'project', 'action' => 'update', 'description' => 'Modifier un projet'],
            ['name' => 'project.delete', 'entity' => 'project', 'action' => 'delete', 'description' => 'Supprimer un projet'],
            ['name' => 'project.manage_members', 'entity' => 'project', 'action' => 'manage_members', 'description' => 'Gérer les membres du projet'],

            // Teams
            ['name' => 'team.view', 'entity' => 'team', 'action' => 'view', 'description' => 'Voir une équipe'],
            ['name' => 'team.update', 'entity' => 'team', 'action' => 'update', 'description' => 'Modifier une équipe'],
            ['name' => 'team.delete', 'entity' => 'team', 'action' => 'delete', 'description' => 'Supprimer une équipe'],
            ['name' => 'team.manage_members', 'entity' => 'team', 'action' => 'manage_members', 'description' => 'Gérer les membres de l\'équipe'],
        ];

        // Insérer les permissions et récupérer les IDs
        $permissionIds = [];
        foreach ($permissions as $permission) {
            $id = DB::table('permissions')->insertGetId(array_merge($permission, [
                'created_at' => now(),
                'updated_at' => now(),
            ]));
            $permissionIds[$permission['name']] = $id;
        }

        // 2. Associer les permissions aux rôles de projet
        $this->seedProjectPermissions($permissionIds);

        // 3. Associer les permissions aux rôles d'équipe
        $this->seedTeamPermissions($permissionIds);

        $this->command->info('✓ Permissions seeded successfully!');
    }

    private function seedProjectPermissions(array $permissionIds): void
    {
        $projectPermissions = [
            // Admin de projet : TOUT
            ['role' => 'admin', 'permission_id' => $permissionIds['issue.create'], 'context' => 'project'],
            ['role' => 'admin', 'permission_id' => $permissionIds['issue.view'], 'context' => 'project'],
            ['role' => 'admin', 'permission_id' => $permissionIds['issue.update'], 'context' => 'project'],
            ['role' => 'admin', 'permission_id' => $permissionIds['issue.delete'], 'context' => 'project'],
            ['role' => 'admin', 'permission_id' => $permissionIds['issue.assign'], 'context' => 'project'],
            ['role' => 'admin', 'permission_id' => $permissionIds['workflow.transition'], 'context' => 'project'],
            ['role' => 'admin', 'permission_id' => $permissionIds['workflow.manage'], 'context' => 'project'],
            ['role' => 'admin', 'permission_id' => $permissionIds['project.view'], 'context' => 'project'],
            ['role' => 'admin', 'permission_id' => $permissionIds['project.update'], 'context' => 'project'],
            ['role' => 'admin', 'permission_id' => $permissionIds['project.delete'], 'context' => 'project'],
            ['role' => 'admin', 'permission_id' => $permissionIds['project.manage_members'], 'context' => 'project'],

            // Manager : Presque tout sauf supprimer projet
            ['role' => 'manager', 'permission_id' => $permissionIds['issue.create'], 'context' => 'project'],
            ['role' => 'manager', 'permission_id' => $permissionIds['issue.view'], 'context' => 'project'],
            ['role' => 'manager', 'permission_id' => $permissionIds['issue.update'], 'context' => 'project'],
            ['role' => 'manager', 'permission_id' => $permissionIds['issue.delete'], 'context' => 'project'],
            ['role' => 'manager', 'permission_id' => $permissionIds['issue.assign'], 'context' => 'project'],
            ['role' => 'manager', 'permission_id' => $permissionIds['workflow.transition'], 'context' => 'project'],
            ['role' => 'manager', 'permission_id' => $permissionIds['project.view'], 'context' => 'project'],
            ['role' => 'manager', 'permission_id' => $permissionIds['project.update'], 'context' => 'project'],
            ['role' => 'manager', 'permission_id' => $permissionIds['project.manage_members'], 'context' => 'project'],

            // Contributor : Créer, modifier ses issues, transitions
            ['role' => 'contributor', 'permission_id' => $permissionIds['issue.create'], 'context' => 'project'],
            ['role' => 'contributor', 'permission_id' => $permissionIds['issue.view'], 'context' => 'project'],
            ['role' => 'contributor', 'permission_id' => $permissionIds['issue.update'], 'context' => 'project'],
            ['role' => 'contributor', 'permission_id' => $permissionIds['workflow.transition'], 'context' => 'project'],
            ['role' => 'contributor', 'permission_id' => $permissionIds['project.view'], 'context' => 'project'],

            // Viewer : Seulement voir
            ['role' => 'viewer', 'permission_id' => $permissionIds['issue.view'], 'context' => 'project'],
            ['role' => 'viewer', 'permission_id' => $permissionIds['project.view'], 'context' => 'project'],
        ];

        foreach ($projectPermissions as $permission) {
            DB::table('role_permissions')->insert(array_merge($permission, [
                'created_at' => now(),
                'updated_at' => now(),
            ]));
        }
    }

    private function seedTeamPermissions(array $permissionIds): void
    {
        $teamPermissions = [
            // Admin d'équipe : TOUT
            ['role' => 'admin', 'permission_id' => $permissionIds['team.view'], 'context' => 'team'],
            ['role' => 'admin', 'permission_id' => $permissionIds['team.update'], 'context' => 'team'],
            ['role' => 'admin', 'permission_id' => $permissionIds['team.delete'], 'context' => 'team'],
            ['role' => 'admin', 'permission_id' => $permissionIds['team.manage_members'], 'context' => 'team'],

            // Manager d'équipe
            ['role' => 'manager', 'permission_id' => $permissionIds['team.view'], 'context' => 'team'],
            ['role' => 'manager', 'permission_id' => $permissionIds['team.update'], 'context' => 'team'],
            ['role' => 'manager', 'permission_id' => $permissionIds['team.manage_members'], 'context' => 'team'],

            // Contributor d'équipe : voir
            ['role' => 'contributor', 'permission_id' => $permissionIds['team.view'], 'context' => 'team'],

            // Viewer d'équipe : voir
            ['role' => 'viewer', 'permission_id' => $permissionIds['team.view'], 'context' => 'team'],
        ];

        foreach ($teamPermissions as $permission) {
            DB::table('role_permissions')->insert(array_merge($permission, [
                'created_at' => now(),
                'updated_at' => now(),
            ]));
        }
    }
}
