<?php

namespace App\Interfaces\Teams;

use App\Models\Teams\Team;
use Illuminate\Pagination\LengthAwarePaginator;

interface TeamServiceInterface
{
    public function createTeam(array $data): Team;

    public function getTeamById(int $id): ?Team;

    public function getTeamBySlug(string $slug): ?Team;

    public function updateTeam(Team $team, array $data): Team;

    public function deleteTeam(Team $team): bool;

    public function getAllTeams(array $filters = [], int $perPage = 15): LengthAwarePaginator;

    public function addMember(Team $team, int $userId, string $role = 'member'): void;

    public function removeMember(Team $team, int $userId): void;

    public function updateMemberRole(Team $team, int $userId, string $role): void;
}
