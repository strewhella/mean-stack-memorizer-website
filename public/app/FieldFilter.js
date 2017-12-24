/**
 * Created by Simon on 31/12/2014.
 */
(function(){
    'use strict';

    var module = 'app';
    var filter = 'fields';

    angular.module(module).filter(filter, FieldFilter);

    /* @ngInject */
    function FieldFilter(){
        return function(array, params){
            array.forEach(function(item){
                item.show = true;

                Object.keys(params).forEach(function(key){
                    if (angular.isArray(item)) {
                        var found = false;
                        item.forEach(function (subitem) {
                            found = contains(subitem, key, params[key]);
                        });
                        if (!found) {
                            item.show = false;
                        }
                    }
                    else {
                        item.show = contains(item, key, params[key]);
                    }
                });
            });

            return array;
        };

        function contains(item, property, filter){
            return item.hasOwnProperty(property) && item[property].toString().indexOf(filter.toString()) !== -1;
        }
    }
}());