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
        Schema::create('evaluator_grades', function (Blueprint $table) {
            $table->id();
            $table->foreignId('evaluator_id')->references('id')->on('users')->onUpdate('cascade')->onDelete('cascade');
            $table->foreignId('grade_id')->references('id')->on('grades')->onUpdate('cascade')->onDelete('cascade');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('evaluator_grades');
    }
};
