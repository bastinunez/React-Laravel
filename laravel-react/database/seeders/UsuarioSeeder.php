<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;
use App\Models\User;

class UsuarioSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $digitador = User::create([
            'nombres' => 'Ana María',
            'apellidos' => 'López Rodríguez',
            'iniciales' => 'AMLR',
            'correo' => 'amaria@gdoc.cl',
            'password' => Hash::make('digitador'),
            'rut' => '23.456.789-0',
            'rol' => 2,
            'estado' => 2,
            'change_pwd' => false
        ])->assignRole("Digitador");

        $admin_uno = User::create([
            'nombres' => 'Bastián Orlando',
            'apellidos' => 'Núñez Castro',
            'iniciales' => 'BONC',
            'correo' => 'bnunez@gdoc.cl',
            'password' => Hash::make('administrador'),
            'rut' => '20.185.866-6',
            'rol' => 3,
            'estado' => 1,
            'change_pwd' => false
        ])->assignRole("Administrador");

        $admin_dos = User::create([
            'nombres' => 'Rino Eduardo',
            'apellidos' => 'Raggi Núñez',
            'iniciales' => 'RERN',
            'correo' => 'rraggi@gdoc.cl',
            'password' => Hash::make('administrador'),
            'rut' => '16.023.927-1',
            'rol' => 3,
            'estado' => 1,
            'change_pwd' => false
        ])->assignRole("Administrador");

        $admin_tres = User::create([
            'nombres' => 'Francisco Javier',
            'apellidos' => 'Benavente Bustos',
            'iniciales' => 'RERN',
            'correo' => 'fbenavente@gdoc.cl',
            'password' => Hash::make('administrador'),
            'rut' => '15.194.090-0',
            'rol' => 3,
            'estado' => 1,
            'change_pwd' => false
        ])->assignRole("Administrador");


        $usuario_uno = User::create([
            'nombres' => 'Usuario Usuario',
            'apellidos' => 'Usuario Usuario',
            'iniciales' => 'UUUU',
            'correo' => 'usuario1@gdoc.cl',
            'password' => Hash::make('usuario'),
            'rut' => '20.757.638-7',
            'rol' => 1,
            'estado' => 1,
            'change_pwd' => false
        ])->assignRole("Usuario");

    }

}
