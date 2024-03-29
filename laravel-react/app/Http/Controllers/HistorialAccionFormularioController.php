<?php

namespace App\Http\Controllers;

use App\Http\Resources\HistorialAccionFormularioResource;
use App\Models\Accion;
use App\Models\Funcionario;
use App\Models\HistorialFormulario;
use App\Models\TipoDocumento;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;


class HistorialAccionFormularioController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $current_user=Auth::user();
        if ($current_user->hasPermissionTo('Gestion-Crear permiso')){
            return Inertia::render('Historial/Formulario',[
                'historial'=>HistorialAccionFormularioResource::collection(HistorialFormulario::all()),
                'acciones'=>Accion::all(),
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
    public function destroyAll()
    {
        HistorialFormulario::truncate();
        $current_user=Auth::user();
        HistorialFormulario::create([
            'responsable'=>$current_user->id,
            'accion'=>4,
            'detalles'=>"Elimina todos los datos de la tabla de historial general"
        ]);
    }
}
