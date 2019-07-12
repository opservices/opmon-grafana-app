'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.AnnotationsQueryCtrl = exports.QueryOptionsCtrl = exports.ConfigCtrl = exports.QueryCtrl = exports.Datasource = undefined;

var _datasource = require('./datasource');

var _query_ctrl = require('./query_ctrl');

function _classCallCheck(instance, Constructor) {
  if (!(instance instanceof Constructor)) {
    throw new TypeError("Cannot call a class as a function");
  }
}

var OpMonConfigCtrl = function OpMonConfigCtrl() {
  _classCallCheck(this, OpMonConfigCtrl);
};

OpMonConfigCtrl.templateUrl = 'partials/config.html';

var OpMonQueryOptionsCtrl = function OpMonQueryOptionsCtrl() {
  _classCallCheck(this, OpMonQueryOptionsCtrl);
};

OpMonQueryOptionsCtrl.templateUrl = 'partials/query.options.html';

var OpMonAnnotationsQueryCtrl = function OpMonAnnotationsQueryCtrl() {
  _classCallCheck(this, OpMonAnnotationsQueryCtrl);
};

OpMonAnnotationsQueryCtrl.templateUrl = 'partials/annotations.editor.html';

exports.Datasource = _datasource.OpMonDatasource;
exports.QueryCtrl = _query_ctrl.OpMonDatasourceQueryCtrl;
exports.ConfigCtrl = OpMonConfigCtrl;
exports.QueryOptionsCtrl = OpMonQueryOptionsCtrl;
exports.AnnotationsQueryCtrl = OpMonAnnotationsQueryCtrl;
//# sourceMappingURL=module.js.map
//# sourceMappingURL=module.js.map
