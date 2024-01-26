<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Inertia\Inertia;
use App\Models\Documento;
use App\Http\Resources\DocumentoResource;
use App\Models\User;
use Illuminate\Support\Facades\Validator;
use Illuminate\Validation\ValidationException;
use Illuminate\Support\Facades\Auth;
use Throwable;
use Illuminate\Support\Facades\Hash;

class UsuarioController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        //$user_pwd=Auth::user()->password;
        return Inertia::render('Usuario/Perfil');
    }

    public function gestion_index()
    {
        return Inertia::render('Documentos/ShowDocuments',[
            'documentos'=>DocumentoResource::collection(Documento::all())
        ]);
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
        //
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

    /**
     * Update the specified resource in storage.
     */
    public function update_pwd(Request $request)
    {
        $input=$request->all();
        Validator::make($input, [
            'current_password' => ['required', 'string', 'current_password:web'],
            'nueva_pwd' => ['required','string','regex:/[a-zA-Z@0-9]/'],
        ],[
            'current_password.current_password' => 'Las contraseñas no coinciden.',
            'nueva_pwd.regex'=>'La contraseña admite letras, números y @.',
        ])->validate();
        $user=User::find(Auth::user()->id);
        $user->forceFill([
            'password' => Hash::make($input['nueva_pwd']),
        ])->save();
        return back()->with("success_form_pwd","Se guardó correctamente la contraseña");
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        //
    }
}
