(function() {
  'use strict';

  angular
    .module('16bitHeroes')
    .run(runBlock);

  /** @ngInject */
  function runBlock($log) {

    $log.debug('runBlock end');
  }

})();
