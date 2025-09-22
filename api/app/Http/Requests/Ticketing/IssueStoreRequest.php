<?php

namespace App\Http\Requests\Ticketing;

use Illuminate\Foundation\Http\FormRequest;

class IssueStoreRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'project_id' => ['required', 'integer', 'exists:projects,id'],
            'type_id' => ['required', 'integer', 'exists:issue_types,id'],
            'status_id' => ['required', 'integer', 'exists:statuses,id'],
            'priority_id' => ['required', 'integer', 'exists:priorities,id'],
            'reporter_id' => ['required', 'integer', 'exists:users,id'],
            'assignee_id' => ['nullable', 'integer', 'exists:users,id'],
            'title' => ['required', 'string', 'max:255'],
            'description' => ['nullable', 'string'],
            'story_points' => ['nullable', 'numeric', 'min:0', 'max:999.99'],
            'due_date' => ['nullable', 'date', 'after_or_equal:today'],
        ];
    }

    public function messages(): array
    {
        return [
            'project_id.required' => 'Le projet est requis.',
            'project_id.exists' => 'Le projet sélectionné n\'existe pas.',
            'type_id.required' => 'Le type d\'issue est requis.',
            'type_id.exists' => 'Le type d\'issue sélectionné n\'existe pas.',
            'status_id.required' => 'Le statut est requis.',
            'status_id.exists' => 'Le statut sélectionné n\'existe pas.',
            'priority_id.required' => 'La priorité est requise.',
            'priority_id.exists' => 'La priorité sélectionnée n\'existe pas.',
            'reporter_id.required' => 'Le rapporteur est requis.',
            'reporter_id.exists' => 'Le rapporteur sélectionné n\'existe pas.',
            'assignee_id.exists' => 'L\'assigné sélectionné n\'existe pas.',
            'title.required' => 'Le titre est requis.',
            'title.max' => 'Le titre ne peut pas dépasser 255 caractères.',
            'story_points.numeric' => 'Les points d\'histoire doivent être un nombre.',
            'story_points.min' => 'Les points d\'histoire doivent être positifs.',
            'story_points.max' => 'Les points d\'histoire ne peuvent pas dépasser 999.99.',
            'due_date.date' => 'La date d\'échéance doit être une date valide.',
            'due_date.after_or_equal' => 'La date d\'échéance ne peut pas être dans le passé.',
        ];
    }
}