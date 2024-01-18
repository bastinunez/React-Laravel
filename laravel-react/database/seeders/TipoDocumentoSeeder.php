<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class TipoDocumentoSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        DB::table('tipo_documento')->insert([
            ['nombre' => 'Carta'],
            ['nombre' => 'Certificado'],
            ['nombre' => 'Cierre de actividad'],
            ['nombre' => 'Decreto a Controlaría'],
            ['nombre' => 'Decreto de pago'],
            ['nombre' => 'Decreto exento'],
            ['nombre' => 'Informe'],
            ['nombre' => 'Memo'],
            ['nombre' => 'Minuta de Distribución'],
            ['nombre' => 'Oficio'],
            ['nombre' => 'Solicitudes de pedido'],
        ]);
    }
}
