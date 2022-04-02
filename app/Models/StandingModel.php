<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\HasOne;
use Illuminate\Support\Collection;

/**
 * @property integer $id
 * @property integer $points
 * @property integer $played
 * @property integer $win
 * @property integer $draw
 * @property integer $lose
 * @property integer $goal_drawn
 * @property bool $isStillPlaying
 * @property TeamModel $team
 * @property Collection<GameModel> $uncompletedGames
 * @property Collection<GameModel> $homeGames
 * @property Collection<GameModel> $awayGames
 */
class StandingModel extends Model
{
    use HasFactory;

    /**
     * @var string
     */
    protected $table = 'standings';

    protected $guarded = [];

    /**
     * @var string[]
     */
    protected $hidden = [
        'team_id',
        'created_at',
        'updated_at',
    ];

    protected $appends = ['isStillPlaying'];

    protected $with = ['team'];

    const MAX_GAMES_PER_STANDINGS = 6;

    const POINTS_PER_WIN = 3;

    /**
     * @return bool
     */
    public function getIsStillPlayingAttribute(): bool
    {
        return $this->played > 0 && $this->played < self::MAX_GAMES_PER_STANDINGS;
    }

    public function getUncompletedGamesAttribute()
    {
        $homeGames = $this->homeGames;
        $awayGames = $this->awayGames;

        return collect([$homeGames, $awayGames])
            ->flatten()
            ->filter(function($item) {
                return ! $item->is_completed;
            });
    }

    public function getCompletedGamesAttribute()
    {
        $homeGames = $this->homeGames;
        $awayGames = $this->awayGames;

        return collect([$homeGames, $awayGames])
            ->flatten()
            ->filter(function($item) {
                return $item->is_completed;
            });
    }

    public function clear()
    {
        $this->points = 0;
        $this->played = 0;
        $this->win = 0;
        $this->draw = 0;
        $this->lose = 0;
        $this->goal_drawn = 0;
    }

    /**
     * @param $goalsCount
     */
    public function win($goalsCount)
    {
        $this->played += 1;
        $this->win += 1;
        $this->points += self::POINTS_PER_WIN;
        $this->goal_drawn += $goalsCount;
    }

    /**
     * @param $goalDrawn
     */
    public function lose($goalDrawn)
    {
        $this->played += 1;
        $this->goal_drawn += -$goalDrawn;
        $this->lose += 1;
    }

    public function draw()
    {
        $this->played += 1;
        $this->draw += 1;
        $this->points += 1;
    }

    /**
     * @return HasOne
     */
    public function team(): HasOne
    {
        return $this->hasOne(TeamModel::class, 'id', 'team_id');
    }

    /**
     * @return HasMany
     */
    public function homeGames(): HasMany
    {
        return $this->hasMany(GameModel::class, 'home_team_id', 'team_id');
    }

    /**
     * @return HasMany
     */
    public function awayGames(): HasMany
    {
        return $this->hasMany(GameModel::class, 'away_team_id', 'team_id');
    }
}
