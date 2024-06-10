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

import type { RouteRecordRaw } from 'vue-router'
import type { Component } from 'vue'
import utils from '@/utils'
import projectsPage from './modules/projects'

// All TSX files under the views folder automatically generate mapping relationship
const modules = import.meta.glob('/src/views/**/**.tsx')
const components: { [key: string]: Component } = utils.mapping(modules)

/**
 * Basic page
 */
const basePage: RouteRecordRaw[] = [
  {
    path: '/',
    redirect: { name: 'overview' },
    meta: { title: '首页' },
    component: () => import('@/layouts/content'),
    children: [
      {
        path: '/overview',
        name: 'overview',
        component: components['overview'],
        meta: {
          title: '首页',
          activeMenu: 'overview'
        }
      },
      {
        path: '/job-management',
        name: 'job_management',
        component: components['job-management'],
        meta: {
          title: '任务管理',
          activeMenu: 'job_management'
        }
      },
      {
        path: '/task-management',
        name: 'task_management',
        component: components['task-management'],
        meta: {
          title: '任务管理',
          activeMenu: 'task_management'
        }
      },
      {
        path: '/cluster-management',
        name: 'cluster_management',
        component: components['cluster-management'],
        meta: {
          title: '集群管理',
          activeMenu: 'cluster_management'
        }
      }
    ]
  },
  projectsPage
]

const routes: RouteRecordRaw[] = basePage

export default routes
