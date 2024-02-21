<?php

namespace App\Http\Controllers;

use App\Http\Resources\TipoDocumentoResource;
use App\Models\HistorialFormulario;
use App\Models\TipoDocumento;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class TipoDocumentoController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $current_user=Auth::user();
        if ($current_user->hasPermissionTo('Gestion-Tipos de documentos')){
            return Inertia::render('Tipos Documentos/ShowTiposDocumento',[
                'all_tipos_documento'=>TipoDocumentoResource::collection(TipoDocumento::all())
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
        if ($current_user->hasPermissionTo('Gestion-Crear tipo de documento')){
            return Inertia::render('Tipos Documentos/AgregarTipoDocumento',);
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
            $tipo = TipoDocumento::create([
                "nombre"=>$request->nombre
            ]);
            $user_id=Auth::id();
            HistorialFormulario::create([
                'responsable'=>$user_id,
                'accion'=>2,
                'detalles'=>"Crea tipo de documento con nombre: " . $tipo->nombre
                //'detalles'=>"Actualiza parámetros: " . $request->fecha_documento!==null? "fecha" : ""
            ]);
            return redirect()->back()->with(["create"=>"Se añadió el tipo de documento"]);
        }catch (\Illuminate\Database\QueryException $e) {
            // Manejo específico para errores de duplicidad
            if ($e->errorInfo[1] == 1062) {
                return redirect()->back()->withErrors(["create"=>"Ya existe el tipo de documento"]);
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
        if ($current_user->hasPermissionTo('Gestion-Editar tipo de documento')){
            $tipo= TipoDocumento::find((int)$id);

            if(is_null($tipo)){
                return back();
            }
            return Inertia::render('Tipos Documentos/EditarTipoDocumento',[
                'tipo_documento'=>new TipoDocumentoResource(TipoDocumento::find((int)$id))
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
            $direccion = TipoDocumento::find($id);
            $antiguo= $direccion->nombre;
            $direccion->nombre=$request->nombre;
            $direccion->save();
    
            $user_id=Auth::id();
            HistorialFormulario::create([
                'responsable'=>$user_id,
                'accion'=>3,
                'detalles'=>"Edita tipo de documento " . $antiguo . " con nuevo nombre: " . $direccion->nombre
                //'detalles'=>"Actualiza parámetros: " . $request->fecha_documento!==null? "fecha" : ""
            ]);
    
            return redirect()->back()->with(["update"=>"Se actualizó el tipo de documento"]);
        }catch (\Illuminate\Database\QueryException $e) {
            // Manejo específico para errores de duplicidad
            if ($e->errorInfo[1] == 1062) {
                return redirect()->back()->withErrors(["update"=>"Ya existe el tipo de documento"]);
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
