/*eslint-disable */
if (ENV !== 'production') {
  document.write(
    '<script src="http://' + (location.host || 'localhost').split(':')[0] +':35729/livereload.js?snipver=1"></script>'
  );
}
/*eslint-enable */

function layoutGrid() {
  function noop() {}

  function groupBy(data, iterator) {
    const results = []
    var itr = typeof iterator === 'string' ? function (d) {
      return d[iterator]
    } : iterator

    data.forEach(function (d) {
      const key = itr(d)
      results[key] = results[key] || []
      results[key].push(d)
    })

    return results
  }

  const config = {}
  config.width = 500
  config.height = 1000
  config.colWidth = 50
  config.rowHeight = 50
  config.sectionPadding = 100
  config.marginLeft = config.colWidth
  config.marginTop = config.sectionPadding
  let data = []
  let groupByFn = noop
  let groupComparator
  let dataComparator
  let groups = []

  class chart {
    static data(x) {
      if (!arguments.length) return data
      data = x
      return chart
    }

    static groupBy(x) {
      groupByFn = x

      chart.relayout()

      return chart
    }

    static sort(x, y) {
      if (x) groupComparator = x
      if (y) dataComparator = y

      chart.relayout()

      return chart
    }

    static groups() {
      return groups
    }

    static relayout() {
      groups = []
      const grouped = groupBy(data, groupByFn)
      let y0 = config.marginTop

      Object.keys(grouped)
        .sort(groupComparator)
        .forEach(function (key, groupIdx) {
          const ds = grouped[key]
          let x0 = config.marginLeft

          groups.push({
            name: key,
            y: y0,
            groupIndex: groupIdx,
            data: ds
          })

          ds.sort(dataComparator)
            .forEach(d => {
              if (x0 + config.colWidth > config.width) {
                x0 = config.marginLeft
                y0 += config.rowHeight
              }

              d.x = x0
              d.y = y0
              d.groupIndex = groupIdx

              x0 += config.colWidth
            })

          y0 += config.sectionPadding
        })

      config.height = y0

      return chart
    }
  }

  ['width', 'height', 'colWidth', 'rowHeight', 'sectionPadding', 'marginLeft', 'marginTop'].forEach(function (prop) {
    chart[prop] = function (x) {
      if (!arguments.length) return config[prop]
      config[prop] = x
      return chart
    }
  })

  return chart
}

export default layoutGrid
