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
import themeList from '@/themes'
import type { ThemeState, ITheme } from './types'
import { PREFIX_STORE } from '../utils/common'

export const useThemeStore = defineStore({
  id: `${PREFIX_STORE}-theme`,
  state: (): ThemeState => ({
    darkTheme: false,
    theme: 'light',
    isNavLogoBlack: false,
    navTextColor: '',
    localTheme: ''
  }),
  persist: true,
  getters: {
    getDarkTheme(): boolean {
      return this.darkTheme
    },
    getTheme(): ITheme {
      return this.theme
    },
    getIsNavLogoBlack(): boolean {
      return this.isNavLogoBlack
    },
    getNavTextColor(): string {
      return this.navTextColor
    },
    getLocalTheme(): string {
      return this.localTheme
    }
  },
  actions: {
    setTheme(str: ITheme): void {
      let theme = 'light' as ITheme
      if (Object.keys(themeList).includes(theme)) {
        theme = str
      }
      this.theme = theme
      this.darkTheme = themeList[theme]?.darkLogo
      this.isNavLogoBlack = !themeList[theme]?.darkLogo
      const themeConfig = themeList[theme]
      //@ts-ignore
      this.navTextColor = themeConfig?.Menu?.itemTextColor || ''
    },
    setLocalTheme(theme: string): void {
      this.localTheme = theme
    },
    init(theme?: ITheme): void {
      this.setTheme(theme || this.theme)
    }
  }
})
