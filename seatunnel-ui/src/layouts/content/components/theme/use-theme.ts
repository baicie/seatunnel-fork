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

import { ref, watch } from 'vue'
import { useI18n } from 'vue-i18n'
import { useThemeStore } from '@/store/theme/theme'
import { find } from 'lodash'
import type { ITheme } from '../../types'
import themeList from '@/themes'

export function useTheme() {
  const { t, locale } = useI18n()
  const themeStore = useThemeStore()
  const getThemes = () => {
    const themes = [
      // { label: t('theme.dark_blue'), key: 'dark-blue' },
      { label: t('theme.light'), key: 'light' },
      { label: t('theme.dark'), key: 'dark' }
    ]
    if (themeList.custom) {
      themeList.custom =
        sessionStorage.getItem('custom_theme') &&
        sessionStorage.getItem('custom_theme') !== 'undefined'
          ? JSON.parse(sessionStorage.getItem('custom_theme') as string)
          : themeList.custom
      themes.push({
        label:
          locale.value === 'zh_CN'
            ? themeList.custom.themeName?.zh || t('theme.dark_blue')
            : themeList.custom.themeName?.en || t('theme.dark_blue'),
        key: 'custom'
      })
      sessionStorage.setItem('custom_theme', JSON.stringify(themeList.custom))
    }
    return themes
  }

  const getThemeLabel = () => {
    const item = find(themes.value, ['key', themeStore.getTheme])
    return item?.label
  }
  const themes = ref(getThemes())
  const currentThemeLabel = ref(getThemeLabel())

  const onSelectTheme = (theme: ITheme) => {
    themeStore.setTheme(theme)
    currentThemeLabel.value = getThemeLabel()
  }

  watch(locale, () => {
    themes.value = getThemes()
    currentThemeLabel.value = getThemeLabel()
  })

  return { themes, currentThemeLabel, onSelectTheme }
}
