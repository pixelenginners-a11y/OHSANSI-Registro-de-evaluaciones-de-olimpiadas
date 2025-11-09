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
        Schema::create('areas', function (Blueprint $table) {
            $table->id();
            $table->string('name', 100)->unique();
            $table->string('description')->nullable();
            $table->boolean('active')->default(true);
            $table->boolean('is_group')->default(false);
            $table->integer('group_min_size')->nullable();
            $table->integer('group_max_size')->nullable();
            $table->timestamps();
            $table->softDeletes();

            $table->foreignId('responsable_id')->nullable()->references('id')->on('users')->onDelete('set null');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('areas');
    }
};
