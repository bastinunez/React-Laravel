<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('otro_doc', function (Blueprint $table) {
            $table->id();
            $table->longText('descripcion');
            $table->string('mime_file')->nullable();

        });
        DB::statement("ALTER TABLE otro_doc ADD file MEDIUMBLOB");
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('otro_doc');
    }
};
