<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Spatie\Activitylog\Traits\LogsActivity;
use Spatie\Activitylog\LogOptions;
use Illuminate\Database\Eloquent\Model;

class DocumentoAnexo extends Model
{
    use HasFactory,LogsActivity;
    protected $table = 'documento_anexo';
    public $timestamps = false;
    protected $fillable = [
        'documento_id','documento_id_anexo'
    ];
    
    //ESTO PUEDE DAR PROBLEMAS SI ELIMINO
    public function getActivitylogOptions(): LogOptions
    {
        return LogOptions::defaults()
            ->logOnly(['documentoIdRelacion.numero','documentoIdRelacion.fecha','documentoIdRelacion.rut','documentoIdRelacion.autorRelacion.nombres','documentoIdRelacion.autorRelacion.apellidos','documentoIdRelacion.tipoRelacion.nombre','documentoIdRelacion.estadoRelacion.nombre',
            'documentoAnexoIdRelacion.numero','documentoAnexoIdRelacion.fecha','documentoAnexoIdRelacion.rut','documentoAnexoIdRelacion.tipoRelacion.nombre','documentoAnexoIdRelacion.autorRelacion.nombres','documentoAnexoIdRelacion.autorRelacion.apellidos','documentoAnexoIdRelacion.estadoRelacion.nombre'])
            //->logOnly(['documento_id','documento_id_anexo'])
            ->useLogName('documento_anexo');
        // Chain fluent methods for configuration options
    }
    public function documentoIdRelacion()
    {
        return $this->belongsTo(Documento::class, 'documento_id');
    }
    public function documentoAnexoIdRelacion()
    {
        return $this->belongsTo(Documento::class, 'documento_id_anexo');
    }
}
