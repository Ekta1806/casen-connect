<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateAdminPostsLikesTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('admin_posts_likes', function (Blueprint $table) {
            $table->id();
            $table->string('liked_by',255)->nullable();
            $table->unsignedInteger('admin_post_id')->default(0);
            $table->unsignedInteger('admin_id')->default(0);
            $table->unsignedInteger('teacher_id')->default(0);
            $table->unsignedInteger('student_id')->default(0);
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
        Schema::dropIfExists('admin_posts');
    }
}
