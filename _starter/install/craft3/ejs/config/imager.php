<?php

return [
    // All environments
    '*' => [
        'imagerSystemPath' => '@webroot/resized/',
        'imagerUrl' => '/resized/',
    ],
    'staging' => [
        'optimizers' => ['mozjpeg', 'gifsicle', 'optipng'],
        'useCwebp' => true,
    ],
    'live' => [
        'optimizers' => ['mozjpeg', 'gifsicle', 'optipng'],
        'useCwebp' => true,
    ],
];