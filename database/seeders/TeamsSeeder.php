<?php

namespace Database\Seeders;

use App\Models\TeamModel;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class TeamsSeeder extends Seeder
{
    const DATA = [
        [
            'id' => 1,
            'uid' => 'liv',
            'power' => 90,
            'title' => 'Liverpool'
        ],
        [
            'id' => 2,
            'uid' => 'man',
            'power' => 70,
            'title' => 'Manchester City'
        ],
        [
            'id' => 3,
            'uid' => 'chel',
            'power' => 60,
            'title' => 'Chelsea'
        ],
        [
            'id' => 4,
            'uid' => 'ars',
            'power' => 40,
            'title' => 'Arsenal'
        ],
    ];

    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        foreach (self::DATA as $teamData) {
            $user = new TeamModel();
            $user->fill($teamData);
            $user->save();
        }
    }
}
