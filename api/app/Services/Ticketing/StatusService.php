<?php

namespace App\Services\Ticketing;

use App\Models\Ticketing\Status;
use App\Interfaces\Ticketing\StatusServiceInterface;
use Illuminate\Pagination\LengthAwarePaginator;
use Illuminate\Support\Facades\DB;

class StatusService implements StatusServiceInterface
{
  public function createStatus(array $data): Status
  {
    return DB::transaction(function () use ($data) {
      $data['key'] = strtoupper(trim($data['key']));

      return Status::create([
        'key' => $data['key'],
        'name' => $data['name'],
        'category' => $data['category'],
      ]);
    });
  }

  public function getStatusById(int $id): ?Status
  {
    return Status::find($id);
  }

  public function getStatusByKey(string $key): ?Status
  {
    return Status::where('key', strtoupper($key))->first();
  }

  public function updateStatus(Status $status, array $data): Status
  {
    return DB::transaction(function () use ($status, $data) {
      if (isset($data['key'])) {
        $data['key'] = strtoupper(trim($data['key']));
      }

      $status->update($data);
      return $status->fresh();
    });
  }

  public function deleteStatus(Status $status): bool
  {
    return DB::transaction(function () use ($status) {
      $issuesCount = $status->issues()->count();
      if ($issuesCount > 0) {
        throw new \Exception("Impossible de supprimer un statut utilisé par {$issuesCount} issue(s). Migrez d'abord ces issues vers un autre statut.");
      }

      $transitionsFrom = DB::table('workflow_transitions')
        ->where('from_status_id', $status->id)
        ->count();

      $transitionsTo = DB::table('workflow_transitions')
        ->where('to_status_id', $status->id)
        ->count();

      $transitionsCount = $transitionsFrom + $transitionsTo;

      if ($transitionsCount > 0) {
        throw new \Exception("Impossible de supprimer un statut utilisé dans {$transitionsCount} transition(s). Supprimez d'abord les transitions depuis le workflow editor.");
      }

      DB::table('project_statuses')
        ->where('status_id', $status->id)
        ->delete();

      return $status->delete();
    });
  }

  public function getAllStatuses(array $filters = [], int $perPage = 15): LengthAwarePaginator
  {
    $query = Status::query();

    // Filtres
    if (!empty($filters['category'])) {
      $query->where('category', $filters['category']);
    }

    if (!empty($filters['search'])) {
      $query->where(function ($q) use ($filters) {
        $q->where('name', 'like', '%' . $filters['search'] . '%')
          ->orWhere('key', 'like', '%' . $filters['search'] . '%');
      });
    }

    // Tri
    $orderBy = $filters['order_by'] ?? 'name';
    $orderDir = $filters['order_dir'] ?? 'asc';
    $query->orderBy($orderBy, $orderDir);

    return $query->paginate($perPage);
  }

  public function getAvailableStatuses(?int $projectId = null): array
  {
    $query = Status::select(['id', 'key', 'name', 'category']);

    if ($projectId) {
      $query->where(function ($q) use ($projectId) {
        $q->whereNull('project_id')
          ->orWhere('project_id', $projectId);
      });
    } else {
      $query->whereNull('project_id');
    }

    return $query->orderBy('category')->orderBy('name')->get()->toArray();
  }
}
