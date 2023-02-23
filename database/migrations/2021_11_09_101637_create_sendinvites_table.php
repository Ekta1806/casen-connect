<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateSendinvitesTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('send_invites', function (Blueprint $table) {
            $table->id();
            $table->string('email');
            $table->string('token');
            $table->unsignedInteger('teacher_id');
            $table->unsignedInteger('class_id');
            $table->unsignedInteger('track_id');
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
        Schema::dropIfExists('sendinvites');
    }
}
