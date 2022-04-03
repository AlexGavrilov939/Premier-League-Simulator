<?php

namespace App\Services;

use App\Models\GameModel;
use App\Models\StandingModel;
use App\Models\TeamModel;
use Illuminate\Database\Eloquent\Collection as EloquentCollection;
use Illuminate\Support\Collection;

class SimulatorService
{
    /**
     * @return void
     */
    public function resetData(): void
    {
        GameModel::query()->truncate();
        StandingModel::query()->truncate();
    }

    /**
     * @return void
     */
    public function resetStandings(): void
    {
        $games = $this->getGames();
        $standings = $this->getStandings();
        foreach ($games as $item) {
            $item->clear();
            $item->save();
        }
        foreach ($standings as $item) {
            $item->clear();
            $item->save();
        }
    }

    /**
     * @return GameModel[]|Collection
     */
    public function generateFixtures(): Collection|array
    {
        $this->resetData();
        $teamsList = $this->getTeams();
        $fixturesByWeeks = $this->matchDrawCalculation($teamsList);
        foreach ($fixturesByWeeks as $i => $weekData) {
            foreach ($weekData as $gameData) {
                $gameModel = new GameModel();
                $gameModel->fill($gameData);
                $gameModel->week_num = $i + 1;
                $gameModel->save();
            }
        }

        return $this->getFixtures();
    }

    /**
     * @return EloquentCollection
     */
    public function regenerateStandings(): EloquentCollection
    {
        StandingModel::query()->truncate();
        $teams = $this->getTeams();
        foreach ($teams as $team) {
            $standing = new StandingModel();
            $standing->fill(['team_id' => $team->id]);
            $standing->save();
        }

        return $this->getStandings();
    }

    /**
     * @param $weekNum
     */
    public function simulateWeeksGames($weekNum)
    {
        $gamesQuery = GameModel::query();
        if ($weekNum) {
            $gamesQuery->where(['week_num' => $weekNum]);
        }
        $games = $gamesQuery->get();
        foreach ($games as $game) {
            $this->simulateGame($game);
            $this->recalculateStandings($game);
        }
    }

    /**
     * @param GameModel $game
     */
    private function simulateGame(GameModel $game)
    {
        /**
         * @var $predictionService PredictionService
         */
        $predictionService = app(PredictionService::class);
        $gameOutcome = $predictionService->predictGameOutcome($game->homeTeam, $game->awayTeam);

        $game->home_team_goals_num = $gameOutcome['home_team_goals'];
        $game->away_team_goals_num = $gameOutcome['away_team_goals'];
        $game->is_completed = true;
        $game->save();
    }

    /**
     * @param GameModel $game
     */
    private function recalculateStandings(GameModel $game)
    {
        $homeTeamGoalsNum = $game->home_team_goals_num;
        $awayTeamGoalsNum = $game->away_team_goals_num;
        $goalDrawn = abs($homeTeamGoalsNum - $awayTeamGoalsNum);

        if ($homeTeamGoalsNum > $awayTeamGoalsNum) {
            $game->homeTeam->standing->win($goalDrawn);
            $game->awayTeam->standing->lose($goalDrawn);
        } elseif ($homeTeamGoalsNum < $awayTeamGoalsNum) {
            $game->awayTeam->standing->win($goalDrawn);
            $game->homeTeam->standing->lose($goalDrawn);
        } else {
            $game->awayTeam->standing->draw();
            $game->homeTeam->standing->draw();
        }
        $game->awayTeam->standing->save();
        $game->homeTeam->standing->save();
    }

    /**
     * @return EloquentCollection
     */
    public function getTeams(): EloquentCollection
    {
        return TeamModel::query()->get();
    }

    /**
     * @return EloquentCollection
     */
    public function getStandings(): EloquentCollection
    {
        return StandingModel::query()
            ->orderByDesc('points')
            ->orderBy('played')
            ->get();
    }

    /**
     * @return EloquentCollection
     */
    public function getGames(): EloquentCollection
    {
        return GameModel::query()->orderBy('week_num')->get();
    }

    /**
     * @return Collection
     */
    public function getFixtures(): Collection
    {
        return $this->getGames()
            ->groupBy('week_num')
            ->map(function($item, $weekNum) {
                return [
                    'week_num' => $weekNum,
                    'is_completed' => $item[0]->is_completed,
                    'games' => $item->map(function ($gameData) {
                        return [
                            'home' => collect($gameData->homeTeam)
                                ->merge(['goals' => $gameData->home_team_goals_num])
                                ->toArray(),
                            'away' => collect($gameData->awayTeam)
                                ->merge(['goals' => $gameData->away_team_goals_num])
                                ->toArray(),
                        ];
                    })
                ];
            })
            ->values();
    }

    /**
     * @param Collection $teams
     * @param int $weaksCount
     * @return array
     */
    private function matchDrawCalculation(Collection $teams, int $weaksCount = 6): array
    {
        $pairs = [];
        $n = count($teams);
        for ($x = 0; $x < $n; $x++) {
            for ($y = 0; $y < $n; $y++) {
                if ($teams[$x]->id == $teams[$y]->id) {
                    continue;
                }
                $pairs[] = [
                    'home_team_id' => $teams[$x]->id,
                    'away_team_id' => $teams[$y]->id,
                ];
            }
        }
        shuffle($pairs);
        $gamesPerWeek = count($pairs) / $weaksCount;

        return array_chunk($pairs, $gamesPerWeek);
    }
}
