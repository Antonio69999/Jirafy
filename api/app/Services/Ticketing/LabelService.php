<?php

namespace App\Services\Ticketing;

use App\Interfaces\Ticketing\LabelServiceInterface;
use App\Models\Ticketing\Label;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;

class LabelService implements LabelServiceInterface
{
    /**
     * Récupérer tous les labels avec pagination
     */
    public function getAllLabels(array $filters = [], int $perPage = 20): LengthAwarePaginator
    {
        $query = Label::query()
            ->with('project:id,key,name')
            ->orderBy('name');

        // Filtrage par projet
        if (!empty($filters['project_id'])) {
            $query->where('project_id', $filters['project_id']);
        }

        // Labels globaux uniquement
        if (!empty($filters['global_only'])) {
            $query->whereNull('project_id');
        }

        // Recherche par nom
        if (!empty($filters['search'])) {
            $query->where('name', 'ILIKE', '%' . $filters['search'] . '%');
        }

        // Tri
        if (!empty($filters['order_by'])) {
            $direction = $filters['order_dir'] ?? 'asc';
            $query->orderBy($filters['order_by'], $direction);
        }

        return $query->paginate($perPage);
    }

    /**
     * Récupérer les labels d'un projet spécifique
     */
    public function getProjectLabels(int $projectId, array $filters = [], int $perPage = 20): LengthAwarePaginator
    {
        $query = Label::forProject($projectId)
            ->orderBy('name');

        // Recherche par nom
        if (!empty($filters['search'])) {
            $query->where('name', 'ILIKE', '%' . $filters['search'] . '%');
        }

        return $query->paginate($perPage);
    }

    /**
     * Récupérer les labels disponibles pour un projet (globaux + projet)
     */
    public function getAvailableLabelsForProject(int $projectId): array
    {
        return Label::availableForProject($projectId)
            ->select(['id', 'name', 'color', 'project_id'])
            ->orderBy('name')
            ->get()
            ->toArray();
    }

    /**
     * Récupérer un label par ID
     */
    public function getLabelById(int $id): ?Label
    {
        return Label::with('project:id,key,name')->find($id);
    }

    /**
     * Créer un nouveau label
     */
    public function createLabel(array $data): Label
    {
        // Validation de la couleur au format hexa
        if (isset($data['color']) && !preg_match('/^#[0-9A-Fa-f]{6}$/', $data['color'])) {
            $data['color'] = '#3b82f6'; // Couleur par défaut
        }

        return Label::create($data);
    }

    /**
     * Mettre à jour un label
     */
    public function updateLabel(Label $label, array $data): Label
    {
        // Validation de la couleur au format hexa
        if (isset($data['color']) && !preg_match('/^#[0-9A-Fa-f]{6}$/', $data['color'])) {
            unset($data['color']); // Garder l'ancienne couleur si invalide
        }

        $label->update($data);
        $label->refresh();

        return $label;
    }

    /**
     * Supprimer un label
     */
    public function deleteLabel(Label $label): bool
    {
        // Détacher des issues avant suppression
        $label->issues()->detach();

        return $label->delete();
    }
}