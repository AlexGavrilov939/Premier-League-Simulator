<?php

namespace App\Services;

use App\Models\GameModel;
use App\Models\StandingModel;

class PredictionService
{
    /**
     * @return array
     */
    public function predictWinners(): array
    {
        if (! $this->checkIsPossibleToPredict()) {
            return [];
        }

        $standings = StandingModel::query()->orderByDesc('points')->get();
        $currentTopTeam = $standings->first();

        $remainedPossiblePoints = StandingModel::POINTS_PER_WIN * (StandingModel::MAX_GAMES_PER_STANDINGS - $currentTopTeam->played);
        $topTeamPoint = $currentTopTeam->points;

        $predictions = [];
        foreach ($standings as $i => $standing) {
            $currentStandingsPosition = $i + 1;
            $chance = $this->calculateChangeToWinStandings(
                $standing,
                $currentStandingsPosition,
                $remainedPossiblePoints,
                $topTeamPoint
            );
            $predictions[] = [
                'chanceToWinPoints' => $chance,
                'team' => $standing->team->only(['id', 'uid', 'title']),
            ];
        }
        $this->inflateTeamsChancesWithPercentage($predictions);

        return collect($predictions)
            ->sortByDesc('chanceToWinPercentage')
            ->values()
            ->toArray();
    }

    /**
     * @param array $predictions
     */
    private function inflateTeamsChancesWithPercentage(array &$predictions)
    {
        $pointsSum = collect($predictions)->pluck('chanceToWinPoints')->sum();
        $pointsSum = $pointsSum ?: 0.1;
        $onePointPercentValue = 100 / $pointsSum;

        foreach ($predictions as $i => $teamPrediction) {
            $chanceToWinPercentage = round(
                $teamPrediction['chanceToWinPoints'] * $onePointPercentValue,
                2
            );
            $predictions[$i]['chanceToWinPercentage'] = $chanceToWinPercentage;
        }
    }

    /**
     * @param StandingModel $standing
     * @param int $currentPosition
     * @param $remainedPossiblePoints
     * @param $topTeamPoints
     * @return float|int
     */
    private function calculateChangeToWinStandings(
        StandingModel $standing,
        int $currentPosition,
        $remainedPossiblePoints,
        $topTeamPoints
    ): float|int {
        $remainedPossiblePoints = StandingModel::POINTS_PER_WIN * (StandingModel::MAX_GAMES_PER_STANDINGS - $standing->played);
        // in this case it is impossible to win - chance is 0
        if ($remainedPossiblePoints + $standing->points < $topTeamPoints) {
//            if (! in_array($standing->id, [1, 4])) {
//                dd($standing->toArray(), $remainedPossiblePoints, $topTeamPoints);
//            }
            return 0;
        }

        $increaseChangeAtHome = 2;
        $increaseChangeAway = 1;
        $changeToWin = 0;
        foreach ($standing->uncompletedGames as $game) {
            /**
             * @var $game GameModel
             */
            if ($game->home_team_id == $standing->team->id) {
                $changeToWin += $increaseChangeAtHome;
            }
            if ($game->away_team_id == $standing->team->id) {
                $changeToWin += $increaseChangeAway;
            }
        }

        $chanceWithCurrentPosition = $changeToWin - ($currentPosition / 2);
        $chanceWithPointsDifference = $chanceWithCurrentPosition - (($topTeamPoints - $standing->points) / 2);

        if ($chanceWithPointsDifference > 0) {
            return $chanceWithPointsDifference;
        }
        if ($currentPosition == 1 && $standing->uncompletedGames->empty()) {
            return abs($chanceWithPointsDifference);
        }

        return 0;
    }

    /**
     * @return bool
     */
    private function checkIsPossibleToPredict(): bool
    {
        $standings = StandingModel::query()->get();
        $hasStillPlayingTeams = false;
        foreach ($standings as $team) {
            /**
             * @var $team StandingModel
             */
            if ($team->isStillPlaying) {
                $hasStillPlayingTeams = true;
            }
        }

        return $hasStillPlayingTeams;
    }
}
