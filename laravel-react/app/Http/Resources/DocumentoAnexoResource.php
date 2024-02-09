<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class DocumentoAnexoResource extends JsonResource
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
            'numero' => $this->numero,
            'tipo' => $this->tipoRelacion->nombre,
            'fecha' => $this->fecha,
            'anno' => $this->anno,
            'rut' => $this->rut,
            'materia' => $this->materia,
            'estado' => $this->estadoRelacion->nombre,
            'direccion' => $this->direccionRelacion->nombre,
            'autor' => $this->autorRelacion->nombres.' '.$this->autorRelacion->apellidos,
            'autor_abreviacion' => $this->autorRelacion->abreviacion,
            'name_file'=>$this->name_file,
            'mime_file'=>$this->mime_file,
            'file' => $this->file,
        ];
    }
}
