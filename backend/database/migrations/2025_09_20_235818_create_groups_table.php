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
        Schema::create('groups', function (Blueprint $table) {
            $table->id();
            $table->string('name', 50);
            $table->foreignId('area_id')->references('id')->on('areas')->onUpdate('cascade')->onDelete('cascade');
            $table->foreignId('grade_id')->references('id')->on('grades')->onUpdate('cascade')->onDelete('cascade');
            $table->string('status',20)->default('inscribed');
            $table->timestamps();
            $table->softDeletes();

            $table->unique(['name', 'area_id', 'grade_id'], 'groups_name_area_grade_unique');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('groups');
    }
};
