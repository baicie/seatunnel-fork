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

import { computed, defineComponent, h, ref } from 'vue'
import {
  NTabPane,
  NTabs,
  useDialog,
  NBadge,
  NSpace,
  NButton,
  NScrollbar,
  NEllipsis,
  NIcon,
  NPopover
} from 'naive-ui'
import { MonacoEditor } from '../monaco'
import { SqlLineage } from '../sql-lineage'
import { Toolbar } from '../toolbar'
import { Log } from '../log'
import { useLogHeight, useSetting, useTabs } from '../../hooks'
import Fullscreen from './fullscreen'
import { useFullscreen } from './use-fullscreen'
import Empty from './empty'
import Handlers from './handlers'
import _, { find } from 'lodash'
import styles from './index.module.scss'
import { useLocale } from '../../hooks'
import { useIdeLogStore } from '../../store/log'
import { ILog } from '../../store/log/types'
import { QuestionCircleOutlined } from '@vicons/antd'

export const Tabs = defineComponent({
  name: 'tabs',
  setup() {
    const {
      tabsRef,
      currentTabRef,
      tasksStateRef,
      readonlyRef,
      handleScriptChange,
      handlePanelClose,
      handlePanelSave,
      handlePanelChange,
      handlePanelTypeSwitch
    } = useTabs()
    const codeImportRef = ref(false)

    const dialog = useDialog()
    const {
      getEditorHeight,
      getLogHeight,
      setFileLogHeight,
      setLogHeightByFileId
    } = useLogHeight()
    const { isFullscreen, toggleFullscreen } = useFullscreen()
    const { renderSettingRef } = useSetting()
    const { t } = useLocale()

    const logStore = useIdeLogStore()
    const logs = logStore.getLogs

    const handleClose = (currentTabCode: number) => {
      const currentTab = find(tabsRef.value, { code: currentTabCode })
      if (!currentTab) return
      if (!currentTab.changed) {
        handlePanelClose(currentTabCode)
        return
      }
      dialog.warning({
        title: t('close_tips'),
        content: t('close_content'),
        action: () => (
          <NSpace>
            <NButton
              onClick={async () => {
                const result = await handlePanelSave(currentTab)
                if (result) {
                  dialog.destroyAll()
                  handlePanelClose(currentTabCode)
                }
              }}
            >
              {t('save')}
            </NButton>
            <NButton
              onClick={() => {
                handlePanelClose(currentTabCode)
                setFileLogHeight(currentTabCode, 0)
                dialog.destroyAll()
              }}
            >
              {t('force_close')}
            </NButton>
            <NButton onClick={() => dialog.destroyAll()} type='primary'>
              {t('cannel')}
            </NButton>
          </NSpace>
        )
      })
    }

    const handleFullscreen = (id: number) => {
      toggleFullscreen('file-editor-' + id)
    }

    const handleLogFullscreen = (id: number) => {
      toggleFullscreen('file-log-' + id)
    }

    const handleCodeImport = () => {
      codeImportRef.value = true
    }

    const onPanelChange = (code: number) => {
      handlePanelChange(code)
      setLogHeightByFileId(code)
    }

    return () => {
      return !!tabsRef.value.length ? (
        <NTabs
          value={currentTabRef.value}
          type='card'
          closable
          tabStyle={{
            minWidth: '80px',
            height: '100%'
          }}
          size='small'
          onClose={handleClose}
          class={styles['tabs']}
          onUpdateValue={onPanelChange}
        >
          {tabsRef.value.map((tab) => {
            let log = _.find(logs, { taskCode: tab.code })
            if (!log) {
              logStore.addLog({
                taskCode: tab.code,
                commandId: -1,
                content: t('debug_tips'),
                timer: 0,
                pause: false,
                skipLineNum: 0
              })
              const logs = logStore.getLogs
              log = (_.find(logs, { taskCode: tab.code }) || {}) as ILog
            }

            let rawScript
            let dataSource = 0
            if (tab.settingRef.value) {
              const settingValue = tab.settingRef.value?.value?.getValues()
              dataSource =
                settingValue.datasource ||
                settingValue.sourceMysqlDatasource ||
                0

              rawScript = settingValue.rawScript
            }

            const editorReadonly = computed(() => {
              return (
                readonlyRef.value ||
                tab.resourceType === 'GIT' ||
                (tab.resourceId && !tab.path)
              )
            })

            return (
              <NTabPane
                name={tab.code}
                key={tab.code}
                tab={() => (
                  <NSpace size={4}>
                    <NEllipsis style='max-width: 200px'>
                      {tab.name || tab.code}
                    </NEllipsis>
                    {tasksStateRef.value[tab.code] && (
                      <NBadge dot type='warning' />
                    )}
                  </NSpace>
                )}
              >
                <Toolbar
                  onFullscreen={() => void handleFullscreen(tab.code)}
                  onCodeImport={() => handleCodeImport()}
                  onSwitchPanel={(type) => {
                    if (type === 'sql-lineage') {
                      return void handlePanelTypeSwitch(tab, type)
                    }
                  }}
                  tab={tab}
                />
                {tab.editor !== false && tab.paneType === 'initScript' && (
                  <Fullscreen
                    id={'file-editor-' + tab.code}
                    isFullscreen={isFullscreen.value}
                    onClose={() => void handleFullscreen(tab.code)}
                  >
                    <MonacoEditor
                      value={
                        typeof tab.initScript === 'undefined'
                          ? rawScript
                          : tab.initScript
                      }
                      options={{
                        language: tab.language,
                        readOnly: editorReadonly.value
                      }}
                      height={
                        !isFullscreen.value
                          ? `${getEditorHeight() - getLogHeight() - 40 - 45}px`
                          : 'calc(100vh - 70px)'
                      }
                      onUpdateValue={(value: string) =>
                        void handleScriptChange(value, tab, 'initScript')
                      }
                      key={tab.language}
                      code={tab.code}
                      dataSource={dataSource}
                    />
                  </Fullscreen>
                )}
                {tab.editor !== false && tab.paneType === 'script' && (
                  <Fullscreen
                    id={'file-editor-' + tab.code}
                    isFullscreen={isFullscreen.value}
                    onClose={() => void handleFullscreen(tab.code)}
                  >
                    {tab.taskType === 'ZDATAX' && (
                      <NSpace justify='end'>
                        <NPopover
                          trigger='hover'
                          placement='left'
                          style={{ maxWidth: '500px' }}
                        >
                          {{
                            trigger: () =>
                              h(
                                NIcon,
                                { size: 20, class: styles['question-icon'] },
                                () => h(QuestionCircleOutlined)
                              ),
                            default: () => [
                              t('task_param_datax_tips'),
                              h('br'),
                              t('task_example'),
                              h(
                                'pre',
                                {
                                  class: styles['json']
                                },
                                JSON.stringify(
                                  { key1: 'value1', key2: 'value2' },
                                  null,
                                  2
                                )
                              )
                            ]
                          }}
                        </NPopover>
                      </NSpace>
                    )}
                    {tab.taskType === 'ZFLINKX' && (
                      <NSpace justify='end'>
                        <NPopover
                          trigger='hover'
                          placement='left'
                          style={{ maxWidth: '500px' }}
                        >
                          {{
                            trigger: () =>
                              h(
                                NIcon,
                                { size: 20, class: styles['question-icon'] },
                                () => h(QuestionCircleOutlined)
                              ),
                            default: () => [
                              t('task_param_flinkx_tips'),
                              h('br'),
                              t('task_example'),
                              h(
                                'pre',
                                {
                                  class: styles['json']
                                },
                                JSON.stringify(
                                  [
                                    {
                                      paramName: 'param1',
                                      paramCommand: 'value1',
                                      id: -1,
                                      type: 1
                                    },
                                    {
                                      paramName: 'param2',
                                      paramCommand: 'value2',
                                      id: -1,
                                      type: 1
                                    }
                                  ],
                                  null,
                                  2
                                )
                              )
                            ]
                          }}
                        </NPopover>
                      </NSpace>
                    )}
                    <MonacoEditor
                      value={
                        typeof tab.script === 'undefined'
                          ? rawScript
                          : tab.script
                      }
                      options={{
                        language: tab.language,
                        readOnly: editorReadonly.value
                      }}
                      height={
                        !isFullscreen.value
                          ? `${getEditorHeight() - getLogHeight() - 40 - 45}px`
                          : 'calc(100vh - 70px)'
                      }
                      onUpdateValue={(value: string) =>
                        void handleScriptChange(value, tab, 'script')
                      }
                      key={tab.language}
                      code={tab.code}
                      dataSource={dataSource}
                    />
                  </Fullscreen>
                )}

                <div
                  class={styles['setting']}
                  v-show={tab.paneType === 'setting'}
                >
                  <NScrollbar
                    style={{
                      height: `${
                        getEditorHeight() - getLogHeight() - 40 - 45
                      }px`
                    }}
                  >
                    {renderSettingRef.value(tab)}
                  </NScrollbar>
                </div>

                {tab.paneType === 'sql-lineage' && <SqlLineage tab={tab} />}

                <Fullscreen
                  id={'file-log-' + tab.code}
                  isFullscreen={isFullscreen.value}
                  onClose={() => void handleLogFullscreen(tab.code)}
                >
                  <Log
                    editorShow={tab.editor}
                    taskCode={tab.code}
                    v-model:value={log.content}
                    onFullscreen={() => void handleLogFullscreen(tab.code)}
                    isFullscreen={isFullscreen}
                  />
                </Fullscreen>
                <Handlers
                  onSwitchPanel={(type) =>
                    void handlePanelTypeSwitch(tab, type)
                  }
                  paneType={tab.paneType}
                  extraHandlers={tab.handlers}
                />
              </NTabPane>
            )
          })}
        </NTabs>
      ) : (
        <Empty />
      )
    }
  }
})
