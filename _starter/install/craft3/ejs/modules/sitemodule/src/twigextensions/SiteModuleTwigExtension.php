<?php
/**
 * Site Module module for Craft CMS 3.x
 *
 * Helper module for site-specific functionality.
 *
 * @link      https://wbrowar.com/
 * @copyright Copyright (c) 2018 Will Browar
 */

namespace modules\sitemodule\twigextensions;

use craft\helpers\Template;
use craft\helpers\UrlHelper;
use modules\sitemodule\SiteModule;

use Craft;
use yii\BaseYii;

/**
 * Twig can be extended in many ways; you can add extra tags, filters, tests, operators,
 * global variables, and functions. You can even extend the parser itself with
 * node visitors.
 *
 * http://twig.sensiolabs.org/doc/advanced.html
 *
 * @author    Will Browar
 * @package   SiteModule
 * @since     1.0.0
 */
class SiteModuleTwigExtension extends \Twig_Extension
{
    // Public Methods
    // =========================================================================

    /**
     * Returns the name of the extension.
     *
     * @return string The extension name
     */
    public function getName()
    {
        return 'Site Module';
    }

    /**
     * Returns an array of Twig filters, used in Twig templates via:
     *
     *      {{ 'something' | someFilter }}
     *
     * @return array
     */
    public function getFilters()
    {
        return [
            new \Twig_SimpleFilter('htmlattr', [$this, 'renderHtmlAttributes']),
        ];
    }

    /**
     * Returns an array of Twig functions, used in Twig templates via:
     *
     *      {% set this = someFunction('something') %}
     *
     * @return array
     */
    public function getFunctions()
    {
        return [
            new \Twig_SimpleFunction('attrAdd', [$this, 'attrAdd']),
            new \Twig_SimpleFunction('checkAccessByIp', [$this, 'checkAccessByIp']),
        ];
    }

    /**
     * Formats HTML attributes and makes it easy to override and add classes and other attributes
     *
     * @param array $attrs
     * @param array $newItems
     * @param string $group
     *
     * @return array
     */
    public function attrAdd(array $attrs, array $newItems, string $group = null):array
    {
        switch ($group) {
            case 'class':
                $attrs['class'] = ($attrs['class'] ?? false) ? array_merge($attrs['class'], $newItems) : $newItems;
                break;
            case 'style':
                $attrs['style'] = ($attrs['style'] ?? false) ? array_merge($attrs['style'], $newItems) : $newItems;
                break;
            default:
                $attrs = array_merge($attrs, $newItems);
        }

        return $attrs;
    }

    /**
     * Allow only visitors that are logged in or visitors visiting from whitelisted IP addresses
     *
     * @param array $attrs
     *
     * @return mixed
     */
    public function checkAccessByIp(array $environments = ['staging'])
    {
        $accessGranted = !(in_array(getenv('CRAFTENV_CRAFT_ENVIRONMENT'), $environments) && (getenv('CRAFTENV_WHITELISTED_IPS') ?? false));

        if (!$accessGranted) {
            if (!Craft::$app->getUser()->getIsGuest()) {
                // Allow access for logged in users
                $accessGranted = true;
            } else {
                // Allow access for users that visit the site from an IP address in CRAFTENV_WHITELISTED_IPS, in the env.php file
                $accessGranted = in_array(Craft::$app->getRequest()->getUserIP(), json_decode(getenv('CRAFTENV_WHITELISTED_IPS')));
            }
        }

        // If user cannot access the page, send them to the 503
        if (!$accessGranted && !in_array(Craft::$app->getRequest()->getUrl(), ['/404', '/503'])) {
            return BaseYii::$app->getResponse()->redirect(UrlHelper::url('503'));
        }
    }

    /**
     * Formats HTML attributes and makes it easy to override and add classes and other attributes
     *
     * @param array $attrs
     *
     * @return string
     */
    public function renderHtmlAttributes(array $attrs):string
    {
        // Ported from https://github.com/timkelty/htmlattributes-craft
        $str = trim(implode(' ', array_map(function($attrName) use ($attrs) {
            $attrVal = $attrs[$attrName];
            $quote = '"';

            if (is_null($attrVal) || $attrVal === true) {
                return $attrName;
            } elseif($attrVal === false) {
                return '';
            } elseif(is_array($attrVal)) {
                switch ($attrName) {
                    case 'class':
                        $attrVal = implode(' ', array_filter($attrVal));
                        break;

                    case 'style':
                        array_walk($attrVal, function(&$val, $key) {
                            $val = $key . ': ' . $val;
                        });
                        $attrVal = implode('; ', $attrVal) . ';';
                        break;

                    // Default to json, for data-* attributes
                    default:
                        $quote = '\'';
                        $attrVal = json_encode($attrVal);
                        break;
                }
            } else {
                return $attrName . '="' . $attrVal . '"';
            }

            return $attrName . '=' . $quote . $attrVal . $quote;
        }, array_keys($attrs))));

        return Template::raw($str);
    }
}
