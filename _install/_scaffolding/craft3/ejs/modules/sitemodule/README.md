# Site Module module for Craft CMS 3.x

Helper module for site-specific functionality.

## Requirements

This module requires Craft CMS 3.0.27 or later.

## Installation

To install the module, follow these instructions.

First, you'll need to add the contents of the `app.php` file to your `config/app.php` (or just copy it there if it does not exist). This ensures that your module will get loaded for each request. The file might look something like this:
```
return [
    'modules' => [
        'site-module' => [
            'class' => \modules\sitemodule\SiteModule::class,
        ],
    ],
    'bootstrap' => ['site-module'],
];
```
You'll also need to make sure that you add the following to your project's `composer.json` file so that Composer can find your module:

    "autoload": {
        "psr-4": {
          "modules\\sitemodule\\": "modules/sitemodule/src/"
        }
    },

After you have added this, you will need to do:

    composer dump-autoload
 
 …from the project’s root directory, to rebuild the Composer autoload map. This will happen automatically any time you do a `composer install` or `composer update` as well.

## Using Site Module

### Twig Extensions

#### HTML Attributes
Based on a port from the [htmlAttributes Craft 2 plugin](https://github.com/timkelty/htmlattributes-craft), Twig Extensions have been added to help format `class`, `style` and other html attributes using clean markup.

##### `htmlattr` Filter
Format an object of attributes and groups classes and styles together.

```twig
{% set attrs = {
  class: ['myClass', 'myClass2'],
  style: {
    'background-image': "url('img.png')",
    'color': 'red',
  },
  'data-foo': {
    someKey: 'foo',
    otherKey: 'bar',
    myArray: ['foo', 'bar', 'baz'],
  },
  'data-bar': true,
  'data-baz': null,
  'data-qux': false,
} %}

<div {{ attrs|htmlattr }}></div>
```

Outputs

```html
<div
 class="myClass myClass2"
 style="background-image: url('img.png'); color: red"
 data-foo='{"someKey":"foo","otherKey":"bar","myArray":["foo","bar","baz"]}'
 data-bar
 data-baz
 ></div>
```

##### `attrAdd()` Function
The `attrAdd` function makes it easy to add classes and styles to an attributes array.

```twig
{# Add classes #}
{% set attrs = attrAdd(attrs, ['new_class', 'second_new_class'], 'class') %}

{# Add styles #}
{% set attrs = attrAdd(attrs, { 'opacity': '.5' }, 'style') %}

{# Add other attributes #}
{% set attrs = attrAdd(attrs, { 'foo': true, '@click': 'someVueFunction' }) %}
```

### IP Whitelisting
Allow only visitors that are logged in or visitors visiting from whitelisted IP addresses.

To set it up, start by adding the IP addresses to the `.env.php` file:

```php
    // Block a staging site from being visible outside of these IP addresses
    'WHITELISTED_IPS' => json_encode(['MY.IP.ADDRESS.HERE']),
```

Then add this code to your TWIG template (this is set up in the `_layout.twig` file by default):

```twig
{# Only check when in the 'staging' environment #}
{% do checkAccessByIp() %}

{# Specify which environment to check #}
{% do checkAccessByIp('dev', 'staging') %}
```

## Site Module Roadmap

Some things to do, and ideas for potential features:

* Release it

Brought to you by [Will Browar](https://wbrowar.com/)
