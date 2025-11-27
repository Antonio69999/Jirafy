<?php

namespace App\Http\Requests\Ticketing;

use Illuminate\Foundation\Http\FormRequest;

class StatusStoreRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'key' => ['required', 'string', 'max:30', 'unique:statuses,key', 'regex:/^[A-Z0-9_-]+$/'],
            'name' => ['required', 'string', 'max:50'],
            'category' => ['required', 'string', 'in:todo,in_progress,done'],
            'project_id' => ['nullable', 'integer', 'exists:projects,id'],
        ];
    }

    public function messages(): array
    {
        return [
            'key.regex' => 'La clé doit être en majuscule, alphanumérique (et underscore/tiret)',
            'category.in' => 'La catégorie doit être: todo, in_progress ou done',
        ];
    }
}
