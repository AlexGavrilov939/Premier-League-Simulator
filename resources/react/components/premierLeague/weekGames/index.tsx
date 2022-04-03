import { HomeIcon, PaperAirplaneIcon, PlayIcon } from '@heroicons/react/solid';
import { SimulationDataType, SimulationStepEnum } from '@/components/premierLeague/content';
import React from 'react';
import cx from 'classnames';
import styles from './styles.module.scss';

type WeekGamesDataType = {
  week_num: number,
  is_completed?: boolean,
  games: SimulationDataType['teams']
}
export type WeekGamesType = {
  weekData: WeekGamesDataType,
  mode?: SimulationStepEnum,
  simulateGameHandler?: (weekNum: number) => void
}

const WeekGames: React.FC<WeekGamesType> = ({
  weekData,
  mode= SimulationStepEnum.FIXTURES,
  simulateGameHandler = () => {},
}) => (
  <div key={weekData.week_num} className={cx('rounded-lg overflow-hidden bg-indigo-100 shadow-sm mt-2', styles.container)}>
    <div className={'flex justify-between items-center bg-indigo-900 px-2 sm:px-3 py-1 sm:py-2 h-9 lg:h-10'}>
      <span className='text-white text-xs lg:text-sm font-bold'>Week: {weekData.week_num}</span>
      {mode === SimulationStepEnum.STANDINGS && ! weekData.is_completed && <PlayIcon
        className={'w-7 h-7 cursor-pointer text-blue-300 hover:text-blue-400'}
        onClick={() => simulateGameHandler(weekData.week_num)}
      />}
    </div>
    {weekData.games.map((item) => (
      <div
        key={`${weekData.week_num}-${item.home.id}-${item.away.id}`}
        className='flex justify-between items-center border px-2 sm:px-3 py-1 sm:py-2'
      >
        <div className='w-2/5 flex items-center'>
          <HomeIcon className='w-4 h-4 lg:w-5 lg:h-5 mr-1 mb-0.5'/>
          <span className='text-sm lg:text-base font-semibold'>{item.home.title}</span>
        </div>
        <div className={'flex items-center font-bold'}>
          {weekData.is_completed && <>
            <div className={'w-4 text-center text-sm lg:text-base mr-0.5'}>{item.home.goals}</div>
            &ndash;
            <div className={'w-4 text-center text-sm lg:text-base ml-0.5'}>{item.away.goals}</div>
          </>}
          {! weekData.is_completed && <>&ndash;</>}
        </div>
        <div className='w-2/5 flex items-center text-right justify-end'>
          <span className='text-sm lg:text-base font-semibold'>{item.away.title}</span>
          <PaperAirplaneIcon className='w-4 h-4 lg:w-5 lg:h-5 ml-1 mb-0.5'/>
        </div>
      </div>
    ))}
  </div>
);

export default React.memo(WeekGames);
