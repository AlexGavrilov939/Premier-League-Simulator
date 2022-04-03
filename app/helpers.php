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
     * @param array $values
     * @param array $weights
     * @return mixed
     */
    function weighted_random(array $values, array $weights): mixed
    {
        $count = count($values);
        $i = 0;
        $n = 0;
        $num = mt_rand(0, array_sum($weights));
        while ($i < $count) {
            $n += $weights[$i];
            if ($n >= $num) {
                break;
            }
            $i++;
        }
        return $values[$i];
    }
}
