<?php

namespace App\Http\Middleware;

use Closure;

class AjaxRequest
{
    /**
     * @param $request
     * @param \Closure $next
     * @return mixed
     */
    public function handle($request, Closure $next)
    {
        // Check if the route is an ajax request only route
        if (! $request->ajax()) {
            abort(405, 'Unauthorized action.');
        }

        return $next($request);
    }
}