<?php

use App\Http\Controllers\SimulatorController;
use Illuminate\Support\Facades\Route;

Route::group(['as' => 'simulator.'], function () {
   Route::get('/', [SimulatorController::class, 'index'])->name('index');
   Route::post('reset-data', [SimulatorController::class, 'resetData'])->name('resetData');
   Route::post('load-simulator-data', [SimulatorController::class, 'loadSimulatorData'])->name('loadData');
   Route::post('regenerate-fixtures', [SimulatorController::class, 'regenerateFixtures'])->name('regenerateFixtures');
   Route::post('generate-standings', [SimulatorController::class, 'generateStandings'])->name('generateStandings');
   Route::post('reset-standings', [SimulatorController::class, 'resetStandings'])->name('resetStandings');
   Route::post('simulate-week-games', [SimulatorController::class, 'simulateWeekGames'])->name('simulateWeekGames');
});
