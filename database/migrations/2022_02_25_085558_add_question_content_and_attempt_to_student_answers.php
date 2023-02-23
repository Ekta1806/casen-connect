<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class AddQuestionContentAndAttemptToStudentAnswers extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::table('student_answers', function (Blueprint $table) {
            $table->string('question_content')->after('status');
            $table->json('options')->nullable();
            $table->integer('attempt')->nullable();
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::table('student_answers', function (Blueprint $table) {
            //
        });
    }
}
