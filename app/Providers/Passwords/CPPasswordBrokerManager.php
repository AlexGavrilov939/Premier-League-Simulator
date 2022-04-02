<?php

namespace App\Providers\Passwords;

use Closure;
use Illuminate\Auth\Passwords\TokenRepositoryInterface;
use Illuminate\Auth\Passwords\PasswordBrokerManager;
use Illuminate\Support\Str;

class CPPasswordBrokerManager extends PasswordBrokerManager
{
    /**
     * [Override]
     * Create a token repository instance based on the given configuration.
     *
     * @param  array $config
     *
     * @return TokenRepositoryInterface
     */
    protected function createTokenRepository(array $config)
    {
        $key = $this->app['config']['app.key'];

        if (Str::startsWith($key, 'base64:')) {
            $key = base64_decode(substr($key, 7));
        }

        $connection = $config['connection'] ?? null;

        return new CPDatabaseTokenRepository(
            $this->app['db']->connection($connection),
            $this->app['hash'],
            $config['table'],
            $key,
            $config['expire']
        );
    }
}