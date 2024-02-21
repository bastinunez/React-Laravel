<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class OtroDocumento extends Model
{
    use HasFactory;
    protected $table = 'otro_doc';
    public $timestamps = false;
    protected $fillable = [
        'descripcion',
        'mime_file',
        'file'
    ];
    
}
