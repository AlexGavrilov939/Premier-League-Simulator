<?php

namespace App\Http\Controllers;

use App\Services\PredictionService;
use App\Services\SimulatorService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Arr;
use Inertia\Inertia;
use Inertia\Response as InertiaResponse;

class SimulatorController extends Controller
{
    /**
     * @var SimulatorService
     */
    private SimulatorService $simulatorService;

    /**
     * @var PredictionService
     */
    private PredictionService $predictionService;

    public function __construct()
    {
        $this->simulatorService = app(SimulatorService::class);
        $this->predictionService = app(PredictionService::class);
    }

    /**
     * @return InertiaResponse
     */
    public function index(): InertiaResponse
    {
        return Inertia::render('simulator/index');
    }

    /**
     * @return JsonResponse
     */
    public function loadSimulatorData(): JsonResponse
    {
        $teams = $this->simulatorService->getTeams();
        $games = $this->simulatorService->getFixtures();
        $standings = $this->simulatorService->getStandings();
        $predictions = $this->predictionService->predictWinners();

        return response()->inertiaJson([
            'teams' => $teams,
            'games' => $games,
            'standings' => $standings,
            'predictions' => $predictions
        ]);
    }

    /**
     * @return JsonResponse
     */
    public function resetData(): JsonResponse
    {
        $this->simulatorService->resetData();

        return response()->inertiaJson(['status' => 'success']);
    }

    /**
     * @return JsonResponse
     */
    public function regenerateFixtures(): JsonResponse
    {
        $fixtures = $this->simulatorService->generateFixtures();

        return response()->inertiaJson(['games' => $fixtures]);
    }

    /**
     * @return JsonResponse
     */
    public function generateStandings(): JsonResponse
    {
        $standings = $this->simulatorService->regenerateStandings();

        return response()->inertiaJson(['standings' => $standings]);
    }

    /**
     * @return JsonResponse
     */
    public function resetStandings(): JsonResponse
    {
        $this->simulatorService->resetStandings();
        $games = $this->simulatorService->getFixtures();
        $standings = $this->simulatorService->getStandings();

        return response()->inertiaJson([
            'games' => $games,
            'standings' => $standings,
            'predictions' => $this->predictionService->predictWinners(),
        ]);
    }

    /**
     * @param Request $request
     * @return JsonResponse
     */
    public function simulateWeekGames(Request $request): JsonResponse
    {
        $validatedData = $request->validate([
            'week_num' => ['integer', 'min:1', 'max:6', 'nullable'],
        ]);
        $weekNum = Arr::get($validatedData, 'week_num');

        $this->simulatorService->simulateWeeksGames($weekNum);
        $games = $this->simulatorService->getFixtures();
        $standings = $this->simulatorService->getStandings();

        return response()->inertiaJson([
            'games' => $games,
            'standings' => $standings,
            'predictions' => $this->predictionService->predictWinners()
        ]);
    }
}
