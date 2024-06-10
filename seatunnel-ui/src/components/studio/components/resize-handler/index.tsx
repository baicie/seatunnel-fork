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
import {
  defineComponent,
  ref,
  PropType,
  Ref,
  onMounted,
  onUnmounted
} from 'vue'
import { NButton, NIcon, NSpace, NTooltip } from 'naive-ui'
import { CaretRightOutlined, CaretLeftOutlined } from '@vicons/antd'
import { getDirection } from './helpers'
import styles from './index.module.scss'
import type { HandlerPlacement, ResizedOptions } from './types'
import { useI18n } from 'vue-i18n'
import { isMac } from '@/common/common'
import key from 'keymaster'

const resizeHandlerProps = {
  placement: {
    type: String as PropType<HandlerPlacement>,
    default: 'right'
  },
  from: {
    type: String,
    default: ''
  },
  xPosition: {
    type: Object as PropType<Ref<'left' | 'right' | 'center'>>,
    default: {
      value: 'center'
    }
  }
}

export { ResizedOptions }
export { HandlerPlacement } from './types'

export const ResizeHandler = defineComponent({
  name: 'resize-handler',
  props: resizeHandlerProps,
  emits: ['resized', 'actionClick'],
  setup(props, { emit }) {
    const { t } = useI18n()
    const handlerRef = ref()
    const { placement } = props
    const direction = getDirection(placement)
    let memoizedBodyStyleCursor = ''
    let startPosition = 0
    const getClasses = (placement: HandlerPlacement): string[] => {
      const classes = [
        styles['resize-handler'],
        styles[`resize-handler-${placement}`]
      ]

      classes.push(
        direction === 'x'
          ? styles['resize-handler-x']
          : styles['resize-handler-y']
      )
      return classes
    }
    const classes = getClasses(placement)

    const onMouseDown = (ev: MouseEvent) => {
      document.body.style['user-select' as any] = 'none'
      startPosition = direction === 'y' ? ev.clientY : ev.clientX
      memoizedBodyStyleCursor = document.body.style.cursor
      document.body.style.cursor = direction === 'y' ? 'ns-resize' : 'ew-resize'
      document.addEventListener('mousemove', onMouseMove)
      document.addEventListener('mouseup', onMouseUp)
    }
    const onMouseMove = (ev: MouseEvent) => {
      if (direction === 'x') {
        const increment = startPosition - ev.clientX
        emit('resized', {
          x: increment
        })
        startPosition = ev.clientX
      } else {
        const increment = startPosition - ev.clientY
        emit('resized', {
          y: increment
        })
        startPosition = ev.clientY
      }
    }
    const onMouseUp = () => {
      document.removeEventListener('mousemove', onMouseMove)
      document.removeEventListener('mouseup', onMouseUp)
      document.body.style['user-select' as any] = 'auto'
      document.body.style.cursor = memoizedBodyStyleCursor
    }
    const onMouseEnter = () => {
      if (props.xPosition.value !== 'center' || !handlerRef.value) return
      handlerRef.value.style.opacity = 1
    }

    const onMouseLeave = () => {
      if (props.xPosition.value !== 'center' || !handlerRef.value) return
      handlerRef.value.style.opacity = 0
    }

    const onActionClick = (direction: 'left' | 'right') => {
      emit('actionClick', direction)
    }

    onMounted(() => {
      if (handlerRef.value) {
        handlerRef.value.addEventListener('mousedown', onMouseDown)
        handlerRef.value.addEventListener('mouseenter', onMouseEnter)
        handlerRef.value.addEventListener('mouseleave', onMouseLeave)
        if (props.from === 'dag') {
          document.addEventListener('mousemove', onMouseLeave)
        }
      }
    })
    onUnmounted(() => {
      if (handlerRef.value) {
        handlerRef.value.removeEventListener('mousedown', onMouseDown)
        handlerRef.value.removeEventListener('mouseenter', onMouseEnter)
        handlerRef.value.removeEventListener('mouseleave', onMouseLeave)
        if (props.from === 'dag') {
          document.removeEventListener('mousemove', onMouseLeave)
        }
      }
    })

    const preventAction = (e: KeyboardEvent) => {
      if ((e.keyCode == 219 && e.metaKey) || (e.keyCode == 219 && e.ctrlKey)) {
        e.preventDefault()
      }
    }

    onMounted(() => {
      key('ctrl+[, ⌘+[', () => {
        onActionClick('left')
      })
      key('ctrl+], ⌘+]', () => {
        onActionClick('right')
      })
      document.addEventListener('keydown', preventAction)
    })

    onUnmounted(() => {
      key.unbind('ctrl+[, ⌘+[')
      key.unbind('ctrl+], ⌘+]')
      document.removeEventListener('keydown', preventAction)
    })

    const actionsXPosition = {
      center: '-4px',
      left: '-9px',
      right: '-4px'
    }
    return () => (
      <div
        ref={handlerRef}
        class={classes}
        style={{
          opacity:
            props.xPosition.value === 'center' && props.from !== 'dag' ? 0 : 1
        }}
        onMousemove={(ev) => {
          ev.stopPropagation()
        }}
      >
        <div
          class={styles['handler-inner']}
          style={{
            display: props.xPosition.value === 'center' ? 'block' : 'none'
          }}
        ></div>
        {props.from === 'dag' && (
          <NSpace
            class={styles['handler-actions']}
            vertical
            style={{
              left: actionsXPosition[props.xPosition.value]
            }}
          >
            <NTooltip>
              {{
                trigger: () => (
                  <NButton
                    size='tiny'
                    round
                    strong
                    style={{
                      '--n-color': '#fff',
                      '--n-color-hover': '#fff',
                      '--n-color-pressed': '#fff',
                      '--n-color-focus': '#fff',
                      display:
                        props.xPosition.value === 'left' ? 'none' : 'flex'
                    }}
                    onClick={() => void onActionClick('left')}
                  >
                    {{
                      icon: () => (
                        <NIcon size={10}>
                          <CaretLeftOutlined />
                        </NIcon>
                      )
                    }}
                  </NButton>
                ),
                default: () =>
                  t(`project.dag.left_shortcut${isMac() ? '_mac' : ''}`)
              }}
            </NTooltip>
            <NTooltip>
              {{
                trigger: () => (
                  <NButton
                    size='tiny'
                    round
                    strong
                    style={{
                      '--n-color': '#fff',
                      '--n-color-hover': '#fff',
                      '--n-color-pressed': '#fff',
                      '--n-color-focus': '#fff',
                      display:
                        props.xPosition.value === 'right' ? 'none' : 'flex'
                    }}
                    onClick={() => void onActionClick('right')}
                  >
                    {{
                      icon: () => (
                        <NIcon size={10} style={{ marginLeft: '1px' }}>
                          <CaretRightOutlined />
                        </NIcon>
                      )
                    }}
                  </NButton>
                ),
                default: () =>
                  t(`project.dag.right_shortcut${isMac() ? '_mac' : ''}`)
              }}
            </NTooltip>
          </NSpace>
        )}
      </div>
    )
  }
})
