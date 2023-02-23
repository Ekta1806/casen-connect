<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class AddLevelDetailsColumnInDailyQuestionsTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::table('daily_questions', function (Blueprint $table) {
            $table->unsignedInteger('level_id')->default(0)->after('question_details');
            $table->json('level_details')->nullable()->after('level_id');
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
            $table->dropColumn('level_id');
            $table->dropColumn('level_details');
        });
    }
}
