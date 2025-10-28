<?php

namespace Database\Factories;

use App\Models\Ticketing\Label;
use App\Models\Ticketing\Project;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Ticketing\Label>
 */
class LabelFactory extends Factory
{
    protected $model = Label::class;

    public function definition(): array
    {
        $colors = [
            '#3b82f6', // blue
            '#22c55e', // green
            '#f59e0b', // yellow
            '#ef4444', // red
            '#ec4899', // pink
            '#8b5cf6', // purple
            '#14b8a6', // teal
        ];

        return [
            'name' => fake()->unique()->word(),
            'color' => fake()->randomElement($colors),
            'description' => fake()->sentence(),
            'project_id' => null, // Par défaut label global
        ];
    }

    /**
     * Label lié à un projet spécifique
     */
    public function forProject(Project $project): static
    {
        return $this->state(fn(array $attributes) => [
            'project_id' => $project->id,
        ]);
    }

    /**
     * Label global (sans projet)
     */
    public function global(): static
    {
        return $this->state(fn(array $attributes) => [
            'project_id' => null,
        ]);
    }
}
