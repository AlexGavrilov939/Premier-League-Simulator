<?php

if (! function_exists('getFlashMessage')) {
    /**
     * @return mixed
     * @throws \Psr\Container\ContainerExceptionInterface
     * @throws \Psr\Container\NotFoundExceptionInterface
     */
    function getFlashMessage(): mixed
    {
        return session()->get('message');
    }
}

if (! function_exists('setFlashMessage')) {
    /**
     * @param $value
     */
    function setFlashMessage($value): void
    {
        session()->flash('message', $value);
    }
}

if (! function_exists('logs_path')) {
    /**
     * Get the path to the logs folder.
     * @param string $filename
     * @return string
     */
    function logs_path(string $filename = 'laravel.log'): string
    {
        $logsFolder = env('LOGS_PATH', storage_path('logs'));
        return "{$logsFolder}/{$filename}";
    }
}

if (! function_exists('weighted_random')) {
    /**
     * Get the path to the logs folder.
     * @param $min
     * @param $max
     * @param $gamma
     * @return string
     */
    function weighted_random($min, $max, $gamma): string
    {
        $offset = $max - $min+1;
        return floor($min + pow(lcg_value(), $gamma) * $offset);
    }
}
