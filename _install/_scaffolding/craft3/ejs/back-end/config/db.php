<?php
/**
 * Craft 3 Multi-Environment
 * Efficient and flexible multi-environment config for Craft 3 CMS
 *
 * $_ENV constants are loaded by craft3-multi-environment from .env.php via
 * ./web/index.php for web requests, and ./craft for console requests
 *
 * @author    nystudio107
 * @copyright Copyright (c) 2017 nystudio107
 * @link      https://nystudio107.com/
 * @package   craft3-multi-environment
 * @since     1.0.5
 * @license   MIT
 */

use craft\helpers\App;

/**
 * Database Configuration
 *
 * All of your system's database configuration settings go in here.
 * You can see a list of the default settings in src/config/DbConfig.php
 */

return [

    // All environments
    '*' => [
        'dsn' => App::env('DB_DSN') ?: null,
        'driver' => App::env('DB_DRIVER'),
        'server' => App::env('DB_SERVER'),
        'port' => App::env('DB_PORT'),
        'database' => App::env('DB_DATABASE'),
        'user' => App::env('DB_USER'),
        'password' => App::env('DB_PASSWORD'),
        'schema' => App::env('DB_SCHEMA'),
        'tablePrefix' => App::env('DB_TABLE_PREFIX'),
        'charset' => 'utf8',
        'collation' => 'utf8_unicode_ci',
    ],
];