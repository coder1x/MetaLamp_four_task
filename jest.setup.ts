import $ from 'jquery';
import JQueryStatic from './node_modules/@types/jquery';

interface JQ extends Window {
  $?: JQueryStatic,
  jQuery?: JQueryStatic,
}

const windowJQ: JQ = window;
windowJQ.$ = $;
windowJQ.jQuery = $;
