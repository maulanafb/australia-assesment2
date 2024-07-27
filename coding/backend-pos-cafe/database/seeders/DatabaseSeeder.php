<?php

namespace Database\Seeders;

use App\Models\User;
// use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        \App\Models\User::factory(10)->create();

        \App\Models\User::factory()->create([
            'name' => 'Maulana Fb',
            'email' => 'admin@admin.com',
            'password' => Hash::make('password'),
            'roles' => 'admin',
        ]);
        \App\Models\User::factory()->create([
            'name' => 'User',
            'email' => 'user@user.com',
            'password' => Hash::make('password'),
            'roles' => 'user',
        ]);
        \App\Models\User::factory()->create([
            'name' => 'staff',
            'email' => 'staff@staff.com',
            'password' => Hash::make('password'),
            'roles' => 'staff',
        ]);
    }
}
