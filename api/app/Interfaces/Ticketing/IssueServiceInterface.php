<?php

namespace App\Interfaces\Ticketing;

use App\Models\Ticketing\Issue;
use Illuminate\Pagination\LengthAwarePaginator;

interface IssueServiceInterface
{
    public function createIssue(array $data): Issue;

    public function getIssueById(int $id): ?Issue;

    public function getIssueByKey(string $key): ?Issue;

    public function updateIssue(Issue $issue, array $data): Issue;

    public function deleteIssue(Issue $issue): bool;

    public function getProjectIssues(int $projectId, array $filters = [], int $perPage = 15): LengthAwarePaginator;

    public function getAllIssues(array $filters = [], int $perPage = 15): LengthAwarePaginator;

    public function generateIssueKey(int $projectId): string;
}