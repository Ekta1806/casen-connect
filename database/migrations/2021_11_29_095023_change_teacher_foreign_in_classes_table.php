<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class ChangeTeacherForeignInClassesTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        $keyExists = $this->hasForeignKeyInClassesTable();

        if (! empty($keyExists)) {
            Schema::table('classes', function (Blueprint $table) {
                $table->dropForeign('classes_teacher_id_foreign');
                $table->foreign('teacher_id')->references('id')->on('teachers')->onDelete('cascade');
            });
        }

        /*Schema::table('classes', function (Blueprint $table) {
            $table->dropForeign('classes_teacher_id_foreign');
            $table->foreign('teacher_id')->references('id')->on('teachers')->onDelete('cascade');
        });*/
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        $keyExists = $this->hasForeignKeyInClassesTable();

        if (! empty($keyExists)) {
            Schema::table('classes', function (Blueprint $table) {
                $table->dropForeign('classes_teacher_id_foreign');
                $table->foreign('teacher_id')->references('id')->on('users')->onDelete('cascade');
            });
        }

        /*Schema::table('classes', function (Blueprint $table) {
            $table->dropForeign('classes_teacher_id_foreign');
            $table->foreign('teacher_id')->references('id')->on('users')->onDelete('cascade');
        });*/
    }

    protected function hasForeignKeyInClassesTable()
    {
        return \Illuminate\Support\Facades\DB::select(
            \Illuminate\Support\Facades\DB::raw(
                'SHOW KEYS
                FROM classes
                WHERE Key_name=\'classes_teacher_id_foreign\''
            )
        );
    }
}
