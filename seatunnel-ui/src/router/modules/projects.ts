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
  path: '/projects',
  name: 'projects',
  meta: {
    title: '项目管理',
    auth: 'project:view'
  },
  redirect: { name: 'projects-list' },
  component: () => import('@/layouts/content'),
  children: [
    {
      path: '/projects/list',
      name: 'projects-list',
      component: components['projects-list'],
      meta: {
        title: '项目',
        activeMenu: 'projects',
        showSide: false
      }
    },
    {
      path: '/projects/overview',
      name: 'projects-overview',
      component: components['projects-overview'],
      meta: {
        title: '项目概览',
        activeMenu: 'projects',
        showSide: true,
        auth: 'project:overview:view'
      }
    },
    {
      path: '/projects/members',
      name: 'projects-member',
      component: components['projects-member'],
      meta: {
        title: '项目成员管理',
        activeMenu: 'projects',
        showSide: false,
        auth: 'project:member:view'
      }
    },
    // {
    //   path: '/projects/:projectCode/workflow/relation',
    //   name: 'workflow-relation',
    //   component: components['projects-workflow-relation'],
    //   meta: {
    //     title: '工作流关系',
    //     activeMenu: 'projects',
    //     showSide: true,
    //     auth: 'project:lineages:view'
    //   }
    // },
    {
      path: '/projects/workflow-definition',
      name: 'workflow-definition-list',
      component: components['projects-workflow-definition'],
      meta: {
        title: '工作流定义',
        activeMenu: 'projects',
        showSide: true,
        auth: 'project:definition:view'
      }
    },
    {
      path: '/projects/:projectCode/workflow/definitions/create',
      name: 'workflow-definition-create',
      component: components['projects-workflow-definition-create'],
      meta: {
        title: '创建工作流定义',
        activeMenu: 'projects',
        activeSide: '/projects/workflow-definition',
        showSide: true,
        auth: 'project:definition:create'
      }
    },
    {
      path: '/projects/:projectCode/workflow/definitions/:code',
      name: 'workflow-definition-detail',
      component: components['projects-workflow-definition-detail'],
      meta: {
        title: '工作流定义详情',
        activeMenu: 'projects',
        activeSide: '/projects/workflow-definition',
        showSide: true,
        auth: 'project:definition:create'
      }
    },
    {
      path: '/projects/workflow/instances',
      name: 'workflow-instance-list',
      component: components['projects-workflow-instance'],
      meta: {
        title: '工作流实例',
        activeMenu: 'projects',
        showSide: true,
        auth: 'project:process-instance:view'
      }
    },
    {
      path: '/projects/:projectCode/workflow/instances/:id',
      name: 'workflow-instance-detail',
      component: components['projects-workflow-instance-detail'],
      meta: {
        title: '工作流实例详情',
        activeMenu: 'projects',
        activeSide: '/projects/workflow/instances',
        showSide: true,
        auth: 'project:process-instance:update'
      }
    },
    {
      path: '/projects/workflow/instances/:id/gantt',
      name: 'workflow-instance-gantt',
      component: components['projects-workflow-instance-gantt'],
      meta: {
        title: '工作流实例甘特图',
        activeMenu: 'projects',
        activeSide: '/projects/workflow/instances',
        showSide: true,
        auth: 'project:process-instance:view-gantt'
      }
    },
    {
      path: '/projects/task/definitions',
      name: 'task-definition',
      component: components['projects-task-definition'],
      meta: {
        title: '任务定义',
        activeMenu: 'projects',
        showSide: true
      }
    },
    {
      path: '/projects/task/instances',
      name: 'task-instance',
      component: components['projects-task-instance'],
      meta: {
        title: '任务实例',
        activeMenu: 'projects',
        showSide: true,
        auth: 'project:task-instance:view'
      }
    },
    {
      path: '/projects/:projectCode/task/instances/:taskCode',
      name: 'task-instance-detail',
      component: components['projects-task-instance-detail'],
      meta: {
        title: '任务实例详情',
        activeMenu: 'projects',
        showSide: true,
        auth: 'project:task-instance:view'
      }
    },
    {
      path: '/projects/task/coronations',
      name: 'task-coronation',
      component: components['projects-task-coronation'],
      meta: {
        title: '加权列表',
        activeMenu: 'projects',
        showSide: true,
        auth: 'project:coronation-task:view'
      }
    },
    {
      path: '/projects/task/isolation',
      name: 'task-isolation',
      component: components['projects-task-isolation'],
      meta: {
        title: '隔离列表',
        activeMenu: 'projects',
        showSide: true,
        auth: 'project:isolation-task:view'
      }
    },
    {
      path: '/projects/:projectCode/workflow-definition/tree/:definitionCode',
      name: 'workflow-definition-tree',
      component: components['projects-workflow-definition-tree'],
      meta: {
        title: '工作流定义树形图',
        activeMenu: 'projects',
        activeSide: '/projects/workflow-definition',
        showSide: true,
        auth: 'project:definition:view-tree'
      }
    },
    {
      path: '/projects/task/synchronization-definition/batch',
      name: 'synchronization-definition-batch',
      component: components['projects-tunnel-define-batch'],
      meta: {
        title: '离线同步任务定义',
        activeMenu: 'projects',
        showSide: true,
        auth: 'project:seatunnel-task:view'
      }
    },
    {
      path: '/projects/task/synchronization-definition/streaming',
      name: 'synchronization-definition-streaming',
      component: components['projects-tunnel-define-stream'],
      meta: {
        title: '实时同步任务定义',
        activeMenu: 'projects',
        showSide: true,
        auth: 'project:seatunnel-task:view'
      }
    },
    {
      path: '/projects/:projectCode/task/synchronization-definition/batch/:jobDefinitionCode',
      name: 'synchronization-definition-dag-batch',
      component: components['projects-tunnel-define-detail-batch'],
      meta: {
        title: '同步任务定义画布',
        activeMenu: 'projects',
        activeSide: '/projects/task/synchronization-definition/batch',
        showSide: true,
        auth: ['project:seatunnel-task:create', 'project:seatunnel-task:update']
      }
    },
    {
      path: '/projects/:projectCode/task/synchronization-definition/streaming/:jobDefinitionCode',
      name: 'synchronization-definition-dag-streaming',
      component: components['projects-tunnel-define-detail-stream'],
      meta: {
        title: '实时任务定义画布',
        activeMenu: 'projects',
        activeSide: '/projects/task/synchronization-definition/streaming',
        showSide: true,
        auth: ['project:seatunnel-task:create', 'project:seatunnel-task:update']
      }
    },
    {
      path: '/projects/task/synchronization-instance/batch',
      name: 'synchronization-instance-batch',
      component: components['projects-tunnel-instance-batch'],
      meta: {
        title: '离线同步任务实例',
        activeMenu: 'projects',
        showSide: true,
        auth: 'project:seatunnel-task-instance:view'
      }
    },
    {
      path: '/projects/task/synchronization-instance/streaming',
      name: 'synchronization-instance-streaming',
      component: components['projects-tunnel-instance-stream'],
      meta: {
        title: '实时同步任务实例',
        activeMenu: 'projects',
        showSide: true,
        auth: 'project:seatunnel-task-instance:view'
      }
    },
    {
      path: '/projects/:projectCode/task/synchronization-instance/:taskCode/batch',
      name: 'synchronization-instance-detail-batch',
      component: components['projects-tunnel-instance-detail-batch'],
      meta: {
        title: '同步任务实例详情',
        activeMenu: 'projects',
        activeSide: '/projects/task/synchronization-instance/batch',
        showSide: true,
        auth: 'project:seatunnel-task-instance:details'
      }
    },
    {
      path: '/projects/:projectCode/task/synchronization-instance/:taskCode/streaming',
      name: 'synchronization-instance-detail-streaming',
      component: components['projects-tunnel-instance-detail-stream'],
      meta: {
        title: '实时任务实例详情',
        activeMenu: 'projects',
        activeSide: '/projects/task/synchronization-instance/streaming',
        showSide: true,
        auth: 'project:seatunnel-task-instance:details'
      }
    }
  ]
}
