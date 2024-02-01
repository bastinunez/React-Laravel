<?php

namespace App\Http\Controllers;
use Illuminate\Http\Request;
use Inertia\Inertia;
use App\Models\Documento;
use App\Http\Resources\DocumentoResource;
use App\Http\Resources\PermissionResource;
use App\Http\Resources\RoleResource;
use App\Http\Resources\UserSharedResource;
use App\Http\Resources\UsuarioResource;
use App\Models\User;
use App\Models\Estado;
use App\Models\HistorialUsuario;
use App\Models\Permission;
use App\Models\Rol;
use Illuminate\Support\Facades\Validator;
use Illuminate\Validation\ValidationException;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Throwable;
use Illuminate\Support\Facades\Hash;

class GestionUsuarioController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $usuarios = User::whereNotIn("id",[Auth::id()])->get();
        //dd($usuarios);
        // $usuario_solo = User::find(2);
        // dd($usuarios,$usuario_solo);
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

    public function get_user($rut){
        //dd($request->rut);
        // Obtener los IDs de los documentos anexos relacionados con el documento dado
        $usuario = User::where('rut',$rut)->get();

        return response()->json(["filas"=>$usuario]);
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
            if ((int)$input['rol']==1){
                $rol='Usuario';
            }
            elseif ((int)$input['rol']==2){
                $rol='Digitador';
            }
            else{
                $rol='Administrador';
            }

            //correo
            $nombres = str_replace(['á', 'é', 'í', 'ó', 'ú', 'ñ'], ['a', 'e', 'i', 'o', 'u', 'n'], $input["nombres"]);
            $apellidos = str_replace(['á', 'é', 'í', 'ó', 'ú', 'ñ'], ['a', 'e', 'i', 'o', 'u', 'n'], $input["apellidos"]);
            $nombresArray = explode(" ", $nombres);
            $primerNombre = strtolower(substr($nombresArray[0], 0, 1));
            $apellidosArray = explode(" ", $apellidos);
            $apellidosCompletos = strtolower(implode("", $apellidosArray));
            $resultado = $primerNombre . $apellidosCompletos;
            $dominio="@gdoc.cl";
            $correo=$resultado . $dominio;

            $validacion_correo=User::where('correo',$correo)->get();
            if (sizeof($validacion_correo)!=0){
                $primerNombre = strtolower(substr($nombresArray[0], 0, 2));
                $apellidosArray = explode(" ", $apellidos);
                $apellidosCompletos = strtolower(implode("", $apellidosArray));
                $resultado = $primerNombre . $apellidosCompletos;
                $correo=$resultado . $dominio;
                $validacion_correo=User::where('correo',$correo)->get();
                if (sizeof($validacion_correo)!=0){
                    $primerNombre = strtolower(substr($nombresArray[0], 0, 3));
                    $apellidosArray = explode(" ", $apellidos);
                    $apellidosCompletos = strtolower(implode("", $apellidosArray));
                    $resultado = $primerNombre . $apellidosCompletos;
                    $correo=$resultado . $dominio;
                }
            }
            

            $usuario=User::create([
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

            $user_id=Auth::id();
            HistorialUsuario::create([
                'usuario_id'=>$usuario->id,
                'responsable'=>$user_id,
                'accion'=>2,
                'detalles'=>"Crea manualmente el usuario"
                //'detalles'=>"Actualiza parámetros: " . $request->fecha_documento!==null? "fecha" : ""
            ]);

            return redirect()->back()->with(["create"=>"Usuario agregado exitosamente"]);
        }else{
            return redirect()->back()->withErrors(["create"=>"Usuario no pudo ser agregado"]);
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

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(string $id)
    {
        $usuario= User::find((int)$id);

        if(is_null($usuario)){
            return Inertia::render('Usuarios/NoUserEdit');
        }

        return Inertia::render("Usuarios/EditarUsuario",[
            "usuario"=> new UserSharedResource($usuario),
            'roles'=>RoleResource::collection(Rol::all()),
            'permisos'=>PermissionResource::collection(Permission::all())
        ]);
    }

    public function edit_user_metadata(Request $request,string $id){
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
            $usuario = User::find($id);
            $usuario->update([
                'nombres' => $input['nombres'],
                'apellidos' => $input['apellidos']
            ]);

            $user_id=Auth::id();
            HistorialUsuario::create([
                'usuario_id'=>$usuario->id,
                'responsable'=>$user_id,
                'accion'=>3,
                'detalles'=>"Actualiza metadatos"
                //'detalles'=>"Actualiza parámetros: " . $request->fecha_documento!==null? "fecha" : ""
            ]);

            return redirect()->back()->with("update","Se guardó correctamente los cambios");
            
        }catch (\Throwable $th){
            return redirect()->back()->withError("update","No se pudo guardar");
        }
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, string $id)
    {
        $user=User::find($id);
        $user->forceFill([
            'password' => 12345678,
        ])->save();

        $user_id=Auth::id();
        HistorialUsuario::create([
            'usuario_id'=>$user->id,
            'responsable'=>$user_id,
            'accion'=>3,
            'detalles'=>"Restaura contraseña"
            //'detalles'=>"Actualiza parámetros: " . $request->fecha_documento!==null? "fecha" : ""
        ]);
        return redirect()->back()->with("update","Se restauró correctamente");
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

                $user_id=Auth::id();
                HistorialUsuario::create([
                    'usuario_id'=>$usuario->id,
                    'responsable'=>$user_id,
                    'accion'=>8,
                    'detalles'=>"Habilita usuario"
                    //'detalles'=>"Actualiza parámetros: " . $request->fecha_documento!==null? "fecha" : ""
                ]);
            }
        }elseif ($opcion==2){
            foreach($users as $user_id){
                $usuario = User::find($user_id);
                $usuario->estado = $opcion;
                $usuario->save();

                $user_id=Auth::id();
                HistorialUsuario::create([
                    'usuario_id'=>$usuario->id,
                    'responsable'=>$user_id,
                    'accion'=>7,
                    'detalles'=>"Anula usuario"
                    //'detalles'=>"Actualiza parámetros: " . $request->fecha_documento!==null? "fecha" : ""
                ]);
            }
        }
        $usuarios = UsuarioResource::collection(User::all());
        return redirect()->back()->with(['update'=>'Se pudo cambiar los estados de los seleccionados','usuarios'=>$usuarios]);
    }

    public function updatePermission(Request $request,string $id){
        $opcion=$request->opcion;
        $permisos=$request->permisos;
        $user=User::find($id);
        //dd(Permission::all());
        if ($opcion==0){
            foreach($permisos as $permiso){
                $user->revokePermissionTo($permiso);
            }
        }else{
            foreach($permisos as $permiso){
                $permision_name=Permission::find($permiso);
                $user->givePermissionTo($permision_name);
            }
        }
        $user->save();
        dd($user->getPermissionNames());
        $usuario= new UserSharedResource($user);
        return redirect()->back()->with(['update'=>'Se pudo cambiar los permisos seleccionados','usuario'=>$usuario]);
    }


    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        //
    }
}
