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

import { useLocalesStore } from '@/store/locales/locales'
import { useThemeStore } from '@/store/theme/theme'
import themeList from '@/themes'
import {
  GlobalThemeOverrides,
  NConfigProvider,
  NDialogProvider,
  NMessageProvider,
  darkTheme,
  dateEnUS,
  dateZhCN,
  enUS,
  zhCN
} from 'naive-ui'
import { computed, defineComponent } from 'vue'
import { RouterView } from 'vue-router'

const App = defineComponent({
  name: 'App',
  setup() {
    const themeStore = useThemeStore()
    themeStore.init()
    const currentTheme = computed(() =>
      themeStore.getTheme === 'dark' ? darkTheme : undefined
    )
    const localesStore = useLocalesStore()
    const themeOverrides: GlobalThemeOverrides =
      themeList[currentTheme ? 'dark' : themeStore.getTheme]

    console.log(themeOverrides, currentTheme.value)

    return () => (
      <NConfigProvider
        theme={currentTheme.value}
        theme-overrides={themeOverrides}
        style={{ width: '100%', height: '100vh' }}
        date-locale={
          String(localesStore.getLocales) === 'zh_CN' ? dateZhCN : dateEnUS
        }
        locale={String(localesStore.getLocales) === 'zh_CN' ? zhCN : enUS}
      >
        <NMessageProvider
          placement={'top'}
          container-style={{ wordBreak: 'break-all' }}
        >
          <NDialogProvider>
            <RouterView />
          </NDialogProvider>
        </NMessageProvider>
      </NConfigProvider>
    )
  }
})

export default App
