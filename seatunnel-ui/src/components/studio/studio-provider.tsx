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
import { defineComponent, provide, computed, toRef } from 'vue'
import Studio from './studio'
import studioProps from './studio-props'
import { enUS } from './locales'
import { configProviderInjectionKey } from './context'
import { useExpose } from './hooks/use-expose'

const StudioProvider = defineComponent({
  name: 'studio-provider',
  props: studioProps,
  setup(props, { expose }) {
    const exposeFn = useExpose()

    expose(exposeFn)

    provide(configProviderInjectionKey, {
      localeRef: computed(() => props.locale || enUS),
      darkThemeRef: toRef(props, 'darkTheme'),
      renderSettingRef: toRef(props, 'renderSetting'),
      renderToolbarRef: toRef(props, 'renderToolbar'),
      tabsRef: toRef(props, 'tabs'),
      tasksStateRef: props.tasksStateRef,
      currentTabRef: toRef(props, 'currentTab'),
      readonlyRef: toRef(props, 'readonly'),
      handleScriptChange: props.handleScriptChange,
      handlePanelClose: props.handlePanelClose,
      handlePanelSave: props.handlePanelSave,
      handlePanelChange: props.handlePanelChange,
      handlePanelTypeSwitch: props.handlePanelTypeSwitch
    })
    return () => <Studio />
  }
})

export default StudioProvider
