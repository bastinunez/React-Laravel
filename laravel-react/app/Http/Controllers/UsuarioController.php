<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Inertia\Inertia;
use App\Models\Documento;
use App\Http\Resources\DocumentoResource;
use App\Http\Resources\RoleResource;
use App\Http\Resources\UserSharedResource;
use App\Http\Resources\UsuarioResource;
use App\Models\User;
use App\Models\Estado;
use App\Models\Rol;
use Illuminate\Support\Facades\Validator;
use Illuminate\Validation\ValidationException;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Throwable;
use Illuminate\Support\Facades\Hash;

class UsuarioController extends Controller
{
    /**
     * Display a listing of the resource.
     */ 
    public function index()
    {
        return Inertia::render('Usuarios/Perfil');
    }

    public function gestion_index()
    {
        $usuarios = User::all();
        $usuarios->load('roles.permissions');
        return Inertia::render('Usuarios/ShowUsers',[
            'usuarios'=>UsuarioResource::collection($usuarios),
            'estados'=>Estado::all(),
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        return Inertia::render('Usuarios/AgregarUsuario',[
            'roles'=>RoleResource::collection(Rol::all())
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
      
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
    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        //
    }

    public function edit($id){
    }

    /**
     * El usuario cambia sus metadatos
     */
    public function edit_data(Request $request)
    {
        $input=$request->all();
        Validator::make($input, [
            'nombres' => ['required', 'string', 'max:40','regex:/^[A-ZÁÉÍÓÚÜÑ][a-záéíóúüñ]+(?:\s[A-ZÁÉÍÓÚÜÑ][a-záéíóúüñ]+)+$/'],
            'apellidos' => ['required', 'string', 'max:40','regex:/^[A-ZÁÉÍÓÚÜÑ][a-záéíóúüñ]+(?:\s[A-ZÁÉÍÓÚÜÑ][a-záéíóúüñ]+)+$/'],
        ],[
            'nombres.regex'=>'Ingresa los nombres correctamente: Nombre Nombre',
            'nombres.string'=>'Ingresa cadena de carácteres',
            'nombres.max'=>'Superaste la cantidad de carácteres',
            'apellidos.regex'=>'Ingresa los apellidos correctamente: Apellido Apellido',
            'apellidos.string'=>'Ingresa cadena de carácteres',
            'apellidos.max'=>'Superaste la cantidad de carácteres',
        ])->validate();
        try{
            $user =Auth::user();
            $usuario = User::find($user->id);
            $usuario->update([
                'nombres' => $input['nombres'],
                'apellidos' => $input['apellidos']
            ]);
            
            return redirect()->back()->with(["update"=>"Se guardó correctamente los cambios"]);
            
        }catch (\Throwable $th){
            return redirect()->back()->with(["update"=>"No se pudo guardar"]);
        }
       
    }

    /**
     * El usuario cambia su contraseña en el perfil
     */
    public function update_pwd(Request $request) 
    {
        $input=$request->all();
        Validator::make($input, [
            'current_password' => ['required', 'string', 'current_password:web'],
            'nueva_pwd' => ['required','string','regex:/[a-zA-Z@0-9]/','different:current_password'],
        ],[
            'current_password.current_password' => 'La contraseña no coincide con la actual',
            'current_password.required'=>'Debes ingresar la contraseña por antigua.',
            'nueva_pwd.regex'=>'La contraseña admite letras, números y @.',
            'nueva_pwd.required'=>'Debes ingresar la nueva contraseña.',
            'nueva_pwd.different'=>'Debes ingresar una contraseña distinta.',
        ])->validate();
        $user=User::find(Auth::user()->id);
        $user->forceFill([
            'password' => Hash::make($input['nueva_pwd'])
        ])->save();
        return back()->with(["update"=>"Se guardó correctamente la contraseña"]);
    }

    /**
     * El usuario restaura la contraseña y debe cambiar su contraseña para poder iniciar
     */
    public function change_pwd(Request $request)
    {
        $input=$request->all();
        Validator::make($input, [
            'current_password' => ['required', 'string', 'current_password:web'],
            'nueva_pwd' => ['required','string','regex:/[a-zA-Z@0-9]/','different:current_password'],
        ],[
            'current_password.current_password' => 'La contraseña no coincide con la actual',
            'current_password.required'=>'Debes ingresar la contraseña por antigua.',
            'nueva_pwd.regex'=>'La contraseña admite letras, números y @.',
            'nueva_pwd.required'=>'Debes ingresar la nueva contraseña.',
            'nueva_pwd.different'=>'Debes ingresar una contraseña distinta.',
        ])->validate();
        try{
            $user=User::find(Auth::user()->id);
            $user->forceFill([
                'password' => Hash::make($input['nueva_pwd']),
                'change_pwd' => 0
            ])->save();
            return redirect()->route('dashboard');
        }catch(\Throwable $th){
            return back();
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
