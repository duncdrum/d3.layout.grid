(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports) :
  typeof define === 'function' && define.amd ? define(['exports'], factory) :
  (factory((global.d3 = global.d3 || {})));
}(this, (function (exports) { 'use strict';

/*eslint-disable */
{
  document.write(
    '<script src="http://' + (location.host || 'localhost').split(':')[0] +':35729/livereload.js?snipver=1"></script>'
  );
}
/*eslint-enable */

function layoutGrid() {
  function noop() {}

  function groupBy(data, iterator) {
    var results = [];
    var itr = typeof iterator === 'string' ? function (d) {
      return d[iterator]
    } : iterator;

    data.forEach(function (d) {
      var key = itr(d);
      results[key] = results[key] || [];
      results[key].push(d);
    });

    return results
  }

  var config = {};
  config.width = 500;
  config.height = 1000;
  config.colWidth = 50;
  config.rowHeight = 50;
  config.sectionPadding = 100;
  config.marginLeft = config.colWidth;
  config.marginTop = config.sectionPadding;
  var data = [];
  var groupByFn = noop;
  var groupComparator;
  var dataComparator;
  var groups = [];

  function chart(selection) {}

  chart.data = function (x) {
    if (!arguments.length) return data
    data = x;
    return chart
  };

  chart.groupBy = function (x) {
    groupByFn = x;

    chart.relayout();

    return chart
  };

  chart.sort = function (x, y) {
    if (x) groupComparator = x;
    if (y) dataComparator = y;

    chart.relayout();

    return chart
  };

  chart.groups = function () {
    return groups
  };

  chart.relayout = function () {
    groups = [];
    var grouped = groupBy(data, groupByFn);
    var y0 = config.marginTop;

    Object.keys(grouped)
      .sort(groupComparator)
      .forEach(function (key, groupIdx) {
        var ds = grouped[key];
        var x0 = config.marginLeft;

        groups.push({
          name: key,
          y: y0,
          groupIndex: groupIdx,
          data: ds
        });

        ds.sort(dataComparator)
          .forEach(function (d) {
            if (x0 + config.colWidth > config.width) {
              x0 = config.marginLeft;
              y0 += config.rowHeight;
            }

            d.x = x0;
            d.y = y0;
            d.groupIndex = groupIdx;

            x0 += config.colWidth;
          });

        y0 += config.sectionPadding;
      });

    config.height = y0;

    return chart
  };

  void ['width', 'height', 'colWidth', 'rowHeight', 'sectionPadding', 'marginLeft', 'marginTop'].forEach(function (prop) {
    chart[prop] = function (x) {
      if (!arguments.length) return config[prop]
      config[prop] = x;
      return chart
    };
  });

  return chart
}

exports.layoutGrid = layoutGrid;

Object.defineProperty(exports, '__esModule', { value: true });

})));
