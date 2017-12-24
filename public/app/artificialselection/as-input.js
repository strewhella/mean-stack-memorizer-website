(function() {
    'use strict';

    var module = 'artificialselection';
    var directive = 'asInput';

    /* @ngInject */
    angular.module(module).directive(directive, function (common) {
        var msgSuffix = 'Msg';

        function validator(name, msg) {
            return { name: name, msg: msg, show: false };
        }

        return {
            restrict: 'E',
            templateUrl: common.templateUrl(module, directive),
            require: ['^asForm', 'asInput'],
            scope: {
                model: '=ngModel',
                label: '@asLabel',
                type: '@asType',
                placeholder: '@',
                required: '=ngRequired',
                disabled: '=ngDisabled',
                minlength: '=vvMinlength',
                maxlength: '=vvMaxlength', // TODO: Use ng-model-options='{ allowInvalid: true }' and delete valuedValidators
                min: '=vvMin',
                max: '=vvMax',
                pattern: '=vvPattern',
                url: '=vvUrl',
                email: '=vvEmail',
                integer: '=vvInteger',
                float: '=vvFloat',
                equal: '=vvEqual',
                notequal: '=vvNotequal',
                requiredMsg: '@asRequired' + msgSuffix,
                minlengthMsg: '@asMinlength' + msgSuffix, // TODO: Update to use ng-messages
                maxlengthMsg: '@asMaxlength' + msgSuffix, // TODO: Add msgs as child elements rather than attributes
                minMsg: '@asMin' + msgSuffix,
                maxMsg: '@asMax' + msgSuffix,
                patternMsg: '@asPattern' + msgSuffix,
                emailMsg: '@asEmail' + msgSuffix,
                equalMsg: '@asEqual' + msgSuffix,
                notequalMsg: '@asNotequal' + msgSuffix,
                urlMsg: '@asUrl' + msgSuffix,
                inputClass: '@asInputClass',
                labelClass: '@asLabelClass',
                outerGroupClass: '@asOuterGroupClass',
                innerGroupClass: '@asInnerGroupClass',
                errorClass: '@asErrorClass',
                filterInput: '@asFilter',
                cols: '@asCols',
                rows: '@asRows'
            },
            controller: function ($scope, $element) {
                var self = this;

                $scope.ngSettings = {
                    required: $scope.required,
                    disabled: $scope.disabled
                };
                
                $scope.$watch('disabled', function (newVal) {
                    $scope.ngSettings.disabled = newVal;
                });

                $scope.$watch('required', function (newVal) {
                    $scope.ngSettings.required = newVal;
                });

                self.setDisabled = function (disabled) {
                    if (!$scope.disabled) {
                        $scope.ngSettings.disabled = disabled;
                    }
                };

                function findMsg(name) {
                    name = common.camelCase(name.replace('vv-', ''));
                    return $scope[name + msgSuffix];
                }

                $scope.validators = [];
                var attrs = $element[0].attributes;

                // Create the set of validators and msgs
                for (var i = 0; i < attrs.length; ++i) {
                    var attr = attrs[i];
                    var name = attr.name;
                    if (name.indexOf('vv') !== -1) {
                        var msg = findMsg(name);
                        $scope.validators.push(validator(name.replace(new RegExp('-', 'g'), ''), msg));
                    }
                }

                if ($scope.required) {
                    $scope.validators.push(validator('required', $scope.requiredMsg));
                }
            },
            compile: function (element, attrs) {
                attrs.asLabel = attrs.asLabel || '';
                attrs.asType = attrs.asType || 'text';
                attrs.asPlaceholder = attrs.asPlaceholder || (attrs.asLabel || '');

                attrs.asEmailMsg = attrs.asEmailMsg || 'This is not a valid email address';
                attrs.asEqualMsg = attrs.asEqualMsg || 'This does not match';
                attrs.asNotequalMsg = attrs.asNotequalMsg || 'This cannot match';
                attrs.asUrlMsg = attrs.asUrlMsg || 'This is not a valid url';
                attrs.asRequiredMsg = attrs.asRequiredMsg || 'This is required';
                attrs.asMinlengthMsg = attrs.asMinlengthMsg || 'This must contain at least {{' + attrs.vvMinlength + '}} characters';
                attrs.asMaxlengthMsg = attrs.asMaxlengthMsg || 'This must contain less than {{' + attrs.vvMaxlength + '}} characters';
                attrs.asMinMsg = attrs.asMinMsg || 'This must be greater than {{' + attrs.vvMin + '}}';
                attrs.asMaxMsg = attrs.asMaxMsg || 'This must be less than {{' + attrs.vvMax + '}}';
                attrs.asPatternMsg = attrs.asPatternMsg || 'This is invalid';
                attrs.asFloatMsg = attrs.asFloatMsg || 'This is not a valid decimal number';
                attrs.asIntegerMsg = attrs.asIntegerMsg || 'This is not a whole number';

                attrs.asOuterGroupClass = attrs.asOuterGroupClass || 'form-group';
                attrs.asLabelClass = attrs.asLabelClass || '';
                attrs.asInnerGroupClass = attrs.asInnerGroupClass || '';
                attrs.asInputClass = attrs.asInputClass || 'form-control';
                attrs.asErrorClass = attrs.asErrorClass || 'text-danger';
                attrs.asErrorIcon = attrs.asErrorIcon || 'fa fa-exclamation-triangle';

                attrs.vvEmail = (attrs.vvEmail || attrs.vvEmail === '') || false;
                attrs.vvEqual = attrs.vvEqual || false;
                attrs.vvNotequal = attrs.vvNotequal || false;
                attrs.vvUrl = (attrs.vvUrl || attrs.vvUrl === '') || false;
                attrs.vvMinlength = attrs.vvMinlength || false;
                attrs.vvMaxlength = attrs.vvMaxlength || false;
                attrs.vvMin = attrs.vvMin || false;
                attrs.vvMax = attrs.vvMax || false;
                attrs.vvPattern = attrs.vvPattern || false;
                attrs.vvFloat = attrs.vvFloat || false;
                attrs.vvInteger = attrs.vvInteger || false;
                attrs.ngRequired = attrs.ngRequired || false;

                attrs.asFilterInput = (attrs.asFilter || attrs.asFilter === '') || false;
                attrs.asCols = attrs.asCols || 20;
                attrs.asRows = attrs.asRows || 4;

                var input = element.find('input');
                var textarea = element.find('textarea');
                var finalInput = null;
                if (attrs.asType === 'textarea') {
                    input.remove();
                    finalInput = textarea;
                }
                else {
                    textarea.remove();
                    finalInput = input;
                }

                var inputAttrs = finalInput[0].attributes;
                var remove = [];
                for (var i = 0; i < inputAttrs.length; ++i) {
                    var inputAttr = inputAttrs[i].nodeName;
                    var normInputAttr = common.camelCase(inputAttr);
                    if (attrs[normInputAttr] === false) {
                        remove.push(inputAttr);
                    }
                }

                remove.forEach(function (attr) {
                    finalInput.removeAttr(attr);
                });

                return {
                    post: function (scope, iElem, iAttr, controllers) {
                        var formController = controllers[0];
                        var inputController = controllers[1];
                        formController.registerController(inputController);

                        function checkValidity(field, valid) {
                            if (scope.inputForm) {
                                scope.inputForm.inputField.$setValidity(field, valid);
                            }
                            scope.update();
                        }
                        
                        var listener = scope.$watch('inputForm', function (form) {
                            if (form) {
                                formController.registerInput(form);
                                listener();
                            }
                        });

                        if (iAttr.vvEqual) {
                            scope.$parent.$watch(iAttr.vvEqual, function () {
                                checkValidity('vvequal', scope.model === scope.equal);
                            });
                        }

                        if (iAttr.vvNotequal) {
                            scope.$parent.$watch(iAttr.vvNotequal, function () {
                                checkValidity('vvnotequal', scope.model !== scope.notequal);
                            });
                        }

                        // TODO: Can replace this behaviour with ng-messages
                        scope.update = function () {
                            if (scope.inputForm) {
                                var found = false;
                                for (var i = 0; i < scope.validators.length; ++i) {
                                    var validator = scope.validators[i];
                                    validator.show = false;
                                    if (scope.inputForm.inputField.$dirty && scope.inputForm.inputField.$error[validator.name] && !found) {
                                        validator.show = true;
                                        found = true;
                                    }
                                }
                                formController.update();
                            }
                        };

                        scope.onEnter = function () {
                            formController.trySubmit();
                        };
                    }
                };
            }
        };
    });

}());