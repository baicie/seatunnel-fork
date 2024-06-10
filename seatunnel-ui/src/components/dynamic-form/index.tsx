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

import { defineComponent, toRefs } from 'vue'
import { useForm } from './use-form'
import { NForm } from 'naive-ui'
import { useI18n } from 'vue-i18n'
import { data } from './data'
import { DynamicFormItem } from './dynamic-form-item'
import Modal from '@/components/modal'
import type { PropType } from 'vue'

const props = {
  showModal: {
    type: Boolean as PropType<boolean>,
    default: false
  },
  formData: {
    type: Object as PropType<object>
  }
}

const DynamicForm = defineComponent({
  name: 'DynamicForm',
  props,
  emits: ['cancelModal', 'confirmModal'],
  setup(props, ctx) {
    const { t } = useI18n()
    const { variables, handleValidate } = useForm(data)

    const onCancelModal = () => {
      ctx.emit('cancelModal')
    }

    const onConfirmModal = () => {
      handleValidate()
      ctx.emit('confirmModal')
    }

    return {
      t,
      ...toRefs(variables),
      onCancelModal,
      onConfirmModal,
      name: data.name
    }
  },
  render() {
    return (
      <Modal
        style={{width: '70%'}}
        title={''}
        show={this.showModal}
        onCancel={this.onCancelModal}
        onConfirm={this.onConfirmModal}
      >
        <NForm
          model={this.model}
          rules={this.rules}
          class='dynamic-form'
          ref='dynamicForm'
        >
          {
            this.formStructure.length > 0 && <DynamicFormItem
              formStructure={this.formStructure as any}
              model={this.model}
              name={this.name}
            />
          }
        </NForm>
      </Modal>
    )
  }
})

export { DynamicForm }