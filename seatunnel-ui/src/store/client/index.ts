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
import type { ClientState, CasModel } from './type'
import { PREFIX_STORE } from '../utils/common'

export const useClientStore = defineStore({
  id: `${PREFIX_STORE}-client`,
  state: (): ClientState => ({
    casModel: 'common',
    casLoginUrl: '',
    casLogoutUrl: '',
    loaded: false,
    title: 'Whale Scheduler Admin',
    gpt: false,
    integrate: false,
    menu: true,
    customCopy: false,
    copyRight: 'Version {version} - Copyright 2023 Whaleops Open Source Co.LTD'
  }),
  persist: {
    storage: sessionStorage
  },
  getters: {
    getCasModel(): CasModel {
      return this.casModel
    },
    getCasLoginUrl(): string {
      return this.casLoginUrl
    },
    getCasLogoutUrl(): string {
      return this.casLogoutUrl
    },
    getLoaded(): boolean {
      return this.loaded
    },
    getTitle(): string {
      return this.title
    },
    getGpt(): boolean {
      return this.gpt
    },
    getIntegrate(): boolean {
      return this.integrate
    },
    getMenu(): boolean {
      // The menu is displayed in non-integrated mode,
      // and the integrated mode is displayed according to the menu configuration.
      return this.integrate ? this.menu : true
    },
    getCopyRight(): string {
      return this.copyRight
    },
    getCustomCopy(): boolean {
      return this.customCopy
    }
  },
  actions: {
    init(params: {
      casModel: CasModel
      casLoginUrl: string
      casLogoutUrl: string
      title: string
      gpt: boolean
      integrate: boolean
      menu: boolean
      copyRight: string
      customCopy: boolean
    }) {
      this.casModel = params.casModel
      this.casLoginUrl = params.casLoginUrl
      this.casLogoutUrl = params.casLogoutUrl
      this.loaded = true
      params.title && (this.title = params.title)
      this.gpt = params.gpt
      this.integrate = params.integrate
      this.menu = params.menu
      params.copyRight && (this.copyRight = params.copyRight)
      this.customCopy = params.customCopy
    },
    setLoaded(loaded: boolean) {
      this.loaded = loaded
    }
  }
})
