<?php

namespace Database\Factories;

use App\Models\Teams\Team;
use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\Str;

class TeamFactory extends Factory
{
    protected $model = Team::class;

    public function definition(): array
    {
        $name = fake()->unique()->company() . ' Team';

        return [
            'slug' => Str::slug($name),
            'name' => $name,
            'description' => fake()->sentence(),
        ];
    }
}
