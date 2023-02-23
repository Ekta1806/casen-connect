<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class AddStatusColumnsInCommentsTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::table('comments', function (Blueprint $table) {
            $table->string('status')->nullable()->after('commented_by');
            $table->timestamp('status_updated_on')->nullable()->after('status');
            $table->unsignedInteger('status_updated_by_teacher_id')->default(0)->after('status_updated_on');
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::table('comments', function (Blueprint $table) {
            $table->dropColumn('status');
            $table->dropColumn('status_updated_on');
            $table->dropColumn('status_updated_by_teacher_id');
        });
    }
}
