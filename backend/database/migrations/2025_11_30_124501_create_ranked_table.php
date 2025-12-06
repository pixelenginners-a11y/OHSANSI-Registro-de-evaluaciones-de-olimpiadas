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
        Schema::create('ranked', function (Blueprint $table) {
            $table->id();
            $table->foreignId('olimpiada_id')->references('id')->on('olimpiadas')->onUpdate('cascade')->onDelete('cascade');
            $table->foreignId('inscription_id')->nullable()->references('id')->on('inscriptions')->onUpdate('cascade')->onDelete('cascade');
            $table->foreignId('group_id')->nullable()->references('id')->on('groups')->onUpdate('cascade')->onDelete('cascade');
            $table->foreignId('area_id')->references('id')->on('areas')->onUpdate('cascade')->onDelete('cascade');
            $table->foreignId('grade_id')->references('id')->on('grades')->onUpdate('cascade')->onDelete('cascade');
            $table->integer('position'); // 1, 2, 3, 4...
            $table->decimal('final_score', 5, 2); // La nota que obtuvo
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('ranked');
    }
};
