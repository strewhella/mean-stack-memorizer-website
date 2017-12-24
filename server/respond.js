/**
 * Created by Simon on 27/11/2014.
 */
'use strict';

var _ = require('lodash');

module.exports = function(res, err, data, status){
    if (res.statusCode !== 200){
        return res.send();
    }
    else if (status){
        return res.status(status).send();
    }

    if (err) return res.status(400).send();

    if (Array.isArray(data) && data.length === 0 || _.isUndefined(data) || _.isNull(data)){
        return res.status(404).send();
    }

    res.status(200).json(data);
};