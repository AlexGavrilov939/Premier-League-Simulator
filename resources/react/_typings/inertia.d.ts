import React from 'react';

/**
 * InertiaJS is missing type definitions for the Head component.
 * Here we define our own types for the component.
 *
 * @see https://github.com/inertiajs/inertia/issues/824
 * @see https://github.com/inertiajs/inertia/pull/855
 */
declare module '@inertiajs/inertia-react' {
    type HeadProps = {
        title?: string,
    }

    // eslint-disable-next-line no-unused-vars
    const Head: React.FC<HeadProps>;
}
