<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateClassPostsCommentHistoriesTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('class_posts_comment_histories', function (Blueprint $table) {
            $table->id();
            $table->integer('class_post_id')->nullable();
            $table->integer('class_post_comment_id')->nullable();
            $table->string('comment')->nullable();
            $table->string('notes', 255)->nullable();
            $table->string('status')->nullable();
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
        Schema::dropIfExists('class_posts_comment_histories');
    }
}
