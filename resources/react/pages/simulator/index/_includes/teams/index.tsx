import React from 'react';
import TeamLogo from '@/components/premierLeague/teamLogo';
import cx from 'classnames';

type SimulatorTeamsType = {
  teams: any[],
}

const columns = [
  {
    label: '',
    classNames: ['w-32'],
  },
  {
    label: 'Team name',
    classNames: [],
  },
  {
    label: 'Power',
    classNames: [],
  },
];

const SimulatorTeams: React.FC<SimulatorTeamsType> = ({ teams }) => (
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
      {teams.map((team) => (
        <tr key={team.id}>
          <td className='flex items-center justify-center py-2'>
            <TeamLogo uid={team.uid}/>
          </td>
          <td className="px-2 py-3 whitespace-nowrap">
            <span className={'text-base font-semibold'}>{team.title}</span>
          </td>
          <td className="px-2 py-3 whitespace-nowrap">
            <span className={'text-sm'}>{team.power}</span>
          </td>
        </tr>
      ))}
    </tbody>
  </table>
);

export default SimulatorTeams;
