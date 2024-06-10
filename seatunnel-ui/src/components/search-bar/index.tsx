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

import { BarsOutlined, ReloadOutlined, SearchOutlined } from '@vicons/antd'
import { NSpace, NButton, NIcon, NCard, NBadge } from 'naive-ui'
import {
  defineComponent,
  renderSlot,
  ref,
  Fragment,
  PropType,
  onBeforeMount
} from 'vue'
import styles from './index.module.scss'
import { useRoute, useRouter } from 'vue-router'

const props = {
  badgeTips: {
    type: Boolean as PropType<boolean>,
    default: false
  }
}

const SearchBar = defineComponent({
  name: 'search-bar',
  props,
  emits: ['handleSearch', 'handleReset'],
  setup(props, { emit, slots }) {
    const router = useRouter()
    const route = useRoute()
    const isMore = ref(false)

    const handleMore = () => {
      isMore.value = !isMore.value
      router.replace({
        query: {
          ...route.query,
          isMore: String(isMore.value)
        }
      })
    }
    const handleSearch = () => emit('handleSearch')
    const handleReset = () => emit('handleReset')

    onBeforeMount(() => {
      isMore.value = route.query.isMore === 'true'
    })
    return () => (
      <NCard segmented={true}>
        {{
          header: () => (
            <NSpace
              justify='space-between'
              wrap={false}
              class={styles['header']}
            >
              {renderSlot(slots, 'default')}
              <NSpace>
                {slots.more && (
                  <NBadge dot={props.badgeTips}>
                    <NButton onClick={handleMore}>
                      <NIcon>
                        <BarsOutlined />
                      </NIcon>
                    </NButton>
                  </NBadge>
                )}
                <NButton onClick={handleReset}>
                  <NIcon>
                    <ReloadOutlined />
                  </NIcon>
                </NButton>
                <NButton type='primary' onClick={handleSearch}>
                  <NIcon>
                    <SearchOutlined />
                  </NIcon>
                </NButton>
              </NSpace>
            </NSpace>
          ),
          default: () =>
            isMore.value &&
            slots.more && <Fragment>{renderSlot(slots, 'more')}</Fragment>
        }}
      </NCard>
    )
  }
})

export default SearchBar
