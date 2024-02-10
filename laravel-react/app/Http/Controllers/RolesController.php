<?php

namespace App\Http\Controllers;

use App\Http\Resources\PermissionResource;
use App\Http\Resources\RoleResource;
use App\Models\HistorialFormulario;
use Spatie\Permission\Models\Permission;
use App\Models\Rol;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;
use Spatie\Permission\Models\Role;

class RolesController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $current_user=Auth::user();
        //dd(RoleResource::collection(Rol::all()));
        if ($current_user->hasPermissionTo('Gestion-Roles')){
            return Inertia::render('Roles/Gestion',[
                "all_roles"=>RoleResource::collection(Role::all())
            ]);
        }else{
            return back();
        }
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        $current_user=Auth::user();
        if ($current_user->hasPermissionTo('Gestion-Crear rol')){
            return Inertia::render('Roles/AgregarRol');
        }else{
            return back();
        }
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        try{
            $direccion = Role::create([
                "name"=>$request->nombre
            ]);
            return redirect()->back()->with(["create"=>"Se añadió el rol"]);
        }catch (\Illuminate\Database\QueryException $e) {
            // Manejo específico para errores de duplicidad
            if ($e->errorInfo[1] == 1062) {
                return redirect()->back()->withErrors(["create"=>"Ya existe el rol"]);
            } else {
                // Otros errores de la base de datos
                throw $e;
            }
        }
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(string $id)
    {
        $current_user=Auth::user();
        if ($current_user->hasPermissionTo('Gestion-Editar rol')){
            return Inertia::render('Roles/EditarRol',[
                'rol'=>Role::with('permissions')->find($id),
                'all_permisos'=>PermissionResource::collection(Permission::all())
            ]);
        }else{
            return back();
        }
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, string $id)
    {
        try{
            $rol = Role::find($id);
            $antiguo= $rol->name;
            $rol->name=$request->nombre;
            $rol->save();
    
            $user_id=Auth::id();
            HistorialFormulario::create([
                'responsable'=>$user_id,
                'accion'=>3,
                'detalles'=>"Edita rol " . $antiguo . " con nuevo nombre: " . $rol->name
                //'detalles'=>"Actualiza parámetros: " . $request->fecha_documento!==null? "fecha" : ""
            ]);
    
            return redirect()->back()->with(["update"=>"Se actualizó la dirección"]);
        }catch (\Illuminate\Database\QueryException $e) {
            // Manejo específico para errores de duplicidad
            if ($e->errorInfo[1] == 1062) {
                return redirect()->back()->withErrors(["update"=>"Ya existe la rol"]);
            } else {
                // Otros errores de la base de datos
                throw $e;
            }
        }
    }

    public function addPermissions(Request $request,string $id){
        $rol=Role::find($id);
        $rol->givePermissionTo($request->permisos);
    }

    public function deletePermissions(Request $request,string $id){
        $rol=Role::find($id);
        if ($request->opcion==0){
            foreach($request->permisos as $permiso){
                $rol->revokePermissionTo($permiso['name']);
            }
        }else{
            foreach($request->permisos as $permiso){

                $rol->revokePermissionTo($permiso);
            }
        }
        
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        //
    }
}
