/*
 * Licensed to the Apache Software Foundation (ASF) under one or more
 * contributor license agreements.  See the NOTICE file distributed with
 * this work for additional information regarding copyright ownership.
 * The ASF licenses this file to You under the Apache License, Version 2.0
 * (the "License"); you may not use this file except in compliance with
 * the License.  You may obtain a copy of the License at
 *
 *    http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import { defineComponent, ref, onMounted } from 'vue'
import { Graph, Cell } from '@antv/x6'
import { useTabs } from '../../hooks'
import { getSqlLineage } from '../../service/modules/sql-lineage'
import { formatSqlLineage } from '@/components/studio/components/sql-lineage/use-format'
import { debounce } from 'lodash'
import { useResizeObserver } from '@vueuse/core'
import type { PropType } from 'vue'
import type { ITab } from '../../types/tab'

const nodeWidth = 200
const nodeHeight = 52

const SqlLineage = defineComponent({
  name: 'SqlLineage',
  props: {
    tab: {
      type: Object as PropType<ITab>,
      default: {}
    }
  },
  setup(props) {
    const { currentTabRef } = useTabs()
    const container = ref()
    const dagContainer = ref()
    const minimapContainer = ref()
    const graph = ref<Graph>()

    const initGraph = () => {
      graph.value = new Graph({
        container: container.value,
        scroller: true,
        //autoResize: true,
        grid: {
          size: 10,
          visible: true
        },
        minimap: {
          enabled: true,
          width: 200,
          height: 120,
          container: minimapContainer.value
        }
        //interacting: {
        //  nodeMovable: false
        //},
      })
    }

    const registerNode = () => {
      Graph.unregisterNode('dag-node')
      Graph.registerNode('dag-node', {
        inherit: 'rect'
      })
    }

    const registerEdge = () => {
      Graph.unregisterEdge('dag-edge')
      Graph.registerEdge(
        'dag-edge',
        {
          attrs: {
            line: {
              stroke: '#666',
              strokeWidth: 0.5
            }
          },
          router: {
            name: 'orth'
          }
        },
        true
      )
    }

    const edgeHover = () => {
      graph.value &&
        (graph.value as Graph).on('edge:mouseenter', ({ edge }) => {
          edge.setAttrs({
            line: {
              stroke: '#79befa',
              strokeWidth: 1.5
            }
          })
        })

      graph.value &&
        (graph.value as Graph).on('edge:mouseleave', ({ edge }) => {
          edge.setAttrs({
            line: {
              stroke: '#666',
              strokeWidth: 0.5
            }
          })
        })
    }

    const formatNode = (data: Array<any>) => {
      return data.map((row) => {
        row.shape = 'html'
        row.width = nodeWidth
        row.height = nodeHeight
        row.html = () => {
          const wrap = document.createElement('div')
          wrap.style.width = '100%'
          wrap.style.height = '100%'
          wrap.style.wordBreak = 'break-all'
          wrap.style.display = 'flex'
          wrap.style.alignItems = 'center'
          wrap.style.justifyContent = 'center'
          wrap.style.border = '2px solid #bbdcfa'
          wrap.style.background = '#ddefff'
          wrap.style.borderRadius = '4px'
          wrap.style.fontSize = '12px'
          wrap.innerText = row.data.label
          return wrap
        }
        return row
      })
    }

    const getData = () => {
      graph.value && (graph.value as Graph).dispose()
      if (props.tab.language !== 'SQL' && !props.tab.script) return

      const settingValue = props.tab.settingRef.value?.value?.getValues()
      const sqlType = settingValue ? settingValue.type || 'MYSQL' : 'MYSQL'

      getSqlLineage({
        sqlType,
        sqlStatement: props.tab.script as string
      }).then((res: any) => {
        const cells: Cell[] = []
        const shape = [
          ...formatNode(
            res.tables.map((node: any) => {
              node.data = { label: node.label }
              node.shape = 'dag-node'
              node.id = String(node.id)
              delete node.label
              return node
            })
          ),
          ...res.relations.map((line: any) => {
            line.shape = 'dag-edge'
            line.source.cell = String(line.source.cell)
            line.target.cell = String(line.target.cell)
            line.id = 'l' + line.id
            return line
          })
        ]

        initGraph()
        registerNode()
        registerEdge()
        edgeHover()

        shape.forEach((item) => {
          if (item.shape === 'html') {
            cells.push((graph.value as Graph).addNode(item))
          } else {
            cells.push((graph.value as Graph).addEdge(item))
          }
        })
        ;(graph.value as Graph).resetCells(cells)
        formatSqlLineage(graph.value)
      })
    }

    const resize = debounce(() => {
      if (dagContainer.value && true) {
        const w = dagContainer.value.offsetWidth
        const h = dagContainer.value.offsetHeight
        graph.value?.resize(w, h)
      }
    }, 200)

    useResizeObserver(dagContainer, resize)

    onMounted(() => {
      getData()
    })

    return {
      container,
      'dag-container': dagContainer,
      minimapContainer
    }
  },
  render() {
    return (
      <div
        ref='dag-container'
        style={{ width: '100%', height: 'calc(100vh - 220px)' }}
      >
        <div ref='container' style={{ width: '100%', height: '100%' }} />
        <div
          ref='minimapContainer'
          style={{
            position: 'absolute',
            right: 0,
            bottom: 0,
            border: 'dashed 1px #e4e4e4',
            'z-index': 9
          }}
        ></div>
      </div>
    )
  }
})

export { SqlLineage }
