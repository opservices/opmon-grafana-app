'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
// Editor modes
var MODE_AVAIL = exports.MODE_AVAIL = 0;
var MODE_CP = exports.MODE_CP = 1;
var MODE_SYSTEM = exports.MODE_SYSTEM = 2;

//export const MODE_AVAIL_SERVICE = 2;
//export const MODE_ITEMID = 3;
//export const MODE_TRIGGERS = 4;

// Triggers severity
var SEV_NOT_CLASSIFIED = exports.SEV_NOT_CLASSIFIED = 0;
var SEV_INFORMATION = exports.SEV_INFORMATION = 1;
var SEV_WARNING = exports.SEV_WARNING = 2;
var SEV_AVERAGE = exports.SEV_AVERAGE = 3;
var SEV_HIGH = exports.SEV_HIGH = 4;
var SEV_DISASTER = exports.SEV_DISASTER = 5;

var SHOW_ALL_TRIGGERS = exports.SHOW_ALL_TRIGGERS = [0, 1];
var SHOW_ALL_EVENTS = exports.SHOW_ALL_EVENTS = [0, 1];
var SHOW_OK_EVENTS = exports.SHOW_OK_EVENTS = 1;

// Data point
var DATAPOINT_VALUE = exports.DATAPOINT_VALUE = 0;
var DATAPOINT_TS = exports.DATAPOINT_TS = 1;

var TRIGGER_SEVERITY = exports.TRIGGER_SEVERITY = [{ val: 0, text: 'Not classified' }, { val: 1, text: 'Information' }, { val: 2, text: 'Warning' }, { val: 3, text: 'Average' }, { val: 4, text: 'High' }, { val: 5, text: 'Disaster' }];
//# sourceMappingURL=constants.js.map
//# sourceMappingURL=constants.js.map
