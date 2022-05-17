/* eslint no-unused-vars: off */
import $ from 'jquery';
// eslint-disable-next-line import/extensions
import 'focus-visible/dist/focus-visible.min.js';

// eslint-disable-next-line import/no-unresolved
import '@styles/styles';

interface RequireContext {
  keys(): string[];
  (id: string): any;
  <T>(id: string): T;
  resolve(id: string): string;
  id: string;
}

function requireAll(requireContext: RequireContext) {
  return requireContext.keys().map(requireContext);
}

requireAll(require.context('./components/', true, /^\.\/(?!.*((?:tests)|(?:\.d))).*\.((scss)|(jsx?)|(tsx?))$/));
requireAll(require.context('./pages/', true, /^\.\/(?!.*((?:tests)|(?:\.d))).*\.((scss)|(jsx?)|(tsx?))$/));
