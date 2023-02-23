<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateIntakeQuestionsTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('intake_questions', function (Blueprint $table) {
            $table->id();
            $table->text('content')->nullable();
            $table->text('option_1')->nullable();
            $table->text('option_2')->nullable();
            $table->text('option_3')->nullable();
            $table->text('option_4')->nullable();
            $table->text('correct_answer_option')->nullable();
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
        Schema::dropIfExists('intake_questions');
    }
}
