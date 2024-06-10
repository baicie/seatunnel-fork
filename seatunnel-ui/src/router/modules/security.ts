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
  path: '/security',
  name: 'security',
  meta: {
    title: '配置中心',
    auth: 'security:view',
    activeMenu: 'security'
  },
  component: () => import('@/layouts/content'),
  children: [
    {
      path: '/security/tenant-manage',
      name: 'tenant-manage',
      component: components['security-tenant-manage'],
      meta: {
        title: '租户管理',
        activeMenu: 'security',
        showSide: true,
        auth: 'security:tenant:view'
      }
    },
    {
      path: '/security/user-manage',
      name: 'user-manage',
      component: components['security-user-manage'],
      meta: {
        title: '用户管理',
        activeMenu: 'security',
        showSide: true,
        auth: 'security:user:view'
      }
    },
    {
      path: '/security/role-manage',
      name: 'role-manage',
      component: components['security-role-manage'],
      meta: {
        title: '角色管理',
        activeMenu: 'security',
        showSide: true,
        auth: 'security:role:view'
      }
    },
    {
      path: '/security/role-manage/permission-check',
      name: 'role-manage-permission-check',
      component: components['security-role-manage-permission'],
      meta: {
        title: '查看权限',
        activeMenu: 'security',
        showSide: true,
        activeSide: '/security/role-manage',
        auth: 'security:role:permission-view'
      }
    },
    {
      path: '/security/role-manage/permission-assign',
      name: 'role-manage-permission-assign',
      component: components['security-role-manage-permission'],
      meta: {
        title: '分配权限',
        activeMenu: 'security',
        showSide: true,
        activeSide: '/security/role-manage',
        auth: 'security:role:permission-assign'
      }
    },
    {
      path: '/security/alarm-group-manage',
      name: 'alarm-group-manage',
      component: components['security-alarm-group-manage'],
      meta: {
        title: '告警组管理',
        activeMenu: 'security',
        showSide: true,
        auth: 'security:alert-group:view'
      }
    },
    {
      path: '/security/worker-group-manage',
      name: 'worker-group-manage',
      component: components['security-worker-group-manage'],
      meta: {
        title: 'Worker分组管理',
        activeMenu: 'security',
        showSide: true,
        auth: 'security:worker-group:view'
      }
    },
    {
      path: '/security/yarn-queue-manage',
      name: 'yarn-queue-manage',
      component: components['security-yarn-queue-manage'],
      meta: {
        title: 'Yarn队列管理',
        activeMenu: 'security',
        showSide: true,
        auth: 'security:queue:view'
      }
    },
    {
      path: '/security/environment-manage',
      name: 'environment-manage',
      component: components['security-environment-manage'],
      meta: {
        title: '环境管理',
        activeMenu: 'security',
        showSide: true,
        auth: 'security:environment:view'
      }
    },
    {
      path: '/security/token-manage',
      name: 'token-manage',
      component: components['security-token-manage'],
      meta: {
        title: '令牌管理管理',
        activeMenu: 'security',
        showSide: true,
        auth: 'security:token:view'
      }
    },
    {
      path: '/security/alarm-instance-manage',
      name: 'alarm-instance-manage',
      component: components['security-alarm-instance-manage'],
      meta: {
        title: '告警实例管理',
        activeMenu: 'security',
        showSide: true,
        auth: 'security:alert-plugin:view'
      }
    },
    {
      path: '/security/k8s-namespace-manage',
      name: 'k8s-namespace-manage',
      component: components['security-k8s-namespace-manage'],
      meta: {
        title: 'K8S命名空间管理',
        activeMenu: 'security',
        showSide: true
      }
    },
    {
      path: '/security/calendar-manage',
      name: 'calendar-manage',
      component: components['security-calendar-manage'],
      meta: {
        title: '日历管理',
        activeMenu: 'security',
        showSide: true,
        auth: 'security:calendar:view'
      }
    },
    {
      path: '/security/card-manage',
      name: 'card-manage',
      component: components['security-card-manage'],
      meta: {
        title: '牌管理',
        activeMenu: 'security',
        showSide: true,
        auth: 'security:cards:view'
      }
    },
    {
      path: '/security/system-param-manage',
      name: 'system-param-manage',
      component: components['security-system-param-manage'],
      meta: {
        title: '预置参数管理',
        activeMenu: 'security',
        showSide: true,
        auth: 'security:cards:view'
      }
    },
    {
      path: '/security/timing-manage',
      name: 'timing-manage',
      component: components['security-timing-manage'],
      meta: {
        title: '定时管理',
        activeMenu: 'security',
        showSide: true,
        auth: 'security:timing:view'
      }
    },
    {
      path: '/security/label-manage',
      name: 'label-manage',
      component: components['security-label-manage'],
      meta: {
        title: '标签管理',
        activeMenu: 'security',
        showSide: true,
        auth: 'security:label:view'
      }
    },
    {
      path: '/security/audit-manage',
      name: 'audit-manage',
      component: components['security-audit-manage'],
      meta: {
        title: '审计日志',
        activeMenu: 'security',
        showSide: true,
        auth: 'security:audit:view'
      }
    },
    {
      path: '/security/packaged-deployment',
      name: 'packaged-deployment',
      component: components['security-packaged-deployment'],
      meta: {
        title: '打包部署',
        activeMenu: 'security',
        showSide: true,
        auth: 'security:deploy:view'
      }
    },
    {
      path: '/security/license-manage',
      name: 'license-manage',
      component: components['security-license-manage'],
      meta: {
        title: 'License管理',
        activeMenu: 'security',
        showSide: true,
        auth: 'security:license:view'
      }
    },
    {
      path: '/security/baseline-manage',
      name: 'baseline-manage',
      component: components['security-baseline-manage'],
      meta: {
        title: '基线管理',
        activeMenu: 'security',
        showSide: true,
        auth: 'security:baseline-manage:view'
      }
    },
    {
      path: '/security/baseline-instance',
      name: 'baseline-instance',
      component: components['security-baseline-instance'],
      meta: {
        title: '基线实例',
        activeMenu: 'security',
        showSide: true,
        auth: 'security:baseline-instance:view'
      }
    },
    {
      path: '/security/baseline-instance/:instanceId',
      name: 'baseline-instance-info',
      component: components['security-baseline-instance-info'],
      meta: {
        title: '基线实例详情',
        activeMenu: 'security',
        activeSide: '/security/baseline-instance',
        showSide: true,
        auth: 'security:baseline-instance:info'
      }
    }
  ]
}
