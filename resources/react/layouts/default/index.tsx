import { PageDataType } from '@/app';
import Content from './_includes/content';
import Footer from './_includes/footer';
import Header from './_includes/header';
import React from 'react';
import cx from 'classnames';
import styles from './styles.module.scss';

export type PageChildrenType = {
  children?: React.ReactChild | React.ReactChild[]
}

export type PageClassnamesType = {
  classNames?: string[] | string
};

export type DefaultLayoutType = PageDataType & PageChildrenType & {
  errors?: string[],
}

export type DefaultLayoutChildType = PageDataType;

const DefaultLayout: React.FC<DefaultLayoutType> = ({
  app,
  children,
  errors,
}) => (
  <div className={cx('flex flex-col h-screen justify-between bg-gray-100 text-gray-600', styles.bg)}>
    <Header app={app} />
    <Content>
      {children}
    </Content>
    <Footer />
  </div>
);

export default DefaultLayout;
