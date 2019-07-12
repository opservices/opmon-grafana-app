'use strict';

System.register(['app/plugins/sdk', 'lodash', './css/display-status-panel.css!'], function (_export, _context) {
  "use strict";

  var MetricsPanelCtrl, _, _createClass, panelDefaults, log, DisplayStatus, pluck, updateProperty;

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
    }, function (_cssDisplayStatusPanelCss) {}],
    execute: function () {
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

      panelDefaults = {
        statusSettings: {
          fontSize: '60px',
          fontWeight: 'bold',
          color: 'white',
          textTransform: 'uppercase'
        },
        elementSettings: {
          fontSize: '20px',
          fontWeight: 'normal',
          color: 'white',
          textTransform: 'normal'
        }
      };

      log = function log(msg) {
        return function (x) {
          return console.log(msg, x), x;
        };
      };

      _export('DisplayStatus', DisplayStatus = function (_MetricsPanelCtrl) {
        _inherits(DisplayStatus, _MetricsPanelCtrl);

        function DisplayStatus($scope, $injector) {
          _classCallCheck(this, DisplayStatus);

          var _this = _possibleConstructorReturn(this, (DisplayStatus.__proto__ || Object.getPrototypeOf(DisplayStatus)).call(this, $scope, $injector));

          _.defaultsDeep(_this.panel, panelDefaults);

          _this.events.on('data-received', _this.onDataReceived.bind(_this));
          _this.events.on('init-edit-mode', _this.onInitEditMode.bind(_this));

          _this.getColors().then(function (colors) {
            return _this.allStates = colors;
          });
          return _this;
        }

        _createClass(DisplayStatus, [{
          key: 'onDataReceived',
          value: function onDataReceived() {
            var data = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : [];

            if (!this.allStates) {
              return setTimeout(this.onDataReceived.bind(this, data), 1000);
            }
            var state = this.allStates[pluck([0, 'datapoints', 0, 0], data) % this.allStates.length] || { label: 'n/A', color: '#000' };

            this.element = {
              name: pluck([0, 'target'], data) || 'Element not found'
            };

            this.status = {
              label: state.label,
              color: state.color
            };

            this.render();
          }
        }, {
          key: 'link',
          value: function link(scope, elem, attrs, ctrl) {
            var _this2 = this;

            this.events.on('render', function () {
              elem.find('.panel-container').css('background-color', _this2.status.color);
              elem.find('.panel-title').css('color', '#FFF');
            });
          }
        }, {
          key: 'getColors',
          value: function getColors() {
            return window.opmonColorStatus && window.opmonColorStatus.length > 0 ? Promise.resolve(window.opmonColorStatus) : fetch('/opmon/seagull/www/index.php/opinterface/action/retrieveStateColors', {
              credentials: 'same-origin',
              headers: {
                'X-Requested-With': 'XMLHttpRequest'
              }
            }).then(function (res) {
              return res.json();
            }).then(function (colors) {
              return window.opmonColorStatus = colors, colors;
            });
          }
        }, {
          key: 'onInitEditMode',
          value: function onInitEditMode() {
            this.addEditorTab('Options', 'public/plugins/state/editor.html', 2);
          }
        }]);

        return DisplayStatus;
      }(MetricsPanelCtrl));

      _export('DisplayStatus', DisplayStatus);

      DisplayStatus.templateUrl = 'module.html';

      pluck = function pluck(keys, obj) {
        return keys.reduce(function (x, key) {
          return x && x[key];
        }, obj);
      };

      updateProperty = function updateProperty(ctx) {
        return function (scope, property, value) {
          ctx[scope][property] = value;
        };
      };
    }
  };
});
//# sourceMappingURL=display_status_ctrl.js.map
