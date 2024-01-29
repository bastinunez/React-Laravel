<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;


return new class extends Migration
{
    public function up()
    {
        Schema::create('usuario', function (Blueprint $table) {
            $table->id();
            $table->string('nombres', 40);
            $table->string('apellidos', 40);
            $table->string('iniciales', 4);
            $table->string('correo', 50)->unique();
            $table->string('password', 60);
            $table->string('rut', 12)->unique();
            $table->foreignId('rol')->constrained('roles')->onUpdate('cascade');
            $table->boolean('estado');
            $table->boolean('change_pwd');
            $table->rememberToken();
        });
    }

    public function down()
    {
        Schema::dropIfExists('usuario');
    }
};
