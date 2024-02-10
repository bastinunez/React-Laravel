<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class HistorialDocumentosResource extends JsonResource
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
            'doc_id' => $this->documentoRelacion->id,
            'doc_fecha' => $this->documentoRelacion->fecha,
            'doc_numero' => $this->documentoRelacion->numero,
            'doc_direccion' => $this->documentoRelacion->direccionRelacion->nombre,
            'doc_estado' => $this->documentoRelacion->estadoRelacion->nombre,
            'doc_tipo' => $this->documentoRelacion->tipoRelacion->nombre,
            'doc_autor' => $this->documentoRelacion->autorRelacion->nombres . " " . $this->documentoRelacion->autorRelacion->apellidos, 
        ];
    }
}
