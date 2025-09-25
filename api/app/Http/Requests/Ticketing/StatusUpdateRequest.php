<?php

namespace App\Http\Requests\Ticketing;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class StatusUpdateRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        $statusId = $this->route('status')->id;

        return [
            'key' => [
                'sometimes',
                'string',
                'max:30',
                Rule::unique('statuses', 'key')->ignore($statusId),
                'regex:/^[A-Z0-9_-]+$/'
            ],
            'name' => ['sometimes', 'string', 'max:50'],
            'category' => ['sometimes', 'string', 'in:todo,in_progress,done'],
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
