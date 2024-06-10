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

import { useI18n } from 'vue-i18n'
import { defineComponent, PropType, reactive, toRefs, ref } from 'vue'
import {
  NForm,
  NFormItem,
  NInput,
  NButton,
  NCheckbox,
  useMessage
} from 'naive-ui'
import Modal from '@/components/modal'
import { advanceCopyCustom } from '@/service/modules/process-definition'

const props = {
  show: {
    type: Boolean as PropType<boolean>,
    default: false
  },
  row: {
    type: Object as PropType<any>,
    default: {}
  }
}

const OneToThirtySixModal = defineComponent({
  name: 'one-to-thirty-six',
  props,
  emits: ['cancelModal', 'confirmModal'],
  setup(props, ctx) {
    const message = useMessage()
    const variables = reactive({
      CopyProjectModalRef: ref(),
      saving: false,
      rules: {
        source: {
          required: true,
          trigger: ['input', 'blur'],
          validator() {
            if (variables.model.source === '') {
              return new Error(t('project.list.source_tips'))
            }
          }
        }
      },
      model: {
        source: '850000_西藏',
        target: '',
        provinceReplace: true,
        codeReplace: true
      }
    })
    const { t } = useI18n()

    const cancelModal = () => {
      ctx.emit('cancelModal', props.show)
      variables.model = {
        source: '850000_西藏',
        target: '',
        provinceReplace: true,
        codeReplace: true
      }
    }

    const confirmModal = () => {
      variables.CopyProjectModalRef.validate((errors: any) => {
        if (!errors) {
          try {
            const data = {
              ...variables.model,
              workflowCode: props.row.code
            }

            advanceCopyCustom(data).then((res: any) => {
              if (res.status == 200) {
                if (res.data.code == 0) {
                  ctx.emit('confirmModal', props.show)
                  variables.model = {
                    source: '850000_西藏',
                    target: '',
                    provinceReplace: true,
                    codeReplace: true
                  }
                  message.success(res.data.msg)
                } else {
                  message.error(res.data.msg)
                }
              }
            })
          } catch (err) {
            // console.log(err)
          }
        } else {
          return
        }
      })
    }
    const addOtherProvince = () => {
      variables.model.target =
        '110000_北京,120000_天津,130000_河北,140000_山西,150000_内蒙,210000_辽宁,210200_大连,220000_吉林,230000_黑龙江,310000_上海,320000_江苏,330000_浙江,330200_宁波,340000_安徽,350000_福建,350200_厦门,360000_江西,370000_山东,370200_青岛,410000_河南,420000_湖北,430000_湖南,440000_广东,440200_深圳,450000_广西,460000_海南,510000_四川,520000_贵州,530000_云南,610000_陕西,620000_甘肃,630000_青海,640000_宁夏,650000_新疆,660000_重庆'
    }

    return {
      ...toRefs(variables),
      t,
      cancelModal,
      confirmModal,
      addOtherProvince
    }
  },
  render() {
    const { t } = this
    return (
      <Modal
        title={t('project.list.copy_project')}
        show={this.show}
        onConfirm={this.confirmModal}
        onCancel={this.cancelModal}
        confirmClassName='btn-submit'
        cancelClassName='btn-cancel'
        confirmLoading={this.saving}
      >
        <NForm rules={this.rules} ref='CopyProjectModalRef'>
          <NFormItem label={t('project.list.string_replaced')} path='source'>
            <NInput
              v-model={[this.model.source, 'value']}
              class='input-project-name'
            />
          </NFormItem>
          <NFormItem>
            <NButton
              style={'margin-right: 10px;'}
              onClick={this.addOtherProvince}
              type='info'
            >
              添加其他35个省
            </NButton>
            <NCheckbox v-model:checked={this.model.codeReplace}>
              是否单独替换省机构代码
            </NCheckbox>
            <NCheckbox v-model:checked={this.model.provinceReplace}>
              是否单独替换省名称
            </NCheckbox>
          </NFormItem>
          <NFormItem label={t('project.list.string_replaced')} path='target'>
            <NInput v-model={[this.model.target, 'value']} type='textarea' />
          </NFormItem>
        </NForm>
      </Modal>
    )
  }
})

export default OneToThirtySixModal
