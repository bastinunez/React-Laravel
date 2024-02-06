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

class HistorialDocumentosController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $current_user=Auth::user();
        if ($current_user->hasPermissionTo('Ver historial documento')){
            // $roles = Rol::whereIn('name', ['digitador', 'administrador'])->get();
            // $user=Auth::user();
            // Obtener usuarios con roles específicos
            //$responsables = User::role($roles)->get();
            //dd($responsables);
            return Inertia::render('Historial/Documentos',[
                'historial'=>HistorialDocumentosResource::collection(HistorialDocumento::all()),
                'autores'=>Funcionario::all(),
                'acciones'=>Accion::all(),
                //'responsables'=>$responsables,
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
