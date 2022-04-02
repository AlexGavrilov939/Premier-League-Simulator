import { SimulationDataType } from '@/components/premierLeague/content';
import React from 'react';
import WeekGames from '@/components/premierLeague/weekGames';

type SimulatorGamesType = {
  games: SimulationDataType['games']
}

const SimulatorGames: React.FC<SimulatorGamesType> = ({
  games,
}) => (
  <div className={'flex flex-wrap justify-between gap-y-3'}>
    {games.map((weekData, weekNum) => (
      <WeekGames key={weekNum} weekData={weekData} />
    ))}
  </div>
);

export default SimulatorGames;
