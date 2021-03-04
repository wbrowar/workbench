<?php

return [
    // All environments
    '*' => [
        'cacheFolderPath' => 'cache/blitz',
        'cachingEnabled' => true,
    ],

    // Production (live) environment
    'production' => [
        'cachingEnabled' => true,
    ],

    // Staging (pre-production) environment
    'staging'  => [
        'cachingEnabled' => false,
    ],

    // Local (development) environment
    'dev'  => [
        'cachingEnabled' => false,
    ],
];