<?php

namespace Database\Seeders;

use App\Models\Auth\User;
use Illuminate\Database\Seeder;

class AdminSeeder extends Seeder
{
    public function run(): void
    {
        // Créer l'utilisateur admin
        if (!User::where('email', 'admin@jirafy.com')->exists()) {
            User::create([
                'name' => 'Admin User',
                'email' => 'admin@jirafy.com',
                'password' => bcrypt('admin123'),
                'email_verified_at' => now(),
                'role' => 'admin'
            ]);
            $this->command->info('✓ Admin user created');
        }

        // Créer un utilisateur test
        if (!User::where('email', 'test@jirafy.com')->exists()) {
            User::create([
                'name' => 'Test User',
                'email' => 'test@jirafy.com',
                'password' => bcrypt('password123'),
                'email_verified_at' => now(),
                'role' => 'user'
            ]);
            $this->command->info('✓ Test user created');
        }
    }
}
