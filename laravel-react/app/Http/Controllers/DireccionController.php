<?php

namespace App\Http\Controllers;

use App\Http\Resources\DireccionResource;
use Illuminate\Http\Request;
use App\Models\Direccion;
use App\Models\HistorialFormulario;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Validator;


class DireccionController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $current_user=Auth::user();
        if ($current_user->hasPermissionTo('Gestion-Direcciones')){
            return Inertia::render('Direcciones/ShowDirecciones',[
                'all_direcciones'=>DireccionResource::collection(Direccion::all())
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
        if ($current_user->hasPermissionTo('Gestion-Crear direccion')){
            return Inertia::render('Direcciones/AgregarDireccion',);
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
            $direccion = Direccion::create([
                "nombre"=>$request->nombre
            ]);
            $user_id=Auth::id();
            HistorialFormulario::create([
                'responsable'=>$user_id,
                'accion'=>2,
                'detalles'=>"Crea direccion con nombre: " . $direccion->nombre
                //'detalles'=>"Actualiza parámetros: " . $request->fecha_documento!==null? "fecha" : ""
            ]);
            return redirect()->back()->with(["create"=>"Se añadió la dirección"]);
        }catch (\Illuminate\Database\QueryException $e) {
            // Manejo específico para errores de duplicidad
            if ($e->errorInfo[1] == 1062) {
                return redirect()->back()->withErrors(["create"=>"Ya existe la direccion"]);
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
        if ($current_user->hasPermissionTo('Gestion-Editar direccion')){
            $direccion= Direccion::find((int)$id);

            if(is_null($direccion)){
                return Inertia::render('Direcciones/NoDireccionEdit');
            }
            return Inertia::render('Direcciones/EditarDireccion',[
                'direccion'=>new DireccionResource(Direccion::find((int)$id))
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
            $direccion = Direccion::find($id);
            $antiguo= $direccion->nombre;
            $direccion->nombre=$request->nombre;
            $direccion->save();
    
            $user_id=Auth::id();
            HistorialFormulario::create([
                'responsable'=>$user_id,
                'accion'=>3,
                'detalles'=>"Edita direccion " . $antiguo . " con nuevo nombre: " . $direccion->nombre
                //'detalles'=>"Actualiza parámetros: " . $request->fecha_documento!==null? "fecha" : ""
            ]);
    
            return redirect()->back()->with(["update"=>"Se actualizó la dirección"]);
        }catch (\Illuminate\Database\QueryException $e) {
            // Manejo específico para errores de duplicidad
            if ($e->errorInfo[1] == 1062) {
                return redirect()->back()->withErrors(["update"=>"Ya existe la direccion"]);
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
