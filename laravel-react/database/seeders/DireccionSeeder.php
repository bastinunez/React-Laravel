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
            ['nombre' => 'Sin Dirección'],
            ['nombre' => 'Administración Municipal'],
            ['nombre' => 'Administración y Finanzas'],
            ['nombre' => 'Seguridad Pública'],
            ['nombre' => 'Asesoría Jurídica'],
            ['nombre' => 'Dideco'],
            ['nombre' => 'Secplac'],
            ['nombre' => 'Obras Municipales'],
            ['nombre' => 'Juzgado Policía Local'],
            ['nombre' => 'Secretaría Municipal'],
            ['nombre' => 'Control Interno'],
            ['nombre' => 'Tránsito'],
            ['nombre' => 'Educación'],
            ['nombre' => 'Salud'],
        ]);
    }
}
