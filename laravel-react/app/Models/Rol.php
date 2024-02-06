<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Rol extends Model
{
    use HasFactory;
    protected $table = 'roles';
    protected $fillable = [
        'name'
    ];
     // Relationship with permissions
     public function permissions()
     {
         return $this->belongsToMany(Permission::class);
     }
 
     // Relationship with users
     public function users()
     {
         return $this->hasMany(User::class);
     }
}
