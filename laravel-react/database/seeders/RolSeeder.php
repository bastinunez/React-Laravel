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


        //GESTION ROLES Y PERMISOS
        Permission::create(['name'=>'Gestion-Roles'])->syncRoles([$roleAdministrador]);
        Permission::create(['name'=>'Gestion-Crear rol'])->syncRoles([$roleAdministrador]);
        Permission::create(['name'=>'Gestion-Editar rol'])->syncRoles([$roleAdministrador]);
        Permission::create(['name'=>'Gestion-Permisos'])->syncRoles([$roleAdministrador]);
        Permission::create(['name'=>'Gestion-Crear permiso'])->syncRoles([$roleAdministrador]);
        Permission::create(['name'=>'Gestion-Editar permiso'])->syncRoles([$roleAdministrador]);
    }
}
