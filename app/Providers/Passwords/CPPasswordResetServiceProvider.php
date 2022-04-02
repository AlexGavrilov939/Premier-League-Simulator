<?php

namespace App\Providers\Passwords;

use Illuminate\Auth\Passwords\PasswordBrokerManager;
use Illuminate\Auth\Passwords\PasswordResetServiceProvider;

class CPPasswordResetServiceProvider extends PasswordResetServiceProvider
{
    /**
     * [Override]
     * Register the password broker instance.
     *
     * @return void
     */
    protected function registerPasswordBroker()
    {
        $this->app->singleton('auth.password', function ($app) {
            return new CPPasswordBrokerManager($app);
        });

        $this->app->bind('auth.password.broker', function ($app) {
            return $app->make('auth.password')->broker();
        });
    }
}