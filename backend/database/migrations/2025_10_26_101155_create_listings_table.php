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
        Schema::create('listings', function (Blueprint $table) {
            $table->id();
            $table->string('name', 100);
            $table->foreignId('area_id')->references('id')->on('areas')->onUpdate('cascade')->onDelete('cascade');
            $table->foreignId('grade_id')->references('id')->on('grades')->onUpdate('cascade')->onDelete('cascade');
            $table->string('type', 50);
            $table->text('description')->nullable();   
            $table->boolean('is_published')->default(false);
            $table->timestamp('published_at')->nullable();
            $table->string('visibility', 20)->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('listings');
    }
};
