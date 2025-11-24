<?php

namespace Database\Seeders;

// use App\Models\Auth\User;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
  public function run(): void
  {

    $this->command->info('🚀 Starting Database Seeding...');

    // Appeler le seeder complet
    $this->call(CompleteJirafySeeder::class);

    // $this->command->info(' Database seeded successfully!');
    // Créer des utilisateurs test
    // User::create([
    //     'name' => 'Admin User',
    //     'email' => 'admin@jirafy.com',
    //     'password' => bcrypt('password123'),
    //     'email_verified_at' => now(),
    //     'role' => 'admin',
    // ]);

    // User::create([
    //     'name' => 'Test User',
    //     'email' => 'test@jirafy.com',
    //     'password' => bcrypt('password123'),
    //     'email_verified_at' => now(),
    //     'role' => 'user',
    // ]);

    // Seeders de base
    // $this->call([
    //     PermissionSeeder::class,
    //     TicketingReferenceSeeder::class,
    //     ProjectSeeder::class,
    //     LabelSeeder::class,
    // ]);

    $this->command->info(' Database seeded successfully!');
  }
}
