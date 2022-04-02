import Loader from '@/components/loader';
import React, { ReactElement, SyntheticEvent } from 'react';
import cx from 'classnames';
import styles from './styles.module.scss';

export enum ButtonBehaviorTypeEnum {
  DEFAULT,
  ERROR,
}

type ButtonProps = {
    type?: 'submit' | 'reset' | 'button' | undefined,
    behaviorType?: ButtonBehaviorTypeEnum,
    className?: string,
    processing?: boolean,
    loading?: boolean,
    children: string | ReactElement[] | React.ReactNode,
    icon?: ReactElement,
    onClick?: (event: SyntheticEvent) => void
}

const Button: React.FC<ButtonProps> = ({
  type = 'submit',
  behaviorType = ButtonBehaviorTypeEnum.DEFAULT,
  className = '',
  processing,
  children,
  icon,
  onClick = () => {},
  loading = false,
}) => (
  <button
    type={type}
    className={cx(
        `flex items-center px-2 sm:px-3 py-1.5 sm:py-2 border border-transparent rounded-md` +
        ` font-semibold text-sm text-white uppercase` +
        `ease-in-out duration-150 ${
          processing && 'opacity-25'
        } ${className || ''}`, {
          [styles.button]: true,
          ['cursor-not-allowed']: loading,
          ['bg-blue-500 hover:bg-blue-400 active:bg-blue-500']: behaviorType == ButtonBehaviorTypeEnum.DEFAULT,
          ['bg-red-500 hover:bg-red-400 active:bg-red-500']: behaviorType == ButtonBehaviorTypeEnum.ERROR,
          'transition': ! processing,
        })
    }
    disabled={processing}
    onClick={onClick}
  >
    {loading && <div className='w-5 h-5 mr-2'>
      <Loader />
    </div>}
    {icon && ! loading && <div className='w-5 h-5 mr-2'>
      {icon}
    </div>}
    {children}
  </button>
);

export default React.memo(Button);
