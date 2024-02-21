<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Direccion;
use App\Models\DocumentoAnexo;
use App\Models\Documento;
use App\Models\Funcionario;
use App\Models\TipoDocumento;
use App\Models\Estado;
use App\Models\OtroDocumento;
use App\Models\OtroDocumentoAnexo;
use Inertia\Inertia;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Arr;
use DateTime;
use Illuminate\Support\Facades\Auth;

class OtroDocumentoController extends Controller
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
        $input = $request->all();
        Validator::make($input,[
            // 'archivo' => ['file', 'mimes:pdf,jpg,bmp,png,xlsx,doc,docx,txt,', 'max:2048']
            'archivo' => ['required','file']
        ],[
            'archivo.file' => 'Debe ingresar un archivo',
        ])->validate();
        
        try{
            $path = $request->file('archivo')->getRealPath();
            $ext = $request->file('archivo')->extension();
            $doc = file_get_contents($path);
            $base64 = base64_encode($doc);
            $mime = $request->file('archivo')->getClientMimeType();

            $otro_doc = OtroDocumento::create([
                'descripcion'=>$input['descripcion'],
                'file' => $base64,
                'mime_file'=> $mime
            ]);
            OtroDocumentoAnexo::create([
                'documento_id'=>$input['documento_id'],
                'otro_doc_id_anexo'=>$otro_doc->id
            ]);
            return redirect()->back()->with(["create"=>"Se pudo crear el anexo"]);
        }catch (\Illuminate\Database\QueryException $e){
            if ($e->errorInfo[1] == 1062) {
                return redirect()->back()->withErrors(["create"=>"Ya existe el anexo"]);
            } elseif ($e->errorInfo[1] == 1452) {
                return redirect()->back()->withErrors(["create"=>"No existe una referencia"]);
            }else {
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
