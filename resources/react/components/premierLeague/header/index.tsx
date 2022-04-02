import React from 'react';
import logo from './images/premier_league.png';

type LeagueHeader = {
  title?: string,
};

const LeagueHeader: React.FC<LeagueHeader> = ({ title }) => (
  <div className='px-4 py-3 flex justify-between items-center border-b'>
    {title && <span className={'text-sm uppercase font-bold'}>{title}</span>}
    <img src={logo} className={'h-7'}/>
  </div>
);

export default React.memo(LeagueHeader);
