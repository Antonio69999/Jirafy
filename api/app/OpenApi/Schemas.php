<?php

namespace App\OpenApi;

/**
 * @OA\Schema(
 *     schema="WorkflowTransition",
 *     type="object",
 *     @OA\Property(property="id", type="integer", example=1),
 *     @OA\Property(property="project_id", type="integer", example=1),
 *     @OA\Property(property="from_status_id", type="integer", example=1),
 *     @OA\Property(property="to_status_id", type="integer", example=2),
 *     @OA\Property(property="name", type="string", example="Start Progress"),
 *     @OA\Property(property="description", type="string", nullable=true),
 *     @OA\Property(property="fromStatus", ref="#/components/schemas/Status"),
 *     @OA\Property(property="toStatus", ref="#/components/schemas/Status")
 * )
 *
 * @OA\Schema(
 *     schema="TransitionCreate",
 *     type="object",
 *     required={"project_id", "from_status_id", "to_status_id", "name"},
 *     @OA\Property(property="project_id", type="integer", example=1),
 *     @OA\Property(property="from_status_id", type="integer", example=1),
 *     @OA\Property(property="to_status_id", type="integer", example=2),
 *     @OA\Property(property="name", type="string", example="Start Progress"),
 *     @OA\Property(property="description", type="string", nullable=true)
 * )
 *
 * @OA\Schema(
 *     schema="AvailableTransition",
 *     type="object",
 *     @OA\Property(property="id", type="integer"),
 *     @OA\Property(property="name", type="string"),
 *     @OA\Property(property="description", type="string", nullable=true),
 *     @OA\Property(property="to_status_id", type="integer"),
 *     @OA\Property(property="toStatus", ref="#/components/schemas/Status"),
 *     @OA\Property(property="validation_errors", type="array", @OA\Items(type="string")),
 *     @OA\Property(property="is_allowed", type="boolean")
 * )
 *
 * @OA\Schema(
 *     schema="WorkflowValidation",
 *     type="object",
 *     @OA\Property(property="valid", type="boolean", example=true),
 *     @OA\Property(property="errors", type="array", @OA\Items(type="string")),
 *     @OA\Property(property="warnings", type="array", @OA\Items(type="string"))
 * )
 *
 * @OA\Schema(
 *     schema="Status",
 *     type="object",
 *     @OA\Property(property="id", type="integer", example=1),
 *     @OA\Property(property="key", type="string", example="TODO"),
 *     @OA\Property(property="name", type="string", example="À faire"),
 *     @OA\Property(property="category", type="string", enum={"todo", "in_progress", "done"})
 * )
 *
 * @OA\Schema(
 *     schema="Issue",
 *     type="object",
 *     @OA\Property(property="id", type="integer"),
 *     @OA\Property(property="key", type="string", example="WEB-123"),
 *     @OA\Property(property="title", type="string"),
 *     @OA\Property(property="description", type="string", nullable=true),
 *     @OA\Property(property="project_id", type="integer"),
 *     @OA\Property(property="status_id", type="integer"),
 *     @OA\Property(property="type_id", type="integer"),
 *     @OA\Property(property="priority_id", type="integer"),
 *     @OA\Property(property="reporter_id", type="integer"),
 *     @OA\Property(property="assignee_id", type="integer", nullable=true),
 *     @OA\Property(property="story_points", type="number", nullable=true),
 *     @OA\Property(property="due_date", type="string", format="date", nullable=true),
 *     @OA\Property(property="created_at", type="string", format="date-time"),
 *     @OA\Property(property="updated_at", type="string", format="date-time")
 * )
 *
 * @OA\Schema(
 *     schema="Project",
 *     type="object",
 *     @OA\Property(property="id", type="integer"),
 *     @OA\Property(property="key", type="string", example="WEB"),
 *     @OA\Property(property="name", type="string", example="Site Web"),
 *     @OA\Property(property="description", type="string", nullable=true),
 *     @OA\Property(property="team_id", type="integer", nullable=true),
 *     @OA\Property(property="lead_user_id", type="integer", nullable=true),
 *     @OA\Property(property="created_at", type="string", format="date-time"),
 *     @OA\Property(property="updated_at", type="string", format="date-time")
 * )
 */
class Schemas
{
  // Ce fichier contient uniquement les annotations
}
