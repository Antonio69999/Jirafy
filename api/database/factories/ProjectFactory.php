<?php

namespace Database\Factories;

use App\Models\Ticketing\Project;
use App\Models\Auth\User;
use Illuminate\Database\Eloquent\Factories\Factory;

class ProjectFactory extends Factory
{
    protected $model = Project::class;

    public function definition(): array
    {
        $key = strtoupper(fake()->unique()->lexify('???'));

        return [
            'key' => $key,
            'name' => fake()->company() . ' Project',
            'description' => fake()->sentence(),
            'lead_user_id' => User::factory(),
            'issue_seq' => 0,
        ];
    }
}