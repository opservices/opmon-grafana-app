'use strict';

System.register(['./datasource', './query_ctrl'], function (_export, _context) {
  "use strict";

  var OpMonDatasource, OpMonDatasourceQueryCtrl, OpMonConfigCtrl, OpMonQueryOptionsCtrl, OpMonAnnotationsQueryCtrl;

  function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
      throw new TypeError("Cannot call a class as a function");
    }
  }

  return {
    setters: [function (_datasource) {
      OpMonDatasource = _datasource.OpMonDatasource;
    }, function (_query_ctrl) {
      OpMonDatasourceQueryCtrl = _query_ctrl.OpMonDatasourceQueryCtrl;
    }],
    execute: function () {
      _export('ConfigCtrl', OpMonConfigCtrl = function OpMonConfigCtrl() {
        _classCallCheck(this, OpMonConfigCtrl);
      });

      OpMonConfigCtrl.templateUrl = 'partials/config.html';

      _export('QueryOptionsCtrl', OpMonQueryOptionsCtrl = function OpMonQueryOptionsCtrl() {
        _classCallCheck(this, OpMonQueryOptionsCtrl);
      });

      OpMonQueryOptionsCtrl.templateUrl = 'partials/query.options.html';

      _export('AnnotationsQueryCtrl', OpMonAnnotationsQueryCtrl = function OpMonAnnotationsQueryCtrl() {
        _classCallCheck(this, OpMonAnnotationsQueryCtrl);
      });

      OpMonAnnotationsQueryCtrl.templateUrl = 'partials/annotations.editor.html';

      _export('Datasource', OpMonDatasource);

      _export('QueryCtrl', OpMonDatasourceQueryCtrl);

      _export('ConfigCtrl', OpMonConfigCtrl);

      _export('QueryOptionsCtrl', OpMonQueryOptionsCtrl);

      _export('AnnotationsQueryCtrl', OpMonAnnotationsQueryCtrl);
    }
  };
});
//# sourceMappingURL=module.js.map
