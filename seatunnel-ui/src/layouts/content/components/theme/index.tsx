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

import { defineComponent } from 'vue'
import { NDropdown, NIcon, NButton } from 'naive-ui'
import { DownOutlined } from '@vicons/antd'
import { useTheme } from './use-theme'
import styles from './index.module.scss'
import { useThemeStore } from '@/store/theme/theme'

const Theme = defineComponent({
  name: 'Theme',
  setup() {
    const { themes, currentThemeLabel, onSelectTheme } = useTheme()
    const themeStore = useThemeStore()
    const localThemeName = themeStore.getTheme
    const themeName = ['light', 'dark', 'custom'].includes(localThemeName)
      ? localThemeName
      : 'light'
    themeStore.setTheme(themeName)

    return () => (
      <NDropdown
        trigger='hover'
        show-arrow
        options={themes.value}
        on-select={onSelectTheme}
      >
        <NButton text>
          {currentThemeLabel.value}
          <NIcon class={styles.icon}>
            <DownOutlined />
          </NIcon>
        </NButton>
      </NDropdown>
    )
  }
})

export default Theme
