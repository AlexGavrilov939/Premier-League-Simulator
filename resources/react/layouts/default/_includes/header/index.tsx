import { Link } from '@inertiajs/inertia-react';
import { PageChildrenType, PageClassnamesType } from '@/layouts/default';
import { PageDataType } from '@/app';
import InsiderLogo from '@/components/insiderLogo';
import React from 'react';
import cx from 'classnames';
import responsiveIcon from './images/responsive_icon.svg';
import route from 'ziggy-js';

type HeaderType = PageChildrenType & PageClassnamesType & Pick<PageDataType, 'app'>;

const Header: React.FC<HeaderType> = ({ app, classNames }) => (
  <nav className={cx('bg-white border-b border-gray-100 shadow', classNames)}>
    <div className='px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto'>
      <div className="flex items-center justify-between">
        <div className='py-2 flex items-center'>
          <Link href={route('simulator.index')}>
            <InsiderLogo version={app?.version} />
          </Link>
        </div>
        <img src={responsiveIcon} className='w-14 h-14 hidden lg:block' />
      </div>
    </div>
  </nav>
);

export default React.memo(Header);
