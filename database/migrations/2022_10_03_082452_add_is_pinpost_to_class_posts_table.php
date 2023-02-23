<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class AddIsPinpostToClassPostsTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::table('class_posts', function (Blueprint $table) {
            $table->unsignedTinyInteger('is_pinpost')->default(0)->after('classes_id');
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::table('class_posts', function (Blueprint $table) {
            $table->dropColumn('is_pinpost');
        });
    }
}
