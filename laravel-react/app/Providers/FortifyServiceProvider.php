<?php

namespace App\Providers;

use App\Actions\Fortify\CreateNewUser;
use App\Actions\Fortify\ResetUserPassword;
use App\Actions\Fortify\UpdateUserPassword;
use App\Actions\Fortify\UpdateUserProfileInformation;
use Illuminate\Cache\RateLimiting\Limit;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\RateLimiter;
use Illuminate\Support\ServiceProvider;
use Illuminate\Support\Str;
use Laravel\Fortify\Fortify;
use App\Models\User;
use Illuminate\Support\Facades\Hash;

class FortifyServiceProvider extends ServiceProvider
{
    /**
     * Register any application services.
     */
    public function register(): void
    {
        //
    }

    /**
     * Bootstrap any application services.
     */
    public function boot(): void
    {
        Fortify::createUsersUsing(CreateNewUser::class);
        Fortify::updateUserProfileInformationUsing(UpdateUserProfileInformation::class);
        Fortify::updateUserPasswordsUsing(UpdateUserPassword::class);
        Fortify::resetUserPasswordsUsing(ResetUserPassword::class);

        RateLimiter::for('login', function (Request $request) {
            $throttleKey = Str::transliterate(Str::lower($request->input(Fortify::username())).'|'.$request->ip());

            return Limit::perMinute(5)->by($throttleKey);
        });

        RateLimiter::for('two-factor', function (Request $request) {
            return Limit::perMinute(5)->by($request->session()->get('login.id'));
        });
        
        // Fortify::authenticateUsing(function (Request $request) {
        //     $user = User::where('rut', $request->rut)->first();
     
        //     if ($user &&
        //         Hash::check($request->password, $user->password)) {
        //         return $user;
        //     }
        // });
        Fortify::authenticateUsing(function (Request $request) {
            $user = User::where('rut', $request->rut)->first();
            if ($user && Hash::check($request->password, $user->password) && $user->estado == 1) {
                //if ($user->estado == 1) {
                    return $user;
                //} else {
                    // Usuario no habilitado, redirigir con mensaje de error
                //    return back()->with(['error' => 'La cuenta no está habilitada']);
                //}
            }
        
            // Si no se encuentra el usuario o la contraseña es incorrecta, redirigir con mensaje de error
            //return back()->with(['error' => 'Credenciales incorrectas']);
        });
    }
}
