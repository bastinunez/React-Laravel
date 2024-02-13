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
        $usuarios = [
            [
                'nombres' => 'Ana María',
                'apellidos' => 'López Rodríguez',
                'iniciales' => 'AMLR',
                'correo' => 'amaria@gdoc.cl',
                'password' => Hash::make('digitador'),
                'rut' => '23.456.789-0',
                'rol' => 2,
                'estado' => 2,
                'change_pwd' => false
            ],
        ];

        $usuario = User::create([
            'nombres' => 'Administrador Administrador',
            'apellidos' => 'Administrador Administrador',
            'iniciales' => 'AAAA',
            'correo' => 'admin1@gdoc.cl',
            'password' => Hash::make('administrador'),
            'rut' => '20.185.866-6',
            'rol' => 3,
            'estado' => 1,
            'change_pwd' => false
        ])->assignRole("Administrador");
        $usuario2 = User::create([
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
        
        foreach ($usuarios as $usuarioData) {
            $usuario = User::create($usuarioData);

            // Asignar roles
            if (isset($usuarioData['rol'])) {
                $rol = $this->obtenerNombreRol($usuarioData['rol']); // Función para obtener el nombre del rol según tu lógica
                $usuario->assignRole($rol);
            }
        }
    }

    public function obtenerNombreRol($rolId)
    {
        // Lógica para mapear el ID del rol a su nombre
        // Puedes cambiar esto según la lógica de tus roles
        switch ($rolId) {
            case 1:
                return 'Usuario';
            case 2:
                return 'Digitador';
            case 3:
                return 'Administrador';
        }
    }
}
