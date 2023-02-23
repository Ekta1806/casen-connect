<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class AddTeacherIdInClassPostsLikesTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::table('class_posts_likes', function (Blueprint $table) {
            $table->unsignedInteger('teacher_id')->default(0)->after('liked_by');
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::table('class_posts_likes', function (Blueprint $table) {
            $table->dropColumn('teacher_id');
        });
    }
}
