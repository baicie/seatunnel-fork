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

import { useThemeStore } from '@/store/theme/theme'
import { NLayoutSider, NMenu, NSpace, NText } from 'naive-ui'
import { PropType, computed, defineComponent, ref, watch } from 'vue'
import Logo from '@/components/logo'
import { useRoute, useRouter } from 'vue-router'

const Sidebar = defineComponent({
  name: 'Sidebar',
  props: {
    sideMenuOptions: {
      type: Array as PropType<any>,
      default: []
    },
    sideKey: {
      type: String as PropType<string>,
      default: ''
    }
  },
  setup(props) {
    const route = useRoute()
    const router = useRouter()
    const collapsedRef = ref(false)
    const value = computed<string>(
      () =>
        (route.meta.activeSide
          ? route.meta.activeSide
          : route.matched[1]?.path) as string
    )

    const themeStore = useThemeStore()
    const menuStyle = ref(themeStore.getDarkTheme ? 'dark' : 'light')

    const handleMenu = (value: string) => {
      router.push(value)
    }

    watch(
      () => themeStore.getTheme,
      () => {
        menuStyle.value = themeStore.getDarkTheme ? 'dark' : 'light'
      }
    )

    return () => (
      <NLayoutSider
        bordered
        nativeScrollbar={false}
        show-trigger='bar'
        collapse-mode='width'
        collapsed={collapsedRef.value}
        onCollapse={() => (collapsedRef.value = true)}
        onExpand={() => (collapsedRef.value = false)}
        width={256}
      >
        <NSpace wrapItem={false} align='center' style='padding-left:24px;'>
          <Logo />

          <NText style='font-weight:600;padding-left:12px;'>
            Seatunnel Dashboard
          </NText>
        </NSpace>
        <NMenu
          class='tab-vertical'
          value={value.value}
          options={props.sideMenuOptions}
          onUpdate:value={handleMenu}
        />
      </NLayoutSider>
    )
  }
})

export default Sidebar
