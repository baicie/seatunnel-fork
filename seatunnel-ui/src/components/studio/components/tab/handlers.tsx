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

import { defineComponent, onMounted, PropType } from 'vue'
import { NButtonGroup, NButton } from 'naive-ui'
import { useLocale } from '../../hooks'
import { useTheme } from '../../hooks'
import styles from './index.module.scss'
import type { ITabPanelType, IHandler } from '../../types/tab'

const props = {
  extraHandlers: {
    type: Array as PropType<IHandler[]>,
    default: []
  },
  paneType: {
    type: String as PropType<ITabPanelType>,
    default: 'setting'
  }
}

const Handlers = defineComponent({
  name: 'studio-handlers',
  props,
  emits: ['switchPanel'],
  setup(props, { emit }) {
    const { t } = useLocale()
    const { darkThemeRef } = useTheme()
    const onSwitchPanel = (type: string) => {
      emit('switchPanel', type)
    }

    onMounted(() => {
      emit('switchPanel', 'setting')
    })

    return () => (
      <div class={styles['handlers']}>
        <NButtonGroup
          vertical
          style={{ backgroundColor: darkThemeRef?.value ? '#0000' : '#fff' }}
        >
          <NButton
            class={`${styles['handler']} ${
              props.paneType === 'setting' ? styles['handler-active'] : ''
            }`}
            onClick={() => void onSwitchPanel('setting')}
          >
            {t('setting')}
          </NButton>
          {props.extraHandlers.map((handler) => (
            <NButton
              class={`${styles['handler']} ${
                props.paneType === handler.key ? styles['handler-active'] : ''
              }`}
              onClick={() => void onSwitchPanel(handler.key)}
            >
              {/* @ts-ignore */}
              {t(handler.name)}
            </NButton>
          ))}
        </NButtonGroup>
      </div>
    )
  }
})

export default Handlers
