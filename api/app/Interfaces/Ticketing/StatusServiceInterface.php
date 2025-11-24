<?php

namespace App\Interfaces\Ticketing;

use App\Models\Ticketing\Status;
use Illuminate\Pagination\LengthAwarePaginator;

interface StatusServiceInterface
{
  public function createStatus(array $data): Status;

  public function getStatusById(int $id): ?Status;

  public function getStatusByKey(string $key): ?Status;

  public function updateStatus(Status $status, array $data): Status;

  public function deleteStatus(Status $status): bool;

  public function getAllStatuses(array $filters = [], int $perPage = 15): LengthAwarePaginator;

  public function getAvailableStatuses(?int $projectId = null): array;
}
