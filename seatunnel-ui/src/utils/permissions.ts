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
import { IPermission } from '@/store/user/types'

export const getPermissions = (
  permissions: IPermission[]
): { router: string[]; function: string[] } => {
  const routerPermissions = [] as string[]
  const functionPermissions = [] as string[]
  const loopPermissions = (list: IPermission[]) => {
    list.forEach((permission: IPermission) => {
      // 1 for module,2 for page, 3 for page or function, 4 for function.
      if ([1, 2, 3].includes(permission.type)) {
        routerPermissions.push(permission.key)
      }
      if ([3, 4].includes(permission.type)) {
        functionPermissions.push(permission.key)
      }
      if (permission.subPermissions) loopPermissions(permission.subPermissions)
    })
  }
  loopPermissions(permissions)
  return {
    router: routerPermissions,
    function: functionPermissions
  }
}
