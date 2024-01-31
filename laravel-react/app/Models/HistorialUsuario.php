<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class HistorialUsuario extends Model
{
    use HasFactory;
    protected $table = 'historial_accion_usuario';
    const UPDATED_AT = null;
    protected $fillable = [
        'usuario_id',
        'responsable',
        'accion',
        'detalles',
        'created_at'
    ];
    public function usuarioRelacion()
    {
        return $this->belongsTo(User::class, 'usuario_id');
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
