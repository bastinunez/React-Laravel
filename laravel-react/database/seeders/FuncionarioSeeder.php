<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class FuncionarioSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        DB::table('funcionario')->insert([
            ['nombres' => 'Sin Autor',
            'apellidos' => 'Sin Autor',
            'abreviacion' => 'NNNN'
            ]
        ]);
    }
}
