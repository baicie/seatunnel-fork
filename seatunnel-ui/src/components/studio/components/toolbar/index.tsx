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

import { defineComponent, inject, ref, PropType, onMounted, watch } from 'vue'
import { NButton, NEllipsis, NIcon, NSpace, NTooltip } from 'naive-ui'
import {
  FullscreenOutlined,
  DeploymentUnitOutlined,
  CloseOutlined
} from '@vicons/antd'
import { configProviderInjectionKey } from '../../context'
import { useLocale } from '../../hooks'
import type { ITab } from '../../types/tab'
import styles from './index.module.scss'
import { useTaskConfigStore } from '@/store/dag/task-config'

export const Toolbar = defineComponent({
  name: 'toolbar',
  emits: ['fullscreen', 'codeImport', 'switchPanel'],
  props: {
    tab: {
      type: Object as PropType<ITab>,
      default: {}
    }
  },
  setup(props, { emit }) {
    const { t } = useLocale()
    const showLineage = ref(true)
    const filePath = ref(
      typeof props.tab.path === 'string' ? props.tab.path : ''
    )
    const onSwitchPanel = (type: string) => {
      emit('switchPanel', type)
    }
    const { renderToolbarRef } = inject(configProviderInjectionKey, {
      // eslint-disable-next-line no-unused-vars, @typescript-eslint/no-unused-vars
      renderToolbarRef: ref((tab: ITab) => null)
    })

    const handleClearCodeImport = () => {
      const taskConfigStore = useTaskConfigStore()
      const code = taskConfigStore.getCurrentTaskCode
      taskConfigStore.clearResourceImport(code, {
        code,
        script: ''
      })
    }

    const handleFullscreen = () => {
      emit('fullscreen')
    }

    onMounted(() => {
      showLineage.value = props.tab.taskType === 'SQL'
    })

    watch(
      () => props.tab,
      () => {
        filePath.value =
          typeof props.tab.path === 'string' ? props.tab.path : ''
        showLineage.value = props.tab.taskType === 'SQL'
      }
    )

    return () => (
      <NSpace
        justify='space-between'
        style={{ paddingRight: '20px' }}
        class={styles['title']}
      >
        {props.tab.paneType === 'script' && props.tab.editor !== false && (
          <div
            class={
              props.tab.resourceId
                ? styles['warning-text']
                : styles['not-exit-text']
            }
          >
            {props.tab.resourceId && (
              <>
                <NEllipsis
                  style={{
                    paddingLeft: '10px',
                    marginRight: '20px',
                    width: '100%',
                    maxWidth: 'calc(100% - 20px)',
                    color:
                      props.tab.resourceId && !filePath.value ? 'red' : null
                  }}
                >
                  {filePath.value ||
                    (props.tab.resourceId &&
                      props.tab?.ideContentField?.resourceFullName)}
                </NEllipsis>
                <span class={styles['close-icon']}>
                  <NButton text color='#545557' onClick={handleClearCodeImport}>
                    <NIcon size={12}>
                      <CloseOutlined />
                    </NIcon>
                  </NButton>
                </span>
              </>
            )}
          </div>
        )}
        <NSpace>
          {renderToolbarRef.value(props.tab)}
          {showLineage.value && (
            <NTooltip trigger='hover'>
              {{
                trigger: () => (
                  <NButton
                    text
                    style={{ fontSize: '18px' }}
                    onClick={() => void onSwitchPanel('sql-lineage')}
                  >
                    <NIcon>
                      <DeploymentUnitOutlined />
                    </NIcon>
                  </NButton>
                ),
                default: () => t('sql_lineage')
              }}
            </NTooltip>
          )}
          {props.tab.paneType === 'script' && props.tab.editor !== false && (
            <NTooltip trigger='hover'>
              {{
                trigger: () => (
                  <NButton
                    text
                    style={{ fontSize: '18px' }}
                    onClick={handleFullscreen}
                  >
                    <NIcon>
                      <FullscreenOutlined />
                    </NIcon>
                  </NButton>
                ),
                default: () => t('fullscreen')
              }}
            </NTooltip>
          )}
        </NSpace>
      </NSpace>
    )
  }
})
