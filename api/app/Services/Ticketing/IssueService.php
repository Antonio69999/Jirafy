<?php

namespace App\Services\Ticketing;

use App\Models\Ticketing\{Issue, Project};
use App\Interfaces\Ticketing\IssueServiceInterface;
use Illuminate\Pagination\LengthAwarePaginator;
use Illuminate\Support\Facades\DB;

class IssueService implements IssueServiceInterface
{
    public function createIssue(array $data): Issue
    {
        return DB::transaction(function () use ($data) {
            $project = Project::findOrFail($data['project_id']);
            
            $nextNumber = $project->increment('issue_seq');
            $issueKey = $this->generateIssueKey($project->id);

            /** @var Issue $issue */
            $issue = Issue::create([
                'project_id' => $data['project_id'],
                'type_id' => $data['type_id'],
                'status_id' => $data['status_id'],
                'priority_id' => $data['priority_id'],
                'reporter_id' => $data['reporter_id'],
                'assignee_id' => $data['assignee_id'] ?? null,
                'number' => $nextNumber,
                'issue_key' => $issueKey,
                'title' => $data['title'],
                'description' => $data['description'] ?? null,
                'story_points' => $data['story_points'] ?? null,
                'due_date' => $data['due_date'] ?? null,
            ]);

            return $issue->load([
                'project:id,key,name',
                'type:id,key,name',
                'status:id,key,name,category',
                'priority:id,key,name,weight',
                'reporter:id,name,email',
                'assignee:id,name,email'
            ]);
        });
    }

    public function getIssueById(int $id): ?Issue
    {
        return Issue::query()
            ->with([
                'project:id,key,name',
                'type:id,key,name',
                'status:id,key,name,category',
                'priority:id,key,name,weight',
                'reporter:id,name,email',
                'assignee:id,name,email',
                'labels:id,name,color',
                'comments.author:id,name,email'
            ])
            ->find($id);
    }

    public function getIssueByKey(string $key): ?Issue
    {
        return Issue::query()
            ->with([
                'project:id,key,name',
                'type:id,key,name',
                'status:id,key,name,category',
                'priority:id,key,name,weight',
                'reporter:id,name,email',
                'assignee:id,name,email',
                'labels:id,name,color',
                'comments.author:id,name,email'
            ])
            ->where('issue_key', $key)
            ->first();
    }

    public function updateIssue(Issue $issue, array $data): Issue
    {
        $issue->fill([
            'type_id' => $data['type_id'] ?? $issue->type_id,
            'status_id' => $data['status_id'] ?? $issue->status_id,
            'priority_id' => $data['priority_id'] ?? $issue->priority_id,
            'assignee_id' => $data['assignee_id'] ?? $issue->assignee_id,
            'title' => $data['title'] ?? $issue->title,
            'description' => $data['description'] ?? $issue->description,
            'story_points' => $data['story_points'] ?? $issue->story_points,
            'due_date' => $data['due_date'] ?? $issue->due_date,
        ])->save();

        return $issue->load([
            'project:id,key,name',
            'type:id,key,name',
            'status:id,key,name,category',
            'priority:id,key,name,weight',
            'reporter:id,name,email',
            'assignee:id,name,email',
            'labels:id,name,color'
        ]);
    }

    public function deleteIssue(Issue $issue): bool
    {
        return DB::transaction(function () use ($issue) {
            return $issue->delete();
        });
    }

    public function getProjectIssues(int $projectId, array $filters = [], int $perPage = 15): LengthAwarePaginator
    {
        $query = Issue::query()
            ->with([
                'type:id,key,name',
                'status:id,key,name,category',
                'priority:id,key,name,weight',
                'reporter:id,name,email',
                'assignee:id,name,email',
                'labels:id,name,color'
            ])
            ->where('project_id', $projectId);

        // Filtres
        if (!empty($filters['status_id'])) {
            $query->where('status_id', (int)$filters['status_id']);
        }

        if (!empty($filters['type_id'])) {
            $query->where('type_id', (int)$filters['type_id']);
        }

        if (!empty($filters['priority_id'])) {
            $query->where('priority_id', (int)$filters['priority_id']);
        }

        if (!empty($filters['assignee_id'])) {
            $query->where('assignee_id', (int)$filters['assignee_id']);
        }

        if (!empty($filters['search'])) {
            $term = $filters['search'];
            $query->where(function ($w) use ($term) {
                $w->where('title', 'ilike', "%{$term}%")
                    ->orWhere('description', 'ilike', "%{$term}%")
                    ->orWhere('issue_key', 'ilike', "%{$term}%");
            });
        }

        // Tri
        if (!empty($filters['order_by'])) {
            $dir = $filters['order_dir'] ?? 'asc';
            $query->orderBy($filters['order_by'], $dir);
        } else {
            $query->orderBy('created_at', 'desc');
        }

        return $query->paginate($perPage);
    }

    public function getAllIssues(array $filters = [], int $perPage = 15): LengthAwarePaginator
    {
        $query = Issue::query()
            ->with([
                'project:id,key,name',
                'type:id,key,name',
                'status:id,key,name,category',
                'priority:id,key,name,weight',
                'reporter:id,name,email',
                'assignee:id,name,email',
                'labels:id,name,color'
            ]);

        // Mêmes filtres que getProjectIssues mais sans restriction de projet
        if (!empty($filters['project_id'])) {
            $query->where('project_id', (int)$filters['project_id']);
        }

        if (!empty($filters['status_id'])) {
            $query->where('status_id', (int)$filters['status_id']);
        }

        if (!empty($filters['type_id'])) {
            $query->where('type_id', (int)$filters['type_id']);
        }

        if (!empty($filters['priority_id'])) {
            $query->where('priority_id', (int)$filters['priority_id']);
        }

        if (!empty($filters['assignee_id'])) {
            $query->where('assignee_id', (int)$filters['assignee_id']);
        }

        if (!empty($filters['search'])) {
            $term = $filters['search'];
            $query->where(function ($w) use ($term) {
                $w->where('title', 'ilike', "%{$term}%")
                    ->orWhere('description', 'ilike', "%{$term}%")
                    ->orWhere('issue_key', 'ilike', "%{$term}%");
            });
        }

        if (!empty($filters['order_by'])) {
            $dir = $filters['order_dir'] ?? 'asc';
            $query->orderBy($filters['order_by'], $dir);
        } else {
            $query->orderBy('created_at', 'desc');
        }

        return $query->paginate($perPage);
    }

    public function generateIssueKey(int $projectId): string
    {
        $project = Project::findOrFail($projectId);
        return $project->key . '-' . $project->issue_seq;
    }
}