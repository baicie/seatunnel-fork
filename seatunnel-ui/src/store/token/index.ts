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

import { defineStore } from 'pinia'
import { PREFIX_STORE } from '../utils/common'
import { TokenState } from './types'

// Used for product integration, using token to access api.
export const useTokenStore = defineStore({
  id: `${PREFIX_STORE}-token`,
  state: (): TokenState => ({
    token: null
  }),
  persist: true,
  getters: {
    getToken(): string | null {
      return this.token
    }
  },
  actions: {
    setToken(token: string): void {
      this.token = token
    },
    cleanToken(): void {
      this.token = null
    }
  }
})
