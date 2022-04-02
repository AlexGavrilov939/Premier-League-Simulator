<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateStandingsTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('standings', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('team_id');
            $table->unsignedInteger('points')->default(0);
            $table->unsignedInteger('played')->default(0);
            $table->unsignedInteger('win')->default(0);
            $table->unsignedInteger('draw')->default(0);
            $table->unsignedInteger('lose')->default(0);
            $table->integer('goal_drawn')->default(0);
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
        Schema::dropIfExists('standings');
    }
}
