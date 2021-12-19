# MetaLamp four task
fourth test task from MetaLamp.

Range Slider Fox is an easy and simple range slider  written in TypeScript as JQUERY plugin

***

* Version: 1.0
* <a href="https://plugins.su/">Demo page</a>
* <a href="https://plugins.su/RangeSliderFox.zip">Download ZIP</a>

You can configure range slider as you need in the demonstration Panel and copy the configuration code from the column "Config code" by clicking "Copy code" button.
Just don't forget to change the value inside еру parenthesis $(...).


## Description:

* Adaptive and accessible design.
* Possibility of keyboard and touch control.
* Skin support (you can fully change appearance of the slider using css).
* Has 4 built-in themes.
* High performance because of thoughtful architecture.
* Cross-browser.
* Vertical view is supported.

## Key features:

* Any amount of the sliders in the same page without conflicts and significant performance issues.
* Negative and fractional values are supported.
* Possibility to set custom step or jump from value to value of the grid.
* Possibility to switch off the elements of user interface.
* Postfixes and prefixes for you values.
* Dot sets its value in the value property if the slider is initialized on an input element.
* Configuration and manipulation via data-attributes is supported.
* You can block work of the slider.
* You can subscribe and unsubscribe events of the slider using its API (onStart, onChange, onReset, onUpdate).
* The slider supports external methods (renew, reset, destroy).
* The grid view is adapted on change of the slider width, which makes it fully adaptive.
* You can change the view of the slider any time: vertical or horizontal.
* Code of the plugin is compatible with ES5.

## Dependencies:
* <a href="http://jquery.com/" target="_blank">jQuery 1.2.x+</a>


## Usage:

Add the following libraries to the page:
* jQuery
* rangeSliderFox.js

Add the following stylesheets to the page:
* rangeSliderFox.css


## Initialisation:

```html
<input class="rslider__fox"  value="">
``` 

```javascript
$('.rslider__fox').RangeSliderFox({
    type: 'double',
    theme: 'fox',
    min: -120,
    max: 800,
    to: 500,
    from: 200,
    bar: true,
    tipMinMax: true,
    tipFromTo: true,
    grid: true,
    gridSnap: false,
    gridNum: 40,
    onStart: (data) => {
      console.log(data.type);
      console.log(data.orientation); 
      console.log(data.theme);
      console.log(data.min);
      console.log(data.max);
      console.log(data.from);
      console.log(data.to);
      console.log(data.step);
      console.log(data.keyStepOne);
      console.log(data.keyStepHold);
      console.log(data.bar);
      console.log(data.tipPrefix);
      console.log(data.tipPostfix);
      console.log(data.tipMinMax);
      console.log(data.tipFromTo);
      console.log(data.grid);
      console.log(data.gridSnap);
      console.log(data.gridNum);
      console.log(data.gridStep);
      console.log(data.gridRound);
      console.log(data.disabled);
    },
    onChange:(data) => {
      console.log(data);
    },
    onUpdate:(data) => {
      console.log(data);
    },
    onReset:(data) => {
      console.log(data);
    }
})
``` 

## Usage API:

```javascript
const obj = $(dom).RangeSliderFox({}).data('RangeSliderFox');

// This piece of code will change range values and set the dot on position 350.
obj.update({
min:0,
max:600,
from:350
})

// unsubscribe from events
obj.update({
  onStart:null,
  onChange:null,
  onUpdate:null,
  onReset:null
})


obj.reset()

// reset - will reset all the setup to the values which were 
// passed on initialization or will take default values

obj.destroy() 

// destroy - will destroy slider instance, DOM-elements and all related events.

``` 

## Settings:

| Option | Data-Attr | Default value (possible values) | Type | Description |
| --- | --- | --- | --- | --- |
| type | data-type | 'single' ('double') | string | Dot type (single or double) |
| orientation | data-orientation | 'horizontal' ('vertical') | string | slider orientation (vertical or horizontal) |
| theme | data-theme | 'base' ('fox' , 'dark', 'classic') | string | Pass the name of the theme. CSS-selector should have name like .rs-[name] (e.g. .rs-base) |
| min | data-min | 0 (-n, n.n..) | number | Minimal value of the range |
| max | data-max | 10 (-n, n.n..) | number | Maximal value of the range |
| to | data-to | 2 (-n, n.n..) | number | Second dot position |
| from | data-from | 1 (-n, n.n..) | number | First dot position |
| step | data-step | 0 (n, n.n.. <= max-min) | number | Step of the dot mooving |
| keyStepOne | data-key-step-one | 0 (max-min) | number | Step of the dot mooving on keyboard key single pressing |
| keyStepHold | data-key-step-hold | 0 (max-min) | number | Step of the dot mooving on keyboard key holding |
| bar | data-bar | false | boolean | Progrees-bar view (shown or hidden) |
| tipPrefix | data-tip-prefix | '' (char…) | string | Prefix for hints (15 characters maximum) |
| tipPostfix | data-tip-postfix | '' (char…) | string | Postfix for hints (15 characters maximum) |
| tipMinMax | data-tip-min-max | true | boolean | MinMax hints view (on or off) |
| tipFromTo | data-tip-from-to | true | boolean | FromTo hints view (on or off) |
| grid | data-grid | false | boolean | Scale view (on or off) |
| gridSnap | data-grid-snap | false | boolean | Dot can stop between scale marks (yes or no) |
| gridNum | data-grid-num | 0 (n, n.n..) | number | Amount of intervals the scale is split into |
| gridStep | data-grid-step | 0 (n, n.n..) | number | Amount of steps in the interval |
| gridRound | data-grid-round | 0 (n) | number | Fractional rounding |
| disabled | data-disabled | false | boolean | Slider enabled or disabled |
| onStart | - | null | Function | Call a callback function after the first start of the plugin and pass an object of current configuration data as an argument |
| onChange | - | null | Function | Call a callback function after each user’s interaction with the slider and pass an object of current configuration data as an argument |
| onUpdate | - | null | Function | Call a callback function after “update”  method calling and pass an object of current configuration data as an argument |
| onReset | - | null | Function | Call a callback function after “reset”  method calling and pass an object of current configuration data as an argument |

## details

* only one of values gridNum or gridStep can be set for scale. If both of them are set, gridStep will be ignored

* gridSnap is ignored if one of parameters step, keyStepOne, keyStepHold is set

* step is ignored while keyboard controlling if one of parameters keyStepOne, keyStepHold is set


## Setup and Scripts ( build the project, start, testing, production)

* Node version v14.18.1

* Install dependencies:
  ```
  npm i
  ```
* Start dev server:
  ```
  npm start
  go to http://localhost:8080/
  ```

* On the production server create the bundle files
  ```
  npm run build
  ```

* Building only the plugin 
  ```
  npm run plugin
  ```

* Plugin testing:
  ```
  npm run test
  ```


## Plugin Architecture:

* Architecture is based on MVC using Observer pattern.

* UML class diagram:
![readme](_tmp/UML.png)
* <a href="https://plugins.su/UML.png">UML full-size image view </a>
* <a href="https://github.com/coder1x/readme/blob/master/_tmp/UML.drawio">UML class diagram (drawio)</a>