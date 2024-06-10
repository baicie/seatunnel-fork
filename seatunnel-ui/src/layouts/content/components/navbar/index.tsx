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

import { defineComponent, PropType, ref, watch } from 'vue'
import { useRoute } from 'vue-router'
import { useThemeStore } from '@/store/theme/theme'
import styles from './index.module.scss'
import { NAvatar, NButton, NLayoutHeader, NMenu } from 'naive-ui'
import Logo from '@/components/logo'
import Locales from '../locales'
import Theme from '../theme'
import AIGPT from '@/assets/images/AIGPT.svg'
import { useClientStore } from '@/store/client'

const Navbar = defineComponent({
  name: 'Navbar',
  props: {
    headerMenuOptions: {
      type: Array as PropType<any>,
      default: []
    },
    localesOptions: {
      type: Array as PropType<any>,
      default: []
    },
    timezoneOptions: {
      type: Array as PropType<any>,
      default: []
    },
    userDropdownOptions: {
      type: Array as PropType<any>,
      default: []
    }
  },
  emits: ['showGpt'],
  setup(props, ctx) {
    const themeStore = useThemeStore()
    const clientStore = useClientStore()
    const route = useRoute()

    const menuKey = ref(route.meta.activeMenu as string)

    const showGptDialog = () => {
      ctx.emit('showGpt')
    }

    watch(
      () => route.path,
      () => {
        menuKey.value = route.meta.activeMenu as string
      }
    )
    return () => (
      <NLayoutHeader style='height: 65px'>
        <div class={styles.container}>
          <div
            class={styles.settings}
            style={
              themeStore.getNavTextColor
                ? `--text-color:${themeStore.getNavTextColor}`
                : ''
            }
          >
            {clientStore.getGpt && (
              <NButton text onClick={showGptDialog}>
                <div class={styles['chat-title-ic']}>
                  <NAvatar
                    size={20}
                    src={AIGPT}
                    color={'#fff'}
                    round
                    bordered={false}
                  ></NAvatar>
                </div>
              </NButton>
            )}

            <Theme />
            <Locales localesOptions={props.localesOptions} />
          </div>
        </div>
      </NLayoutHeader>
    )
  }
})

export default Navbar
