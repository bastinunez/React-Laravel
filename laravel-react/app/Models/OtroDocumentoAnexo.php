<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class OtroDocumentoAnexo extends Model
{
    use HasFactory;
    protected $table = 'otro_doc_anexo';
    public $timestamps = false;
    protected $fillable = [
        'documento_id','otro_doc_id_anexo'
    ];
    public function documentoIdRelacion()
    {
        return $this->belongsTo(Documento::class, 'documento_id');
    }
    public function documentoAnexoIdRelacion()
    {
        return $this->belongsTo(OtroDocumento::class, 'otro_doc_id_anexo');
    }
}
