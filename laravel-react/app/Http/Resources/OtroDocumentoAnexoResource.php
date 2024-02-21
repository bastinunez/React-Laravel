<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class OtroDocumentoAnexoResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        return [
            'descripcion' => $this->descripcion,
            'mime_file'=>$this->mime_file,
            'file' => $this->file,
        ];
    }
}
