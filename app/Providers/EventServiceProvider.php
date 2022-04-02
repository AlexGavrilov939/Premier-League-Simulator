<?php

namespace App\Providers;

use App\Events\EmailConfirmationRequestedEvent;
use App\Events\ProxyHostChangedEvent;
use App\Events\ProxyHostCreatedEvent;
use App\Listeners\ProxyHostCreatedListener;
use App\Listeners\ProxyHostStatusChangedListener;
use App\Listeners\NewAccountCreatedListener;
use App\Listeners\EmailVerificationSentListener;
use Illuminate\Auth\Events\Registered;
use Illuminate\Foundation\Support\Providers\EventServiceProvider as ServiceProvider;

class EventServiceProvider extends ServiceProvider
{
    /**
     * The event listener mappings for the application.
     *
     * @var array
     */
    protected $listen = [
        Registered::class => [
            NewAccountCreatedListener::class,
        ],
        EmailConfirmationRequestedEvent::class => [
            EmailVerificationSentListener::class,
        ],
        ProxyHostCreatedEvent::class => [
            ProxyHostCreatedListener::class
        ],
        ProxyHostChangedEvent::class => [
            ProxyHostStatusChangedListener::class
        ]
    ];

    /**
     * Register any events for your application.
     *
     * @return void
     */
    public function boot()
    {
        //
    }
}
