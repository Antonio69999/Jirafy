<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;


class TicketingReferenceSeeder extends Seeder
{
    public function run(): void
    {
        DB::table('issue_types')->upsert([
            ['key' => 'EPIC',    'name' => 'Epic'],
            ['key' => 'STORY',   'name' => 'Story'],
            ['key' => 'TASK',    'name' => 'Task'],
            ['key' => 'BUG',     'name' => 'Bug'],
            ['key' => 'SUBTASK', 'name' => 'Sub-task'],
        ], ['key'], ['name']);

        DB::table('priorities')->upsert([
            ['key' => 'LOWEST',  'name' => 'Lowest',  'weight' => 10],
            ['key' => 'LOW',     'name' => 'Low',     'weight' => 20],
            ['key' => 'MEDIUM',  'name' => 'Medium',  'weight' => 30],
            ['key' => 'HIGH',    'name' => 'High',    'weight' => 40],
            ['key' => 'HIGHEST', 'name' => 'Highest', 'weight' => 50],
        ], ['key'], ['name','weight']);

        DB::table('statuses')->upsert([
            ['key' => 'TODO',        'name' => 'To Do',       'category' => 'todo'],
            ['key' => 'IN_PROGRESS', 'name' => 'In Progress', 'category' => 'in_progress'],
            ['key' => 'DONE',        'name' => 'Done',        'category' => 'done'],
        ], ['key'], ['name','category']);
    }
}