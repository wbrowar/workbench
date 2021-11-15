<?php
/**
 * Site Module module for Craft CMS 3.x
 *
 * Helper module for site-specific functionality.
 *
 * @link      https://wbrowar.com/
 * @copyright Copyright (c) 2021 Will Browar
 */

namespace modules\sitemodule\widgets;

use craft\webhooks\Plugin as Webhooks;

use Craft;
use craft\base\Widget;

/**
 * FEATURE: Webhook Deploy
 *
 * @author    Will Browar
 * @package   SiteModule
 * @since     1.0.0
 */
class WebhookDeploy extends Widget
{

    // Public Properties
    // =========================================================================

    /**
     * @var string
     */
//    public $message = 'Hello, world.';

    // Static Methods
    // =========================================================================

    /**
     * @inheritdoc
     */
    public static function displayName(): string
    {
        return Craft::t('site-module', 'Webhook Deploy');
    }

    /**
     * @inheritdoc
     */
//    public static function iconPath()
//    {
//        return Craft::getAlias("@modules/sitemodule/assetbundles/webhookdeploywidget/dist/img/WebhookDeploy-icon.svg");
//    }

    /**
     * @inheritdoc
     */
    public static function maxColspan()
    {
        return null;
    }

    // Public Methods
    // =========================================================================

    /**
     * @inheritdoc
     */
//    public function rules()
//    {
//        $rules = parent::rules();
//        $rules = array_merge(
//            $rules,
//            [
//                ['message', 'string'],
//                ['message', 'default', 'value' => 'Hello, world.'],
//            ]
//        );
//        return $rules;
//    }

    /**
     * @inheritdoc
     */
//    public function getSettingsHtml()
//    {
//        return Craft::$app->getView()->renderTemplate(
//            'site-module/widgets/WebhookDeploy_settings',
//            [
//                'widget' => $this
//            ]
//        );
//    }

    /**
     * @inheritdoc
     */
    public function getBodyHtml()
    {
        $user = Craft::$app->getUser()->getIdentity();
        $webhooks = Webhooks::getInstance()->getWebhookManager()->getAllWebhooks();

        return Craft::$app->getView()->renderTemplate(
            'site-module/widgets/WebhookDeploy_body',
            [
                'userCanEnableWebhooks' => $user->admin || $user->can('siteModuleEnableWebhooks'),
                'userCanTriggerWebhookDeploy' => $user->admin || $user->can('siteModuleTriggerWebhookDeploy'),
                'webhooks' => $webhooks,
                'widget' => $this,
            ]
        );
    }
}
