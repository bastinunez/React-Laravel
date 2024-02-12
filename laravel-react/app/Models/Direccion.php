<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Spatie\Activitylog\Traits\LogsActivity;
use Spatie\Activitylog\LogOptions;

class Direccion extends Model
{
    use HasFactory,LogsActivity;
    protected $table = 'direccion';
    public $timestamps = false;
    protected $fillable = [
        'nombre'
    ];
    public function getActivitylogOptions(): LogOptions
    {
        return LogOptions::defaults()
            ->logOnly(['nombre'])
            ->useLogName('direccion');
        // Chain fluent methods for configuration options
    }
}
