(function () {
    'use strict';

    var module = 'artificialselection';
    var directive = 'asSubmit';

    /* @ngInject */
    angular.module(module).directive(directive, function (common) {
        return {
            restrict: 'E',
            require: ['^asForm', 'asSubmit'],
            templateUrl: common.templateUrl(module, directive),
            scope: {
                inputClass: '@asInputClass',
                groupClass: '@asGroupClass',
                submit: '&asSubmit',
                label: '@asLabel',
                status: '=asStatus',
                submitAction: '&asSubmitAction'
            },
            controller: function ($scope){
                var self = this;
                self.setDisabled = setDisabled;
                self.setLoading = setLoading;

                $scope.disabled = true;
                $scope.loading = false;

                function setDisabled(disabled) {
                    $scope.disabled = disabled;
                }

                function setLoading(loading) {
                    $scope.loading = loading;
                }
            },
            compile: function(element, attrs){
                attrs.asInputClass = attrs.asInputClass || 'btn btn-success';
                attrs.asGroupClass = attrs.asGroupClass || 'form-group';

                return {
                    post: function (scope, elem, attr, controllers) {
                        var formController = controllers[0];
                        var submitController = controllers[1];
                        formController.registerSubmit(submitController);

                        formController.submit = function () {
                            submitController.setLoading(true);
                            scope.submit();

                            if (scope.submitAction) {
                                scope.submitAction();
                            }
                        };
                        scope.trySubmit = formController.submit;

                        scope.$watch('status.type', function (newVal, oldVal) {
                            if (newVal){
                                formController.setDisabledAll(true);
                            }

                            if (newVal === null && oldVal === 'success') {
                                formController.setDisabledAll(false);
                            }
                        });


                    }
                };
            }
        };
    });
}());