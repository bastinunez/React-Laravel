<?php

namespace App\Http\Controllers;

use App\Http\Resources\PermissionResource;
use App\Models\HistorialFormulario;
use App\Models\Permission as ModelsPermission;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;
use Spatie\Permission\Models\Permission;

class PermissionController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $current_user=Auth::user();
        if ($current_user->hasPermissionTo('Gestion-Permisos')){
            return Inertia::render('Permisos/Gestion',[
                "all_permisos"=>PermissionResource::collection(Permission::all())
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
        if ($current_user->hasPermissionTo('Gestion-Crear permiso')){
            return Inertia::render('Permisos/AgregarPermiso');
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
            $direccion = Permission::create([
                "name"=>$request->nombre,
                'guard_name' => 'web',
            ]);
            return redirect()->back()->with(["create"=>"Se añadió el permiso"]);
        }catch (\Illuminate\Database\QueryException $e) {
            // Manejo específico para errores de duplicidad
            if ($e->errorInfo[1] == 1062) {
                return redirect()->back()->withErrors(["create"=>"Ya existe el permiso"]);
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
        if ($current_user->hasPermissionTo('Gestion-Crear permiso')){
            return Inertia::render('Permisos/EditarPermiso',[
                'permiso'=>Permission::find($id)
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
            $permiso = Permission::find($id);
            $antiguo= $permiso->name;
            $permiso->name=$request->nombre;
            $permiso->save();
    
            $user_id=Auth::id();
            HistorialFormulario::create([
                'responsable'=>$user_id,
                'accion'=>3,
                'detalles'=>"Edita permiso " . $antiguo . " con nuevo nombre: " . $permiso->name
                //'detalles'=>"Actualiza parámetros: " . $request->fecha_documento!==null? "fecha" : ""
            ]);
    
            return redirect()->back()->with(["update"=>"Se actualizó la dirección"]);
        }catch (\Illuminate\Database\QueryException $e) {
            // Manejo específico para errores de duplicidad
            if ($e->errorInfo[1] == 1062) {
                return redirect()->back()->withErrors(["update"=>"Ya existe el permiso"]);
            } else {
                // Otros errores de la base de datos
                throw $e;
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
