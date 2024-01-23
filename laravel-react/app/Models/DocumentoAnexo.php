<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class DocumentoAnexo extends Model
{
    use HasFactory;
    protected $table = 'documento_anexo';
    public $timestamps = false;
    protected $fillable = [
        'documento_id','documento_id_anexo'
    ];

    public function documentoIdRelacion()
    {
        return $this->belongsTo(Documento::class, 'documento_id');
    }
    public function documentoAnexoIdRelacion()
    {
        return $this->belongsTo(Documento::class, 'documento_id_anexo');
    }
}
