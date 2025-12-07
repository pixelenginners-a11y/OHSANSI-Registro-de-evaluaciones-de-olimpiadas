<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('system_logs', function (Blueprint $table) {
            $table->id();
            $table->foreignId('actor_id')->nullable()->constrained('users')->nullOnDelete();
            $table->string('actor_role')->nullable();
            $table->string('action'); // e.g. evaluation.updated, user.created
            $table->string('entity_type')->nullable(); // Evaluation, User, Listing, CompetitionPhase
            $table->unsignedBigInteger('entity_id')->nullable();
            $table->unsignedBigInteger('area_id')->nullable();
            $table->unsignedBigInteger('grade_id')->nullable();
            $table->string('phase')->nullable();
            $table->json('metadata')->nullable(); // before/after snapshot and context
            $table->string('ip_address')->nullable();
            $table->text('user_agent')->nullable();
            $table->timestamps();

            $table->index(['action', 'entity_type']);
            $table->index(['actor_id', 'actor_role']);
            $table->index(['area_id', 'grade_id']);
            $table->index('phase');
            $table->index('created_at');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('system_logs');
    }
};
