import React from 'react';
import arsenal from './images/arsenal.svg';
import chelsea from './images/chelsea.svg';
import cx from 'classnames';
import liverpool from './images/liverpool.svg';
import man from './images/man.svg';
import noImage from './images/no-image.svg';
import styles from './styles.module.scss';

const uidsMap = {
  man: man,
  liv: liverpool,
  chel: chelsea,
  ars: arsenal,
};

export enum TeamLogoSizeEnum {
  NORMAL,
  SMALL
}

type TeamLogoType = {
  uid?: string,
  size?: TeamLogoSizeEnum
}

const TeamLogo: React.FC<TeamLogoType> = ({
  uid,
  size = TeamLogoSizeEnum.NORMAL,
}) => (
  <div className={cx(
      'bg-gray-100 border shadow shadow-inner inline-block',
      {
        ['p-2']: size == TeamLogoSizeEnum.NORMAL,
        ['p-1.5']: size == TeamLogoSizeEnum.SMALL,
      },
      styles.logoWrapper,
  )}>
    <img src={uid && uidsMap[uid] || noImage} className={cx(
        'bg-white shadow-lg',
        {
          ['w-16 h-16 p-1.5']: size == TeamLogoSizeEnum.NORMAL,
          ['w-12 h-12 p-1']: size == TeamLogoSizeEnum.SMALL,
        },
        styles.logo,
    )} alt={'Team logo'}/>
  </div>
);

export default React.memo(TeamLogo);
