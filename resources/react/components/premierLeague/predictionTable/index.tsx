import { PageClassnamesType } from '@/layouts/default';
import { SimulatorSimulationType } from '@/pages/simulator/index/_includes/standings';
import React from 'react';
import TeamLogo, { TeamLogoSizeEnum } from '@/components/premierLeague/teamLogo';
import cx from 'classnames';

type PredictionTableType = PageClassnamesType & Pick<SimulatorSimulationType, 'predictions'>

const columns = [
  {
    label: 'Team',
    classNames: ['text-center w-20'],
  },
  {
    label: 'Percentage',
    classNames: ['text-center'],
  },
];
const teams = [
  {
    id: 1,
    title: 'Manchester',
    uid: 'man',
    percentage: 30,
  },
  {
    id: 2,
    title: 'Liv',
    uid: 'liv',
    percentage: 20,
  },
  {
    id: 3,
    title: 'Chel',
    uid: 'chel',
    percentage: 10,
  },
  {
    id: 4,
    title: 'Ars',
    uid: 'ars',
    percentage: 10,
  },
];

const PredictionTable: React.FC<PredictionTableType> = ({
  predictions = [],
  classNames = [],
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
        {predictions.map((item) => (
          <tr key={item.team.id}>
            <td className='flex items-center justify-center py-1'>
              <TeamLogo uid={item.team.uid} size={TeamLogoSizeEnum.SMALL} />
            </td>
            <td className="p-1 whitespace-nowrap text-center">
              <span className={'font-semibold text-sm'}>{item.chanceToWinPercentage}%</span>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  </div>
);

export default PredictionTable;
