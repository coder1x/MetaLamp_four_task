import '@styles/styles';
// eslint-disable-next-line no-unused-vars
import $ from 'jquery';
import 'focus-visible/dist/focus-visible.min.js';

function requireAll(requireContext: any) {
  return requireContext.keys().map(requireContext);
}

requireAll(require.context('./components/', true, /^\.\/(?!.*(?:__tests__)).*\.((jsx?)|(tsx?))$/));
requireAll(require.context('./pages/', true, /^\.\/(?!.*(?:__tests__)).*\.((jsx?)|(tsx?))$/));
requireAll(require.context('./plugins/', true, /^\.\/(?!.*(?:__tests__)).*\.((jsx?)|(tsx?))$/));

