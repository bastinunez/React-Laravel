<?php

namespace App\Http\Middleware;

use Illuminate\Http\Request;
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
            ],
            'flash' => [
                "message"  => fn () => $request->session()->get('message'),
                'IdDoc' => fn () => $request->session()->get('IdDoc'),
                'documentos' => fn () => $request->session()->get('documentos'),
                'FormDocumento' => fn () => $request->session()->get('FormDocumento'),
                'FormDocMini' => fn () => $request->session()->get('FormDocMini'),
                'success_form_edit' => fn () => $request->session()->get('success_form_edit'),
                'success_form_pwd' => fn () => $request->session()->get('success_form_pwd'),
            ],
            'auth' => function () use ($request) {
                return [
                    'user' => $request->user() ? : null,
                ];
            },
            "auth.user.roles" => fn() => $request->user() ? $request->user()->getRoleNames() : null,
            "auth.user.permisos" => fn() => $request->user() ? $request->user()->getAllPermissions()->pluck('name'):null
        ];
    }
}
