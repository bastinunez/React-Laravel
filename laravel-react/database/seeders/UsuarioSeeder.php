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
            // [
            //     'nombres' => 'Carlos Andrés',
            //     'apellidos' => 'Martínez Soto',
            //     'iniciales' => 'CAMS',
            //     'correo' => 'cmartinez@gdoc.cl',
            //     'password' => Hash::make('password'),
            //     'rut' => '34.567.890-1',
            //     'rol' => 3,
            //     'estado' => 1,
            //     'change_pwd' => false
            // ],
            // [
            //     'nombres' => 'Laura Patricia',
            //     'apellidos' => 'García Mendoza',
            //     'iniciales' => 'LPGM',
            //     'correo' => 'lgarcia@gdoc.cl',
            //     'password' => Hash::make('miclave123'),
            //     'rut' => '45.678.901-2',
            //     'rol' => 1,
            //     'estado' => 1,
            //     'change_pwd' => false
            // ],
            // // Rol: 1, Estado: true, Change_pwd: false
            // [
            //     'nombres' => 'Gabriel Alejandro',
            //     'apellidos' => 'Ramírez Sánchez',
            //     'iniciales' => 'GARS',
            //     'correo' => 'gramirez@gdoc.cl',
            //     'password' => Hash::make('clave123'),
            //     'rut' => '56.789.012-3',
            //     'rol' => 1,
            //     'estado' => 1,
            //     'change_pwd' => false
            // ],
            // [
            //     'nombres' => 'Isabel Cristina',
            //     'apellidos' => 'López González',
            //     'iniciales' => 'ICLG',
            //     'correo' => 'isabel@gdoc.cl',
            //     'password' => Hash::make('contraseña456'),
            //     'rut' => '67.890.123-4',
            //     'rol' => 1,
            //     'estado' => 1,
            //     'change_pwd' => false
            // ],
            // [
            //     'nombres' => 'Fernando José',
            //     'apellidos' => 'Torres Castro',
            //     'iniciales' => 'FJTC',
            //     'correo' => 'fernando@gdoc.cl',
            //     'password' => Hash::make('mipassword'),
            //     'rut' => '78.901.234-5',
            //     'rol' => 1,
            //     'estado' => 1,
            //     'change_pwd' => false
            // ],
            // //Rol: 2, Estado: true, Change_pwd: false
            // [
            //     'nombres' => 'María Fernanda',
            //     'apellidos' => 'Hernández Vargas',
            //     'iniciales' => 'MFHV',
            //     'correo' => 'mariafernanda@gdoc.cl',
            //     'password' => Hash::make('otraclave'),
            //     'rut' => '89.012.345-6',
            //     'rol' => 2,
            //     'estado' => 1,
            //     'change_pwd' => false
            // ],
            // [
            //     'nombres' => 'Andrés Felipe',
            //     'apellidos' => 'Díaz Herrera',
            //     'iniciales' => 'AFDH',
            //     'correo' => 'andres@gdoc.cl',
            //     'password' => Hash::make('password123'),
            //     'rut' => '90.123.456-7',
            //     'rol' => 2,
            //     'estado' => 1,
            //     'change_pwd' => false
            // ],
            // [
            //     'nombres' => 'Luisa Alejandra',
            //     'apellidos' => 'Gómez Ramírez',
            //     'iniciales' => 'LAGR',
            //     'correo' => 'luisa@gdoc.cl',
            //     'password' => Hash::make('nuevaclave'),
            //     'rut' => '01.234.567-8',
            //     'rol' => 2,
            //     'estado' => 1,
            //     'change_pwd' => false
            // ],
            // //Rol: 3, Estado: true, Change_pwd: false
            // [
            //     'nombres' => 'Pedro Antonio',
            //     'apellidos' => 'Mendoza Torres',
            //     'iniciales' => 'PAMT',
            //     'correo' => 'pedro@gdoc.cl',
            //     'password' => Hash::make('miclave'),
            //     'rut' => '12.345.678-9',
            //     'rol' => 3,
            //     'estado' => 1,
            //     'change_pwd' => false
            // ],
            // [
            //     'nombres' => 'Sandra Milena',
            //     'apellidos' => 'Gutiérrez Soto',
            //     'iniciales' => 'SMGS',
            //     'correo' => 'sandra@gdoc.cl',
            //     'password' => Hash::make('contraseña567'),
            //     'rut' => '23.456.789-5',
            //     'rol' => 3,
            //     'estado' => 1,
            //     'change_pwd' => false
            // ],
            // [
            //     'nombres' => 'Roberto Carlos',
            //     'apellidos' => 'Lara Gómez',
            //     'iniciales' => 'RCLG',
            //     'correo' => 'roberto@gdoc.cl',
            //     'password' => Hash::make('miclave123'),
            //     'rut' => '34.567.890-4',
            //     'rol' => 3,
            //     'estado' => 1,
            //     'change_pwd' => false
            // ],
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

        // dd($usuario->getPermissionsViaRoles());

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

        //dd($usuario2->getPermissionsViaRoles());

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
