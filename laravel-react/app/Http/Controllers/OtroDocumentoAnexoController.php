<?php

namespace App\Http\Controllers;

use App\Models\OtroDocumento;
use App\Models\OtroDocumentoAnexo;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class OtroDocumentoAnexoController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        //
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
    public function destroy(Request $request)
    {
        $documento_id=$request->documento_id;
        $anexos=$request->anexos;
        foreach($anexos as $anexo_id){
            OtroDocumentoAnexo::where([
                'documento_id' => $documento_id,
                'otro_doc_id_anexo' => $anexo_id
            ])->delete();
            OtroDocumento::where([
                'id' => $anexo_id
            ])->delete();
        }
        return redirect()->back()->with(['destroy'=>'Se pudieron eliminar todos']);
    }
}
