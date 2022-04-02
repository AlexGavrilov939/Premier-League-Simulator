import React from 'react';
import logo from './images/insider-logo.webp';

type InsiderLogoType = {
  version?: string
}

const versionLabelClasses = 'text-xs bg-blue-500 text-white whitespace-nowrap rounded-lg m-0 ml-1 px-1 py-0.5';

const InsiderLogo: React.FC<InsiderLogoType> = ({ version }) => (
  <div className='flex items-center divide-x-2 divide-solid divide-opacity-20 divide-gray-500'>
    <img src={logo} className='w-20 sm:w-28 h-auto max-h-full mr-2' />
    <div className='pl-2'>
      <span className='text-sm sm:text-base lg:text-lg font-semibold'>
        Premier League Simulator
      </span>
      {version && <span className={versionLabelClasses}>
        {version}
      </span>}
    </div>
  </div>
);

export default React.memo(InsiderLogo);
