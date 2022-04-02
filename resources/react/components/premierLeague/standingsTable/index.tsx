import { PageClassnamesType } from '@/layouts/default';
import { SimulatorSimulationType } from '@/pages/simulator/index/_includes/standings';
import React from 'react';
import TeamLogo, { TeamLogoSizeEnum } from '@/components/premierLeague/teamLogo';
import cx from 'classnames';

const columns = [
  {
    label: 'Team',
    classNames: ['text-center w-20'],
  },
  {
    label: 'PTS',
    classNames: ['text-center'],
  },
  {
    label: 'P',
    classNames: ['text-center'],
  },
  {
    label: 'W',
    classNames: ['text-center'],
  },
  {
    label: 'D',
    classNames: ['text-center'],
  },
  {
    label: 'L',
    classNames: ['text-center'],
  },
  {
    label: 'GD',
    classNames: ['text-center'],
  },
];

type StandingsTableType = PageClassnamesType & Pick<SimulatorSimulationType, 'standings'>

const StandingsTable: React.FC<StandingsTableType> = ({
  standings = [],
  classNames,
}) => (
  <div className={cx(classNames)}>
    <table className={'min-w-full divide-y divide-gray-100'}>
      <thead>
        <tr>
          {columns.map((item, i) => (
            <th key={i} scope="col"
              className={cx('p-2 text-left text-xs text-gray-500 uppercase font-bold tracking-wider', item.classNames)}>
              {item.label}
            </th>
          ))}
        </tr>
      </thead>
      <tbody className='bg-white divide-y divide-gray-100'>
        {standings.map((item) => (
          <tr key={item.id}>
            <td className='flex items-center justify-center py-1'>
              <TeamLogo uid={item.team.uid} size={TeamLogoSizeEnum.SMALL} />
            </td>
            <td className="p-1 whitespace-nowrap text-center">
              <span className={'text-sm'}>{item.points}</span>
            </td>
            <td className="p-1 whitespace-nowrap text-center">
              <span className={'text-sm'}>{item.played}</span>
            </td>
            <td className="p-1 whitespace-nowrap text-center">
              <span className={'text-sm'}>{item.win}</span>
            </td>
            <td className="p-1 whitespace-nowrap text-center">
              <span className={'text-sm'}>{item.draw}</span>
            </td>
            <td className="p-1 whitespace-nowrap text-center">
              <span className={'text-sm'}>{item.lose}</span>
            </td>
            <td className="p-1 whitespace-nowrap text-center">
              <span className={'text-sm'}>{item.goal_drawn}</span>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  </div>
);

export default StandingsTable;
