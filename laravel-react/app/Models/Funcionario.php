<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Spatie\Activitylog\Traits\LogsActivity;
use Spatie\Activitylog\LogOptions;

class Funcionario extends Model
{
    use HasFactory,LogsActivity;
    protected $table = 'funcionario';
    public $timestamps = false;
    protected $fillable = [
        'nombres',
        'apellidos',
        'abreviacion'
    ];
    
    public function getActivitylogOptions(): LogOptions
    {
        return LogOptions::defaults()
            ->logOnly(['nombres','apellidos','abreviacion'])
            ->useLogName('funcionario');
        // Chain fluent methods for configuration options
    }
}
