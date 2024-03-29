<?php

namespace App\Http\Controllers;

use App\Http\Resources\DocumentoResource;
use App\Models\Direccion;
use App\Models\DocumentoAnexo;
use App\Models\Documento;
use App\Models\Estado;
use App\Models\Funcionario;
use App\Models\HistorialDocumento;
use App\Models\HistorialDocumentoAnexo;
use App\Models\TipoDocumento;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Auth;
use DateTime;
use Inertia\Inertia;

class DocumentoAnexoController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(string $id)
    {
        // $documentos = Documento::all();
        // $documentos = $documentos->reject(function ($documento) use ($id) {
        //     return $documento->id === $id;
        // });
        $current_user=Auth::user();
        if ($current_user->hasPermissionTo('Gestion-Crear documento')){
            $documentosAnexosIds = DocumentoAnexo::where('documento_id', $id)
            ->pluck('documento_id_anexo')
            ->toArray();
            $documentosAnexosIds[] = $id;
    
            // Obtener todos los documentos que NO están en la lista de IDs obtenidos
            $documentosFiltrados = Documento::whereNotIn('id', $documentosAnexosIds)
                ->get();
            $documentosTransformados = DocumentoResource::collection($documentosFiltrados);
            return Inertia::render("Documentos/AgregarDocumentoAnexo",[
                "all_docs"=>$documentosTransformados,
                "id_doc"=>$id
            ]);
        }else{
            return back();
        }
       
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create(Request $request)
    {
        $documento_id=$request->documento_id;
        $docs=$request->docs;
        try {
            foreach  ($docs as $doc_id){
                DB::table("documento_anexo")->insert([
                    "documento_id"=>$documento_id,
                    "documento_id_anexo"=>$doc_id
                ]);

            }
            return redirect()->back()->with(['anexar'=>'Se pudo anexar el documento']);
        }catch (\Throwable $th){
            //dd("Error: " . $th->getMessage());
            return redirect()->back()->withErrors(['anexar'=>'No se pudo anexar el documento']);
        }
    }

    public function store_existent(Request $request)
    {
        $documento_id=$request->documento_id;
        $docs=$request->anexos;
        try {
            foreach  ($docs as $doc_id){
                DB::table("documento_anexo")->insert([
                    "documento_id"=>$documento_id,
                    "documento_id_anexo"=>$doc_id
                ]);

                $user_id=Auth::id();
                HistorialDocumentoAnexo::create([
                    'fk_documento_id'=>$documento_id,
                    'fk_documento_id_anexo'=>$doc_id,
                    'responsable'=>$user_id,
                    'accion'=>5
                ]);
            }
            return redirect()->back()->with(['add_anexo'=>'Se pudo anexar el documento']);
        }catch (\Throwable $th){
            //dd("Error: " . $th->getMessage());
            return redirect()->back()->withErrors(['add_anexo'=>'No se pudo anexar el documento']);
        }
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $input = $request->all();
        $input['fecha_documento'] = new DateTime($input['fecha_documento']);
        $input['fecha_documento'] = $input['fecha_documento']->format('Y-m-d');
        Validator::make($input,[
            'tipo_documento'=> ['required','numeric'],
            'numero_documento'=> ['required','numeric','gt:0'],
            'autor_documento'=> ['required','numeric'],
            'fecha_documento'=>['required','date'],
            'id_doc'=>['required','numeric'],
            'archivo' => ['file', 'mimes:pdf', 'max:2048']
        ],[
            'tipo_documento.required'=>'Debe ingresar el tipo de documento',
            'tipo_documento.numeric'=>'Debe seleccionar un tipo',
            'numero_documento.required'=>'Debe ingresar el número de documento',
            'numero_documento.numeric'=>'Debe ingresar un número',
            'numero_documento.gt'=>'Debe ingresar un número mayor que 0',
            'autor_documento.required'=>'Debe ingresar un autor',
            'autor_documento.numeric'=>'Debe seleccionar un autor',
            'fecha_documento.required'=>'Debe ingresar la fecha',
            'fecha_documento.date'=>'Debe ingresar una fecha',
            'archivo.file' => 'Debe ingresar un archivo',
            'archivo.mimes' => 'El archivo debe ser de tipo: pdf',
            'archivo.max' => 'El tamaño máximo permitido es 2 MB',
        ])->validate();
        $year = new DateTime($input['fecha_documento']);
        $year = $year->format('Y');
        $path = $request->file('archivo')->getRealPath();
        $ext = $request->file('archivo')->extension();
        $doc = file_get_contents($path);
        $base64 = base64_encode($doc);
        $mime = $request->file('archivo')->getClientMimeType();
        $tipo=TipoDocumento::find($request->tipo_documento);
        $nombre_file=($tipo->nombre.' '.$input['numero_documento'] . "-" . $year);
        try {

            $id_documento=DB::table("documento")->insertGetId([
                "tipo" => $input['tipo_documento'],
                "numero" => $input['numero_documento'] . "/" . $year,
                "autor" => $input['autor_documento'],
                "fecha" => $input['fecha_documento'],
                'name_file'=> $nombre_file,
                'file' => $base64,
                'mime_file'=> $mime,
                'materia'=>$request->materia_documento ? $request->materia_documento:'',
                'direccion' => 1,
                "anno" => $year,
                "estado" => $request->estado == 0 ? 1 : 2,
            ]);
            DB::table("documento_anexo")->insertGetId([
                "documento_id"=>$input['id_doc'],
                "documento_id_anexo"=>$id_documento
            ]);

            $user_id=Auth::id();
            HistorialDocumento::create([
                'documento_id'=>$id_documento,
                'responsable'=>$user_id,
                'accion'=>2
            ]);
            HistorialDocumentoAnexo::create([
                'fk_documento_id'=>$input['id_doc'],
                'fk_documento_id_anexo'=>$id_documento,
                'responsable'=>$user_id,
                'accion'=>5
            ]);

            return redirect()->back()->with(["create"=>"Se pudo crear el documento anexo"]);
        }catch (\Illuminate\Database\QueryException $e) {
            // Manejo específico para errores de duplicidad
            if ($e->errorInfo[1] == 1062) {
                return redirect()->back()->withErrors(["create"=>"Ya existe el documento"]);
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
        // $documentos = Documento::all();
        // $documentos = $documentos->reject(function ($documento) use ($id) {
        //     return $documento->id === $id;
        // });
        $current_user=Auth::user();
        if ($current_user->hasPermissionTo('Gestion-Crear documento')){
            $documentosAnexosIds = DocumentoAnexo::where('documento_id', $id)
            ->pluck('documento_id_anexo')
            ->toArray();
            $documentosAnexosIds[] = $id;

            // Obtener todos los documentos que NO están en la lista de IDs obtenidos
            $documentosFiltrados = Documento::whereNotIn('id', $documentosAnexosIds)
                ->get();

            $documentosTransformados = DocumentoResource::collection($documentosFiltrados);

            return Inertia::render("Documentos/AgregarDocumentoAnexo",[
                "all_docs"=>$documentosTransformados,
                'direcciones'=>Direccion::all(),
                'autores'=>Funcionario::all(),
                'tipos'=>TipoDocumento::all(),
                'estados'=>Estado::all(),
                "doc"=> new DocumentoResource(Documento::find($id))
            ]);
        }else{
            return back();
        }
        
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
     * Eliminar asociacion de documento anexo
     */
    public function destroy(Request $request)
    {
        $documento_id=$request->documento_id;
        $anexos=$request->anexos;
        foreach($anexos as $anexo_id){
            $eliminar = DocumentoAnexo::where([
                'documento_id' => $documento_id,
                'documento_id_anexo' => $anexo_id
            ])->delete();
            if ($eliminar){
                $user_id=Auth::id();
                HistorialDocumentoAnexo::create([
                    'fk_documento_id'=>$documento_id,
                    'fk_documento_id_anexo'=>$anexo_id,
                    'responsable'=>$user_id,
                    'accion'=>6,
                    'detalles'=>"Quita anexo del documento ID: " . $documento_id 
                    //'detalles'=>"Actualiza parámetros: " . $request->fecha_documento!==null? "fecha" : ""
                ]);
                //return redirect()->back()->with(['destroy'=>'Se pudo eliminar el documento '.$anexo_id]);
            }
        }
        return redirect()->back()->with(['destroy'=>'Se pudieron eliminar todos']);
    }
}
