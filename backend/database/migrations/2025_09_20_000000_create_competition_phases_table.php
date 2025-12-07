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
        Schema::create('competition_phases', function (Blueprint $table) {
            $table->id();
            $table->string('phase', 50)->unique();
            $table->text('description')->nullable();
            $table->boolean('active')->default(false);
            $table->integer('classification_limit')->nullable();
            $table->timestamp('started_at')->nullable();
            $table->dateTime('ended_at')->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('competition_phases');
    }
};
