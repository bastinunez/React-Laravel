<?php

namespace App\Http\Controllers;

use App\Http\Resources\DocumentoResource;
use App\Http\Resources\HistorialDocumentosResource;
use App\Models\Accion;
use App\Models\Documento;
use App\Models\Direccion;
use App\Models\Funcionario;
use App\Models\TipoDocumento;
use App\Models\Estado;
use App\Models\HistorialDocumento;
use App\Models\Rol;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;
use Spatie\Activitylog\Contracts\Activity;
use Spatie\Activitylog\Models\Activity as ModelsActivity;

class HistorialDocumentosController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $current_user=Auth::user();
        if ($current_user->hasPermissionTo('Ver historial documento')){
            $filas=ModelsActivity::where('log_name', 'documento')->get();
            $userIds = $filas->pluck('causer_id')->unique();
            $users = User::whereIn('id', $userIds)->get();
            $filasConNombres = $filas->map(function ($fila) use ($users) {
                $usuario = $users->where('id', $fila->causer_id)->first();
                $fila->setAttribute('nombres_usuario', $usuario->nombres);
                $fila->setAttribute('apellidos_usuario', $usuario->apellidos);
                $fila->setAttribute('rut_usuario', $usuario->rut);
                $fila->setAttribute('correo_usuario', $usuario->correo);
                return $fila;
            });


            return Inertia::render('Historial/Documentos',[
                //'historial'=>HistorialDocumentosResource::collection(HistorialDocumento::all()),
                'autores'=>Funcionario::all(),
                'acciones'=>Accion::all(),
                // 'history'=>ModelsActivity::where('properties->ip', '127.0.0.1')->get(),
                // 'history'=>ModelsActivity::where('description', 'created')->get(),
                'historial'=>$filasConNombres,
                'tipos'=>TipoDocumento::all(),
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
        //
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        //
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
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, string $id)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        //
    }
}
