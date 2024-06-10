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
import { mergedMenuPath } from '@/common/path'
import {
  BuildOutlined,
  ClusterOutlined,
  DashboardOutlined,
  ScheduleOutlined
} from '@vicons/antd'
import { MenuOption, NEllipsis, NIcon } from 'naive-ui'
import { h, ref } from 'vue'
import { useI18n } from 'vue-i18n'
import { RouterLink, useRoute } from 'vue-router'

export const useMenu = () => {
  const { t } = useI18n()
  const route = useRoute()
  const renderIcon = (icon: any) => {
    return () => h(NIcon, null, { default: () => h(icon) })
  }

  const getBasicOptions = () => {
    const menus: MenuOption[] = [
      {
        label: t('menu.overview'),
        key: 'overview',
        icon: renderIcon(DashboardOutlined)
      },
      {
        label: t('menu.job_management'),
        key: 'job-management',
        icon: renderIcon(BuildOutlined)
      },
      {
        label: t('menu.task_management'),
        key: 'task-management',
        icon: renderIcon(ScheduleOutlined)
      },
      {
        label: t('menu.cluster_management'),
        key: 'cluster-management',
        icon: renderIcon(ClusterOutlined)
      }
    ]
    return menus
  }

  const menuOptions = ref<MenuOption[]>([])

  const formatRouterChildrenLabel = (children: MenuOption[]) => {
    children.forEach((c: MenuOption) => {
      const label = c.label
      if (!c.hasOwnProperty('children')) {
        c.label = () =>
          h(
            NEllipsis,
            {
              style: {
                fontWeight: 400
              }
            },
            {
              default: () =>
                c.href
                  ? h(
                      RouterLink,
                      {
                        style: {
                          fontWeight: 400
                        },
                        to: {
                          path: getFinalPath(c),
                          query: route.query
                        },
                        children: []
                      },
                      { default: () => label }
                    )
                  : label
            }
          )
      } else {
        c.label = () =>
          h(NEllipsis, { style: { fontWeight: 700 } }, { default: () => label })
      }
      if (c.children && c.children.length > 0) {
        formatRouterChildrenLabel(c.children)
      }
    })
  }

  const getFinalPath = (item: MenuOption) => {
    let key = item.key
    while (item.children?.length && key !== 'projects') {
      key = item.children[0].key
      item = item.children[0]
    }
    return mergedMenuPath(key as string)
  }

  const setOptions = () => {
    const options = getBasicOptions()
    // @ts-ignore
    menuOptions.value = options
  }

  const getDefaultRoute = (): string => {
    if (menuOptions.value.length === 0) {
      return '/result/unauthorized'
    }
    if (
      !menuOptions.value[0].children ||
      menuOptions.value[0].key === 'projects'
    ) {
      return `/${menuOptions.value[0].key}`
    }
    if (menuOptions.value[0].children?.length) {
      let defaultPath = '/result/unauthorized'
      const getFirstChild = (list: MenuOption[]) => {
        defaultPath = list[0].key as string
        if (list[0].children && list[0].children.length)
          getFirstChild(list[0].children)
      }
      // @ts-ignore
      getFirstChild(menuOptions.value[0].children)
      return defaultPath
    }
    return '/result/unauthorized'
  }

  return { menuOptions, getDefaultRoute, setOptions }
}
