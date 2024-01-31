<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class HistorialDocumento extends Model
{
    use HasFactory;
    protected $table = 'historial_accion_documento';
    const UPDATED_AT = null;
    protected $fillable = [
        'documento_id',
        'responsable',
        'accion',
        'detalles',
        'created_at'
    ];

    public function documentoRelacion()
    {
        return $this->belongsTo(Documento::class, 'documento_id');
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
