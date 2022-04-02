import { PageClassnamesType } from '@/layouts/default';
import React from 'react';
import cx from 'classnames';
import githubIcon from './images/github-icon2.svg';
import linkedInIcon from './images/linkedin-icon.png';

type FooterType = PageClassnamesType;

const linkedInLink = 'https://www.linkedin.com/in/alex-gavrilov-a3787592/';
const githubLink = 'https://github.com/AlexGavrilov939';

const Footer: React.FC<FooterType> = ({ classNames }) => (
  <>
    <footer className={cx(
        'max-w-7xl mx-auto mt-1 sm:mt-2 lg:mt-3 sm:px-6 lg:px-8 py-2 sm:py-3 flex flex-wrap sm:flex-row',
        'flex-col-reverse items-center justify-between w-full', classNames,
    )}>
      <div className="flex items-center divide-x-2 divide-solid divide-opacity-30 divide-white">
        <span className={'pr-3 text-sm sm:text-sm text-white'}>&copy;&nbsp;2022&nbsp;Alex Gavrilov</span>
        <div className={'pl-3 flex items-center gap-3'}>
          <a
            href={linkedInLink}
            className='block cursor-pointer hover:opacity-80'
            target='_blank'
            rel="noreferrer"
          >
            <img src={linkedInIcon} className={'w-5 h-5'} alt={'LinkedIn'}/>
          </a>
          <a
            href={githubLink}
            className='block cursor-pointer hover:opacity-80'
            target='_blank'
            rel="noreferrer"
          >
            <img src={githubIcon} className={'w-5 h-5'} alt={'Github'}/>
          </a>
        </div>
      </div>
    </footer>
  </>
);

export default React.memo(Footer);
