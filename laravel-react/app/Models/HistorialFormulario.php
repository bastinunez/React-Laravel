<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class HistorialFormulario extends Model
{
    use HasFactory;
    protected $table = 'historial_accion_formulario';
    const UPDATED_AT = null;
    protected $fillable = [
        'responsable',
        'accion',
        'detalles',
        'created_at'
    ];
    public function responsableRelacion()
    {
        return $this->belongsTo(User::class, 'responsable');
    }
    public function accionRelacion()
    {
        return $this->belongsTo(Accion::class, 'accion');
    }
}
