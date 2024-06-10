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

import { defineComponent, h, unref, renderSlot, isVNode } from 'vue'
import { useFormItem } from 'naive-ui/es/_mixins'
import {
  NFormItemGi,
  NSpace,
  NButton,
  NGrid,
  NGridItem,
  NCard,
  NDescriptions,
  NDescriptionsItem,
  NTooltip
} from 'naive-ui'
import { isFunction } from 'lodash'
import {
  PlusOutlined,
  DeleteOutlined,
  EditOutlined,
  ShrinkOutlined
} from '@vicons/antd'
import getField from './get-field'
import {
  CYCLE_LIST,
  CYCLE_TYPE,
  DATE_LSIT,
  getChildrenDefaultValue
} from '../utils'
import type { IJsonItem, FormItemRule } from '../types'
import styles from './index.module.scss'
import ButtonLink from '@/components/button-link'
import { useRouter } from 'vue-router'
import { truncateString } from '@/utils/truncate-text'
import { useI18n } from 'vue-i18n'
import { ITaskState } from '@/common/types'
import { useTaskNodeStore } from '@/store/project'
import { tasksState } from '@/common/common'

const KEYS = [
  'projectCode',
  'definitionCode',
  'depTaskCodes',
  'cycle',
  'dateValue',
  'timeType'
]

const SwitchRelation = defineComponent({
  name: 'SwitchRelation',
  emits: ['add'],
  setup(props, ctx) {
    const formItem = useFormItem({})

    const onAdd = () => void ctx.emit('add')

    return { onAdd, disabled: formItem.mergedDisabledRef }
  },

  render() {
    const { disabled, $slots } = this
    return [
      h(
        NSpace,
        { vertical: true, style: { width: '100%' } },
        {
          default: () => renderSlot($slots, 'default', { disabled })
        }
      )
    ]
  }
})

