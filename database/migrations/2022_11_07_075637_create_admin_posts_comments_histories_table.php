<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateAdminPostsCommentsHistoriesTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('admin_posts_comments_histories', function (Blueprint $table) {
            $table->id();
            $table->unsignedInteger('admin_post_id')->default(0);
            $table->unsignedInteger('admin_post_comment_id')->default(0);
            $table->text('comment')->nullable();
            $table->string('notes', 255)->default(0);
            $table->string('status', 255)->default(0);
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
        Schema::dropIfExists('admin_posts_comments_histories');
    }
}
