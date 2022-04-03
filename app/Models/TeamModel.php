<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasOne;

/**
 * @property integer $id
 * @property integer $power
 * @property StandingModel $standing
 */
class TeamModel extends Model
{
    use HasFactory;

    /**
     * @var string
     */
    protected $table = 'teams';

    protected $guarded = [];

    const HOME_GAME_INCREASE = 10;

    const AWAY_GAME_DECREASE = 10;

    /**
     * @var string[]
     */
    protected $hidden = [
        'created_at',
        'updated_at',
    ];

    /**
     * @return HasOne
     */
    public function standing(): HasOne
    {
        return $this->hasOne(StandingModel::class, 'team_id', 'id');
    }
}
