<?php

namespace App\Http\Middleware;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\URL;
use Inertia\Middleware;
use Tightenco\Ziggy\Ziggy;

class HandleInertiaRequests extends Middleware
{
    /**
     * The root template that is loaded on the first page visit.
     *
     * @var string
     */
    protected $rootView = 'app';

    /**
     * Determine the current asset version.
     */
    public function version(Request $request): ?string
    {
        return parent::version($request);
    }

    /**
     * Define the props that are shared by default.
     *
     * @return array<string, mixed>
     */
    public function share(Request $request): array
    {
        return [
            ...parent::share($request),
            'ziggy' => fn () => [
                ...(new Ziggy)->toArray(),
                'location' => $request->url(),
                'previous' => fn () => URL::previousPath(),
            ],
            'flash' => [
                "message"  => fn () => $request->session()->get('message'),
            ],
            'auth' => function () use ($request) {
                return [
                    // 'user' => $request->user() ? : null,
                    'user' => $request->user() ? ["nombres"=>$request->user()->nombres,
                                "apellidos"=>$request->user()->apellidos,
                                "rut"=>$request->user()->rut,
                                "correo"=>$request->user()->correo
                            ]  : null,
                ];
            },
            "auth.user.roles" => fn() => $request->user() ? $request->user()->getRoleNames() : null,
            "auth.user.permisos" => fn() => $request->user() ? $request->user()->getAllPermissions()->pluck('name'):null
        ];
    }
}
