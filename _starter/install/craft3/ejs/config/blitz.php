<?php

return [
    // All environments
    '*' => [
        'cacheFolderPath' => 'cache/blitz',
        'cachingEnabled' => true,
    ],

    // Live (production) environment
    'live'  => [
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