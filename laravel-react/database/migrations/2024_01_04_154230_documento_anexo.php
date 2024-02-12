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
        Schema::create('documento_anexo', function (Blueprint $table) {
            $table->id();
            $table->foreignId('documento_id')->constrained('documento')->onUpdate('cascade')->onDelete('cascade');
            $table->foreignId('documento_id_anexo')->constrained('documento')->onUpdate('cascade')->onDelete('cascade');
            $table->unique(['documento_id', 'documento_id_anexo']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('documento_anexo');
    }
};
