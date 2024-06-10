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

import { reactive, h } from 'vue'
import { NIcon } from 'naive-ui'
import { useI18n } from 'vue-i18n'
import { useMenu } from './use-menu'
import { UserOutlined, LogoutOutlined, KeyOutlined } from '@vicons/antd'
import { timezoneList } from '@/common/timezone'
import type { IOption } from './types'

export function useDataList() {
  const { t } = useI18n()
  const { menuOptions, setOptions } = useMenu()
  const renderIcon = (icon: any) => {
    return () => h(NIcon, null, { default: () => h(icon) })
  }

  const localesOptions = [
    {
      label: 'English',
      key: 'en_US'
    },
    {
      label: '中文',
      key: 'zh_CN'
    }
  ]

  const timezoneOptions = () =>
    timezoneList.map((item) => ({ label: item, value: item }))

  const state = reactive({
    isShowSide: false,
    localesOptions,
    timezoneOptions: timezoneOptions(),
    userDropdownOptions: [],
    headerMenuOptions: [],
    sideMenuOptions: [] as IOption[]
  })

  const changeHeaderMenuOptions = (state: any) => {
    state.headerMenuOptions = menuOptions.value.map((item: IOption) => {
      return {
        label: item.label,
        key: item.key,
        icon: item.icon
      }
    })
  }

  return {
    state,
    menuOptions,
    setOptions,
    changeHeaderMenuOptions
  }
}
