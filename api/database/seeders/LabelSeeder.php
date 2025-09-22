<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class LabelSeeder extends Seeder
{
    public function run(): void
    {
        DB::table('labels')->insert([
            // Labels projet 5
            [
                'project_id' => 5,
                'name' => 'UI/UX',
                'color' => '#9b59b6',
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'project_id' => 5,
                'name' => 'API',
                'color' => '#1abc9c',
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'project_id' => 5,
                'name' => 'Documentation',
                'color' => '#f39c12',
                'created_at' => now(),
                'updated_at' => now(),
            ],

            // Labels projet 6
            [
                'project_id' => 6,
                'name' => 'Refactor',
                'color' => '#2ecc71',
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'project_id' => 6,
                'name' => 'Hotfix',
                'color' => '#c0392b',
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'project_id' => 6,
                'name' => 'Performance',
                'color' => '#2980b9',
                'created_at' => now(),
                'updated_at' => now(),
            ],
        ]);
    }
}
