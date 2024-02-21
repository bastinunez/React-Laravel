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
        Schema::create('otro_doc_anexo', function (Blueprint $table) {
            $table->foreignId('documento_id')->constrained('documento')->onUpdate('cascade')->onDelete('cascade');
            $table->foreignId('otro_doc_id_anexo')->constrained('otro_doc')->onUpdate('cascade')->onDelete('cascade');
            $table->primary(['documento_id', 'otro_doc_id_anexo']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('otro_doc_anexo');
    }
};
