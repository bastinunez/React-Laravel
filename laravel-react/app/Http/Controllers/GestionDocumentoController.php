<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Inertia\Inertia;
use App\Http\Resources\DocumentoResource;
use App\Models\Direccion;
use App\Models\Documento;
use App\Models\DocumentoAnexo;
use App\Models\Estado;
use App\Models\Funcionario;
use App\Models\TipoDocumento;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Arr;
use DateTime;

class GestionDocumentoController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        return Inertia::render('Documentos/GestionDocumentos',[
            'documentos'=>DocumentoResource::collection(Documento::all()),
            'direcciones'=>Direccion::all(),
            'autores'=>Funcionario::all(),
            'tipos'=>TipoDocumento::all(),
            'estados'=>Estado::all(),
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        return Inertia::render('Documentos/AgregarDocumento',[
            'direcciones'=>Direccion::all(),
            'autores'=>Funcionario::all(),
            'tipos'=>TipoDocumento::all()
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {   
        $input = $request->all();

        $input['fecha_documento'] = new DateTime($input['fecha_documento']);
        $input['fecha_documento'] = $input['fecha_documento']->format('Y-m-d');
        //dd($input['archivo']);

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
            'archivo' => ['file', 'mimes:png,jpg,pdf', 'max:2048']
        ],[
            'tipo_documento.required'=>'Debe ingresar el tipo de documento',
            'numero_documento.required'=>'Debe ingresar el número de documento',
            'numero_documento.numeric'=>'Debe ingresar un número',
            'autor_documento.required'=>'Debe ingresar un autor',
            'direccion_documento.required'=>'Debe ingresar un autor',
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

            $id_doc=DB::table("documento")->insertGetId([
                "tipo" => $input['tipo_documento'],
                "numero" => $input['numero_documento'],
                "autor" => $input['autor_documento'],
                "fecha" => $input['fecha_documento'],
                "anno" => $year,
                "rut" => $input['rut_documento'],
                "materia" => $input['materia_documento'],
                "estado" => 1,
                "direccion" => $input['direccion_documento'],
                'name_file'=> $nombre_file.'.'.$ext,
                'file' => $base64,
                'mime_file'=> $mime
            ]);
            return redirect()->back()->with(["FormDocumento"=>"Success","IdDoc"=>$id_doc]);
        }catch (\Throwable $th){
            dd("Error: " . $th->getMessage());
            return redirect()->back()->with('FormDocumento', 'Error');
        }
        
    }

    public function store_anexo(Request $request){
        $input = $request->all();
        $input['fecha_documento'] = new DateTime($input['fecha_documento']);
        $input['fecha_documento'] = $input['fecha_documento']->format('Y-m-d');
        Validator::make($input,[
            'tipo_documento'=> ['required','numeric'],
            'numero_documento'=> ['required','numeric'],
            'autor_documento'=> ['required','numeric'],
            'fecha_documento'=>['required','date'],
            'id_doc'=>['required','numeric']
        ],[
            'tipo_documento.required'=>'Debe ingresar el tipo de documento',
            'numero_documento.required'=>'Debe ingresar el número de documento',
            'numero_documento.numeric'=>'Debe ingresar un número',
            'autor_documento.required'=>'Debe ingresar un autor',
            'fecha_documento.required'=>'Debe ingresar la fecha',
            'fecha_documento.date'=>'Debe ingresar una fecha',
        ])->validate();
        $year = new DateTime($input['fecha_documento']);
        $year = $year->format('Y');
        $nombre_file=($input['numero_documento']).'-'.($year).'-'.($input['autor_documento']).'-'.($input['tipo_documento']);
        try {

            $id_documento=DB::table("documento")->insertGetId([
                "tipo" => $input['tipo_documento'],
                "numero" => $input['numero_documento'],
                "autor" => $input['autor_documento'],
                "fecha" => $input['fecha_documento'],
                'name_file'=> $nombre_file.'.pdf',
                'direccion' => 1,
                "anno" => $year,
                "estado" => 1,
            ]);
            DB::table("documento_anexo")->insert([
                "documento_id"=>$input['id_doc'],
                "documento_id_anexo"=>$id_documento
            ]);   

            return redirect()->back()->with("FormDocMini","Success");
        }catch (\Throwable $th){
            dd("Error: " . $th->getMessage());
            return redirect()->back()->with('FormDocMini', 'Error');
        }
    }

    public function get_doc_anexos($id){
        $documento = Documento::find($id);  
        if (!$documento) {
            return response()->json(['error' => 'Documento no encontrado'], 404);
        }
        $array=[];
        $filas = DocumentoAnexo::where('documento_id',$id)->get();
        foreach($filas as $fila){
            $doc = Documento::find($fila->documento_id_anexo);
            $array[]=[
                'id' => $doc->id,
                'numero' => $doc->numero,
                'tipo' => $doc->tipoRelacion->nombre,
                'fecha' => $doc->fecha,
                'anno' => $doc->anno,
                'autor_nombre' => $doc->autorRelacion->nombres,
                'autor_apellido' => $doc->autorRelacion->apellidos,
            ];
        }

        return response()->json(["datos"=>$array]);
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
