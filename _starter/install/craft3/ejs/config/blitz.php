<?php

return [
    // All environments
    '*' => [
        'cacheFolderPath' => 'cache/blitz',
        'cachingEnabled' => true,
    ],

    // Production (live) environment
    'live' => [
        'cachingEnabled' => true,
    ],

    // Staging (pre-production) environment
    'staging'  => [
        'cachingEnabled' => false,
    ],

    // Local (development) environment
    'local'  => [
        'cachingEnabled' => false,
    ],
];