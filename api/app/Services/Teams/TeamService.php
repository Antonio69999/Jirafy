<?php

namespace App\Services\Teams;

use App\Models\Teams\Team;
use App\Models\Teams\TeamUser;
use App\Interfaces\Teams\TeamServiceInterface;
use Illuminate\Pagination\LengthAwarePaginator;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;

class TeamService implements TeamServiceInterface
{
    public function createTeam(array $data): Team
    {
        return DB::transaction(function () use ($data) {
            // Générer le slug si non fourni
            if (empty($data['slug'])) {
                $data['slug'] = Str::slug($data['name']);
            }

            $data['slug'] = strtolower(trim($data['slug']));

            /** @var Team $team */
            $team = Team::create([
                'slug' => $data['slug'],
                'name' => $data['name'],
                'description' => $data['description'] ?? null,
            ]);

            // Si un owner est spécifié, l'ajouter automatiquement
            if (!empty($data['owner_id'])) {
                $this->addMember($team, $data['owner_id'], 'owner');
            }

            return $team->load(['members']);
        });
    }

    public function getTeamById(int $id): ?Team
    {
        return Team::query()
            ->with(['members'])
            ->withCount(['members', 'projects'])
            ->find($id);
    }

    public function getTeamBySlug(string $slug): ?Team
    {
        return Team::query()
            ->where('slug', $slug)
            ->with(['members'])
            ->withCount(['members', 'projects'])
            ->first();
    }

    public function updateTeam(Team $team, array $data): Team
    {
        if (isset($data['slug'])) {
            $data['slug'] = strtolower(trim($data['slug']));
        }

        $team->fill([
            'slug' => $data['slug'] ?? $team->slug,
            'name' => $data['name'] ?? $team->name,
            'description' => $data['description'] ?? $team->description,
        ])->save();

        return $team->load(['members']);
    }

    public function deleteTeam(Team $team): bool
    {
        return DB::transaction(function () use ($team) {
            return $team->delete();
        });
    }

    public function getAllTeams(array $filters = [], int $perPage = 15): LengthAwarePaginator
    {
        $query = Team::query()
            ->with(['members'])
            ->withCount(['members', 'projects']);

        if (!empty($filters['search'])) {
            $search = $filters['search'];
            $query->where(function ($q) use ($search) {
                $q->where('name', 'LIKE', "%{$search}%")
                    ->orWhere('slug', 'LIKE', "%{$search}%")
                    ->orWhere('description', 'LIKE', "%{$search}%");
            });
        }

        if (!empty($filters['order_by'])) {
            $orderDir = $filters['order_dir'] ?? 'asc';
            $query->orderBy($filters['order_by'], $orderDir);
        } else {
            $query->orderBy('created_at', 'desc');
        }

        return $query->paginate($perPage);
    }

    public function addMember(Team $team, int $userId, string $role = 'member'): void
    {
        TeamUser::updateOrCreate(
            ['team_id' => $team->id, 'user_id' => $userId],
            ['role' => $role]
        );
    }

    public function removeMember(Team $team, int $userId): void
    {
        TeamUser::where('team_id', $team->id)
            ->where('user_id', $userId)
            ->delete();
    }

    public function updateMemberRole(Team $team, int $userId, string $role): void
    {
        TeamUser::where('team_id', $team->id)
            ->where('user_id', $userId)
            ->update(['role' => $role]);
    }
}
