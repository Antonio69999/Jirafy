<?php

namespace App\Interfaces\Ticketing;

use App\Models\Ticketing\Label;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;

interface LabelServiceInterface
{
    /**
     * Récupérer tous les labels avec pagination
     */
    public function getAllLabels(array $filters = [], int $perPage = 20): LengthAwarePaginator;

    /**
     * Récupérer les labels d'un projet spécifique
     */
    public function getProjectLabels(int $projectId, array $filters = [], int $perPage = 20): LengthAwarePaginator;

    /**
     * Récupérer les labels disponibles pour un projet (globaux + projet)
     */
    public function getAvailableLabelsForProject(int $projectId): array;

    /**
     * Récupérer un label par ID
     */
    public function getLabelById(int $id): ?Label;

    /**
     * Créer un nouveau label
     */
    public function createLabel(array $data): Label;

    /**
     * Mettre à jour un label
     */
    public function updateLabel(Label $label, array $data): Label;

    /**
     * Supprimer un label
     */
    public function deleteLabel(Label $label): bool;
}
