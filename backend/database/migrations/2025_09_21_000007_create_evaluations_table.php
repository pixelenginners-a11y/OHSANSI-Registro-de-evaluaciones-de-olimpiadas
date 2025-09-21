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
        Schema::create('evaluations', function (Blueprint $table) {
            $table->id();
            $table->foreignId('inscription_id')->references('id')->on('inscriptions')->onUpdate('cascade')->onDelete('cascade');
            $table->foreignId('evaluator_id')->references('id')->on('users')->onUpdate('cascade')->onDelete('cascade');
            $table->decimal('score', 5, 2);
            $table->text('description')->nullable();
            $table->string('phase',20);
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('evaluations');
    }
};
