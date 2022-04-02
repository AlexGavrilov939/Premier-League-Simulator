<?php

namespace App\Http\Middleware;

use Closure;
use HTMLPurifier;
use HTMLPurifier_Config;
use Illuminate\Http\Request;

class EscapeTags
{
    /**
     * Handle an incoming request.
     *
     * @param  Request  $request
     * @param  \Closure  $next
     * @return mixed
     */
    public function handle(Request $request, Closure $next): mixed
    {
        $input = $request->all();
        array_walk_recursive($input, function(&$input) {
            $input = esc($input);
        });
        $request->merge($input);
        return $next($request);
    }
}
