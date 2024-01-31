<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Accion extends Model
{
    use HasFactory;
    protected $table = 'accion';
    public $timestamps = false;
    protected $fillable = [
        'nombre'
    ];
}
