import './bootstrap';

import { InertiaProgress } from '@inertiajs/progress';
import { createInertiaApp } from '@inertiajs/inertia-react';
import { render } from 'react-dom';
import React from 'react';

const appName = window.document.getElementsByTagName('title')[0]?.innerText || 'Laravel';

type FlashDataType = {
  status: 'string',
  message: 'string',
};

export type PageDataType = {
  app?: {
    version: string,
  },
  flash?: FlashDataType,
}

createInertiaApp({
  title: (title) => `${title} - ${appName}`,
  resolve: (name) => require(`./pages/${name}`),
  setup({ el, App, props }) {
    return render(<App {...props} />, el);
  },
});

InertiaProgress.init({ color: '#7CAA63' });
