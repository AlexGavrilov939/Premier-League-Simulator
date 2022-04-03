import { PageDataType } from '@/app';
import { StatusCodes } from 'http-status-codes';
import { getApiInstance } from '@/services/apiService';
import Button, { ButtonBehaviorTypeEnum } from '@/components/button';
import DefaultLayout from '@/layouts/default';
import LeagueContent, {
  SimulationDataType,
  SimulationStepEnum,
  SimulationTitles,
  simulationDataPattern,
} from '@/components/premierLeague/content';
import LeagueHeader from '@/components/premierLeague/header';
import Loader from '@/components/loader';
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import SimulatorGames from '@/pages/simulator/index/_includes/games';
import SimulatorStandings from '@/pages/simulator/index/_includes/standings';
import SimulatorTeams from '@/pages/simulator/index/_includes/teams';
import route from 'ziggy-js';

type IndexPageType = PageDataType

const Index: React.FC<IndexPageType> = ({
  app,
  flash,
}) => {
  const [data, setData] = useState<SimulationDataType>(simulationDataPattern);
  const [loading, setLoading] = useState(true);

  const fetchSimulationData = async () => {
    let nextData = { ...simulationDataPattern };
    try {
      const preparedRoute = route('simulator.loadData');
      const { data, status } = await getApiInstance().post(preparedRoute);
      if (status === StatusCodes.OK) {
        nextData = { ...simulationDataPattern, ...data };
      }
    } catch (error: any) {
      console.error(error);
    }

    return nextData;
  };

  const regenerateFixturesHandler = useCallback(async () => {
    setLoading(true);
    let nextData = { ...simulationDataPattern };
    try {
      const preparedRoute = route('simulator.regenerateFixtures');
      const { data: responseData, status } = await getApiInstance().post(preparedRoute);
      if (status === StatusCodes.OK) {
        nextData = { ...data, games: responseData.games };
      }
    } catch (error: any) {
      console.error(error);
    }
    setData(nextData);
    setLoading(false);
  }, [data, setData]);

  const resetDataHandler = useCallback(async () => {
    setLoading(true);
    let nextData = { ...simulationDataPattern };
    try {
      const preparedRoute = route('simulator.resetData');
      const { status } = await getApiInstance().post(preparedRoute);
      if (status === StatusCodes.OK) {
        nextData = { ...simulationDataPattern, teams: data.teams };
      }
    } catch (error: any) {
      console.error(error);
    }
    setData(nextData);
    setLoading(false);
  }, [data, setData]);

  const generateStandingsHandler = useCallback(async () => {
    setLoading(true);
    let nextData = { ...simulationDataPattern };
    try {
      const preparedRoute = route('simulator.generateStandings');
      const { data: responseData, status } = await getApiInstance().post(preparedRoute);
      if (status === StatusCodes.OK) {
        nextData = { ...data, standings: responseData.standings };
      }
    } catch (error: any) {
      console.error(error);
    }
    setData(nextData);
    setLoading(false);
  }, [data, setData]);

  const resetStandingsHandler = useCallback(async () => {
    // setLoading(true);
    let nextData = { ...simulationDataPattern };
    try {
      const preparedRoute = route('simulator.resetStandings');
      const { data: responseData, status } = await getApiInstance().post(preparedRoute);
      if (status === StatusCodes.OK) {
        nextData = { ...data,
          games: responseData.games,
          standings: responseData.standings,
          predictions: responseData.predictions,
        };
      }
    } catch (error: any) {
      console.error(error);
    }
    setData(nextData);
    // setLoading(false);
  }, [data, setData]);

  const simulateWeekGamesHandler = useCallback(async (weekNum = null) => {
    // setLoading(true);
    let nextData = { ...simulationDataPattern };
    try {
      const preparedRoute = route('simulator.simulateWeekGames');
      const { data: responseData, status } = await getApiInstance().post(preparedRoute, {
        week_num: weekNum,
      });
      if (status === StatusCodes.OK) {
        nextData = { ...data,
          games: responseData.games,
          standings: responseData.standings,
          predictions: responseData.predictions,
        };
      }
    } catch (error: any) {
      console.error(error);
    }
    setData(nextData);
    // setLoading(false);
  }, [data, setData]);

  const currentSimulationStep: SimulationStepEnum = useMemo(() => {
    if (data.standings.length > 0) {
      return SimulationStepEnum.STANDINGS;
    } else if (data.games.length > 0) {
      return SimulationStepEnum.FIXTURES;
    } else {
      return SimulationStepEnum.TEAMS;
    }
  }, [data]);

  useEffect(() => {
    fetchSimulationData()
        .then((nextData) => setData(nextData))
        .finally(() => setLoading(false));
  }, []);

  return (<DefaultLayout
    app={app}
    flash={flash}
  >
    <>
      {loading && <div className='h-full flex items-center justify-center'>
        <Loader classNames={'text-blue-300 w-14 h-14'} />
      </div>}
      {! loading && <>
        <div className={'flex flex-col bg-white shadow-sm rounded-lg'}>
          <LeagueHeader title={SimulationTitles[currentSimulationStep] || ''}/>
          <LeagueContent>
            <>
              {currentSimulationStep == SimulationStepEnum.TEAMS && <SimulatorTeams teams={data.teams} />}
              {currentSimulationStep == SimulationStepEnum.FIXTURES && <SimulatorGames games={data.games} />}
              {currentSimulationStep == SimulationStepEnum.STANDINGS &&
                <SimulatorStandings
                  standings={data.standings}
                  games={data.games}
                  predictions={data.predictions}
                  simulateGameHandler={simulateWeekGamesHandler}
                />
              }
            </>
          </LeagueContent>
        </div>
        <div className='flex justify-between mt-3'>
          <div className={'flex'}>
            {currentSimulationStep == SimulationStepEnum.TEAMS && <Button
              className={'mx-1'}
              onClick={regenerateFixturesHandler}>
              Generate fixtures
            </Button>}
            {currentSimulationStep == SimulationStepEnum.FIXTURES && <Button
              className={'mx-1'}
              onClick={generateStandingsHandler}>
                Start simulation
            </Button>}
            {currentSimulationStep == SimulationStepEnum.STANDINGS && <Button
              className={'mx-1'}
              onClick={() => simulateWeekGamesHandler()}>
                Simulate all weeks
            </Button>}
          </div>
          <div className={'flex'}>
            {currentSimulationStep == SimulationStepEnum.FIXTURES && <Button
              onClick={regenerateFixturesHandler}
              className={'mx-1'}
              behaviorType={ButtonBehaviorTypeEnum.ERROR}>
                Reset fixtures
            </Button>}
            {currentSimulationStep == SimulationStepEnum.STANDINGS && <Button
              behaviorType={ButtonBehaviorTypeEnum.ERROR}
              className={'mx-1'}
              onClick={resetStandingsHandler}>
                Reset standings
            </Button>}
            {currentSimulationStep != SimulationStepEnum.TEAMS && <Button
              behaviorType={ButtonBehaviorTypeEnum.ERROR}
              className={'mx-1'}
              onClick={resetDataHandler}>
                Reset data
            </Button>}
          </div>
        </div>
      </>}
    </>
  </DefaultLayout>);
};

export default Index;
