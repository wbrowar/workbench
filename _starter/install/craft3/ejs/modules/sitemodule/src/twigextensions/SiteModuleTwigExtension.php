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
use modules\sitemodule\SiteModule;

use Craft;

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
//            new \Twig_SimpleFunction('addToArray', [$this, 'addToArray']),
        ];
    }

    /**
     * Formats HTML attributes and makes it easy to override and add classes and other attributes
     *
     * @param null $attrs
     *
     * @return array
     */
    public function renderHtmlAttributes($attrs)
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
