<?php

namespace App\Http\Requests\Ticketing;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class ProjectUpdateRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return false;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        $projectId = $this->route('project')?->id ?? null;

        return [
            'team_id'      => ['sometimes', 'nullable', 'integer', 'exists:teams,id'],
            'key'          => [
                'sometimes',
                'string',
                'max:20',
                'regex:/^[A-Z][A-Z0-9\-]*$/',
                Rule::unique('projects', 'key')->ignore($projectId),
            ],
            'name'         => ['sometimes', 'string', 'max:150'],
            'description'  => ['sometimes', 'nullable', 'string'],
            'lead_user_id' => ['sometimes', 'nullable', 'integer', 'exists:users,id'],
        ];
    }

    public function messages(): array
    {
        return [
            'key.regex' => 'La clé doit être en MAJUSCULES, alphanumérique (et tirets).',
        ];
    }
}
