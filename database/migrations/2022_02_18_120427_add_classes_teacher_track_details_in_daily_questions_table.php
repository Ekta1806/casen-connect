<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class AddClassesTeacherTrackDetailsInDailyQuestionsTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::table('daily_questions', function (Blueprint $table) {
            $table->json('track_details')->nullable()->after('track_id');
            $table->json('classes_details')->nullable()->after('classes_id');
            $table->json('teacher_details')->nullable()->after('teacher_id');
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::table('daily_questions', function (Blueprint $table) {
            $table->dropColumn('track_details');
            $table->dropColumn('classes_details');
            $table->dropColumn('teacher_details');
        });
    }
}
