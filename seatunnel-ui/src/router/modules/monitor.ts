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
  path: '/monitor',
  name: 'monitor',
  meta: { title: 'monitor', auth: 'monitor:view', activeMenu: 'monitor' },
  component: () => import('@/layouts/content'),
  children: [
    {
      path: '/monitor/master',
      name: 'servers-master',
      component: components['monitor-servers-master'],
      meta: {
        title: '服务管理-Master',
        activeMenu: 'monitor',
        showSide: true,
        auth: 'monitor:masters:view'
      }
    },
    {
      path: '/monitor/worker',
      name: 'servers-worker',
      component: components['monitor-servers-worker'],
      meta: {
        title: '服务管理-Worker',
        activeMenu: 'monitor',
        showSide: true,
        auth: 'monitor:workers:view'
      }
    },
    {
      path: '/monitor/db',
      name: 'servers-db',
      component: components['monitor-servers-db'],
      meta: {
        title: '服务管理-DB',
        activeMenu: 'monitor',
        showSide: true,
        auth: 'monitor:databases:view'
      }
    },
    {
      path: '/monitor/api-server',
      name: 'servers-api',
      component: components['monitor-servers-api-server'],
      meta: {
        title: '服务管理-api-server',
        activeMenu: 'monitor',
        showSide: true,
        auth: 'monitor:apis:view'
      }
    },
    {
      path: '/monitor/alert-server',
      name: 'servers-alert',
      component: components['monitor-servers-alert-server'],
      meta: {
        title: '服务管理-alert-server',
        activeMenu: 'monitor',
        showSide: true,
        auth: 'monitor:alerts:view'
      }
    },
    {
      path: '/monitor/search-server',
      name: 'servers-search',
      component: components['monitor-servers-search-server'],
      meta: {
        title: '服务管理-search-server',
        activeMenu: 'monitor',
        showSide: true,
        auth: 'monitor:search:view'
      }
    },
    {
      path: '/monitor/zeta',
      name: 'zeta',
      component: components['monitor-servers-zeta'],
      meta: {
        title: 'zeta监控',
        activeMenu: 'monitor',
        showSide: true,
        auth: 'monitor:cluster:view'
      }
    },
    {
      path: '/monitor/statistics',
      name: 'statistics-statistics',
      component: components['monitor-statistics-statistics'],
      meta: {
        title: '统计管理-Statistics',
        activeMenu: 'monitor',
        showSide: true,
        auth: 'monitor:statistics:view'
      }
    },
    {
      path: '/monitor/audit-log',
      name: 'statistics-audit-log',
      component: components['monitor-statistics-audit-log'],
      meta: {
        title: '审计日志-AuditLog',
        activeMenu: 'monitor',
        showSide: true
      }
    },
    {
      path: '/monitor/event-list',
      name: 'statistics-event-list',
      component: components['monitor-statistics-event-list'],
      meta: {
        title: '事件列表-EventList',
        activeMenu: 'monitor',
        showSide: true,
        auth: 'monitor:event:view'
      }
    },
    {
      path: '/monitor/alarm-list',
      name: 'statistics-alarm-list',
      component: components['monitor-statistics-alarm-list'],
      meta: {
        title: '告警列表-AlarmList',
        activeMenu: 'monitor',
        showSide: true,
        auth: 'monitor:alert:view'
      }
    }
  ]
}
