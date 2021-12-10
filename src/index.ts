//eslint-disable-next-line no-unused-vars
import $ from 'jquery';
import 'focus-visible/dist/focus-visible.min.js';

import '@styles/styles';

function requireAll(requireContext: any) {
  return requireContext.keys().map(requireContext);
}

requireAll(require.context('./components/', true, /^\.\/(?!.*((?:__tests__)|(?:\.d))).*\.((jsx?)|(tsx?))$/));
requireAll(require.context('./pages/', true, /^\.\/(?!.*((?:__tests__)|(?:\.d))).*\.((jsx?)|(tsx?))$/));


