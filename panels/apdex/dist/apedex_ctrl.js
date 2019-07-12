'use strict';

System.register(['app/plugins/sdk', 'lodash'], function (_export, _context) {
  "use strict";

  var MetricsPanelCtrl, _, _slicedToArray, _createClass, Apedex, zonesPredicates, labelPredicates, calcApedex, log, panelDefaults;

  function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
      throw new TypeError("Cannot call a class as a function");
    }
  }

  function _possibleConstructorReturn(self, call) {
    if (!self) {
      throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
    }

    return call && (typeof call === "object" || typeof call === "function") ? call : self;
  }

  function _inherits(subClass, superClass) {
    if (typeof superClass !== "function" && superClass !== null) {
      throw new TypeError("Super expression must either be null or a function, not " + typeof superClass);
    }

    subClass.prototype = Object.create(superClass && superClass.prototype, {
      constructor: {
        value: subClass,
        enumerable: false,
        writable: true,
        configurable: true
      }
    });
    if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass;
  }

  return {
    setters: [function (_appPluginsSdk) {
      MetricsPanelCtrl = _appPluginsSdk.MetricsPanelCtrl;
    }, function (_lodash) {
      _ = _lodash.default;
    }],
    execute: function () {
      _slicedToArray = function () {
        function sliceIterator(arr, i) {
          var _arr = [];
          var _n = true;
          var _d = false;
          var _e = undefined;

          try {
            for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) {
              _arr.push(_s.value);

              if (i && _arr.length === i) break;
            }
          } catch (err) {
            _d = true;
            _e = err;
          } finally {
            try {
              if (!_n && _i["return"]) _i["return"]();
            } finally {
              if (_d) throw _e;
            }
          }

          return _arr;
        }

        return function (arr, i) {
          if (Array.isArray(arr)) {
            return arr;
          } else if (Symbol.iterator in Object(arr)) {
            return sliceIterator(arr, i);
          } else {
            throw new TypeError("Invalid attempt to destructure non-iterable instance");
          }
        };
      }();

      _createClass = function () {
        function defineProperties(target, props) {
          for (var i = 0; i < props.length; i++) {
            var descriptor = props[i];
            descriptor.enumerable = descriptor.enumerable || false;
            descriptor.configurable = true;
            if ("value" in descriptor) descriptor.writable = true;
            Object.defineProperty(target, descriptor.key, descriptor);
          }
        }

        return function (Constructor, protoProps, staticProps) {
          if (protoProps) defineProperties(Constructor.prototype, protoProps);
          if (staticProps) defineProperties(Constructor, staticProps);
          return Constructor;
        };
      }();

      _export('Apedex', Apedex = function (_MetricsPanelCtrl) {
        _inherits(Apedex, _MetricsPanelCtrl);

        function Apedex($scope, $injector) {
          _classCallCheck(this, Apedex);

          var _this = _possibleConstructorReturn(this, (Apedex.__proto__ || Object.getPrototypeOf(Apedex)).call(this, $scope, $injector));

          _.defaultsDeep(_this.panel, panelDefaults);

          _this.events.on('data-received', _this.onDataReceived.bind(_this));
          _this.events.on('init-edit-mode', _this.onInitEditMode.bind(_this));

          _this.data = [{ label: 'No data', value: NaN }];
          return _this;
        }

        _createClass(Apedex, [{
          key: 'onDataReceived',
          value: function onDataReceived() {
            var _this2 = this;

            var data = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : [];

            this.data = data.map(function (d) {
              return d.datapoints.reduce(function (result, _ref) {
                var _ref2 = _slicedToArray(_ref, 2),
                    val = _ref2[0],
                    data = _ref2[1];

                return zonesPredicates(_this2.panel.satisfiedZone).reduce(function (acc, f) {
                  return f(acc, val);
                }, result);
              }, { sz: 0, tz: 0, total: d.datapoints.length });
            }).map(function (data) {
              return {
                value: calcApedex(data.sz, data.tz, data.total)
              };
            }).map(function (data) {
              return {
                value: data.value,
                label: labelPredicates().reduce(function (acc, f) {
                  return f(acc, data.value);
                }, { text: 'Excellent', color: '#258e2d' })
              };
            });

            this.render();
          }
        }, {
          key: 'onInitEditMode',
          value: function onInitEditMode() {
            this.addEditorTab('Options', 'public/plugins/apdex/editor.html', 2);
          }
        }, {
          key: 'link',
          value: function link(scope, elem, attrs, ctrl) {
            var _this3 = this;

            this.events.on('render', function () {
              elem.find('.panel-container').css('background-color', _this3.data.reduce(function (_, d) {
                return d.label.color;
              }, '#000'));
              elem.find('.panel-title').css('color', '#FFF');
            });
          }
        }]);

        return Apedex;
      }(MetricsPanelCtrl));

      _export('Apedex', Apedex);

      Apedex.templateUrl = 'module.html';

      zonesPredicates = function zonesPredicates(T) {
        return [function (acc, val) {
          return val <= T ? Object.assign(acc, { sz: acc.sz + 1 }) : acc;
        }, function (acc, val) {
          return val > T && val <= T * 4 ? Object.assign(acc, { tz: acc.tz + 1 }) : acc;
        }];
      };

      labelPredicates = function labelPredicates() {
        return [function (before, val) {
          return val <= 0.93 ? { text: 'Good', color: '#89ca0b' } : before;
        }, function (before, val) {
          return val <= 0.84 ? { text: 'Fair', color: '#ffba10' } : before;
        }, function (before, val) {
          return val <= 0.69 ? { text: 'Poor', color: '#f76522' } : before;
        }, function (before, val) {
          return val <= 0.49 ? { text: 'Unacceptable', color: '#cf2122' } : before;
        }];
      };

      calcApedex = function calcApedex(sz, tz, total) {
        return Number(((sz + tz / 2) / total).toPrecision(2));
      };

      log = function log(msg) {
        return function (x) {
          return console.log(msg, x), x;
        };
      };

      panelDefaults = {
        labelSettings: {
          fontSize: '30px',
          fontWeight: 'bold',
          color: 'white',
          textTransform: 'uppercase'
        },
        valueSettings: {
          fontSize: '20px',
          fontWeight: 'normal',
          color: 'white',
          textTransform: 'normal'
        },
        satisfiedZone: 5
      };
    }
  };
});
//# sourceMappingURL=apedex_ctrl.js.map
