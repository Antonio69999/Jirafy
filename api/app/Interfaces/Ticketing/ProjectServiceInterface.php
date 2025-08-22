<?php

namespace App\Interfaces\Ticketing;

use App\Models\Ticketing\Project;
use Illuminate\Pagination\LengthAwarePaginator;

interface ProjectServiceInterface
{
    public function createProject(array $data): Project;

    public function getProjectById(int $id): ?Project;

    public function updateProject(Project $project, array $data): Project;

    public function deleteProject(Project $project): bool;

    public function getAllProjects(array $filters = [], int $perPage = 15): LengthAwarePaginator;
}
