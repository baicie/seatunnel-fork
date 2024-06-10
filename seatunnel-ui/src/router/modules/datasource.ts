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

import type { Component } from 'vue'
import utils from '@/utils'

// All TSX files under the views folder automatically generate mapping relationship
const modules = import.meta.glob('/src/views/**/**.tsx')
const components: { [key: string]: Component } = utils.mapping(modules)

export default {
  path: '/datasource',
  name: 'datasource',
  meta: { title: '数据源中心', auth: 'datasource:list' },
  component: () => import('@/layouts/content'),
  children: [
    {
      path: '',
      name: 'datasource-list',
      component: components['datasource'],
      meta: {
        title: '数据源中心',
        activeMenu: 'datasource',
        showSide: false
      }
    },
    {
      path: '/datasource/creation',
      name: 'datasource-create',
      component: components['datasource-list-detail'],
      meta: {
        title: '源中心创建',
        activeMenu: 'datasource',
        showSide: false,
        auth: 'datasource:create'
      }
    },
    {
      path: '/datasource/:id',
      name: 'datasource-editor',
      component: components['datasource-list-detail'],
      meta: {
        title: '源中心编辑',
        activeMenu: 'datasource',
        showSide: false,
        auth: 'datasource:detail'
      }
    },
    {
      path: '/virtual-tables/creation',
      name: 'virtual-tables-create',
      component: components['virtual-tables-detail'],
      meta: {
        title: '虚拟表创建',
        activeMenu: 'virtual-tables',
        showSide: false,
        auth: 'datasource:virtual-table-create'
      }
    },
    {
      path: '/virtual-tables/:id',
      name: 'virtual-tables-editor',
      component: components['virtual-tables-detail'],
      meta: {
        title: '虚拟表编辑',
        activeMenu: 'virtual-tables',
        showSide: false,
        auth: 'datasource:virtual-table-detail'
      }
    }
  ]
}
