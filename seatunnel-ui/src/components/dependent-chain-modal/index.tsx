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

import { defineComponent, PropType } from 'vue'
import Modal from '@/components/modal'
import { NAlert, NCard, NIcon, NSpace, NTooltip, NTree } from 'naive-ui'
import { QuestionCircleOutlined } from '@vicons/antd'
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
  type: {
    type: String as PropType<string>,
    default: 'task'
  },
  taskName: {
    type: String as PropType<string>,
    default: ''
  },
  runWorkflows: {
    type: Array as PropType<Array<any>>,
    default: []
  },
  skipWorkflows: {
    type: Array as PropType<Array<any>>,
    default: []
  }
}

export default defineComponent({
  name: 'dependent-chain-modal',
  props,
  emits: ['confirmModal', 'cancelModal'],
  setup(props, ctx) {
    const { t } = i18n.global

    const handleConfirm = () => {
      ctx.emit('confirmModal')
    }

    const handleCancel = () => {
      ctx.emit('cancelModal')
    }

    return () => (
      <Modal
        title={
          props.taskName
            ? t('project.task.detail')
            : t('project.task.confirm_operation')
        }
        show={props.show}
        onConfirm={handleConfirm}
        onCancel={handleCancel}
        confirmShow={!props.taskName}
        confirmLoading={props.saving}
        cancelText={
          props.taskName ? t('project.task.return') : t('project.task.cancel')
        }
      >
        <NSpace vertical>
          {props.taskName && <NAlert showIcon={false}>{props.taskName}</NAlert>}
          <NCard
            title={
              props.type === 'task'
                ? t('project.task.dependent_chain_title')
                : t('project.workflow.dependent_chain_title')
            }
            bordered={false}
            size='small'
          >
            <NTree data={props.runWorkflows}></NTree>
          </NCard>
          {props.skipWorkflows.length > 0 && (
            <NCard title='' bordered={false} size='small'>
              <NAlert title='' type='warning'>
                <NSpace>
                  {props.type === 'task'
                    ? t('project.task.dependent_chain_condition_title')
                    : t('project.workflow.dependent_chain_condition_title')}
                  <NTooltip>
                    {{
                      trigger: () => (
                        <NIcon>
                          <QuestionCircleOutlined />
                        </NIcon>
                      ),
                      default: () => (
                        <div>
                          {t('project.task.dependent_chain_condition_tip1')}
                          <br />
                          {t('project.task.dependent_chain_condition_tip2')}
                          <br />
                          {t('project.task.dependent_chain_condition_tip3')}
                          <br />
                        </div>
                      )
                    }}
                  </NTooltip>
                </NSpace>
              </NAlert>
              <NTree data={props.skipWorkflows}></NTree>
            </NCard>
          )}
        </NSpace>
      </Modal>
    )
  }
})
