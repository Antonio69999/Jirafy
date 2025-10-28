<?php

namespace App\Http\Requests\Ticketing;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class LabelUpdateRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        $labelId = $this->route('label')->id ?? null;

        return [
            'name' => [
                'sometimes',
                'required',
                'string',
                'max:100',
                Rule::unique('labels')->where(function ($query) {
                    return $query->where('project_id', $this->input('project_id') ?? $this->route('label')->project_id);
                })->ignore($labelId),
            ],
            'color' => [
                'sometimes',
                'required',
                'string',
                'regex:/^#[0-9A-Fa-f]{6}$/',
            ],
            'description' => 'nullable|string|max:500',
            // Le project_id ne peut pas être changé après création
        ];
    }

    public function messages(): array
    {
        return [
            'name.required' => 'Le nom du label est obligatoire',
            'name.unique' => 'Un label avec ce nom existe déjà dans ce projet',
            'color.required' => 'La couleur est obligatoire',
            'color.regex' => 'La couleur doit être au format hexadécimal (#RRGGBB)',
        ];
    }
}