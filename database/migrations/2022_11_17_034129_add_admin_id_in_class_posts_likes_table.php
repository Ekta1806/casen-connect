<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class AddAdminIdInClassPostsLikesTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::table('class_posts_likes', function (Blueprint $table) {
            $table->unsignedInteger('admin_id')->default(0)->after('teacher_id');
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
            $table->dropColumn('admin_id');
        });
    }
}
