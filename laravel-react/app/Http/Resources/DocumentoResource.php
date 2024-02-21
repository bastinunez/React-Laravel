<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class DocumentoResource extends JsonResource
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
            'anexos' =>  $this->obtenerDatosAnexos($this->docAnexos),
            'otros_anexos' =>  $this->obtenerDatosAnexosOtros($this->docOtrosAnexos),
        ];
    }

    protected function obtenerDatosAnexos($anexos)
    {
        return $anexos->map(function ($anexo) {
            return [
                'documento_id' => $anexo->documento_id,
                'documento_id_anexo' => $anexo->documento_id_anexo,
                'datos_anexo' => (new DocumentoAnexoResource($anexo->documentoAnexoIdRelacion))
            ];
        });
    }
    protected function obtenerDatosAnexosOtros($anexos)
    {
        return $anexos->map(function ($anexo) {
            return [
                'documento_id' => $anexo->documento_id,
                'otro_doc_id_anexo' => $anexo->otro_doc_id_anexo,
                'datos_anexo' => (new OtroDocumentoAnexoResource($anexo->documentoAnexoIdRelacion))
            ];
        });
    }
}
