<?php

namespace App\Http\Controllers;

use App\Http\Resources\HistorialDocumentosAnexosResource;
use App\Models\Accion;
use App\Models\Funcionario;
use App\Models\HistorialDocumentoAnexo;
use App\Models\TipoDocumento;
use Illuminate\Http\Request;
use Inertia\Inertia;


class HistorialDocumentosAnexosController extends Controller
{
    public function index()
    {
        return Inertia::render('Historial/DocumentosAnexos',[
            'historial'=>HistorialDocumentosAnexosResource::collection(HistorialDocumentoAnexo::all()),
            'autores'=>Funcionario::all(),
            'acciones'=>Accion::all(),
            'tipos'=>TipoDocumento::all(),
        ]);
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
