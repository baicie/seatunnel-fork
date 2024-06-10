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
  PropType,
  h,
  ref,
  Ref,
  onMounted,
  watchEffect,
  nextTick,
  computed
} from 'vue'
import { NTabs, NTabPane, NLog, NConfigProvider } from 'naive-ui'
import {
  ResizeHandler,
  ResizedOptions,
  HandlerPlacement
} from '../resize-handler'
import { useLogHeight, useLocale, useTabs } from '../../hooks'
import hljs from 'highlight.js/lib/core'
import { LogToolbar } from '../log-toolbar'
import { useLogOpen } from './use-log-open'
import styles from './index.module.scss'

const props = {
  taskCode: {
    type: Number,
    default: 0
  },
  value: {
    type: String,
    default: ''
  },
  isFullscreen: {
    type: Object as PropType<Ref<boolean>>,
    default: false
  },
  editorShow: {
    type: Boolean,
    default: true
  }
}
export const LogComponent = defineComponent({
  name: 'log-component',
  props: {
    value: {
      type: String as PropType<string>,
      default: ''
    },
    height: {
      type: String as PropType<string>,
      default: '0px'
    },
    logContentRef: {
      type: Object as PropType<Ref>,
      default: ref()
    }
  },
  setup(props) {
    const { logContentRef } = props

    hljs.registerLanguage('studio-log', () => ({
      contains: [
        {
          scope: 'info',
          begin: 'INFO'
        },
        {
          scope: 'warning',
          begin: 'WARNING'
        },
        {
          scope: 'error',
          begin: 'ERROR'
        }
      ]
    }))

    onMounted(() => {
      watchEffect(() => {
        if (props.value) {
          nextTick(() => {
            logContentRef.value?.scrollTo({ position: 'bottom', slient: true })
          })
        }
      })
    })

    return () =>
      h(
        NConfigProvider,
        {
          hljs,
          class: styles.hljs
        },
        () =>
          h(NLog, {
            ref: logContentRef,
            id: 'log-content',
            log: props.value,
            language: 'studio-log',
            style: {
              height: props.height,
              marginRight: '20px'
            }
          })
      )
  }
})

export const Log = defineComponent({
  name: 'log',
  props,
  emits: ['fullscreen'],
  setup(props, { emit }) {
    const { t } = useLocale()
    const resizeY = ref(0)
    const { currentTabRef } = useTabs()
    const { setLogHeight, getLogHeight, getLogMaxHeight, getLogMinHeight } =
      useLogHeight()
    const { logRef, logContentRef } = useLogOpen()

    const onResized = ({ y }: ResizedOptions) => {
      resizeY.value = y
      let height = getLogHeight() + y
      if (height < 40) height = getLogMinHeight()
      if (height > getLogMaxHeight()) height = getLogMaxHeight()
      setLogHeight(height)
    }

    const logHeight = computed(() => {
      if (props.isFullscreen.value) {
        return 'calc(100vh - 170px)'
      }
      if (props.editorShow === false) {
        return '700px'
      }
      return `${getLogHeight() - getLogMinHeight()}px`
    })

    return () => {
      return (
        <div
          class={styles['log-wrap']}
          style={{
            height: !props.isFullscreen.value
              ? `${getLogHeight()}px`
              : 'calc(100vh - 100px)',
            display: getLogHeight() ? 'block' : 'none',
            paddingTop: '10px'
          }}
        >
          <NTabs type='card' size='small' value='log'>
            {{
              suffix: () =>
                h(LogToolbar, {
                  resizeY: resizeY,
                  editorShow: props.editorShow,
                  taskCode: props.taskCode,
                  logContentRef: logContentRef,
                  value: props.value,
                  isFullscreen: props.isFullscreen,
                  onFullscreen: () => emit('fullscreen')
                }),
              default: () => [
                h(
                  NTabPane,
                  {
                    name: 'log'
                  },
                  {
                    tab: () =>
                      h(
                        'div',
                        {
                          ref: logRef,
                          draggable: true
                        },
                        t('run_log')
                      ),
                    default: () =>
                      h(LogComponent, {
                        logContentRef,
                        value: props.value,
                        height: logHeight.value
                      })
                  }
                )
              ]
            }}
          </NTabs>
          {props.editorShow !== false && (
            <ResizeHandler
              placement={HandlerPlacement.T}
              onResized={onResized}
            />
          )}
        </div>
      )
    }
  }
})
