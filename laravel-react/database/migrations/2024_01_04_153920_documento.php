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
            $table->string('numero', 30)->nullable();
            $table->foreignId('tipo')->constrained('tipo_documento')->onUpdate('cascade');
            $table->date('fecha');
            $table->integer('anno');
            $table->string('rut', 30)->nullable();
            $table->string('materia',255);
            $table->foreignId('estado')->constrained('estado')->onUpdate('cascade');
            $table->foreignId('direccion')->nullable()->constrained('direccion')->onUpdate('cascade');
            $table->foreignId('autor')->constrained('funcionario')->onUpdate('cascade');

            $table->string('name_file')->nullable();
            $table->string('mime_file')->nullable();

            $table->unique(['numero', 'tipo', 'anno', 'autor','materia']);
        });
        DB::statement("ALTER TABLE documento ADD file MEDIUMBLOB");
    }

    public function down()
    {
        Schema::dropIfExists('documento');
    }
};
