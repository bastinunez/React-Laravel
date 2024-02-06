<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class HistorialDocumentoAnexo extends Model
{
    use HasFactory;
    protected $table = 'historial_accion_documento_anexo';
    const UPDATED_AT = null;
    protected $fillable = [
        'fk_documento_id',
        'fk_documento_id_anexo',
        'responsable',
        'accion',
        'detalles',
        'created_at'
    ];
    // public function documentoRelacion()
    // {
    //     return $this->belongsTo(DocumentoAnexo::class, 'fk_documento_id');
    // }
    // public function documentoAnexoRelacion()
    // {
    //     return $this->belongsTo(DocumentoAnexo::class, 'fk_documento_id_anexo');
    // }
    public function documentoRelacion()
    {
        return $this->belongsTo(Documento::class, 'fk_documento_id');
    }

    public function documentoAnexoRelacion()
    {
        return $this->belongsTo(Documento::class, 'fk_documento_id_anexo');
    }
    
    public function responsableRelacion()
    {
        return $this->belongsTo(User::class, 'responsable');
    }
    public function accionRelacion()
    {
        return $this->belongsTo(Accion::class, 'accion');
    }
}
