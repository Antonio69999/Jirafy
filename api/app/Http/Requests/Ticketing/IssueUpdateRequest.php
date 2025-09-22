<?php

namespace App\Http\Requests\Ticketing;

use Illuminate\Foundation\Http\FormRequest;

class IssueUpdateRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'type_id' => ['sometimes', 'integer', 'exists:issue_types,id'],
            'status_id' => ['sometimes', 'integer', 'exists:statuses,id'],
            'priority_id' => ['sometimes', 'integer', 'exists:priorities,id'],
            'assignee_id' => ['sometimes', 'nullable', 'integer', 'exists:users,id'],
            'title' => ['sometimes', 'string', 'max:255'],
            'description' => ['sometimes', 'nullable', 'string'],
            'story_points' => ['sometimes', 'nullable', 'numeric', 'min:0', 'max:999.99'],
            'due_date' => ['sometimes', 'nullable', 'date', 'after_or_equal:today'],
        ];
    }

    public function messages(): array
    {
        return [
            'type_id.exists' => 'Le type d\'issue sélectionné n\'existe pas.',
            'status_id.exists' => 'Le statut sélectionné n\'existe pas.',
            'priority_id.exists' => 'La priorité sélectionnée n\'existe pas.',
            'assignee_id.exists' => 'L\'assigné sélectionné n\'existe pas.',
            'title.max' => 'Le titre ne peut pas dépasser 255 caractères.',
            'story_points.numeric' => 'Les points d\'histoire doivent être un nombre.',
            'story_points.min' => 'Les points d\'histoire doivent être positifs.',
            'story_points.max' => 'Les points d\'histoire ne peuvent pas dépasser 999.99.',
            'due_date.date' => 'La date d\'échéance doit être une date valide.',
            'due_date.after_or_equal' => 'La date d\'échéance ne peut pas être dans le passé.',
        ];
    }
}