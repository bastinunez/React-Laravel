<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Permission extends Model
{
    use HasFactory;
    protected $table = 'permissions';
    protected $fillable = [
        'name'
    ];

     // Relationship with roles.
     public function roles()
     {
         return $this->belongsToMany(Rol::class);
     }
}
