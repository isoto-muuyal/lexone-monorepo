<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Maklad\Permission\Models\Role;
use Maklad\Permission\Models\Permission;

class RolesAndPermissionsSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        app()['cache']->forget('maklad.permission.cache');
        $permissions = [
            'insights',
            'notification',
            'roles',
            'users',
            'Taskers',
            'categories',
            'subcategories',
            'services',
            'needs',
            'bookings',
            'settlement',
            'sitesettings',
            'help',
            'privacy',
        ];
        foreach ($permissions as $permission) {
            Permission::create(['name' => $permission]);
        }
    }
}
