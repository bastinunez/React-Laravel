<?php

namespace App\Actions\Fortify;

use App\Models\User;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Validator;
use Laravel\Fortify\Contracts\CreatesNewUsers;
use Laravel\Jetstream\Jetstream;
use Illuminate\Validation\ValidationException;

class CreateNewUser implements CreatesNewUsers
{
    use PasswordValidationRules;

    /**
     * Validate and create a newly registered user.
     *
     * @param  array<string, string>  $input
     */
    public function create(array $input): User
    {
        Validator::make($input, [
            'nombres' => ['required', 'string', 'max:40','regex:/^[A-ZÁÉÍÓÚÜÑ][a-záéíóúüñ]+(?:\s[A-ZÁÉÍÓÚÜÑ][a-záéíóúüñ]+)+$/'],
            'apellidos' => ['required', 'string', 'max:40','regex:/^[A-ZÁÉÍÓÚÜÑ][a-záéíóúüñ]+(?:\s[A-ZÁÉÍÓÚÜÑ][a-záéíóúüñ]+)+$/'],
            'rut' => ['required', 'regex:/^[0-9]{1,2}\.[0-9]{3}\.[0-9]{3}-[0-9kK]{1}$/'],
            'correo' => ['required', 'string', 'email', 'max:40', 'unique:usuario','regex:/[a-z\.0-9]+@[a-z]+\.[a-z]+/'],
            'password' => ['required','string','regex:/[a-zA-Z@0-9]/','confirmed'],
            'rol' => ['required']
            // 'password' => $this->passwordRules(),
            //'terms' => Jetstream::hasTermsAndPrivacyPolicyFeature() ? ['accepted', 'required'] : '',
        ],[
            'nombres.regex'=>'Ingresa los nombres correctamente: Nombre Nombre',
            'nombres.string'=>'Ingresa cadena de carácteres',
            'nombres.max'=>'Superaste la cantidad de carácteres',
            'apellidos.regex'=>'Ingresa los apellidos correctamente: Apellido Apellido',
            'apellidos.string'=>'Ingresa cadena de carácteres',
            'apellidos.max'=>'Superaste la cantidad de carácteres',
            'rut.regex'=>'Ingresa el rut correctamente: XX.XXX.XXX-X',
            'correo.regex'=>'Ingresa el correo correctamente: nombre@organizacion.tipo',
            'password.regex'=>'La contraseña admite letras, números y @.',
            'password.confirmed'=>'Las contraseñas deben coincidir.',
        ])->validate();


        
        if ($this->validarRutChileno($input['rut'])) {
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
            
            return User::create([
                'nombres' => $input['nombres'],
                'apellidos' => $input['apellidos'],
                'rut' => $input['rut'],
                'iniciales' => $iniciales,
                'correo' => $input['correo'],
                'rol'=> $input['rol'],
                'estado' => true,
                'change_pwd' => false,
                'password' => Hash::make($input['password']),
            ])->assignRole($rol);
        }else{
            throw ValidationException::withMessages([
                'rut' => ['El RUT no es válido.'],
            ]);
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
}
