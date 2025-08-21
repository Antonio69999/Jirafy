<?php

namespace App\Http\Requests\Ticketing;

use Illuminate\Foundation\Http\FormRequest;

class ProjectStoreRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return true;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'team_id' => ['required', 'integer', 'exists:teams,id'],
            'key' => ['required', 'string', 'max:20', 'regex:/^[A-Z][A-Z0-9\-]*$/', 'unique:projects,key'],
            'name' => ['required', 'string', 'max:255'],
            'description' => ['nullable', 'string'],
            'lead_user_id' => ['nullable', 'integer', 'exists:users,id'],
            'issue_seq' => ['nullable', 'integer'],
        ];
    }

    public function message(): array
    {
        return [
            'key.regex' => 'La clé doit être en majuscule, alphanumérique (et tiret)',
        ];
    }
}
