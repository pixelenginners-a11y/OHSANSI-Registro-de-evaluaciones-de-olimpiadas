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
        Schema::create('list_items', function (Blueprint $table) {
            $table->id();
            $table->foreignId('listing_id')->references('id')->on('listings')->onUpdate('cascade')->onDelete('cascade');
            $table->foreignId('inscription_id')->references('id')->on('inscriptions')->onUpdate('cascade')->onDelete('cascade');
            $table->foreignId('group_id')->references('id')->on('groups')->onUpdate('cascade')->onDelete('cascade');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('list_items');
    }
};
