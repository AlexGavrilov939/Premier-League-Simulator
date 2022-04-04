<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class GamesAddFk extends Migration
{
    const TABLE = 'games';

    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::table(self::TABLE, function (Blueprint $table) {
            $table->foreign('home_team_id')
                ->references('id')
                ->on('teams')
                ->cascadeOnUpdate()
                ->cascadeOnDelete();

            $table->foreign('away_team_id')
                ->references('id')
                ->on('teams')
                ->cascadeOnUpdate()
                ->cascadeOnDelete();
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        //
    }
}
