(function () {
    'use strict';

    var module = 'artificialselection';
    var directive = 'asForm';

    angular.module(module).directive(directive, function () {
        return {
            restrict: 'EA',
            transclude: true,
            template: '<div ng-transclude></div>',
            scope: true,
            controller: function (common) {
                var self = this;
                self.inputForms = [];
                self.inputControllers = [];
                self.submitControllers = [];
                self.selectControllers = [];
                self.disabled = true;

                self.update = function () {
                    var valid = self.inputForms.length > 0;
                    for (var i = 0; i < self.inputForms.length; ++i) {
                        var input = self.inputForms[i];
                        if (input.$invalid) {
                            valid = false;
                            break;
                        }
                    }

                    self.disabled = !valid;
                    common.callOnEach(self.submitControllers, 'setDisabled', !valid);
                };

                self.trySubmit = function () {
                    if (self.submit && !self.disabled) {
                        self.submit();
                    }
                };

                self.registerInput = function (inputForm) {
                    self.inputForms.push(inputForm);
                };

                self.registerController = function(inputController){
                    self.inputControllers.push(inputController);
                };

                self.registerSubmit = function (submitController) {
                    self.submitControllers.push(submitController);
                };

                self.registerSelect = function (selectController) {
                    self.selectControllers.push(selectController);
                };

                self.reset = function () {
                    self.inputForms.forEach(function (inputForm) {
                        inputForm.inputField.$setPristine();
                    });
                };

                self.setDisabledAll = function (disabled) {
                    common.callOnEach(self.inputControllers, 'setDisabled', disabled);
                    common.callOnEach(self.submitControllers, 'setDisabled', disabled);
                    common.callOnEach(self.selectControllers, 'setDisabled', disabled);                    
                };
            }
        };
    });
}());