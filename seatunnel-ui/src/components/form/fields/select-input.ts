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

import { h, unref } from 'vue'
import { NInput, NSelect, NSpace, NSwitch } from 'naive-ui'
import { isFunction } from 'lodash'
import type { IJsonItem } from '../types'
import { useI18n } from 'vue-i18n'

export function renderSelectInput(
  item: IJsonItem,
  fields: { [field: string]: any },
  updateValue?: (value: any, field: string) => void,
  fieldStr?: string
) {
  const { t } = useI18n()

  const {
    props,
    field,
    options = [],
    slots = {}
  } = isFunction(item) ? item() : item
  if (fields[`manual_${field}`] === 'true') {
    fields[`manual_${field}`] = true
  }

  if (fields[`manual_${field}`] === 'false') {
    fields[`manual_${field}`] = false
  }

  return h(
    NSpace,
    { vertical: true, style: { width: '100%' } },
    {
      default: () => [
        h(
          NSwitch,
          {
            value: fields[`manual_${field}`],
            onUpdateValue: (val: any) => {
              fields[`manual_${field}`] = val
              if (
                val &&
                unref(options).filter(
                  (option) => option.value === fields[field]
                ).length
              ) {
                const option = unref(options).filter(
                  (option) => option.value === fields[field]
                )[0]
                fields[field] = option.label
              }
              if (
                !val &&
                unref(options).filter(
                  (option) => option.label === fields[field]
                ).length
              ) {
                const option = unref(options).filter(
                  (option) => option.label === fields[field]
                )[0]
                fields[field] = option.value
              }
            }
          },
          {
            checked: () => t('project.node.input'),
            unchecked: () => t('project.node.select')
          }
        ),
        fields[`manual_${field}`]
          ? h(NInput, {
              size: 'small',
              value: fields[field],
              onUpdateValue: (value: string) => {
                void (fields[field] = value)
                props?.onUpdateValue && props.onUpdateValue(value)
                updateValue && updateValue(value, fieldStr || field)
              }
            })
          : h(
              NSelect,
              {
                ...props,
                value: fields[field],
                onSearch: (value: any) => {
                  props?.onSearch && props.onSearch(value)
                },
                onUpdateValue: (value: any, option: any) => {
                  void (fields[field] = value)
                  props?.onUpdateValue && props.onUpdateValue(value, option)
                  updateValue &&
                    updateValue &&
                    updateValue(value, fieldStr || field)
                },
                options: unref(options)
              },
              { ...slots }
            )
      ]
    }
  )
}
