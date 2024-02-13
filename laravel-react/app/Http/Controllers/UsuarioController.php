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
        //$usuarios = User::with('roles', 'permissions')->get();
        //dd(UsuarioResource::collection($usuarios));
        $usuarios = User::all();
        // $prueba=new UserSharedResource($usuarios);
        // dd($prueba->permissions);
        // Obtener roles y permisos usando las relaciones definidas en tu modelo User
        //dd($usuarios->load('roles.permissions'));
        $usuarios->load('roles.permissions');
        //dd(UsuarioResource::collection($usuarios));
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
        $input=$request->all();
        Validator::make($input, [
            'nombres' => ['required', 'string', 'max:40','regex:/^[A-ZÁÉÍÓÚÜÑ][a-záéíóúüñ]+(?:\s[A-ZÁÉÍÓÚÜÑ][a-záéíóúüñ]+)+$/'],
            'apellidos' => ['required', 'string', 'max:40','regex:/^[A-ZÁÉÍÓÚÜÑ][a-záéíóúüñ]+(?:\s[A-ZÁÉÍÓÚÜÑ][a-záéíóúüñ]+)+$/'],
            'rut' => ['required', 'regex:/^[0-9]{1,2}\.[0-9]{3}\.[0-9]{3}-[0-9kK]{1}$/'],
            'rol' => ['required']
        ],[
            'nombres.regex'=>'Ingresa los nombres correctamente: Nombre Nombre',
            'nombres.string'=>'Ingresa cadena de carácteres',
            'nombres.max'=>'Superaste la cantidad de carácteres',
            'apellidos.regex'=>'Ingresa los apellidos correctamente: Apellido Apellido',
            'apellidos.string'=>'Ingresa cadena de carácteres',
            'apellidos.max'=>'Superaste la cantidad de carácteres',
            'rut.regex'=>'Ingresa el rut correctamente: XX.XXX.XXX-X',
        ])->validate();


        
        if ($this->validarRutChileno($input['rut'])) {
            //iniciales
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

            //rol (no es necesario)
            $rol="";
            if ($input['rol']==1){
                $rol='Usuario';
            }
            elseif ($input['rol']==2){
                $rol='Digitador';
            }
            else{
                $rol='Administrador';
            }

            //correo
            $nombres = str_replace(['á', 'é', 'í', 'ó', 'ú', 'ñ'], ['a', 'e', 'i', 'o', 'u', 'n'], $input["nombres"]);
            $apellidos = str_replace(['á', 'é', 'í', 'ó', 'ú', 'ñ'], ['a', 'e', 'i', 'o', 'u', 'n'], $input["apellidos"]);
            $nombresArray = explode(" ", $nombres);
            $primerNombre = strtolower(substr($nombresArray[0], 0, 2));
            $apellidosArray = explode(" ", $apellidos);
            $apellidosCompletos = strtolower(implode("", $apellidosArray));
            $resultado = $primerNombre . $apellidosCompletos;
            $dominio="@gdoc.cl";
            $correo=$resultado . $dominio;

            User::create([
                'nombres' => $input['nombres'],
                'apellidos' => $input['apellidos'],
                'rut' => $input['rut'],
                'iniciales' => $iniciales,
                'correo' => $correo,
                'rol'=> $input['rol'],
                'estado' => true,
                'change_pwd' => true,
                'password' => 12345678
            ])->assignRole($rol);
            return redirect()->back()->with(["FormPostUser"=>"Success"]);
        }else{
            return redirect()->back()->withErrors(["FormPostUser"=>"Error"]);
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
     * Show the form for editing the specified resource.
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
            
            return redirect()->back()->with("success_form_edit","Se guardó correctamente los cambios");
            
        }catch (\Throwable $th){
            return redirect()->back()->with("error","No se pudo guardar");
        }
       
    }

    public function updateCollection(Request $request, string $id)
    {
        $opcion=$request->opcion;
        $users=$request->id_users;
        //AQUI SE HABILITA
        if($opcion==1){
            foreach($users as $user_id){
                $usuario = User::find($user_id);
                $usuario->estado = $opcion;
                $usuario->save();
            }
        }elseif ($opcion==2){
            foreach($users as $user_id){
                $usuario = User::find($user_id);
                $usuario->estado = $opcion;
                $usuario->save();
            }
        }
        $usuarios = UsuarioResource::collection(User::all());
        return redirect()->back()->with(['actualizar'=>'Se pudo cambiar los estados de los seleccionados','usuarios'=>$usuarios]);
    }

    /**
     * Update the specified resource in storage.
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
        return back()->with("update","Se guardó correctamente la contraseña");
    }

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
