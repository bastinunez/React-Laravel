<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Documento extends Model
{
    use HasFactory;

    protected $table = 'documento';
    public $timestamps = false;

    protected $fillable = [
        'numero',
        'tipo',
        'fecha',
        'anno',
        'rut',
        'materia',
        'estado',
        'direccion',
        'autor',
        'mime_file',
        'name_file',
        'file'
    ];

    public function estadoRelacion()
    {
        return $this->belongsTo(Estado::class, 'estado');
    }
    public function tipoRelacion()
    {
        return $this->belongsTo(TipoDocumento::class, 'tipo');
    }
    public function direccionRelacion()
    {
        return $this->belongsTo(Direccion::class, 'direccion');
    }
    public function autorRelacion()
    {
        return $this->belongsTo(Funcionario::class, 'autor');
    }
    public function docAnexos(): HasMany
    {
        return $this->hasMany(DocumentoAnexo::class,'documento_id');
    }
    public function docOtrosAnexos(): HasMany
    {
        return $this->hasMany(OtroDocumentoAnexo::class,'documento_id');
    }

    public function historialAccionDocumentoAnexoRelacion()
    {
        return $this->hasMany(HistorialDocumentoAnexo::class, 'fk_documento_id');
    }

    public function historialAccionDocumentoRelacion()
    {
        return $this->hasMany(HistorialDocumentoAnexo::class, 'fk_documento_id_anexo');
    }

}
