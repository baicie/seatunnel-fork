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

import { defineComponent, PropType, ref, watch } from 'vue'
import Modal from '@/components/modal'
import {
  NButton,
  NCheckbox,
  NCheckboxGroup,
  NIcon,
  NList,
  NListItem,
  NSpace
} from 'naive-ui'
import { RightOutlined } from '@vicons/antd'
import styles from './index.module.scss'
// import { useI18n } from 'vue-i18n'
import i18n from '@/locales'

const props = {
  saving: {
    type: Boolean as PropType<boolean>,
    default: false
  },
  show: {
    type: Boolean as PropType<boolean>,
    default: false
  },
  data: {
    type: Array as PropType<Array<any>>,
    default: []
  }
}

export default defineComponent({
  name: 'dependent-chain-modal',
  props,
  emits: ['confirmModal', 'cancelModal', 'checkDependentChain'],
  setup(props, ctx) {
    // const { t } = useI18n()
    const { t } = i18n.global
    const selectedTask = ref([] as any)

    const handleCheckDependentChain = (id: number, name: string) => {
      ctx.emit('checkDependentChain', id, name)
    }

    const handleConfirm = () => {
      ctx.emit('confirmModal', selectedTask.value)
    }

    const handleCancel = () => {
      ctx.emit('cancelModal')
    }

    watch(
      () => props.show,
      () => {
        if (props.show) {
          selectedTask.value = props.data.map((task: any) => task.id)
        }
      }
    )

    return () => (
      <Modal
        title={t('project.task.batch_confirm')}
        show={props.show}
        onConfirm={handleConfirm}
        onCancel={handleCancel}
        confirmLoading={props.saving}
      >
        <NList>
          <NCheckboxGroup v-model={[selectedTask.value, 'value']}>
            {props.data.map((item: any) => (
              <NListItem class={styles['list-item']}>
                <NSpace justify='space-between' align='center'>
                  <NCheckbox value={item.id}>{item.name}</NCheckbox>
                  <NButton
                    text
                    onClick={() =>
                      handleCheckDependentChain(item.id, item.name)
                    }
                  >
                    <NIcon size={18}>
                      <RightOutlined style={{ color: '#a9a9a9' }} />
                    </NIcon>
                  </NButton>
                </NSpace>
              </NListItem>
            ))}
          </NCheckboxGroup>
        </NList>
      </Modal>
    )
  }
})
