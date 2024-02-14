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
use App\Models\HistorialDocumento;
use App\Models\HistorialDocumentoAnexo;
use App\Models\TipoDocumento;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\Auth;
use DateTime;
use Illuminate\Validation\Rule;

class GestionDocumentoController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $current_user=Auth::user();
        if ($current_user->hasPermissionTo('Gestion-Ver documentos')){
            return Inertia::render('Documentos/GestionDocumentos',[
                'all_documents'=>DocumentoResource::collection(Documento::all()),
                'direcciones'=>Direccion::all(),
                'autores'=>Funcionario::all(),
                'tipos'=>TipoDocumento::all(),
                'estados'=>Estado::all(),
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
        $current_user=Auth::user();
        if ($current_user->hasPermissionTo('Gestion-Crear documento')){
            return Inertia::render('Documentos/AgregarDocumento',[
                'direcciones'=>Direccion::all(),
                'autores'=>Funcionario::all(),
                'tipos'=>TipoDocumento::all()
            ]);
        }else{
            return back();
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
            'direccion_documento'=> ['numeric'],
            'rut_documento'=>['regex:/^0*(\d{1,3}(?:\.\d{3})*|\d{1,3})-[\dK]$/'],
            'archivo' => ['file', 'mimes:pdf', 'max:2048']
        ],[
            'tipo_documento.required'=>'Debe ingresar el tipo de documento',
            'tipo_documento.numeric'=>'Debe seleccionar un tipo',
            'numero_documento.required'=>'Debe ingresar el número de documento',
            'numero_documento.numeric'=>'Debe ingresar un número',
            'numero_documento.gt'=>'Debe ingresar un número mayor que 0',
            'autor_documento.required'=>'Debe ingresar un autor',
            'autor_documento.numeric'=>'Debe seleccionar autor',
            'direccion_documento.required'=>'Debe ingresar dirección',
            'direccion_documento.numeric'=>'Debe seleccionar direccion',
            'rut_documento.regex'=>'Debe ingresar un formato rut (12.345.678-K).',
            'fecha_documento.required'=>'Debe ingresar la fecha',
            'fecha_documento.date'=>'Debe ingresar una fecha',
            'archivo.file' => 'Debe ingresar un archivo',
            'archivo.mimes' => 'El archivo debe ser de tipo: pdf',
            'archivo.max' => 'El tamaño máximo permitido es 2 MB',
        ])->validate();

        $tipo=TipoDocumento::find($request->tipo_documento);
        if($this->validarRutChileno($input['rut_documento'])){
            $year = new DateTime($input['fecha_documento']);
            $year = $year->format('Y');

                
            $path = $request->file('archivo')->getRealPath();
            $ext = $request->file('archivo')->extension();
            $doc = file_get_contents($path);
            $base64 = base64_encode($doc);
            $mime = $request->file('archivo')->getClientMimeType();

            $nombre_file=($tipo->nombre.' '.$input['numero_documento'] . "-" . $year);
            
            try {

                $id_doc=DB::table("documento")->insertGetId([
                    "tipo" => $input['tipo_documento'],
                    "numero" => $input['numero_documento'] . "/" . $year,
                    "autor" => $input['autor_documento'],
                    "fecha" => $input['fecha_documento'],
                    "anno" => $year,
                    "rut" => $input['rut_documento'],
                    "materia" => $input['materia_documento'] ? $input['materia_documento']: '',
                    "estado" => $request->estado == 0 ? 1 : 2,
                    "direccion" => $input['direccion_documento'],
                    'name_file'=> $nombre_file.'.'.$ext,
                    'file' => $base64,
                    'mime_file'=> $mime
                ]);

                $user_id=Auth::id();
                HistorialDocumento::create([
                    'documento_id'=>$id_doc,
                    'responsable'=>$user_id,
                    'accion'=>2
                ]);

                $documentos = Documento::all();
                $documentos = $documentos->reject(function ($documento) use ($id_doc) {
                    return $documento->id === $id_doc;
                });
                return redirect()->route('documento-anexo.show',$id_doc);
            }catch (\Illuminate\Database\QueryException $e) {
                // Manejo específico para errores de duplicidad
                if ($e->errorInfo[1] == 1062) {
                    return redirect()->back()->withErrors(["create"=>"Ya existe el documento"]);
                } else {
                    // Otros errores de la base de datos
                    throw $e;
                }
            }
        }else{
            return redirect()->back()->withErrors(['create'=>'Rut no válido']);
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
        $current_user=Auth::user();
        if ($current_user->hasPermissionTo('Gestion-Editar documento')){
            $documento = Documento::find((int)$id);

            // Obtener los IDs de los documentos anexos relacionados con el documento dado
            $documentosAnexosIds = DocumentoAnexo::where('documento_id', $id)
            ->pluck('documento_id_anexo')
            ->toArray();
            $documentosAnexosIds[] = $id;
            $documentosPadresIds = DocumentoAnexo::where('documento_id_anexo', $id)
            ->pluck('documento_id')
            ->toArray();
            $union = array_merge($documentosAnexosIds,$documentosPadresIds);

            // Obtener todos los documentos que NO están en la lista de IDs obtenidos
            $documentosFiltrados = Documento::whereNotIn('id', $union)
                ->get();
    
            $documentosTransformados = DocumentoResource::collection($documentosFiltrados);
            return Inertia::render('Documentos/EditarDocumento',[
                'documento'=> new DocumentoResource($documento),
                'all_docs'=> $documentosTransformados,
                'direcciones'=>Direccion::all(),
                'autores'=>Funcionario::all(),
                'tipos'=>TipoDocumento::all()
            ]);
        }else{
            return back();
        }
        
    }

    /**
     * Update the specified resource in storage.
     */

    public function updateMetadata(Request $request, string $id){
        $input = $request->all();
        $input['fecha_documento'] = new DateTime($input['fecha_documento']);
        $input['fecha_documento'] = $input['fecha_documento']->format('Y-m-d');
        
        $boolean=false;
        if (base64_encode(base64_decode($request->archivo, true)) === $request->archivo){
            $boolean=true;
        }   

        Validator::make($input,[
            'tipo_documento'=> ['required','numeric'],
            'numero_documento'=> ['required','numeric','gt:0'],
            'autor_documento'=> ['required','numeric'],
            'fecha_documento'=>['required','date'],
            'direccion_documento'=> ['numeric'],
            'rut_documento'=>'sometimes|nullable|regex:/^0*(\d{1,3}(?:\.\d{3})*|\d{1,3})-[\dK]$/',
            'archivo' => ['sometimes','nullable', 
                $boolean?null:'file', 
                $boolean?null:'mimes:pdf', 
                $boolean?null:'max:2048'],
            'tipo_documento.required'=>'Debe ingresar el tipo de documento',
            'numero_documento.required'=>'Debe ingresar el número de documento',
            'numero_documento.numeric'=>'Debe ingresar un número',
            'numero_documento.gt'=>'Debe ingresar un número mayor que 0',
            'autor_documento.required'=>'Debe ingresar un autor',
            'direccion_documento.numeric'=>'Debe ingresar un número',
            'rut_documento.regex'=>'Debe ingresar un formato rut (12.345.678-K)',
            'fecha_documento.required'=>'Debe ingresar la fecha',
            'fecha_documento.date'=>'Debe ingresar una fecha',
            'archivo.file' => 'Debe ingresar un archivo',
            'archivo.mimes' => 'El archivo debe ser de tipo: png, jpg, pdf',
            'archivo.max' => 'El tamaño máximo permitido es 2 MB',
        ])->validate();
        if ($this->validarRutChileno($input['rut_documento'])){
            try{
                $documento = Documento::find($id);
                //dd($documento);
                if ($request->fecha_documento!==null) {
                    $year = new DateTime($input['fecha_documento']);
                    $year = $year->format('Y');
                    $documento->fecha= $input['fecha_documento'];
                    $documento->anno=$year;
                    $documento->save();
                }
                if ($request->tipo_documento!==null) {
                    $documento->tipo=$request->tipo_documento;
                    $documento->save();
                }if ($request->rut_documento!==null) {
                    $documento->rut=$request->rut_documento;
                    $documento->save();
                }
                if ($request->numero_documento!==null) {
                    if ($request->fecha_documento!==null){
                        $year = new DateTime($input['fecha_documento']);
                        $year = $year->format('Y');
                    }else{
                        $year=$documento->anno;
                    }
                    $documento->numero=$request->numero_documento . "/" . $year;
                    $documento->save();
                }
                if ($request->materia!==null) {
                    $documento->materia=$request->materia_documento ? $request->materia_documento: '';
                    $documento->save();
                }
                if ($request->autor_documento!==null) {
                    $documento->autor=$request->autor_documento;
                    $documento->save();
                }
                if ($request->direccion_documento!==null) {
                    $documento->direccion=$request->direccion_documento;
                    $documento->save();
                }
                if ($request->archivo!==null && !$boolean) {
                    if ($request->fecha_documento!==null){
                        $year = new DateTime($input['fecha_documento']);
                        $year = $year->format('Y');
                    }else{
                        $year=$documento->anno;
                    }
                    $tipo=TipoDocumento::find($request->tipo_documento);
                    $path = $request->file('archivo')->getRealPath();
                    $ext = $request->file('archivo')->extension();
                    $doc = file_get_contents($path);
                    $base64 = base64_encode($doc);
                    $mime = $request->file('archivo')->getClientMimeType();
                    $nombre_file=($tipo->nombre.' '.$input['numero_documento'] . "-" . $year);
                    
                    $documento->file=$base64;
                    $documento->mime_file=$mime;
                    $documento->name_file=$nombre_file.'.'.$ext;
                    $documento->save();
                }
                if ($request->archivo == null){
                    $documento->file=null;
                    $documento->mime_file=null;
                    $documento->name_file=null;
                    $documento->save();
                }
                if ($request->estado!==null) {
                    $documento->estado=$request->estado == 0 ? 1 : 2;
                    $documento->save();
                }
               
                $user_id=Auth::user();
                HistorialDocumento::create([
                    'documento_id'=>$documento->id,
                    'responsable'=>$user_id->id,
                    'accion'=>3,
                    'detalles'=>"Actualiza metadatos"
                    //'detalles'=>"Actualiza parámetros: " . $request->fecha_documento!==null? "fecha" : ""
                ]);
    
                return redirect()->back()->with(['update'=>'Se pudo actualizar el documento','documento'=>$documento]);
            }catch(\Throwable $th){
                return redirect()->back()->withErrors(['update'=>'No se pudo actualizar el documento','documento'=>$documento]);
            }
        }else{
            return redirect()->back()->withErrors(['update'=>'Rut no válido']);
        }
        
    }

    public function validarRutChileno($rut) {
        $rut = preg_replace('/[^k0-9]/i', '', $rut);
        $dv  = substr($rut, -1);
        $numero = substr($rut, 0, strlen($rut)-1);
        $i = 2;
        $suma = 0;
        foreach(array_reverse(str_split($numero)) as $v)
        {
            if($i==8)
                $i = 2;

            $suma += $v * $i;
            ++$i;
        }

        $dvr = 11 - ($suma % 11);
        
        if($dvr == 11)
            $dvr = 0;
        if($dvr == 10)
            $dvr = 'K';

        if($dvr == strtoupper($dv))
            return true;
        else
            return false;
    }

    public function updateCollection(Request $request, string $id)
    {
        $opcion=$request->opcion;
        $docs=$request->id_docs;
        //AQUI SE HABILITA
        try {
            if($opcion==1){
                foreach($docs as $doc_id){
                    $documento = Documento::find($doc_id);
                    $documento->estado = $opcion;
                    $documento->save();
    
                    $user_id=Auth::id();
                    HistorialDocumento::create([
                        'documento_id'=>$documento->id,
                        'responsable'=>$user_id,
                        'accion'=>8,
                        'detalles'=>"Habilita documento"
                        //'detalles'=>"Actualiza parámetros: " . $request->fecha_documento!==null? "fecha" : ""
                    ]);
                }
            }elseif ($opcion==2){
                foreach($docs as $doc_id){
                    $documento = Documento::find($doc_id);
                    $documento->estado = $opcion;
                    $documento->save();
    
                    $user_id=Auth::id();
                    HistorialDocumento::create([
                        'documento_id'=>$documento->id,
                        'responsable'=>$user_id,
                        'accion'=>7,
                        'detalles'=>"Anula documento"
                        //'detalles'=>"Actualiza parámetros: " . $request->fecha_documento!==null? "fecha" : ""
                    ]);
                }
                
            }
            $documentos = DocumentoResource::collection(Documento::all());
            return redirect()->back()->with(['update'=>'Se pudo cambiar los estados de los seleccionados','documentos'=>$documentos]);
        }catch(\Throwable $th){
            return redirect()->back()->withErrors(['update'=>'Error al actualizar el estado']);
        }
        
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        //
    }
}
