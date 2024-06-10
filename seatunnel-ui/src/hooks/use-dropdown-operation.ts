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

import { COLUMN_WIDTH_CONFIG } from '@/common/column-width-config'
import i18n from '@/locales'
import { IPermissionModule, usePermissionStore } from '@/store/user'
import { CaretRightOutlined, MoreOutlined } from '@vicons/antd'
import _, { cloneDeep } from 'lodash'
import { NButton, NDropdown, NIcon, NPopconfirm, NTooltip } from 'naive-ui'
import { VNodeChild, createVNode, h, ref } from 'vue'

export interface ITableDropdownOperationParams {
  title: string
  key: string
  onSelect: (key: string, rowData: any, index: number) => void
  noPermission?: boolean
  run?: {
    tips?: string | ((rowData: any, index: number) => string)
    onClick: (rowData: any, index: number) => void
    icon?: VNodeChild | ((rowData: any, index: number) => VNodeChild)
    permission?: string | ((rowData: any) => string)
    popTips?: string | ((rowData: any) => string)
    disabled?: boolean | ((rowData: any) => boolean)
  }
  options: {
    label?: string | ((rowData: any) => string | VNodeChild)
    key: string
    type?: string
    color?: string
    disabled?: boolean | ((rowData: any) => boolean)
    permission?: string | string[] | ((rowData: any) => string | string[])
    visiable?: boolean | ((rowData: any) => boolean)
    popTips?: string | ((rowData: any) => string)
    children?: ITableDropdownOperationParams['options']
  }[]
}

interface Cache {
  showPopover: boolean
  keyPopover: string
  tipsPopover: string
}

const defaultCache = {
  showPopover: false,
  keyPopover: '',
  tipsPopover: ''
}

export const useDropdownOperation = (
  params: ITableDropdownOperationParams,
  module?: IPermissionModule
) => {
  const { t } = i18n.global
  const cache = ref<Cache[]>([])
  const functionPermissions = usePermissionStore().getPermissions(
    module,
    'function'
  )

  const getOption = (key: string) => {
    const options: any[] = []
    params.options.forEach((option) => {
      if (option.children) {
        options.push(...option.children)
      }
      options.push(option)
    })

    return options.find((option) => option.key === key)
  }

  const genOptions = (rowData: any): any[] =>
    params.options
      .filter((option) => {
        const permission =
          typeof option.permission === 'function'
            ? option.permission(rowData)
            : option.permission
        if (!permission) {
          return true
        }
        return _.isArray(permission)
          ? permission.every((key: string) => functionPermissions.has(key))
          : functionPermissions.has(permission)
      })
      .filter((option) => {
        if (!option.visiable) {
          return true
        }
        const visiable =
          typeof option.visiable === 'function'
            ? option.visiable(rowData)
            : option.visiable
        return visiable
      })
      .map((option) => {
        const disabled =
          typeof option.disabled === 'function'
            ? option.disabled(rowData)
            : !!option.disabled

        const label =
          typeof option.label === 'function'
            ? () => (option.label as Function)(rowData)
            : option.key === 'delete' || option.color === 'error'
            ? () =>
                createVNode('div', { style: { color: 'red' } }, option.label)
            : option.label

        const result = {
          label,
          key: option.key,
          disabled,
          children: option.children ? option.children : undefined
        }
        return option.type ? { ...result, type: option.type } : result
      })

  const onSelect = (key: string, rowData: any, index: number) => {
    const option = getOption(key)
    if (option && option.popTips) {
      const item = cloneDeep(defaultCache)
      item.showPopover = true
      item.keyPopover = option.key
      item.tipsPopover =
        typeof option.popTips === 'function'
          ? option.popTips(rowData)
          : option.popTips
      cache.value[index] = item
    } else {
      params.onSelect(key, rowData, index)
    }
  }

  const funcWarp = <T extends VNodeChild>(
    value: unknown,
    ...args: any[]
  ): T => {
    if (typeof value === 'function') {
      return value(...args)
    }
    return value as T
  }

  const showRun = (rowData: any, index: number) => {
    if (!params.run) {
      return false
    }
    if (params.run.permission) {
      return functionPermissions.has(
        funcWarp(params.run.permission, rowData, index)
      )
    }
    return true
  }

  return {
    title: params.title,
    key: params.key,
    ...COLUMN_WIDTH_CONFIG[params.run ? 'operate_run' : 'operate'],
    render: (rowData: any, index: number) => {
      const item = cache.value[index] || defaultCache
      const runPopDisabled = funcWarp(params?.run?.disabled, rowData, index)
      return [
        showRun(rowData, index) &&
          h(
            NTooltip,
            { disabled: runPopDisabled },
            {
              trigger: () =>
                h(
                  NPopconfirm,
                  {
                    onPositiveClick: () => params.run?.onClick(rowData, index),
                    disabled: runPopDisabled
                  },
                  {
                    default: () =>
                      funcWarp(params.run!.popTips, rowData, index) ||
                      t('project.workflow.start'),
                    trigger: () =>
                      h(
                        NButton,
                        {
                          circle: true,
                          size: 'large',
                          text: true,
                          style: 'margin-right: 12px',
                          disabled: runPopDisabled,
                          onClick: () =>
                            runPopDisabled &&
                            params.run?.onClick(rowData, index)
                        },
                        {
                          default: () =>
                            h(
                              NIcon,
                              { color: 'rgb(114, 114, 114)', size: 24 },
                              {
                                default: () =>
                                  funcWarp(params.run!.icon, rowData, index) ||
                                  h(CaretRightOutlined)
                              }
                            )
                        }
                      )
                  }
                ),
              default: () =>
                funcWarp(params.run!.tips, rowData, index) ||
                t('project.workflow.start')
            }
          ),
        h(
          NDropdown,
          {
            options: genOptions(rowData),
            trigger: 'hover',
            placement: 'left',
            onSelect: (key: string) => onSelect(key, rowData, index)
          },
          h(
            NButton,
            { circle: true, text: true, size: 'large' },
            {
              default: () =>
                h(
                  NIcon,
                  {
                    color: 'rgb(114, 114, 114)',
                    size: 24
                  },
                  { default: () => h(MoreOutlined) }
                )
            }
          )
        ),
        h(
          NPopconfirm,
          {
            show: item.showPopover,
            showArrow: false,
            onPositiveClick: () => {
              params.onSelect(item?.keyPopover, rowData, index)
              item.showPopover = false
            },
            onNegativeClick: () => (item.showPopover = false)
            // negativeText: button.negativeText,
            // positiveText: button.positiveText
          },
          {
            trigger: () => '',
            default: () => item.tipsPopover
          }
        )
      ]
    }
  }
}
