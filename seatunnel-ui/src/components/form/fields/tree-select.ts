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
import { NTreeSelect } from 'naive-ui'
import _, { isFunction } from 'lodash'
import type { IJsonItem, IOption } from '../types'

const extractIds = (ids: number[], options: IOption[]) => {
  for (const option of options) {
    ids.push(option.id)
    option.children && extractIds(ids, option.children)
  }
}

export function renderTreeSelect(
  item: IJsonItem,
  fields: { [field: string]: any },
  updateValue?: (value: any, field: string) => void
) {
  const { props = {}, field, options = [] } = isFunction(item) ? item() : item
  return h(NTreeSelect, {
    ...props,
    value: fields[field],
    onUpdateValue: (value: []) => {
      const ids = [] as Array<number>
      extractIds(ids, unref(options))
      fields[field] = _.isArray(value)
        ? value.filter((id) => ids.includes(id))
        : value
      updateValue && updateValue(value, field)
    },
    options: unref(options)
  })
}
