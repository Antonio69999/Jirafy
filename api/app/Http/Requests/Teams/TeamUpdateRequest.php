<?php

namespace App\Http\Requests\Teams;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class TeamUpdateRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        $teamId = $this->route('team')->id;

        return [
            'slug' => [
                'sometimes',
                'string',
                'max:50',
                'regex:/^[a-z0-9\-]+$/',
                Rule::unique('teams', 'slug')->ignore($teamId)
            ],
            'name' => ['sometimes', 'string', 'max:100'],
            'description' => ['sometimes', 'nullable', 'string'],
        ];
    }

    public function messages(): array
    {
        return [
            'slug.regex' => 'Le slug doit être en minuscules, alphanumérique et tirets uniquement',
        ];
    }
}
