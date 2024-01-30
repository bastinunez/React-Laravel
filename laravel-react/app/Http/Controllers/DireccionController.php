<?php

namespace App\Http\Controllers;

use App\Http\Resources\DireccionResource;
use Illuminate\Http\Request;
use App\Models\Direccion;
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
        return Inertia::render('Direcciones/ShowDirecciones',[
            'all_direcciones'=>DireccionResource::collection(Direccion::all())
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        return Inertia::render('Direcciones/AgregarDireccion',);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $direccion = Direccion::create([
            "nombre"=>$request->nombre
        ]);
        return redirect()->back()->with(["FormCreateDireccion"=>"Success"]);
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
        $direccion = Direccion::find($id);
        $direccion->nombre=$request->nombre;
        $direccion->save();
        return redirect()->back()->with(["FormUpdateDireccion"=>"Success"]);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        //
    }
}
