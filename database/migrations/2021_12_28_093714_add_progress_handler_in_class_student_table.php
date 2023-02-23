<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class AddProgressHandlerInClassStudentTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::table('class_student', function (Blueprint $table) {
            $table->string('progress_handler')->nullable()->after('class_id');
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::table('class_student', function (Blueprint $table) {
            $table->dropColumn('progress_handler');
        });
    }
}
