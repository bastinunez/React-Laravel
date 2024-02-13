<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class ChangePassword
{
    /**
     * Handle an incoming request.
     *
     * @param  \Closure(\Illuminate\Http\Request): (\Symfony\Component\HttpFoundation\Response)  $next
     */
    public function handle(Request $request, Closure $next): Response
    {
        if (auth()->user()->change_pwd==1) {
            // Redirigir al usuario a otra página antes del dashboard
            //dd("entro aqui");
            return redirect('/cambiar-contrasena');
        }

        // Si el usuario no está autenticado, continuar con la solicitud normalmente
        return $next($request);
    }
}
