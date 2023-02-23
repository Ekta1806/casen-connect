<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class AddDeletedAtColumnInMultipleTables extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::table('classes', function (Blueprint $table) {
            $table->softDeletes();
        });

        Schema::table('daily_questions', function (Blueprint $table) {
            $table->softDeletes();
        });

        Schema::table('questions', function (Blueprint $table) {
            $table->softDeletes();
        });

        Schema::table('students', function (Blueprint $table) {
            $table->softDeletes();
        });

        Schema::table('teachers', function (Blueprint $table) {
            $table->softDeletes();
        });

        Schema::table('tracks', function (Blueprint $table) {
            $table->softDeletes();
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::table('classes', function (Blueprint $table) {
            $table->dropColumn('deleted_at');
        });

        Schema::table('daily_questions', function (Blueprint $table) {
            $table->dropColumn('deleted_at');
        });

        Schema::table('questions', function (Blueprint $table) {
            $table->dropColumn('deleted_at');
        });

        Schema::table('students', function (Blueprint $table) {
            $table->dropColumn('deleted_at');
        });

        Schema::table('teachers', function (Blueprint $table) {
            $table->dropColumn('deleted_at');
        });

        Schema::table('tracks', function (Blueprint $table) {
            $table->dropColumn('deleted_at');
        });
    }
}
