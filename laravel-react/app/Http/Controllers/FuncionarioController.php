<?php

namespace App\Http\Controllers;

use App\Http\Resources\FuncionarioResource;
use App\Models\Funcionario;
use App\Models\HistorialFormulario;
use Inertia\Inertia;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Validator;

class FuncionarioController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $current_user=Auth::user();
        if ($current_user->hasPermissionTo('Gestion-Funcionarios')){
            return Inertia::render('Funcionarios/ShowFuncionarios',[
                'all_funcionarios'=>FuncionarioResource::collection(Funcionario::all())
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
        if ($current_user->hasPermissionTo('Gestion-Crear funcionario')){
            return Inertia::render('Funcionarios/AgregarFuncionario',);
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
        Validator::make($input, [
            'nombres' => ['required', 'string', 'max:40','regex:/^[A-ZÁÉÍÓÚÜÑ][a-záéíóúüñ]+\s[A-ZÁÉÍÓÚÜÑ][a-záéíóúüñ]+$/'],
            'apellidos' => ['required', 'string', 'max:40','regex:/^[A-ZÁÉÍÓÚÜÑ][a-záéíóúüñ]+\s[A-ZÁÉÍÓÚÜÑ][a-záéíóúüñ]+$/']
        ],[
            'nombres.regex'=>'Ingresa los nombres correctamente: Nombre Nombre',
            'nombres.string'=>'Ingresa cadena de carácteres',
            'nombres.max'=>'Superaste la cantidad de carácteres',
            'apellidos.regex'=>'Ingresa los apellidos correctamente: Apellido Apellido',
            'apellidos.string'=>'Ingresa cadena de carácteres',
            'apellidos.max'=>'Superaste la cantidad de carácteres'
        ])->validate();
        
        $nombreArray = explode(' ', $input['nombres']);
        $inicialesNombres = '';
        foreach ($nombreArray as $nombre) {
            $inicialesNombres .= ucfirst(strtoupper(substr($nombre, 0, 1)));
        }

        $apellidoArray = explode(' ', $input['apellidos']);
        $inicialesApellidos = '';
        foreach ($apellidoArray as $apellido) {
            $inicialesApellidos .= ucfirst(strtoupper(substr($apellido, 0, 1)));
        }

        $iniciales = $inicialesNombres . $inicialesApellidos;
        try{
            $funcionario_id=DB::table('funcionario')->insertGetId([
                'nombres'=>$input['nombres'],
                'apellidos'=>$input['apellidos'],
                'abreviacion'=>$iniciales
            ]);

            $user_id=Auth::id();
            HistorialFormulario::create([
                'responsable'=>$user_id,
                'accion'=>2,
                'detalles'=>"Crea el funcionario con nombres: " . $input['nombres'] . " " . $input['apellidos']
                //'detalles'=>"Actualiza parámetros: " . $request->fecha_documento!==null? "fecha" : ""
            ]);
            
            return redirect()->back()->with(["create"=>"Success"]);
        } catch (\Illuminate\Database\QueryException $e) {
            // Manejo específico para errores de duplicidad
            if ($e->errorInfo[1] == 1062) {
                return redirect()->back()->withErrors(["create"=>"Ya existe el funcionario"]);
            } else {
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
        $current_user=Auth::user();
        if ($current_user->hasPermissionTo('Gestion-Editar funcionario')){
            $funcionario= Funcionario::find((int)$id);
    
            if(is_null($funcionario)){
                return Inertia::render('Funcionarios/NoFuncionarioEdit');
            }
            return Inertia::render('Funcionarios/EditarFuncionario',[
                'funcionario'=>new FuncionarioResource($funcionario)
            ]);
        }else{
            return back();
        }
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, string $id)
    {
        $input=$request->all();
        Validator::make($input, [
            'nombres' => ['required', 'string', 'max:40','regex:/^[A-ZÁÉÍÓÚÜÑ][a-záéíóúüñ]+\s[A-ZÁÉÍÓÚÜÑ][a-záéíóúüñ]+$/'],
            'apellidos' => ['required', 'string', 'max:40','regex:/^[A-ZÁÉÍÓÚÜÑ][a-záéíóúüñ]+\s[A-ZÁÉÍÓÚÜÑ][a-záéíóúüñ]+$/']
        ],[
            'nombres.regex'=>'Ingresa los nombres correctamente: Nombre Nombre',
            'nombres.string'=>'Ingresa cadena de carácteres',
            'nombres.max'=>'Superaste la cantidad de carácteres',
            'apellidos.regex'=>'Ingresa los apellidos correctamente: Apellido Apellido',
            'apellidos.string'=>'Ingresa cadena de carácteres',
            'apellidos.max'=>'Superaste la cantidad de carácteres'
        ])->validate();



        $nombreArray = explode(' ', $input['nombres']);
        $inicialesNombres = '';
        foreach ($nombreArray as $nombre) {
            $inicialesNombres .= ucfirst(strtoupper(substr($nombre, 0, 1)));
        }

        $apellidoArray = explode(' ', $input['apellidos']);
        $inicialesApellidos = '';
        foreach ($apellidoArray as $apellido) {
            $inicialesApellidos .= ucfirst(strtoupper(substr($apellido, 0, 1)));
        }

        $iniciales = $inicialesNombres . $inicialesApellidos;
        try{
            $funcionario = Funcionario::find($id);
            $funcionario->nombres = $input['nombres'];
            $funcionario->apellidos = $input['apellidos'];
            $funcionario->abreviacion = $iniciales;
            $funcionario->save();

            $user_id=Auth::id();
            HistorialFormulario::create([
                'responsable'=>$user_id,
                'accion'=>3,
                'detalles'=>"Edita el funcionario con ID: " . $funcionario->id
                //'detalles'=>"Actualiza parámetros: " . $request->fecha_documento!==null? "fecha" : ""
            ]);

            return redirect()->back()->with(["update"=>"Actualizado correctamente"]);
        }catch (\Illuminate\Database\QueryException $e) {
            // Manejo específico para errores de duplicidad
            if ($e->errorInfo[1] == 1062) {
                return redirect()->back()->withErrors(["update"=>"Ya existe el funcionario"]);
            } else {
                // Otros errores de la base de datos
                throw $e;
            }
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
