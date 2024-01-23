<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    public function up()
    {
        Schema::create('documento', function (Blueprint $table) {
            $table->id();
            $table->integer('numero');
            $table->foreignId('tipo')->constrained('tipo_documento')->onUpdate('cascade');
            $table->date('fecha');
            $table->integer('anno');
            $table->string('rut', 30)->nullable();
            $table->string('materia', 255)->nullable();
            $table->foreignId('estado')->constrained('estado')->onUpdate('cascade');
            $table->foreignId('direccion')->nullable()->constrained('direccion')->onUpdate('cascade');
            $table->foreignId('autor')->constrained('funcionario')->onUpdate('cascade');

            $table->string('name_file')->nullable();
            $table->string('mime_file')->nullable();

            $table->unique(['numero', 'tipo', 'anno', 'autor']);
        });
        DB::statement("ALTER TABLE documento ADD file MEDIUMBLOB");
    }

    public function down()
    {
        Schema::dropIfExists('documento');
    }
};
