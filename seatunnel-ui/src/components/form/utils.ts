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

import { isFunction } from 'lodash'
import type { FormRules, FormItemRule, IJsonItem } from './types'

export function formatLabel(label?: string): string {
  if (!label) return ''
  const match = label.match(/^\$t\('(\S*)'\)/)
  return match ? match[1] : label
}

export function formatValidate(
  validate?: FormItemRule | FormRules
): FormItemRule {
  if (!validate) return {}
  if (Array.isArray(validate)) {
    validate.forEach((item: FormItemRule) => {
      if (!item?.message) delete item.message
      return item
    })
  }
  if (!validate.message) delete validate.message
  return validate
}

export function getChildrenDefaultValue(children: IJsonItem[]) {
  const defaultValue: { [field: string]: any } = {}
  const ruleItem: { [key: string]: FormItemRule[] | FormItemRule } = {}
  const loop = (
    children: IJsonItem[],
    parent: { [field: string]: any },
    ruleParent: { [key: string]: FormItemRule[] | FormItemRule }
  ) => {
    children.forEach((child) => {
      const mergedChild = isFunction(child) ? child() : child
      if (Array.isArray(mergedChild.children)) {
        const childDefaultValue = {}
        const childRuleItem = {}
        loop(mergedChild.children, childDefaultValue, childRuleItem)
        parent[mergedChild.field] = [childDefaultValue]
        ruleParent[mergedChild.field] = {
          type: 'array',
          fields: childRuleItem
        }
        return
      } else {
        parent[mergedChild.field] = mergedChild.value || null
        if (mergedChild.validate)
          ruleParent[mergedChild.field] = formatValidate(mergedChild.validate)
      }
    })
  }

  loop(children, defaultValue, ruleItem)
  return {
    defaultValue,
    ruleItem
  }
}

export const CYCLE_TYPE = {
  NATURAL: 'project.node.natural',
  BUSINESS: 'project.node.card_date'
} as any

export const CYCLE_LIST = {
  month: 'project.node.month',
  week: 'project.node.week',
  day: 'project.node.day',
  hour: 'project.node.hour'
} as any

export const DATE_LSIT = {
  currentHour: 'project.node.current_hour',
  last1Hour: 'project.node.last_1_hour',
  last2Hours: 'project.node.last_2_hour',
  last3Hours: 'project.node.last_3_hour',
  last24Hours: 'project.node.last_24_hour',
  today: 'project.node.today',
  last1Days: 'project.node.last_1_days',
  last2Days: 'project.node.last_2_days',
  last3Days: 'project.node.last_3_days',
  last7Days: 'project.node.last_7_days',
  thisWeek: 'project.node.this_week',
  lastWeek: 'project.node.last_week',
  lastMonday: 'project.node.last_monday',
  lastTuesday: 'project.node.last_tuesday',
  lastWednesday: 'project.node.last_wednesday',
  lastThursday: 'project.node.last_thursday',
  lastFriday: 'project.node.last_friday',
  lastSaturday: 'project.node.last_saturday',
  lastSunday: 'project.node.last_sunday',
  thisMonth: 'project.node.this_month',
  thisMonthBegin: 'project.node.this_month_begin',
  lastMonth: 'project.node.last_month',
  lastMonthBegin: 'project.node.last_month_begin',
  lastMonthEnd: 'project.node.last_month_end',
  currentBusinessMonth: 'project.node.this_month',
  currentBusinessMonthBegin: 'project.node.this_month_begin',
  lastBusinessMonth: 'project.node.last_month',
  lastBusinessMonthBegin: 'project.node.last_month_begin',
  lastBusinessMonthEnd: 'project.node.last_month_end',
  currentBusinessDay: 'project.node.today',
  last1BusinessDays: 'project.node.last_1_days',
  last2BusinessDays: 'project.node.last_2_days',
  last3BusinessDays: 'project.node.last_3_days',
  last7BusinessDays: 'project.node.last_7_days'
} as any
