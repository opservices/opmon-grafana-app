'use strict';

System.register(['lodash', './constants'], function (_export, _context) {
  "use strict";

  var _, c, _createClass, OpMonDatasource;

  function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
      throw new TypeError("Cannot call a class as a function");
    }
  }

  return {
    setters: [function (_lodash) {
      _ = _lodash.default;
    }, function (_constants) {
      c = _constants;
    }],
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

      _export('OpMonDatasource', OpMonDatasource = function () {
        function OpMonDatasource(instanceSettings, $q, backendSrv, templateSrv) {
          _classCallCheck(this, OpMonDatasource);

          this.type = instanceSettings.type;
          this.url = instanceSettings.url + '/opmon/seagull/www/index.php/wsconnector/action/datasource?' + 'mod=OPVIEW' + '&' + 'shareduid=W1ksbu9/9O95NGvyrgbVYe6yEE2LcgQdivS5PHhiVe0=' + '&' + 'q=';
          this.name = instanceSettings.name;
          this.q = $q;
          this.backendSrv = backendSrv;
          this.templateSrv = templateSrv;
          this.headers = { 'Content-Type': 'application/json' };
          if (typeof instanceSettings.basicAuth === 'string' && instanceSettings.basicAuth.length > 0) {
            this.headers['Authorization'] = instanceSettings.basicAuth;
          }
          this.DEFAULT_HOST = "- select host -";
          this.DEFAULT_SERVICE = "- select service -";
          this.DEFAULT_METRIC = "- all -";
          this.DEFAULT_TIMECUT = "24x7";
          this.DEFAULT_RESULT_FORMAT = 'time_series';
          this.DEFAULT_OBJECT_TYPE = 'Host';
          this.DEFAULT_EXTENDED_STATE = false;
          this.DEFAULT_HOSTGROUP = '- select hostgroup -';
          this.DEFAULT_SERVICEGROUP = '- select servicegroup -';
          this.DEFAULT_SERVICECATALOG = '- select service catalog -';
        }

        /* fetch pnp rrd data */


        _createClass(OpMonDatasource, [{
          key: 'query',
          value: function query(options) {
            var query = this.buildQueryParameters(options);
            query.targets = query.targets.filter(function (t) {
              return !t.hide && t.host && t.service && t.hostgroup && t.servicegroup && t.metric && t.serviceCatalog;
            });

            if (query.targets.length <= 0) {
              return this.q.when({ data: [] });
            }

            query.start = Number(options.range.from.toDate().getTime() / 1000).toFixed();
            query.end = Number(options.range.to.toDate().getTime() / 1000).toFixed();

            /* fixup regex syntax in query targets */
            for (var x = 0; x < query.targets.length; x++) {
              var target = query.targets[x];
              if (target.host == this.DEFAULT_HOST || target.mode == c.MODE_SYSTEM) {
                target.host = '';
              }
              if (target.service == this.DEFAULT_SERVICE || target.mode == c.MODE_SYSTEM) {
                target.service = '';
              }
              if (target.metric == this.DEFAULT_METRIC) {
                target.metric = '';
              }

              target.host = this._fixup_regex(target.host);
              target.service = this._fixup_regex(target.service);
              target.metric = this._fixup_regex(target.metric);
              target.serviceCatalog = this._fixup_regex(target.serviceCatalog);

              //target.host_id =  this.rawdata[target.refId]['host'].filter((cur) => (cur.text == target.host)).pop().value;
              //target.service_id = this.rawdata[target.refId]['service'].filter((cur) => (cur.text == target.service)).pop().value;
              //target.metric_id = this.rawdata[target.refId]['metric'].filter((cur) => (cur.text == target.metric)).pop().value;
            }

            if (this.templateSrv.getAdhocFilters) {
              query.adhocFilters = this.templateSrv.getAdhocFilters(this.name);
            } else {
              query.adhocFilters = [];
            }

            return this.doRequest({
              url: this.url + '/query',
              data: query,
              method: 'POST'
            });

            /*var This = this;
            var requestOptions = this._requestOptions({
              url: this.url + '/index.php/api/metrics',
              data: query,
              method: 'POST',
              headers: { 'Content-Type': 'application/json' }
            });
            return this.backendSrv.datasourceRequest(requestOptions)
                                  .then(function(result) {
                                    return(This.dataQueryMapper(result, options))
                                  });*/
          }
        }, {
          key: 'dataQueryMapper',
          value: function dataQueryMapper(result, options) {
            var data = { data: [] };
            if (!result || !result.data || !result.data.targets) {
              return data;
            }
            for (var x = 0; x < result.data.targets.length; x++) {
              for (var k = 0; k < result.data.targets[x].length; k++) {
                var target = options.targets[x];
                var res = result.data.targets[x][k];
                var alias = target.metric;
                if (target.alias) {
                  alias = target.alias;
                  var scopedVars = {
                    tag_host: { value: res.host },
                    tag_service: { value: res.service },
                    tag_metric: { value: res.metric },
                    tag_label: { value: res.metric }
                  };
                  alias = this.templateSrv.replace(alias, scopedVars);
                }
                var datapoints = res.datapoints;
                var length = datapoints.length;
                // remove the last few "null" values from the series because the last value is quite often null
                // and would break current value in legend tables
                for (var y = 1; y < 5; y++) {
                  if (length > y && datapoints[length - y][0] === null) {
                    datapoints.pop();
                  } else {
                    break;
                  }
                }
                var length = datapoints.length;
                var fill = options.targets[x].fill;
                if (fill != "fill") {
                  if (fill == "zero") {
                    fill = 0;
                  }
                  if (fill == "gap") {
                    fill = undefined;
                  }
                  for (var y = 0; y < length; y++) {
                    if (datapoints[y][0] === null) {
                      datapoints[y][0] = fill;
                    }
                  }
                }
                if (options.targets[x].factor && options.targets[x].factor != "") {
                  var factor = eval(options.targets[x].factor);
                  if (factor != NaN && factor != 1) {
                    for (var y = 0; y < length; y++) {
                      if (datapoints[y][0] !== null) {
                        datapoints[y][0] *= factor;
                      }
                    }
                  }
                }
                data.data.push({
                  "target": alias,
                  "datapoints": datapoints
                });
              }
            }
            return data;
          }
        }, {
          key: 'annotationQuery',
          value: function annotationQuery(options) {
            var query = this.templateSrv.replace(options.annotation.query, {}, 'glob');
            var annotationQuery = {
              range: options.range,
              annotation: {
                name: options.annotation.name,
                datasource: options.annotation.datasource,
                enable: options.annotation.enable,
                iconColor: options.annotation.iconColor,
                query: query
              },
              rangeRaw: options.rangeRaw
            };

            return this.doRequest({
              url: this.url + '/annotations',
              method: 'POST',
              data: annotationQuery
            }).then(function (result) {
              return result.data;
            });
          }
        }, {
          key: '_fixup_regex',
          value: function _fixup_regex(value) {
            if (value == undefined || value == null) {
              return value;
            }
            var matches = value.match(/^\/?\^?\{(.*)\}\$?\/?$/);
            if (!matches) {
              return value;
            }
            var values = matches[1].split(/,/);
            for (var x = 0; x < values.length; x++) {
              values[x] = values[x].replace(/\//, '\\/');
            }
            return '/^(' + values.join('|') + ')$/';
          }
        }, {
          key: 'testDatasource',
          value: function testDatasource() {
            return this.doRequest({
              url: this.url + '/',
              method: 'GET'
            }).then(function (response) {
              if (response.status === 200) {
                return { status: "success", message: "Data source is working", title: "Success" };
              }
            });
          }
        }, {
          key: 'metricFindQuery',
          value: function metricFindQuery(query) {
            /*var This = this;
            var type;
            var options = {};
            var query = query_string.split(/\s+/);
            if(query[0]) {
              type = query.shift().replace(/s$/, "");
            }
            // parse simple where statements
            if(query[0] != undefined) {
              if(query[0].toLowerCase() != "where") {
                throw new Error("query syntax error, expecting WHERE");
              }
              query.shift();
               while(query.length >= 3) {
                var t   = query.shift().toLowerCase();
                var op  = query.shift().toLowerCase();
                var val = query.shift();
                if(op != "=") {
                  throw new Error("query syntax error, operator must be '='");
                }
                options[t] = val;
                 if(query[0] != undefined) {
                  if(query[0].toLowerCase() == 'and') {
                    query.shift();
                  } else {
                    throw new Error("query syntax error, expecting AND");
                  }
                }
              }
               // still remaining filters?
              if(query.length > 0) {
                throw new Error("query syntax error");
              }
            }
            return(This.metricFindData(type, options, false));*/
            var interpolated = {
              target: this.templateSrv.replace(query, null, 'regex')
            };

            return this.doRequest({
              url: this.url + '/search',
              data: interpolated,
              method: 'POST'
            }).then(this.mapToTextValue);
          }
        }, {
          key: 'metricFindData',
          value: function metricFindData(type, options, prependVariables) {
            var This = this;
            var mapper;
            var url;
            var data = options || {};
            if (type == "host") {
              url = This.url + '/hosts';
              mapper = This.mapToTextValue;
            } else if (type == "service") {
              url = This.url + '/services';
              data.host = This._fixup_regex(This.templateSrv.replace(options.host));
              //data.host_id = This.rawdata[options.refId]['host'].filter((cur) => (cur.text == data.host)).pop().value;
              mapper = This.mapToTextValue;
              //if(!data.host) { data.host = '/.*/'; }
            } else if (type == "metric" || type == "label") {
              url = This.url + '/metrics';

              if (options.mode == c.MODE_SYSTEM) {
                data.host = '';
                data.service = '';
              } else {
                data.host = This._fixup_regex(This.templateSrv.replace(options.host));
                data.service = This._fixup_regex(This.templateSrv.replace(options.service));
              }

              data.objecttype = This._fixup_regex(This.templateSrv.replace(options.objecttype));
              data.mode = options.mode;
              mapper = This.mapToTextValue;
              //if(!data.host)    { data.host    = '/.*/'; }
              //if(!data.service) { data.service = '/.*/'; }
            } else if (type == "timecut") {
              url = This.url + '/timecuts';
              mapper = This.mapToTextValue;
            } else if (type == "hostgroup" || type == "servicegroup" || type == "serviceCatalog") {
              url = This.url + '/' + type;
              mapper = This.mapToTextValue;
            }

            if (url == undefined) {
              throw new Error("query syntax error, got no url, unknown type: " + type);
            }

            var requestOptions = This._requestOptions({
              url: url,
              data: data,
              method: 'POST',
              headers: { 'Content-Type': 'application/json' }
            });

            return This.backendSrv.datasourceRequest(requestOptions).then(mapper).then(function (data) {
              /* prepend templating variables */
              if (prependVariables) {
                for (var x = 0; x < This.templateSrv.variables.length; x++) {
                  data.unshift({ text: '/^$' + This.templateSrv.variables[x].name + '$/',
                    value: '/^$' + This.templateSrv.variables[x].name + '$/' });
                }
              }
              if (type == 'metric') {
                data.unshift({ text: This.DEFAULT_METRIC, value: "" });
              }
              return data;
            });
          }
        }, {
          key: 'mapToTextValue',
          value: function mapToTextValue(result) {
            return _.map(result.data, function (d, i) {
              if (d && d.text && d.value) {
                return { text: d.text, value: d.value };
              } else if (_.isObject(d)) {
                return { text: d, value: i };
              }
              return { text: d, value: d };
            });
          }
        }, {
          key: 'doRequest',
          value: function doRequest(options) {
            options.withCredentials = this.withCredentials;
            options.headers = this.headers;

            return this.backendSrv.datasourceRequest(options);
          }
        }, {
          key: 'buildQueryParameters',
          value: function buildQueryParameters(options) {
            var _this = this;

            //remove placeholder targets

            options.targets = _.filter(options.targets, function (target) {
              if (target.mode == c.MODE_CP || target.mode == c.MODE_AVAIL) {
                return target.host !== _this.DEFAULT_HOST;
              } else {
                return true;
              }
            });

            options.targets = _.filter(options.targets, function (target) {
              if (target.mode == c.MODE_CP) {
                return target.service !== _this.DEFAULT_SERVICE;
              } else {
                return true;
              }
            });

            // options.targets = _.filter(options.targets, target => {
            //  return target.resultFormat !== this.DEFAULT_RESULT_FORMAT;
            //});
            //options.targets = _.filter(options.targets, target => {
            //  return target.metric !== this.DEFAULT_METRIC;
            //});

            var targets = _.map(options.targets, function (target) {
              return {
                host: _this.templateSrv.replace(_this.templateSrv.replace(target.host, options.scopedVars)),
                service: _this.templateSrv.replace(_this.templateSrv.replace(target.service, options.scopedVars)),
                hostgroup: _this.templateSrv.replace(_this.templateSrv.replace(target.hostgroup, options.scopedVars)),
                servicegroup: _this.templateSrv.replace(_this.templateSrv.replace(target.servicegroup, options.scopedVars)),
                serviceCatalog: _this.templateSrv.replace(_this.templateSrv.replace(target.serviceCatalog, options.scopedVars)),
                metric: _this.templateSrv.replace(_this.templateSrv.replace(target.metric, options.scopedVars)),
                alias: _this.templateSrv.replace(_this.templateSrv.replace(target.alias, options.scopedVars)),
                groupby: _this.templateSrv.replace(_this.templateSrv.replace(target.groupby, options.scopedVars)),
                timecut: _this.templateSrv.replace(_this.templateSrv.replace(target.timecut, options.scopedVars)),
                resultformat: _this.templateSrv.replace(_this.templateSrv.replace(target.resultformat, options.scopedVars)),
                objecttype: _this.templateSrv.replace(_this.templateSrv.replace(target.objecttype, options.scopedVars)),
                extended_state: target.extended_state,
                mode: target.mode,
                //fill: this.templateSrv.replace(this.templateSrv.replace(target.fill, options.scopedVars)),
                //factor: this.templateSrv.replace(this.templateSrv.replace(target.factor, options.scopedVars)),
                refId: target.refId,
                hide: target.hide
              };
            });

            options.targets = targets;

            return options;
          }
        }, {
          key: 'getTagKeys',
          value: function getTagKeys(options) {
            var _this2 = this;

            return new Promise(function (resolve, reject) {
              _this2.doRequest({
                url: _this2.url + '/tag-keys',
                method: 'POST',
                data: options
              }).then(function (result) {
                return resolve(result.data);
              });
            });
          }
        }, {
          key: 'getTagValues',
          value: function getTagValues(options) {
            var _this3 = this;

            return new Promise(function (resolve, reject) {
              _this3.doRequest({
                url: _this3.url + '/tag-values',
                method: 'POST',
                data: options
              }).then(function (result) {
                return resolve(result.data);
              });
            });
          }
        }, {
          key: '_requestOptions',
          value: function _requestOptions(options) {
            options = options || {};
            options.headers = options.headers || {};
            if (this.basicAuth || this.withCredentials) {
              options.withCredentials = true;
            }
            if (this.basicAuth) {
              options.headers.Authorization = this.basicAuth;
            }
            return options;
          }
        }]);

        return OpMonDatasource;
      }());

      _export('OpMonDatasource', OpMonDatasource);
    }
  };
});
//# sourceMappingURL=datasource.js.map
