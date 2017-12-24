(function () {
    'use strict';

    var module = 'artificialselection';
    var directive = 'asEnter';

    /* @ngInject */
    angular.module(module).directive(directive, function () {
        return function (scope, element, attrs) {
            element.bind("keydown keypress", function (event) {
                if (event.which === 13) {
                    scope.$apply(function () {
                        scope.$eval(attrs.asEnter);
                    });

                    event.preventDefault();
                }
            });
        };
    });
}());