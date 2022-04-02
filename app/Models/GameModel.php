<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasOne;
use Illuminate\Support\Collection;

/**
 * @property integer $id
 * @property integer $week_num
 * @property integer $home_team_id
 * @property integer $away_team_id
 * @property integer $home_team_goals_num
 * @property integer $away_team_goals_num
 * @property boolean $is_completed
 * @property Collection<TeamModel> $homeTeam
 * @property Collection<TeamModel> $awayTeam
 */
class GameModel extends Model
{
    use HasFactory;

    /**
     * @var string
     */
    protected $table = 'games';

    protected $guarded = ['id'];

    /**
     * @var string[]
     */
    protected $hidden = [
        'home_team_id',
        'away_team_id',
        'created_at',
        'updated_at',
    ];

    /**
     * @var string[]
     */
    protected $casts = [
        'is_completed' => 'boolean'
    ];

    public function clear()
    {
        $this->home_team_goals_num = 0;
        $this->away_team_goals_num = 0;
        $this->is_completed = false;
    }

    /**
     * @return HasOne
     */
    public function homeTeam(): HasOne
    {
        return $this->hasOne(TeamModel::class, 'id', 'home_team_id');
    }

    /**
     * @return HasOne
     */
    public function awayTeam(): HasOne
    {
        return $this->hasOne(TeamModel::class, 'id', 'away_team_id');
    }
}
