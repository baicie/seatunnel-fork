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
import type { PropType, VNode, Ref } from 'vue'
import type { Locale } from './locales'
import type { ITab, ITabPanelType } from './types/tab'

export default {
  locale: {
    type: Object as PropType<Locale>
  },
  darkTheme: {
    type: Boolean,
    default: false
  },
  renderSetting: {
    type: Function as PropType<(tab: ITab, detailRef: Ref) => VNode>
  },
  renderToolbar: {
    type: Function as PropType<(tab: ITab, detailRef: Ref) => VNode>
  },
  tabs: {
    type: Array as PropType<{ code: number }[]>,
    default: []
  },
  readonly: {
    type: Boolean,
    default: false
  },
  currentTab: {
    type: Number
  },
  tasksStateRef: {
    type: Object as PropType<Ref>,
    default: {
      value: {}
    }
  },
  handleScriptChange: {
    type: Function,
    default: (value: string, tab: ITab) => void 0
  },
  handlePanelClose: {
    type: Function,
    default: (tabCode: number) => void 0
  },
  handlePanelSave: {
    type: Function,
    default: (tab: ITab): boolean => false
  },
  handlePanelChange: {
    type: Function,
    default: (tabCode: number) => void 0
  },
  handlePanelTypeSwitch: {
    type: Function,
    default: (tab: ITab, type: ITabPanelType) => void 0
  }
}
