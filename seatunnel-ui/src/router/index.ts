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

import {
  createRouter,
  createWebHistory,
  NavigationGuardNext,
  RouteLocationNormalized
} from 'vue-router'
import routes from './routes'

import { useClientStore } from '@/store/client'
// NProgress
import NProgress from 'nprogress'
import 'nprogress/nprogress.css'

export const noRedirectModule = ['/monitor', '/resource', '/security']

const router = createRouter({
  history: createWebHistory(
    import.meta.env.MODE === 'production' ? '/dolphinscheduler/ui/' : '/'
  ),
  routes
})

interface metaData {
  title?: string
  activeMenu?: string
  showSide?: boolean
  auth?: string | string[]
}

/**
 * Routing to intercept
 */
router.beforeEach(
  async (
    to: RouteLocationNormalized,
    from: RouteLocationNormalized,
    next: NavigationGuardNext
  ) => {
    NProgress.start()

    const clientStore = useClientStore()

    if (
      clientStore.getLoaded &&
      to.matched.length === 0 &&
      (to.path.includes('login') || to.path.includes('logout'))
    ) {
      next({ ...to, replace: true })
      NProgress.done()
      return
    }

    next()

    NProgress.done()
  }
)

router.afterEach(() => {
  NProgress.done()
})

export default router
