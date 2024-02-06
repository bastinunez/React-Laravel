<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('historial_accion_documento',function (Blueprint $table){
            $table->foreignId('documento_id')->constrained('documento')->onUpdate('cascade');
            $table->foreignId('responsable')->constrained('usuario')->onUpdate('cascade');
            $table->foreignId('accion')->constrained('accion')->onUpdate('cascade');
            $table->string('detalles',255)->nullable();
            $table->timestamp('created_at');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('historial_accion_documento');
    }
};
