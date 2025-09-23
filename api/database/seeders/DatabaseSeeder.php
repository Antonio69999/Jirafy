<?php

namespace Database\Seeders;

use App\Models\Auth\User;
// use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Database\Seeders\TicketingReferenceSeeder;
use Database\Seeders\LabelSeeder;
use Database\Factories\UserFactory;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        User::factory()->count(10)->create();

        User::factory()->create([
            'name' => 'Test User',
            'email' => 'test@example.com',
        ]);
        $this->call(TicketingReferenceSeeder::class);
        $this->call(LabelSeeder::class);
    }
}
