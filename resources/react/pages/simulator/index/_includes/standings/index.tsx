import { SimulationDataType, SimulationStepEnum } from '@/components/premierLeague/content';
import PredictionTable from '@/components/premierLeague/predictionTable';
import React from 'react';
import StandingsTable from '@/components/premierLeague/standingsTable';
import WeekGames, { WeekGamesType } from '@/components/premierLeague/weekGames';

export type SimulatorSimulationType = Pick<SimulationDataType, 'standings' | 'games' | 'predictions'> & {
  simulateGameHandler: WeekGamesType['simulateGameHandler'],
}

const SimulatorStandings: React.FC<SimulatorSimulationType> = ({
  standings = [],
  games = [],
  predictions = [],
  simulateGameHandler,
}) => (
  <>
    <div className={'flex justify-between gap-4 mb-4'}>
      <StandingsTable standings={standings} classNames={'w-7/12'} />
      {predictions.length > 0 && <PredictionTable predictions={predictions} classNames={'w-4/12'} />}
    </div>
    <div className={'flex flex-wrap justify-between'}>
      {games.map((gameData, weekNum) => (
        <>
          <WeekGames
            key={weekNum}
            weekData={gameData}
            mode={SimulationStepEnum.STANDINGS}
            simulateGameHandler={simulateGameHandler}
          />
        </>
      ))}
    </div>
  </>
);

export default SimulatorStandings;
