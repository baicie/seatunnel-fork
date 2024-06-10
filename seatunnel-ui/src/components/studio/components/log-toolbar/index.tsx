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

import { computed, defineComponent, PropType, Ref, ref, watch } from 'vue'
import {
  NSpace,
  NIcon,
  NButton,
  NInput,
  NPopover,
  NButtonGroup
} from 'naive-ui'
import {
  CloseOutlined,
  FullscreenOutlined,
  LeftOutlined,
  PauseCircleOutlined,
  PlayCircleOutlined,
  RightOutlined,
  SearchOutlined,
  UpOutlined
} from '@vicons/antd'
import { useLogHeight } from '../../hooks'
import styles from './index.module.scss'
import { useLogTimer } from '../../hooks/use-log-timer'
import { useIdeLogStore } from '../../store/log'
import _ from 'lodash'

const props = {
  resizeY: {
    type: Object as PropType<Ref>,
    default: ref(0)
  },
  taskCode: {
    type: Number as PropType<number>,
    default: 0
  },
  logContentRef: {
    type: Object as PropType<Ref>,
    default: ref()
  },
  value: {
    type: String as PropType<string>,
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

export const LogToolbar = defineComponent({
  name: 'log-toolbar',
  props,
  emits: ['fullscreen'],
  setup(props, { emit }) {
    const { taskCode } = props

    const searchY = ref(0)
    const showPopover = ref(false)
    const searchVal = ref()

    const showCount = ref(false)
    const count = ref(0)
    const total = ref(0)

    const { toggleLogUpAndDown, getLogHeight, getLogMinHeight } = useLogHeight()

    const logStore = useIdeLogStore()
    const logs = logStore.getLogs
    const log = _.find(logs, { taskCode })

    const runFlag = computed(() => {
      return log && (log.timer || log.pause)
    })

    const { pauseLog, restartLog } = useLogTimer(taskCode)

    const handleFullscreen = () => {
      emit('fullscreen')
    }

    const handlePauseLog = () => pauseLog()

    const handleContinue = () => restartLog()

    const clearSearchHtml = () => {
      const prev = document.getElementById('log-search')
      const newNode = document.createTextNode(prev?.innerHTML as string)
      prev && prev.parentNode?.replaceChild(newNode, prev)
    }

    const replaceHTML = (
      str: string,
      matchVal: string,
      replaceVal: string,
      position: number
    ) => {
      const regExp = new RegExp(matchVal, 'g')

      let ret
      const arr = []
      while ((ret = regExp.exec(str)) !== null) {
        arr.push(ret.index)
      }

      if (arr.length === 0) {
        return null
      }

      total.value = arr.length
      const index = position < arr.length ? arr[position] : arr[arr.length - 1]

      return `${str.substring(0, index)}${replaceVal}${str.substring(
        index + matchVal.length
      )}`
    }

    const search = () => {
      if (!searchVal.value) {
        return false
      }

      // show count
      showCount.value = true

      clearSearchHtml()

      const val = searchVal.value
      const preNodes = document
        .getElementById('log-content')
        ?.querySelectorAll('pre')

      if (!preNodes) {
        return false
      }

      const parentNode = preNodes[0].parentNode as HTMLElement
      const content = parentNode.innerHTML

      const newHtml = replaceHTML(
        content,
        val,
        '<span id="log-search" style="background:#d5d5c4">' + val + '</span>',
        count.value
      )

      if (!newHtml) {
        return false
      }

      const div = document.createElement('div')
      div.innerHTML = newHtml
      const span = div.childNodes
      parentNode.replaceChildren(...span)

      const searchNode = document.getElementById('log-search') as HTMLElement
      props.logContentRef.value.scrollTo({ top: searchNode.offsetTop })

      return true
    }

    const searchKey = (e: any) => {
      if (e.keyCode !== 13) {
        return
      }

      if (search() && count.value < total.value) {
        count.value += 1
      }
    }

    const prevSearch = () => {
      if (count.value > 1) {
        count.value -= 2
        search()
        count.value += 1
      }
    }

    const nextSearch = () => {
      if (search() && count.value < total.value) {
        count.value += 1
      }
    }

    watch(
      () => searchVal.value,
      () => {
        count.value = 0
        total.value = 0
        showCount.value = false
      }
    )

    return () => (
      <NSpace style={{ paddingRight: '10px' }} class={styles.floating}>
        <NPopover
          trigger='manual'
          showArrow={false}
          placement='bottom'
          style='padding: 0'
          show={showPopover.value}
          y={searchY.value + props.resizeY.value}
        >
          {{
            trigger: () => (
              <NButton
                text
                onClick={(ev: MouseEvent) => {
                  showPopover.value = !showPopover.value
                  searchY.value = ev.clientY
                }}
              >
                <NIcon>
                  <SearchOutlined />
                </NIcon>
              </NButton>
            ),
            default: () => (
              <NSpace
                vertical
                style={{
                  padding: '10px 10px 0 10px',
                  backgroundColor: '#f8f8fc'
                }}
                size={0}
              >
                <NInput
                  size='small'
                  passively-activated
                  onKeydown={searchKey}
                  v-model:value={searchVal.value}
                >
                  {{
                    suffix: () =>
                      searchVal.value && showCount.value
                        ? `${count.value} / ${total.value}`
                        : ''
                  }}
                </NInput>
                <NSpace>
                  <NButtonGroup>
                    <NButton text onClick={prevSearch}>
                      <NIcon>
                        <LeftOutlined />
                      </NIcon>
                    </NButton>
                    <NButton text onClick={nextSearch}>
                      <NIcon>
                        <RightOutlined />
                      </NIcon>
                    </NButton>
                    <NButton text onClick={() => (showPopover.value = false)}>
                      <NIcon>
                        <CloseOutlined />
                      </NIcon>
                    </NButton>
                  </NButtonGroup>
                </NSpace>
              </NSpace>
            )
          }}
        </NPopover>
        {runFlag.value && (
          <NButton
            text
            onClick={log && log.pause ? handleContinue : handlePauseLog}
          >
            <NIcon>
              {log && log.pause ? (
                <PlayCircleOutlined />
              ) : (
                <PauseCircleOutlined />
              )}
            </NIcon>
          </NButton>
        )}
        {!props.isFullscreen.value && props.editorShow !== false && (
          <NButton
            text
            onClick={() => {
              toggleLogUpAndDown()
              showPopover.value = false
            }}
          >
            <NIcon
              style={{
                transform: `rotate(${
                  getLogHeight() === getLogMinHeight() ? 0 : 180
                }deg)`,
                transition: '0.3'
              }}
            >
              <UpOutlined />
            </NIcon>
          </NButton>
        )}
        <NButton text onClick={handleFullscreen}>
          <NIcon>
            <FullscreenOutlined />
          </NIcon>
        </NButton>
      </NSpace>
    )
  }
})
