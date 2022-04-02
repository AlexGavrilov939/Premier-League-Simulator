import { HomeIcon, PaperAirplaneIcon, PlayIcon } from '@heroicons/react/solid';
import { SimulationDataType, SimulationStepEnum } from '@/components/premierLeague/content';
import React from 'react';
import styles from './styles.module.scss';
import cx from 'classnames';

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
  <div key={weekData.week_num} className={cx('rounded-lg overflow-hidden bg-indigo-100 shadow-sm w-1/2', styles.container)}>
    <div className={'flex justify-between items-center bg-indigo-900 px-3 py-2 h-10'}>
      <span className='text-white text-sm font-bold'>Week: {weekData.week_num}</span>
      {mode === SimulationStepEnum.STANDINGS && ! weekData.is_completed && <PlayIcon
        className={'w-7 h-7 cursor-pointer text-blue-300 hover:text-blue-400'}
        onClick={() => simulateGameHandler(weekData.week_num)}
      />}
    </div>
    {weekData.games.map((item) => (
      <div key={`${weekData.week_num}-${item.home.id}-${item.away.id}`} className='flex justify-between border px-3 py-2'>
        <div className='w-1/3 flex items-center'>
          <HomeIcon className='w-5 h-5 mr-1'/>
          <span className='font-semibold'>{item.home.title}</span>
        </div>
        <div className={'flex gap-1 font-bold'}>
          {weekData.is_completed && <>
            <div className={'w-4 text-center'}>{item.home.goals}</div>
            &ndash;
            <div className={'w-4 text-center'}>{item.away.goals}</div>
          </>}
          {! weekData.is_completed && <>&ndash;</>}
        </div>
        <div className='w-1/3 flex items-center justify-end'>
          <span className='font-semibold'>{item.away.title}</span>
          <PaperAirplaneIcon className='w-5 h-5 ml-1'/>
        </div>
      </div>
    ))}
  </div>
);

export default React.memo(WeekGames);
