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
        Schema::create('olympians', function (Blueprint $table) {
            $table->id();
            $table->string('full_name', 100);
            $table->string('identity_document',20)->unique();
            $table->string('educational_institution', 100);
            $table->string('department', 50);
            $table->string('academic_tutor',100)->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('olympians');
    }
};
