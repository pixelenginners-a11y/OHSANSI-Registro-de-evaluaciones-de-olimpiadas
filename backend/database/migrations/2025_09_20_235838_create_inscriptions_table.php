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
        Schema::create('inscriptions', function (Blueprint $table) {
            $table->id();
            $table->foreignId('olympian_id')->references('id')->on('olympians')->onUpdate('cascade')->onDelete('cascade');
            $table->foreignId('area_id')->references('id')->on('areas')->onUpdate('cascade')->onDelete('cascade');
            $table->foreignId('grade_id')->references('id')->on('grades')->onUpdate('cascade')->onDelete('cascade');
            $table->string('status',20)->default('inscribed');
            $table->timestamps();
            $table->unique(['olympian_id', 'area_id', 'grade_id']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('inscriptions');
    }
};
