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

import {
  format,
  startOfToday,
  endOfToday,
  startOfDay,
  subDays,
  endOfDay,
  subWeeks,
  subMonths
} from 'date-fns'
import type { DATE_PICKER_TYPES } from './types'

export const FIXED_DATE_TYPES = [
  'today',
  'last_day',
  'last_three_day',
  'last_week',
  'last_month'
]

export const formatShortCutsTime = (
  type: DATE_PICKER_TYPES,
  value: [string, string] | null
): [string, string] | null => {
  switch (type) {
    case 'today':
      return [
        format(startOfToday(), 'yyyy-MM-dd HH:mm:ss'),
        format(endOfToday(), 'yyyy-MM-dd HH:mm:ss')
      ]
    case 'last_day':
      return [
        format(startOfDay(subDays(Date.now(), 1)), 'yyyy-MM-dd HH:mm:ss'),
        format(endOfDay(subDays(Date.now(), 1)), 'yyyy-MM-dd HH:mm:ss')
      ]
    case 'last_three_day':
      return [
        format(startOfDay(subDays(Date.now(), 3)), 'yyyy-MM-dd HH:mm:ss'),
        format(endOfToday(), 'yyyy-MM-dd HH:mm:ss')
      ]
    case 'last_week':
      return [
        format(startOfDay(subWeeks(Date.now(), 1)), 'yyyy-MM-dd HH:mm:ss'),
        format(endOfToday(), 'yyyy-MM-dd HH:mm:ss')
      ]
    case 'last_month':
      return [
        format(startOfDay(subMonths(Date.now(), 1)), 'yyyy-MM-dd HH:mm:ss'),
        format(endOfToday(), 'yyyy-MM-dd HH:mm:ss')
      ]
    case 'custom':
      return value
  }
}
