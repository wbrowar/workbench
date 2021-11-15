<?php
/**
 * Site Module module for Craft CMS 3.x
 *
 * Helper module for site-specific functionality.
 *
 * @link      https://wbrowar.com/
 * @copyright Copyright (c) 2021 Will Browar
 */

namespace modules\sitemodule\controllers;

use craft\elements\Entry;
use craft\webhooks\Plugin as Webhooks;

use Craft;
use craft\web\Controller;

/**
 * FEATURE: Webhook Deploy
 *
 * @author    Will Browar
 * @package   SiteModule
 * @since     1.0.0
 */
class WebhookDeployController extends Controller
{

    // Protected Properties
    // =========================================================================

    /**
     * @var    bool|array Allows anonymous access to this controller's actions.
     *         The actions must be in 'kebab-case'
     * @access protected
     */
    protected $allowAnonymous = ['index'];
//    protected $allowAnonymous = ['index', 'do-something'];

    // Public Methods
    // =========================================================================

    /**
     * @return mixed
     */
    public function actionIndex()
    {
        $result = 'Welcome to the WebhookDeployController actionIndex() method';

        return $result;
    }

    /**
     * @return mixed
     */
    public function actionUpdateWebhook()
    {
        $params = $this->request->getBodyParams();
        
        if ($params['id']) {
            $webhook = Webhooks::getInstance()->getWebhookManager()->getWebhookById($params['id']);
//            $webhookEnabled = $webhook->enabled;

            if (!empty($params['enable-webhook']) && $webhook ?? false) {
                $webhook->enabled = true;
                Webhooks::getInstance()->getWebhookManager()->saveWebhook($webhook);
            } elseif (!empty($params['disable-webhook']) && $webhook ?? false) {
                $webhook->enabled = false;
                Webhooks::getInstance()->getWebhookManager()->saveWebhook($webhook);
            } elseif (!empty($params['deploy-webhook']) && $webhook ?? false) {
                // TODO find a better way to trigger webhooks 🤦‍
                $triggerEntry = Entry::find()->uri('__home__')->one();
                if ($triggerEntry) {
//                    if (!$webhookEnabled) {
//                        $webhook->enabled = true;
//                        Webhooks::getInstance()->getWebhookManager()->saveWebhook($webhook);
//                    }
                    Craft::$app->getElements()->saveElement($triggerEntry);
//                    if (!$webhookEnabled) {
//                        $webhook->enabled = false;
//                        Webhooks::getInstance()->getWebhookManager()->saveWebhook($webhook);
//                    }
                }
            }
        }
        
        $this->redirectToPostedUrl(null,'dashboard');
    }
}
