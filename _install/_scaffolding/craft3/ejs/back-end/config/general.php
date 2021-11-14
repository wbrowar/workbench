<?php
/**
 * General Configuration
 *
 * All of your system's general configuration settings go in here. You can see a
 * list of the available settings in vendor/craftcms/cms/src/config/GeneralConfig.php.
 */

use craft\helpers\App;

$isDev = App::env('ENVIRONMENT') === 'dev';
$isProd = App::env('ENVIRONMENT') === 'production';

return [
    // Global settings
    '*' => [
        'aliases' => [
            '@baseAssetPath' => getenv('BASE_ASSET_PATH'),
            '@baseAssetUrl' => getenv('BASE_ASSET_URL'),
            '@basePath' => getenv('BASE_PATH'),
            '@baseUrl' => getenv('BASE_URL'),
            '@baseCpUrl' => getenv('CP_BASE_URL') ?? getenv('BASE_URL'),
            '@livePreviewParam' => getenv('LIVE_PREVIEW_PARAM'),
            '@livePreviewUrl' => getenv('LIVE_PREVIEW_URL'),
        ],
        'baseUrl' => getenv('PRIMARY_SITE_URL'),
        'baseCpUrl' => getenv('CP_BASE_URL') ?? getenv('BASE_URL'),
        'cpTrigger' => '<%- install.cpTrigger %>',
        'defaultSearchTermOptions' => array(
            'subLeft' => true,
            'subRight' => true,
        ),
        'defaultWeekStartDay' => 1,
        'enableCsrfProtection' => true,
        'generateTransformsBeforePageLoad' => true,
        'isSystemLive' => getenv('IS_SYSTEM_LIVE') == 'true',
        'maxUploadFileSize' => 67108864, // 64M in binary bytes
        'omitScriptNameInUrls' => true,
        'securityKey' => getenv('SECURITY_KEY'),
        'usePathInfo' => true,
        'useProjectConfigFile' => true,
    ],

    // Production (live) environment
    'production' => [
        // Craft defined config settings
        'allowAdminChanges' => false,
        'allowUpdates' => false,
        'backupOnUpdate' => true,
        'devMode' => false,
        'enableTemplateCaching' => true,
    ],

    // Staging (pre-production) environment
    'staging' => [
        // Craft defined config settings
        'allowAdminChanges' => false,
        'allowUpdates' => false,
        'backupOnUpdate' => true,
        'devMode' => false,
        'disallowRobots' => true,
        'enableTemplateCaching' => true,
        'rememberedUserSessionDuration' => 31557600,
        'userSessionDuration' => 31557600,
    ],

    // Local (development) environment
    'dev' => [
        // Craft defined config settings
        'allowAdminChanges' => true,
        'allowUpdates' => true,
        'backupOnUpdate' => true,
        'devMode' => true,
        'disallowRobots' => true,
        'enableTemplateCaching' => false,
        'rememberedUserSessionDuration' => 31557600,
        'userSessionDuration' => 31557600,
    ],
];
