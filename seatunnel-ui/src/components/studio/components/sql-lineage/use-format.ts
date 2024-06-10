import { DagreLayout } from '@antv/layout'
import _ from 'lodash'

const formatSqlLineage = (graph: any) => {
  const layoutConfig = {
    nodesep: 50,
    padding: 50,
    ranksep: 50
  }

  if (!graph) {
    return
  }

  graph.cleanSelection()

  const layoutFunc = new DagreLayout({
    type: 'dagre',
    rankdir: 'LR',
    align: 'UL',
    // Calculate the node spacing based on the edge label length
    ranksepFunc: (d) => {
      const edges = graph.getOutgoingEdges(d.id)
      let max = 0
      if (edges && edges.length > 0) {
        edges.forEach((edge: any) => {
          const edgeView = graph.findViewByCell(edge)
          const labelView = edgeView?.findAttr(
            'width',
            _.get(edgeView, ['labelSelectors', '0', 'body'], null)
          )
          const labelWidth = labelView ? +labelView : 0
          max = Math.max(max, labelWidth)
        })
      }
      return layoutConfig.ranksep + max
    },
    nodesep: layoutConfig.nodesep,
    controlPoints: true
  })

  const json = graph.toJSON()
  const nodes = json.cells
    .filter((cell: any) => cell.shape === 'html')
    .map((item: any) => {
      return {
        ...item,
        // sort by code aesc
        _index: -(item.id as string)
      }
    })
  const edges = json.cells.filter((cell: any) => cell.shape === 'dag-edge')
  const newModel: any = layoutFunc?.layout({
    nodes,
    edges
  } as any)
  graph.fromJSON(newModel)
}

export { formatSqlLineage }