export function renderSwitchRelation(
  item: IJsonItem,
  fields: { [field: string]: any },
  rules: { [key: string]: FormItemRule | FormItemRule[] }[],
  updateValue?: (value: any, field: string) => void
) {
  const { t } = useI18n()
  const router = useRouter()
  const nodeStore = useTaskNodeStore()

  const dependentResult = nodeStore.getDependentResult
  const TasksStateConfig = tasksState(t)

  const mergedItem = isFunction(item) ? item() : item
  const { field, children = [] } = mergedItem
  const { defaultValue, ruleItem } = getChildrenDefaultValue(children)
  rules.push(ruleItem)
  const getChild = (item: { field: string }, i: number) =>
    children.map((child: IJsonItem) => {
      const mergedChild = isFunction(child) ? child(i) : child
      const children = {
        default: () =>
          getField(
            mergedChild,
            item,
            undefined,
            updateValue,
            `${field}.${mergedChild.field}.${i}`
          )
      } as {
        [key: string]: Function
      }
      if (isVNode(mergedChild.name)) {
        children.label = () => h(mergedChild.name ? mergedChild.name : ' ')
      }
      return h(
        NFormItemGi,
        {
          showLabel: !!mergedChild.name,
          path: mergedChild.path || `${field}[${i}].${mergedChild.field}`,
          span: unref(mergedChild.span),
          label: !isVNode(mergedChild.name) ? mergedChild.name : '',
          class: mergedChild.class,
          rule: mergedChild.rule
        },
        children
      )
    })

  const getChildren = ({ disabled }: { disabled: boolean }) =>
    fields[field].map(
      (item: { field: string; disabled?: boolean }, i: number) => {
        let child = getChild(item, i)
        if (field === 'dependTaskList') {
          child.splice(
            1,
            0,
            h(
              NGridItem,
              {
                span: 1,
                class: styles['relation-add']
              },
              () =>
                h(
                  NButton,
                  {
                    circle: true,
                    size: 'tiny',
                    type: 'info',
                    disabled,
                    style: {
                      left: '-35px',
                      bottom: '5px'
                    },
                    onClick: () => {
                      rules.push(ruleItem)
                      fields[field][i]['dependItemList'].push({
                        ...defaultValue.dependItemList[0],
                        isEdit: true
                      })
                      fields[field][i].relation = 'AND'
                    }
                  },
                  {
                    icon: () => h(PlusOutlined)
                  }
                )
            )
          )
        } else {
          if (!fields[field][i].isEdit) {
            let projectName: any
            if (fields[field][i].projectCodeOptions) {
              const projectOption = fields[field][i].projectCodeOptions?.filter(
                (item: any) => item.value === fields[field][i].projectCode
              )
              projectName = projectOption.length
                ? projectOption[0]?.label
                : null
            }

            let workflowName: any
            if (fields[field][i].definitionCodeOptions) {
              const workflowOption = fields[field][
                i
              ].definitionCodeOptions.filter(
                (item: any) => item.value === fields[field][i].definitionCode
              )
              workflowName = workflowOption.length
                ? workflowOption[0].label
                : null
            }

            let taskName = (fields[field][i].depTaskCodes?.map((code: any) =>
              String(code)
            ) || []) as string[]
            if (fields[field][i].allTask) {
              taskName = ['ALL']
            } else if (fields[field][i].depTaskCodeOptions) {
              const optionCodes = fields[field][i].depTaskCodeOptions.map(
                (option: any) => option.value
              )
              taskName = fields[field][i].depTaskCodes.map((code: number) => {
                if (optionCodes.includes(code)) {
                  return fields[field][i].depTaskCodeOptions.filter(
                    (option: any) => code === option.value
                  )[0].label
                } else {
                  return String(code)
                }
              })
              // if (
              //   taskName.length > 1 &&
              //   taskName.length === fields[field][i].depTaskCodeOptions.length
              // ) {
              //   taskName = ['ALL']
              // }
            }

            child = [
              h(
                NFormItemGi,
                {
                  span: 22
                },
                {
                  default: () =>
                    h(
                      NCard,
                      { contentStyle: 'padding: 10px' },
                      {
                        default: () =>
                          h(
                            NDescriptions,
                            {
                              labelPlacement: 'left',
                              title: '',
                              column: 1,
                              labelStyle: { fontWeight: 500 },
                              style: { overflow: 'auto' }
                            },
                            {
                              default: () => [
                                h(
                                  NDescriptionsItem,
                                  {},
                                  {
                                    label: () => t('project.node.project_name'),
                                    default: () => {
                                      if (projectName) {
                                        return h(
                                          NTooltip,
                                          {},
                                          {
                                            trigger: () =>
                                              h(
                                                ButtonLink,
                                                {
                                                  text: true,
                                                  onClick: () => {
                                                    const url = router.resolve({
                                                      name: 'projects-overview',
                                                      query: {
                                                        project:
                                                          fields[field][i]
                                                            .projectCode,
                                                        global: 'false'
                                                      }
                                                    })
                                                    window.open(url.href)
                                                  }
                                                },
                                                {
                                                  default: () =>
                                                    truncateString(
                                                      projectName,
                                                      36
                                                    )
                                                }
                                              ),
                                            default: () => projectName
                                          }
                                        )
                                      } else {
                                        return fields[field][i].projectCode
                                      }
                                    }
                                  }
                                ),
                                h(
                                  NDescriptionsItem,
                                  {},
                                  {
                                    label: () =>
                                      t('project.node.workflow_name'),
                                    default: () => {
                                      if (workflowName) {
                                        return h(
                                          NTooltip,
                                          {},
                                          {
                                            trigger: () =>
                                              h(
                                                ButtonLink,
                                                {
                                                  text: true,
                                                  onClick: () => {
                                                    const url = router.resolve({
                                                      name: 'workflow-definition-detail',
                                                      params: {
                                                        projectCode:
                                                          fields[field][i]
                                                            .projectCode,
                                                        code: fields[field][i]
                                                          .definitionCode
                                                      },
                                                      query: {
                                                        project:
                                                          fields[field][i]
                                                            .projectCode,
                                                        global: 'false'
                                                      }
                                                    })
                                                    window.open(url.href)
                                                  }
                                                },
                                                {
                                                  default: () =>
                                                    truncateString(
                                                      workflowName,
                                                      36
                                                    )
                                                }
                                              ),
                                            default: () => workflowName
                                          }
                                        )
                                      } else {
                                        return fields[field][i].definitionCode
                                      }
                                    }
                                  }
                                ),
                                h(
                                  NDescriptionsItem,
                                  {},
                                  {
                                    label: () => t('project.node.task_name'),
                                    default: () =>
                                      h(
                                        NSpace,
                                        {},
                                        {
                                          default: () =>
                                            taskName.map((item: any, index) =>
                                              h(
                                                NTooltip,
                                                {},
                                                {
                                                  trigger: () =>
                                                    h(
                                                      NButton,
                                                      {
                                                        text: true
                                                      },
                                                      {
                                                        default: () =>
                                                          index !==
                                                          taskName.length - 1
                                                            ? `${truncateString(
                                                                item,
                                                                36
                                                              )},`
                                                            : truncateString(
                                                                item,
                                                                36
                                                              )
                                                      }
                                                    ),
                                                  default: () => item
                                                }
                                              )
                                            )
                                        }
                                      )
                                  }
                                ),
                                h(
                                  NDescriptionsItem,
                                  {},
                                  {
                                    label: () => t('project.node.cycle_time'),
                                    default: () => {
                                      const item = fields[field][i]
                                      const type = item.timeType
                                        ? t(CYCLE_TYPE[item.timeType])
                                        : ''
                                      const cycle = item.cycle
                                        ? t(CYCLE_LIST[item.cycle])
                                        : ''
                                      const date = item.dateValue
                                        ? t(DATE_LSIT[item.dateValue])
                                        : ''
                                      return `${type} > ${cycle} > ${date}`
                                    }
                                  }
                                ),
                                router.currentRoute.value.name !==
                                'workflow-instance-detail'
                                  ? null
                                  : h(
                                      NDescriptionsItem,
                                      {},
                                      {
                                        label: () => t('project.node.status'),
                                        default: () => {
                                          const item = fields[field][i]
                                          const key = `${
                                            item.definitionCode
                                          }-${item.depTaskCodes?.join(',')}-${
                                            item.cycle
                                          }-${item.dateValue}`

                                          const state: ITaskState =
                                            dependentResult[key] ||
                                            'WAITING_THREAD'
                                          return TasksStateConfig[state].desc
                                        }
                                      }
                                    )
                              ]
                            }
                          )
                      }
                    )
                }
              )
            ]
          }
        }
        return h(NGrid, { xGap: 10 }, () => [
          ...child,
          h(
            NGridItem,
            {
              span: 2,
              class: styles['relation-delete']
            },
            () =>
              h(
                NSpace,
                { vertical: true },
                {
                  default: () => [
                    field !== 'dependTaskList'
                      ? h(
                          NButton,
                          {
                            circle: true,
                            type: 'info',
                            size: 'tiny',
                            secondary: field !== 'dependTaskList',
                            disabled: item.disabled ? item.disabled : disabled,
                            onClick: () => {
                              if (
                                Object.keys(fields[field][i]).filter(
                                  (key: any) =>
                                    KEYS.includes(key) &&
                                    fields[field][i][key] === null
                                ).length > 0
                              ) {
                                window.$message.error('依赖项不能为空')
                                return
                              }
                              fields[field][i].isEdit = !fields[field][i].isEdit
                            }
                          },
                          {
                            icon: () =>
                              h(
                                fields[field][i].isEdit
                                  ? ShrinkOutlined
                                  : EditOutlined
                              )
                          }
                        )
                      : null,
                    h(
                      NButton,
                      {
                        circle: true,
                        type: 'error',
                        size: 'tiny',
                        secondary: field !== 'dependTaskList',
                        disabled:
                          (fields.dependTaskList?.length == 1 &&
                            field === 'dependTaskList') ||
                          fields[field].length === 1,
                        onClick: () => {
                          fields[field].splice(i, 1)
                          rules.splice(i, 1)
                        }
                      },
                      {
                        icon: () => h(DeleteOutlined)
                      }
                    )
                  ]
                }
              )
          )
        ])
      }
    )

  return h(
    SwitchRelation,
    {},
    {
      default: getChildren
    }
  )
}
