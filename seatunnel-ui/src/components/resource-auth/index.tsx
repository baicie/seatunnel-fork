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

import { NButton, NTooltip, NIcon, NPopover, useDialog, NSpace } from 'naive-ui'
import { useI18n } from 'vue-i18n'
import { defineComponent, PropType, h, withDirectives, ref } from 'vue'
import { permission } from '@/directives/permission'
import { UserOutlined } from '@vicons/antd'
import { TreeOption } from 'naive-ui'
import {
  authResourceProject,
  getResourceProject,
  verifyUsedFileResource,
  verifyUsedGitResource
} from '@/service/modules/resources'
import { accessTypeKey } from '@/service/modules/resources/types'
import CheckboxTree from '../checkbox-tree'
import { useRouter } from 'vue-router'

const props = {
  row: {
    type: Object as PropType<any>,
    required: true
  },
  accessType: {
    type: String as PropType<accessTypeKey>,
    default: ''
  },
  disabled: {
    type: Boolean as PropType<boolean>,
    default: false
  },
  isResource: {
    type: Boolean as PropType<boolean>,
    default: false
  }
}

const ResourceAuth = defineComponent({
  name: 'resource-auth',
  props,
  setup(props) {
    const { t } = useI18n()
    const router = useRouter()
    const showPopover = ref(false)
    const authOptions = ref<TreeOption[]>([])
    const dialog = useDialog()

    const handleAuth = () => {
      getResourceProject({
        accessType: props.accessType,
        accessCode: props.row.id
      }).then((res: any) => {
        if (props.isResource) {
          authOptions.value = res
            .filter((option: any) => {
              return option.owner === false
            })
            .map((item: any) => {
              return {
                label: item.name,
                key: item.code,
                selected: item.selected
              }
            })
        } else {
          authOptions.value = res.map((option: any) => ({
            label: option.name,
            key: option.code,
            selected: option.selected
          }))
        }

        showPopover.value = true
      })
    }

    const getRemovedProject = (checkedKeys: number[]) => {
      const removedOptions = authOptions.value.filter(
        (option: any) => option.selected && !checkedKeys.includes(option.key)
      )
      return removedOptions.map((option: any) => option.key)
    }

    const handleAuthConfirm = async (
      globalResource: boolean,
      checkedKeys: number[]
    ) => {
      if (props.isResource && props.row.globalResource) {
        showPopover.value = false
        return
      }

      let refs = []
      const removedAuth = getRemovedProject(checkedKeys)
      if (removedAuth.length) {
        let res = []
        if (props.accessType === 'FILE' || props.accessType === 'UDF_FILE') {
          res = await verifyUsedFileResource(props.row.id)
        }
        if (props.accessType === 'GIT_FILE') {
          res = await verifyUsedGitResource(props.row.id)
        }
        refs = res.filter((item: any) => removedAuth.includes(item.projectCode))
      }

      if (refs.length) {
        dialog.warning({
          title: t('resource.file.tips'),
          content: t('resource.auth.auth_content_tips', {
            type: props.row.directory
              ? t('resource.file.folder')
              : t('resource.file.file'),
            content: refs.map((item: any) => item.workflowName).join(',')
          }),
          action: () =>
            h(
              NSpace,
              {},
              {
                default: () => [
                  h(
                    NButton,
                    {
                      type: 'info',
                      onClick: () => {
                        authResourceProject({
                          globalResource,
                          accessType: props.accessType,
                          accessCode: props.row.id,
                          isShare: true,
                          projectCodes: checkedKeys
                        }).then(() => {
                          showPopover.value = false
                          window.$message.success(t('resource.auth.success'))
                          router.go(0)
                        })
                      }
                    },
                    { default: () => t('resource.file.confirm') }
                  ),
                  h(
                    NButton,
                    {
                      onClick: () => {
                        showPopover.value = false
                        dialog.destroyAll()
                      }
                    },
                    { default: () => t('resource.file.cancel') }
                  )
                ]
              }
            )
        })
      } else {
        authResourceProject({
          globalResource,
          accessType: props.accessType,
          accessCode: props.row.id,
          isShare: true,
          projectCodes: checkedKeys
        }).then(() => {
          showPopover.value = false
          window.$message.success(t('resource.auth.success'))
          router.go(0)
        })
      }
    }

    return () => (
      <NTooltip>
        {{
          trigger: () =>
            h(
              NPopover,
              {
                show: showPopover.value,
                placement: 'bottom-end',
                trigger: 'manual'
              },
              {
                trigger: () =>
                  withDirectives(
                    h(
                      NButton,
                      {
                        disabled: props.disabled,
                        tag: 'div',
                        circle: true,
                        size: 'small',
                        type: 'warning',
                        onClick: handleAuth
                      },
                      {
                        default: () =>
                          h(NIcon, null, { default: () => h(UserOutlined) })
                      }
                    ),
                    [[permission, 'security:resources:auth']]
                  ),
                default: () =>
                  h(CheckboxTree, {
                    isResource: props.isResource,
                    data: authOptions.value,
                    row: props.row,
                    defaultChecked: authOptions.value
                      .filter((option) => option.selected)
                      .map((option) => option.key as number),
                    globalResource: props.row.globalResource || false,
                    showGlobalResource: props.accessType !== 'TASK_GROUP',
                    onCancel: () => (showPopover.value = false),
                    onConfirm: handleAuthConfirm
                  })
              }
            ),

          default: () => t('resource.auth.authorize')
        }}
      </NTooltip>
    )
  }
})

export default ResourceAuth
