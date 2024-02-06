<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class HistorialAccionFormularioResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        return [
            'responsable'=>$this->responsableRelacion,
            'accion'=>$this->accionRelacion,
            'detalles'=>$this->detalles,
            'created_at'=>$this->created_at,
        ];
    }
}
