<?php

namespace App\Http\Controllers;

use App\Http\Resources\DireccionResource;
use App\Http\Resources\DocumentoResource;
use App\Models\Direccion;
use App\Models\Documento;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Validator;
use DateTime;


class DocumentoController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        //dd(DocumentoResource::collection(Documento::all()));
        return Inertia::render('Documentos/ShowDocuments',[
            'documentos'=>DocumentoResource::collection(Documento::all())
        ]);
    }

    public function gestion_index(){
        return Inertia::render('Documentos/ShowDocuments');
    }

    public function visualizar(String $id){
        //dd($id);
        $documento=(Documento::find((int)$id));
        //dd($documento);
        return Inertia::render('Documentos/VisualizadorDocumento',[
            "documento"=>$documento
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        return Inertia::render('Documentos/AgregarDocumento',[
            'direcciones'=>Direccion::all()
        ]);
    }
    public function anular()
    {
        return Inertia::render('Documentos/AgregarDocumento');
    }
    public function habilitar()
    {
        return Inertia::render('Documentos/AgregarDocumento');
    }
    public function descargar()
    {
        return Inertia::render('Documentos/AgregarDocumento');
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {   
        $input = $request->all();

        $input['fecha_documento'] = new DateTime($input['fecha_documento']);
        $input['fecha_documento'] = $input['fecha_documento']->format('Y-m-d');

        // $archivo = $request->file('archivo');
        // $mime_type = $archivo->getClientMimeType();
        // dd($mime_type);
        // dd($request->file('archivo'));

        Validator::make($input,[
            'tipo_documento'=> ['required','numeric'],
            'numero_documento'=> ['required','numeric'],
            'autor_documento'=> ['required','numeric'],
            'fecha_documento'=>['required','date'],
            'direccion_documento'=> ['numeric'],
            'rut_documento'=>['regex:/[0-9\.-]+/'],
            'materia_documento'=> ['string'],
            'archivo' => ['file', 'mimes:png,jpg,pdf', 'max:2048']
        ],[
            'tipo_documento.required'=>'Debe ingresar el tipo de documento',
            'numero_documento.required'=>'Debe ingresar el número de documento',
            'numero_documento.numeric'=>'Debe ingresar un número',
            'autor_documento.required'=>'Debe ingresar un autor',
            'direccion_documento.numeric'=>'Debe ingresar un número',
            'rut_documento.regex'=>'Debe ingresar un formato rut',
            'fecha_documento.required'=>'Debe ingresar la fecha',
            'fecha_documento.date'=>'Debe ingresar una fecha',
            'archivo.file' => 'Debe ingresar un archivo',
            'archivo.mimes' => 'El archivo debe ser de tipo: png, jpg, pdf',
            'archivo.max' => 'El tamaño máximo permitido es 2 MB',
        ])->validate();
        
        $year = new DateTime($input['fecha_documento']);
        $year = $year->format('Y');

             
        $path = $request->file('archivo')->getRealPath();
        $ext = $request->file('archivo')->extension();
        $doc = file_get_contents($path);
        $base64 = base64_encode($doc);
        $mime = $request->file('archivo')->getClientMimeType();

        $nombre_file=($input['numero_documento']).'-'.($year).'-'.($input['autor_documento']).'-'.($input['tipo_documento']);
        //dd($nombre_file.'.'.$ext);
        try {

            DB::table("documento")->insert([
                "tipo" => $input['tipo_documento'],
                "numero" => $input['numero_documento'],
                "autor" => $input['autor_documento'],
                "fecha" => $input['fecha_documento'],
                "anno" => $year,
                "rut" => $input['rut_documento'],
                "materia" => $input['materia_documento'],
                "estado" => 1,
                "direccion" => $input['direccion_documento'],
                "autor" => $input['autor_documento'],
                'name_file'=> $nombre_file.'.'.$ext,
                'file' => $base64,
                'mime_file'=> $mime
            ]);


            return back()->with("success","Documento registrado correctamente");
        }catch (\Throwable $th){
            dd("Error: " . $th->getMessage());
            return back()->with('error', '¡Hubo un error al guardar el registro!');
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
