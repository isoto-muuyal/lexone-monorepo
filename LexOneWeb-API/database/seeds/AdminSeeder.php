<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Admin;
use Maklad\Permission\Models\Role;
use Maklad\Permission\Models\Permission;

class AdminSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        $admin = Admin::create([
            'name' => 'LexOne Admin',
            'email' => 'admin@lexone.local',
            'password' => bcrypt('LexOneAdmin123!'),
            'roles' => 'super admin',
        ]);
  
        $roles = Role::create(['name' => 'super admin', 'description'=> 'He is the head of all admins']);
        $permissions = Permission::all();
        $roles->syncPermissions($permissions);
        $admin->assignRole($roles);
    }
}
