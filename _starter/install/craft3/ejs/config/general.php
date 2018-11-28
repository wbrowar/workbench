<?php
/**
 * General Configuration
 *
 * All of your system's general configuration settings go in here. You can see a
 * list of the available settings in vendor/craftcms/cms/src/config/GeneralConfig.php.
 */

return [
    // Global settings
    '*' => [
        'aliases' => [
            '@basePath' => realpath(dirname(__FILE__)) . getenv('BASE_PATH'),
            '@baseUrl' => getenv('BASE_URL'),
        ],
        'cacheDuration' => false,
        'cpTrigger' => '<%- install.cpTrigger %>',
        'defaultSearchTermOptions' => array(
            'subLeft' => true,
            'subRight' => true,
        ),
        'enableStyleInventory' => getenv('STYLE_INVENTORY') ?: false,
        'enableCsrfProtection' => true,
        'generateTransformsBeforePageLoad' => true,
        'omitScriptNameInUrls' => true,
        'securityKey' => getenv('SECURITY_KEY'),
        'siteUrl' => getenv('SITE_URL'),
        'usePathInfo' => true,
        'useProjectConfigFile' => true,
    ],

    // Production (live) environment
    'production' => [
        // Craft defined config settings
        'allowAdminChanges' => false,
        'allowUpdates' => false,
        'backupOnUpdate' => false,
        'devMode' => false,
        'enableTemplateCaching' => true,
    ],

    // Staging (pre-production) environment
    'staging' => [
        // Craft defined config settings
        'allowAdminChanges' => false,
        'allowUpdates' => false,
        'backupOnUpdate' => false,
        'devMode' => false,
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
        'enableTemplateCaching' => false,
        'rememberedUserSessionDuration' => 31557600,
        'userSessionDuration' => 31557600,
    ],
];
