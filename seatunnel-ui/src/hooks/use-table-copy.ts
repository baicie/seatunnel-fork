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
import { NButton, NEllipsis, NIcon } from 'naive-ui'
import { useTextCopy } from '@/hooks'
import { CopyOutlined } from '@vicons/antd'

interface ITableCopyParams {
  title: string | (() => VNodeChild)
  key: string
  width?: number
  sorter?: string
  minWidth?: string | number
  ellipsis?: any
  textColor?: (rowData: any) => string
  showEmpty?: boolean
}

export const useTableCopy = (params: ITableCopyParams) => {
  const { copy } = useTextCopy()

  const getTextVnode = (rowData: any) => {
    const maxWidth = params.width ? params.width - 24 : params.width || 30
    const textColor = params.textColor ? params.textColor(rowData) || '' : ''

    return [
      h(
        NEllipsis,
        {
          style: `max-width: ${maxWidth - 30}px; color: ${textColor}`
        },
        () => {
          if (!params.showEmpty) {
            return rowData[params.key]
          } else {
            return rowData[params.key] || '-'
          }
        }
      ),
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
      )
    ]
  }

  return {
    title: params.title,
    key: params.key,
    width: params.width || '',
    minWidth: params.minWidth || '',
    sorter: params.sorter,
    ellipsis: params.ellipsis || {},
    render: (rowData: any) => getTextVnode(rowData)
  }
}
