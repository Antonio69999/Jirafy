<?php

namespace App\Http\Requests\Ticketing;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class LabelStoreRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'name' => [
                'required',
                'string',
                'max:100',
                Rule::unique('labels')->where(function ($query) {
                    return $query->where('project_id', $this->input('project_id'));
                }),
            ],
            'color' => [
                'required',
                'string',
                'regex:/^#[0-9A-Fa-f]{6}$/',
            ],
            'description' => 'nullable|string|max:500',
            'project_id' => 'nullable|integer|exists:projects,id',
        ];
    }

    public function messages(): array
    {
        return [
            'name.required' => 'Le nom du label est obligatoire',
            'name.unique' => 'Un label avec ce nom existe déjà dans ce projet',
            'color.required' => 'La couleur est obligatoire',
            'color.regex' => 'La couleur doit être au format hexadécimal (#RRGGBB)',
            'project_id.exists' => 'Le projet spécifié n\'existe pas',
        ];
    }
}
