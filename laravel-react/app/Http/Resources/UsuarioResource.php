<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class UsuarioResource extends JsonResource
{
    /**
     * Transform the resource into an array.    
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'nombres' => $this->nombres,
            'apellidos' => $this->apellidos,
            'correo' => $this->correo,
            'rut' => $this->rut,
            'estado' => $this->estadoRelacion->nombre,
            'roles' => RoleResource::collection($this->whenLoaded('roles')),
            // 'permissions' => PermissionResource::collection($this->whenLoaded('permissions')),
            'permissions'=>$this->getAllPermissions()->pluck('name'),
        ];
        //quede aqui falta ver porque no entrega los permisos
    }
}
