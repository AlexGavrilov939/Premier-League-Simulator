<!DOCTYPE html>
<html lang="{{ str_replace('_', '-', app()->getLocale()) }}">
    <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1">
        <meta name="csrf-token" content="{{ csrf_token() }}">

        <title inertia>{{ config('app.name', 'Laravel') }}</title>

        <!-- Fonts -->
        <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Nunito:wght@400;600;700&display=swap">

        <!-- Styles -->
        <link rel="stylesheet" href="{{ mix('build/css/app.css') }}">

        <!-- Scripts -->
        @routes
        <script src="{{ mix('build/js/app.js') }}" defer></script>
    </head>
    <body class="font-sans subpixel-antialiased bg-gray-100 text-gray-600">
        @inertia
    </body>
</html>
