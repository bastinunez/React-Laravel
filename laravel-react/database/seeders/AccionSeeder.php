<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class AccionSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        DB::table('accion')->insert([
            ['nombre' => 'Crear','key'=>'created'],
            ['nombre' => 'Editar','key'=>'edit'],
            ['nombre' => 'Eliminar','key'=>'deleted'],
        ]);
    }
}
