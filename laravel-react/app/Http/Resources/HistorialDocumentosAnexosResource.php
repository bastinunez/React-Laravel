<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class HistorialDocumentosAnexosResource extends JsonResource
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
            'doc_tipo' => $this->documentoRelacion->tipoRelacion->nombre,
            'doc_autor' => $this->documentoRelacion->autorRelacion->nombres . " " . $this->documentoRelacion->autorRelacion->apellidos,
            'doc_anexo_id' => $this->documentoAnexoRelacion->id,
            'doc_anexo_fecha' => $this->documentoAnexoRelacion->fecha,
            'doc_anexo_numero' => $this->documentoAnexoRelacion->numero,
            'doc_anexo_fecha' => $this->documentoAnexoRelacion->fecha,
            'doc_anexo_tipo' => $this->documentoAnexoRelacion->tipoRelacion->nombre,
            'doc_anexo_autor' => $this->documentoAnexoRelacion->autorRelacion->nombres . " " . $this->documentoAnexoRelacion->autorRelacion->apellidos, 
        ];
    }
}
