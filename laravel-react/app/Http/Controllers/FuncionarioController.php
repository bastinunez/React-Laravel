<?php

namespace App\Http\Controllers;

use App\Http\Resources\FuncionarioResource;
use App\Models\Funcionario;
use Inertia\Inertia;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Validator;

class FuncionarioController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        return Inertia::render('Funcionarios/ShowFuncionarios',[
            'all_funcionarios'=>FuncionarioResource::collection(Funcionario::all())
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        return Inertia::render('Funcionarios/AgregarFuncionario',);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $input = $request->all();
        Validator::make($input, [
            'nombres' => ['required', 'string', 'max:40','regex:/^[A-ZÁÉÍÓÚÜÑ][a-záéíóúüñ]+(?:\s[A-ZÁÉÍÓÚÜÑ][a-záéíóúüñ]+)+$/'],
            'apellidos' => ['required', 'string', 'max:40','regex:/^[A-ZÁÉÍÓÚÜÑ][a-záéíóúüñ]+(?:\s[A-ZÁÉÍÓÚÜÑ][a-záéíóúüñ]+)+$/']
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
            DB::table('funcionario')->insert([
                'nombres'=>$input['nombres'],
                'apellidos'=>$input['apellidos'],
                'abreviacion'=>$iniciales
            ]);
            return redirect()->back()->with(["FormPostFuncionario"=>"Success"]);
        }catch(\Throwable $th){
            return redirect()->back()->withErrors(["FormPostFuncionario"=>"Error"]);
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
        return Inertia::render('Funcionarios/EditarFuncionario',[
            'funcionario'=>new FuncionarioResource(Funcionario::find((int)$id))
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, string $id)
    {
        $input=$request->all();
        Validator::make($input, [
            'nombres' => ['required', 'string', 'max:40','regex:/^[A-ZÁÉÍÓÚÜÑ][a-záéíóúüñ]+(?:\s[A-ZÁÉÍÓÚÜÑ][a-záéíóúüñ]+)+$/'],
            'apellidos' => ['required', 'string', 'max:40','regex:/^[A-ZÁÉÍÓÚÜÑ][a-záéíóúüñ]+(?:\s[A-ZÁÉÍÓÚÜÑ][a-záéíóúüñ]+)+$/']
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
            return redirect()->back()->with(["FormUpdateFuncionario"=>"Success"]);
        }catch(\Throwable $th){ 
            return redirect()->back()->withErrors(["FormUpdateFuncionario"=>"Error"]);
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
