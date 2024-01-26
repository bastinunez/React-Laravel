<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class DireccionSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        DB::table('direccion')->insert([
            ['nombre' => 'Sin Direccion'],
            ['nombre' => 'Finanzas'],
            ['nombre' => 'Rentas'],
        ]);
    }
}
