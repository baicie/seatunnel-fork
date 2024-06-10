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

import { noRedirectModule } from '@/router'
import { useClientStore } from '@/store/client'
import { useLocalesStore } from '@/store/locales/locales'
import { useThemeStore } from '@/store/theme/theme'
import { debounce } from 'lodash'
import { NLayout, NLayoutContent, NSpace } from 'naive-ui'
import { defineComponent, onMounted, ref, toRefs, watch } from 'vue'
import { useI18n } from 'vue-i18n'
import { useRoute, useRouter } from 'vue-router'
import NavBar from './components/navbar'
import SideBar from './components/sidebar'
import { useDataList } from './use-dataList'

const Content = defineComponent({
  name: 'Content',
  setup() {
    // window.$message = useMessage()

    const chat = ref()
    const route = useRoute()
    const router = useRouter()
    const { locale } = useI18n()
    const localesStore = useLocalesStore()
    const clientStore = useClientStore()

    const { state, menuOptions, setOptions, changeHeaderMenuOptions } =
      useDataList()
    const sideKeyRef = ref()
    const autoCodeFlag = ref(false)
    const themeStore = useThemeStore()
    const isDark = ref(themeStore.getTheme === 'dark')

    onMounted(() => {
      locale.value = localesStore.getLocales
      setOptions()
      changeHeaderMenuOptions(state)
      getSideMenu(state)
    })

    const getSideMenu = (state: any) => {
      const key = route.meta.activeMenu
      state.sideMenuOptions =
        menuOptions.value.filter((menu: { key: string }) => menu.key === key)[0]
          ?.children || menuOptions.value
      state.isShowSide = route.meta.showSide
    }

    watch(useI18n().locale, () => {
      setOptions()
      changeHeaderMenuOptions(state)
      getSideMenu(state)
    })

    watch(
      () => route.fullPath,
      () => {
        if (
          route.path !== '/login' &&
          route.path !== '/login/admin' &&
          route.path !== '/login/cas' &&
          route.path !== '/result/unauthorized'
        ) {
          state.isShowSide = route.meta.showSide as boolean
          route.params.projectCodes = route.params.projectCode
          if (route.query.project) {
            setOptions()
          }

          getSideMenu(state)

          if (noRedirectModule.includes(route.path)) {
            let option = state.sideMenuOptions[0] as any

            while (option?.children) {
              option.children[0] && (option = option.children[0])
            }
            router.replace(option?.key || '/result/unauthorized')
            return
          }

          const currentSide = (
            route.meta.activeSide
              ? route.meta.activeSide
              : route.matched[1]?.path
          ) as string

          sideKeyRef.value = currentSide?.includes(':projectCode')
            ? currentSide.replace(
                ':projectCode',
                route.params.projectCode as string
              )
            : currentSide
        }
      },
      { immediate: true }
    )

    const dragx = (el: any) => {
      const oDiv = chat.value
      const disX = el.clientX - oDiv.offsetLeft
      const disY = el.clientY - oDiv.offsetTop
      document.onmousemove = function (e: any) {
        let l = e.clientX - disX
        let t = e.clientY - disY
        if (l < 0) {
          l = 0
        } else if (
          l >
          document.documentElement.clientWidth - oDiv.offsetWidth
        ) {
          l = document.documentElement.clientWidth - oDiv.offsetWidth
        }
        if (t < 0) {
          t = 0
        } else if (
          t >
          document.documentElement.clientHeight - oDiv.offsetHeight
        ) {
          t = document.documentElement.clientHeight - oDiv.offsetHeight
        }
        oDiv.style.left = l + 'px'
        oDiv.style.top = t + 'px'
      }
      document.onmouseup = function () {
        document.onmousemove = null
        document.onmouseup = null
      }
      document.ondragstart = function (ev) {
        ev.preventDefault()
      }
      document.ondragend = function (ev) {
        ev.preventDefault()
      }
      return false
    }

    const changeSize = (el: any, pos = 'left') => {
      const oDiv = chat.value
      const poX = el.screenX
      const poY = el.screenY
      const width = oDiv.offsetWidth
      const height = oDiv.offsetHeight
      document.onmousemove = function (e) {
        e.preventDefault()
        const l = e.screenX - poX
        const t = e.screenY - poY
        debounce(() => {
          oDiv.style.width = width + (pos === 'left' ? -l : l) + 'px'
          oDiv.style.height = height + t + 'px'
        }, 80)()
      }
      document.onmouseup = function () {
        document.onmousemove = null
        document.onmouseup = null
      }
      document.ondragstart = function (ev) {
        ev.preventDefault()
      }
      document.ondragend = function (ev) {
        ev.preventDefault()
        document.onmousemove = null
        document.onmouseup = null
      }
      return false
    }

    watch(
      () => themeStore.getTheme,
      () => {
        isDark.value = themeStore.getTheme === 'dark'
      }
    )
    return {
      ...toRefs(state),
      sideKeyRef,
      chat,
      dragx,
      autoCodeFlag,
      changeSize,
      isDark,
      showMenu: clientStore.getMenu
    }
  },
  render() {
    return (
      <NLayout style='height: 100%' has-sider>
        <SideBar
          sideMenuOptions={this.sideMenuOptions}
          sideKey={this.sideKeyRef}
        />
        <NLayout
          style='background-color: #f8f8fc'
          // @ts-ignore
          id='n-layout-content'
        >
          <NavBar
            class='tab-horizontal'
            headerMenuOptions={this.headerMenuOptions}
            localesOptions={this.localesOptions}
            timezoneOptions={this.timezoneOptions}
            userDropdownOptions={this.userDropdownOptions}
          />

          <NLayoutContent
            native-scrollbar={false}
            style={this.showMenu ? 'padding: 16px 22px 0px 22px' : ''}
            contentStyle={'height: 100%'}
          >
            <NSpace
              vertical
              justify='space-between'
              style={'height: 100%'}
              size='small'
            >
              <router-view key={this.$route.fullPath} />
            </NSpace>
          </NLayoutContent>
        </NLayout>
      </NLayout>
    )
  }
})

export default Content
