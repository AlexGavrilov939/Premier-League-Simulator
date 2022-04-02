import { PageChildrenType, PageClassnamesType } from '@/layouts/default';
import React from 'react';
import cx from 'classnames';

export type SimulationDataType = {
  teams: any[],
  games: any[],
  standings: any[],
  predictions: any[],
}

export const simulationDataPattern: SimulationDataType = {
  teams: [],
  games: [],
  standings: [],
  predictions: [],
};

export enum SimulationStepEnum {
  TEAMS,
  FIXTURES,
  STANDINGS
}

export const SimulationTitles = {
  [SimulationStepEnum.TEAMS]: 'Tournament Teams',
  [SimulationStepEnum.FIXTURES]: 'Fixtures',
  [SimulationStepEnum.STANDINGS]: 'Simulation',
};

type LeagueContentType = PageChildrenType & PageClassnamesType;

const LeagueContent: React.FC<LeagueContentType> = ({
  children,
  classNames = [],
}) => (
  <div className={cx('p-3', classNames)}>
    {children}
  </div>
);

export default React.memo(LeagueContent);
