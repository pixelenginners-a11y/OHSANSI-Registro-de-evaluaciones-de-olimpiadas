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
        Schema::table('areas', function (Blueprint $table) {
            $table->boolean('is_group')->default(false)->after('active');
            $table->integer('group_min_size')->nullable()->after('is_group');
            $table->integer('group_max_size')->nullable()->after('group_min_size');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('areas', function (Blueprint $table) {
            $table->dropColumn(['is_group', 'group_min_size', 'group_max_size']);
        });
    }
};
