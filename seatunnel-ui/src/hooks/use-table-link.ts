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

import { VNodeChild, h } from 'vue'
import { NButton, NEllipsis, NIcon, NSpace } from 'naive-ui'
import ButtonLink from '@/components/button-link'
import { useTextCopy } from '@/hooks'
import { CopyOutlined } from '@vicons/antd'
import { CompareFn } from 'naive-ui/es/data-table/src/interface'

interface ITableLinkParams {
  title: string | (() => VNodeChild)
  key: string
  width?: number
  columnWidth?: number
  copy?: boolean
  sorter?: boolean | CompareFn<any> | 'default'
  minWidth?: string | number
  ellipsis?: any
  textColor?: (rowData: any) => string
  showEmpty?: boolean
  columnSelectorDisabled?: boolean
  columnSelectorFilter?: boolean
  button: {
    permission?: string
    getHref?: (rowData: any) => string | null | undefined
    showText?: (rowData: any) => boolean
    onClick?: (rowData: any) => void
    disabled?: (rowData: any) => boolean
  }
  getStateVnode?: (rowData: any) => VNodeChild
}

export const useTableLink = (
  params: ITableLinkParams,
  module?: IPermissionModule
) => {
  const functionPermissions = usePermissionStore().getPermissions(
    module || 'common',
    'function'
  )
  const routerPermissions = usePermissionStore().getPermissions(
    module || 'common',
    'router'
  )

  const getButtonVnode = (rowData: any) => {
    const { copy } = useTextCopy()
    const width = params.columnWidth ? params.columnWidth : params.width
    const maxWidth = width ? width - 24 : width || 30
    const textColor = params.textColor ? params.textColor(rowData) || '' : ''
    return !(params.button.showText && params.button.showText(rowData)) &&
      (!params.button.permission ||
        functionPermissions.has(params.button.permission) ||
        routerPermissions.has(params.button.permission))
      ? [
          h(
            ButtonLink,
            {
              href: params.button.getHref
                ? params.button.getHref(rowData)
                : null,
              onClick: () =>
                params.button.onClick && params.button.onClick(rowData),
              disabled:
                params.button.disabled && params.button.disabled(rowData)
            },
            {
              default: () =>
                h(
                  NEllipsis,
                  {
                    style: `max-width: ${
                      params.copy ? maxWidth - 40 : maxWidth
                    }px; color: ${textColor}`
                  },
                  () => {
                    if (!params.showEmpty) {
                      return rowData[params.key]
                    } else {
                      return rowData[params.key] || '-'
                    }
                  }
                )
            }
          ),
          params.copy &&
            h(
              NButton,
              {
                quaternary: true,
                circle: true,
                type: 'info',
                size: 'tiny',
                onClick: () => void copy(rowData[params.key])
              },
              { icon: () => h(NIcon, { size: 16 }, () => h(CopyOutlined)) }
            ),
          params.getStateVnode && params.getStateVnode(rowData)
        ]
      : [
          h(
            NEllipsis,
            { style: `max-width: ${maxWidth}px;  color: ${textColor}` },
            () => {
              if (!params.showEmpty) {
                return rowData[params.key]
              } else {
                return rowData[params.key] || '-'
              }
            }
          ),
          params.copy &&
            h(
              NButton,
              {
                quaternary: true,
                circle: true,
                type: 'info',
                size: 'tiny',
                onClick: () => void copy(rowData[params.key])
              },
              { icon: () => h(NIcon, { size: 16 }, () => h(CopyOutlined)) }
            ),
          params.getStateVnode && params.getStateVnode(rowData)
        ]
  }

  return {
    title: params.title,
    key: params.key,
    titleColSpan: 1,
    width: params.width || '',
    minWidth: params.minWidth || '',
    sorter: params.sorter,
    ellipsis: params.ellipsis || false,
    columnSelectorFilter: params.columnSelectorFilter,
    columnSelectorDisabled: params.columnSelectorDisabled,
    render: (rowData: any) =>
      h(
        NSpace,
        {
          align: 'center'
        },
        getButtonVnode(rowData)
      )
  }
}
