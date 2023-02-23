<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateDailyQuestionsTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('daily_questions', function (Blueprint $table) {
            $table->id();
            $table->unsignedInteger('track_id')->default(0);
            $table->unsignedInteger('classes_id')->default(0);
            $table->unsignedInteger('teacher_id')->default(0);
            $table->unsignedInteger('question_id')->default(0);
            $table->json('question_details')->nullable();
            $table->date('ask_on_date')->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('daily_questions');
    }
}
