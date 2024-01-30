<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Spatie\Permission\Models\Role;
use Spatie\Permission\Models\Permission;

class RolSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // DB::table('roles')->insert([
        //     ['name' => 'Usuario'],
        //     ['name' => 'Digitador'],
        //     ['name' => 'Administrador'],
        // ]);
        
        $roleUsuario = Role::create(['name'=>'Usuario']);
        $roleDigitador = Role::create(['name'=>'Digitador']);
        $roleAdministrador = Role::create(['name'=>'Administrador']);

        //assignRole sirve para asignar solo a un rol, syncRoles permite añadir varios Roles a un permiso

        //ESTE QUIZÁS NO SE PUEDA IMPLEMENTAR
        Permission::create(['name'=>'Recuperar contraseña'])->syncRoles([$roleUsuario,$roleDigitador,$roleAdministrador]);

        //DASHBOARD
        Permission::create(['name'=>'dashboard'])->syncRoles([$roleUsuario,$roleDigitador,$roleAdministrador]);
        

        //PERFIL
        Permission::create(['name'=>'Ver perfil'])->syncRoles([$roleUsuario,$roleDigitador,$roleAdministrador]);
        Permission::create(['name'=>'Editar perfil'])->syncRoles([$roleUsuario,$roleDigitador,$roleAdministrador]);


        //DOCUMENTOS
        // (mostrar todos, ver un documento, descargar un documento, ver documentos anexos)
        Permission::create(['name'=>'Ver todos documentos'])->syncRoles([$roleUsuario,$roleDigitador,$roleAdministrador]);
        Permission::create(['name'=>'Visualizar documento'])->syncRoles([$roleUsuario,$roleDigitador,$roleAdministrador]);
        Permission::create(['name'=>'Descargar documento'])->syncRoles([$roleUsuario,$roleDigitador,$roleAdministrador]);
        Permission::create(['name'=>'Ver documentos anexos'])->syncRoles([$roleUsuario,$roleDigitador,$roleAdministrador]);
        

        // GESTION DE DOCUMENTOS (ADMIN-DIGITADOR)
        Permission::create(['name'=>'Gestion-Ver documentos'])->syncRoles([$roleDigitador,$roleAdministrador]); 
        Permission::create(['name'=>'Gestion-Ver documento'])->syncRoles([$roleDigitador,$roleAdministrador]);
        Permission::create(['name'=>'Gestion-Crear documento'])->syncRoles([$roleDigitador,$roleAdministrador]);
        Permission::create(['name'=>'Gestion-Editar documento'])->syncRoles([$roleDigitador,$roleAdministrador]);
        Permission::create(['name'=>'Gestion-Editar metadatos documento'])->syncRoles([$roleDigitador,$roleAdministrador]);
        Permission::create(['name'=>'Gestion-Editar documentos anexos de documento'])->syncRoles([$roleDigitador,$roleAdministrador]);
        Permission::create(['name'=>'Gestion-Anular documento'])->syncRoles([$roleDigitador,$roleAdministrador]);
        Permission::create(['name'=>'Gestion-Habilitar documento'])->syncRoles([$roleDigitador,$roleAdministrador]);
        Permission::create(['name'=>'Gestion-Descargar documento'])->syncRoles([$roleDigitador,$roleAdministrador]);
        Permission::create(['name'=>'Gestion-Añadir documento anexo'])->syncRoles([$roleDigitador,$roleAdministrador]);
        Permission::create(['name'=>'Gestion-Eliminar documento anexo'])->syncRoles([$roleDigitador,$roleAdministrador]);
        Permission::create(['name'=>'Gestion-Mostrar documentos anexos'])->syncRoles([$roleDigitador,$roleAdministrador]);

        
        //HISTORIAL
        Permission::create(['name'=>'Ver historial documento'])->syncRoles([$roleAdministrador]);
        Permission::create(['name'=>'Ver historial documento anexo'])->syncRoles([$roleAdministrador]);
        Permission::create(['name'=>'Ver historial accion usuario'])->syncRoles([$roleAdministrador]);
        Permission::create(['name'=>'Ver historial accion formulario'])->syncRoles([$roleAdministrador]);


        //GESTION DE USUARIOS
        Permission::create(['name'=>'Ver todos usuarios'])->syncRoles([$roleAdministrador]);
        Permission::create(['name'=>'Editar usuario'])->syncRoles([$roleAdministrador]);
        Permission::create(['name'=>'Habilitar usuario'])->syncRoles([$roleAdministrador]);
        Permission::create(['name'=>'Anular usuario'])->syncRoles([$roleAdministrador]);
        Permission::create(['name'=>'Crear usuario'])->syncRoles([$roleAdministrador]);
        Permission::create(['name'=>'Cargar usuarios xlsx'])->syncRoles([$roleAdministrador]);
        Permission::create(['name'=>'Cambiar estado usuario'])->syncRoles([$roleAdministrador]);
        Permission::create(['name'=>'Restaurar contraseña'])->syncRoles([$roleAdministrador]);


        //GESTION DIRECCION
        Permission::create(['name'=>'Gestion-Direcciones'])->syncRoles([$roleAdministrador]);
        Permission::create(['name'=>'Gestion-Crear direccion'])->syncRoles([$roleAdministrador]);
        Permission::create(['name'=>'Gestion-Editar direccion'])->syncRoles([$roleAdministrador]);


        //GESTION FUNCIONARIO
        Permission::create(['name'=>'Gestion-Funcionarios'])->syncRoles([$roleAdministrador]);
        Permission::create(['name'=>'Gestion-Crear funcionario'])->syncRoles([$roleAdministrador]);
        Permission::create(['name'=>'Gestion-Editar funcionario'])->syncRoles([$roleAdministrador]);

        // $permisos = [
        //     ['Recuperar contraseña',[3,2,1]],
        //     ['dashboard',[3,2,1]],
        //     ['Ver perfil',[3,2,1]],
        //     ['Editar perfil',[3,2,1]],
        //     ['Ver todos documentos',[3,2,1]],
        //     ['Visualizar documento',[3,2,1]],
        //     ['Descargar documento',[3,2,1]],
        //     ['Ver documentos anexos',[3,2,1]],
        //     ['Gestion-Ver documentos',[3,2]],
        //     ['Gestion-Ver documento',[3,2]],
        //     ['Gestion-Crear documento',[3,2]],
        //     ['Gestion-Editar documento',[3,2]],
        //     ['Gestion-Editar metadatos documento',[3,2]],
        //     ['Gestion-Editar documentos anexos de documento',[3,2]],
        //     ['Gestion-Anular documento',[3,2]],
        //     ['Gestion-Habilitar documento',[3,2]],
        //     ['Gestion-Descargar documento',[3,2]],
        //     ['Gestion-Añadir documento anexo',[3,2]],
        //     ['Gestion-Eliminar documento anexo',[3,2]],
        //     ['Gestion-Mostrar documentos anexos',[3,2]],
        //     ['Ver historial documento',[3]],
        //     ['Ver historial documento anexo',[3]],
        //     ['Ver historial accion usuario',[3]],
        //     ['Ver historial accion formulario',[3]],
        //     ['Ver todos usuarios',[3]],
        //     ['Editar usuario',[3]],
        //     ['Crear usuario',[3]],
        //     ['Cargar usuarios xlsx',[3]],
        //     ['Cambiar estado usuario',[3]],
        //     ['Restaurar contraseña',[3]],
        //     ['Gestion-Editar formulario',[3]],
        //     ['Gestion-Funcionarios',[3]],
        //     ['Gestion-Crear funcionario',[3]],
        //     ['Gestion-Editar funcionario',[3]],
        // ];
        
        // foreach ($permisos as $permiso) {
        //     if(sizeof($permiso[1])==3){
        //         Permission::create(['name' => $permiso[0]])->givePermissionTo([$roleUsuario, $roleDigitador, $roleAdministrador]);
        //     }elseif(sizeof($permiso[1])==2){
        //         Permission::create(['name' => $permiso[0]])->givePermissionTo([$roleDigitador, $roleAdministrador]);
        //     }else{
        //         Permission::create(['name' => $permiso[0]])->givePermissionTo([$roleAdministrador]);
        //     }
           
        // }

    }
}
