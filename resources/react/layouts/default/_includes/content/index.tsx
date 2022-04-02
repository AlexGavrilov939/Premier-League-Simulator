import { PageChildrenType, PageClassnamesType } from '@/layouts/default';
import React from 'react';
import cx from 'classnames';

type ContentType = PageChildrenType & PageClassnamesType;

const Content: React.FC<ContentType> = ({
  children,
  classNames,
}) => (
  <main className={cx('mb-auto mt-2 sm:mt-3 flex-1 m:px-6 lg:px-8 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full', classNames)}>
    {children}
  </main>
);

export default React.memo(Content);
