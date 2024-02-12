<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Spatie\Activitylog\Traits\LogsActivity;
use Spatie\Activitylog\LogOptions;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Documento extends Model
{
    use HasFactory,LogsActivity;

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
    public function getActivitylogOptions(): LogOptions
    {
        return LogOptions::defaults()
            ->logOnly(['numero', 'tipoRelacion.nombre','fecha','autorRelacion.nombres','autorRelacion.apellidos','direccionRelacion.nombre','estadoRelacion.nombre'])
            ->useLogName('documento');
        // Chain fluent methods for configuration options
    }

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
    public function docAnexosFk(): HasMany
    {
        return $this->hasMany(DocumentoAnexo::class,'documento_id_anexo');
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
