<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('historial_accion_usuario',function (Blueprint $table){
            $table->foreignId('usuario_id')->constrained('usuario')->onUpdate('cascade');
            $table->string('accion',50);
            $table->foreignId('responsable')->constrained('usuario')->onUpdate('cascade');
            $table->timestamp('fecha_registro');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('historial_accion_usuario');
    }
};
