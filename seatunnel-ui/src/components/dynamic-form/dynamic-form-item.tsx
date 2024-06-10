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

import { Fragment, computed, defineComponent, onBeforeMount, ref } from 'vue'
import {
  NFormItemGi,
  NGrid,
  NInput,
  NSelect,
  NCheckboxGroup,
  NSpace,
  NCheckbox,
  NTooltip
} from 'naive-ui'
import { useI18n } from 'vue-i18n'
import { PropType, watchEffect } from 'vue'
import type { SelectOption } from 'naive-ui'
import { DynamicFromStructureItem } from './types'

const formatClass = (name: string, modelField: string) => {
  return name.indexOf('[') >= 0
    ? name.split('[')[0].toLowerCase() + name.split('[')[1].split(']')[0]
    : name.toLowerCase() + '-' + modelField.toLowerCase()
}

const formItemDisabled = (
  field: string,
  value: Array<any>,
  item: DynamicFromStructureItem
) => {
  item.visiable = value.filter((v) => field === v).length > 0
  return item.visiable
}

const props = {
  formStructure: {
    type: Object as PropType<Array<object>>
  },
  model: {
    type: Object as PropType<object>
  },
  name: {
    type: String as PropType<string>,
    default: ''
  },
  locales: {
    type: Object as PropType<object>
  }
}

const DynamicFormItem = defineComponent({
  name: 'DynamicFormItem',
  props,
  setup(props) {
    const i18n = useI18n()
    const { t } = i18n

    watchEffect(() => {
      if (props.locales) {
        i18n.mergeLocaleMessage('zh_CN', {
          i18n: (props.locales as any).zh_CN
        })
        i18n.mergeLocaleMessage('en_US', {
          i18n: (props.locales as any).en_US
        })
      }
    })

    return {
      t
    }
  },
  render() {
    return (
      <NGrid xGap={10}>
        {(this.formStructure as Array<any>).map((f) => {
          return (
            (f.show
              ? formItemDisabled(
                  (this.model as any)[f.show.field],
                  f.show.value,
                  f
                )
              : true) && (
              <NFormItemGi
                label={this.t(f.label)}
                path={f.field}
                span={f.span || 24}
              >
                <DynamicItem field={f} name={this.name} model={this.model} />
              </NFormItemGi>
            )
          )
        })}
      </NGrid>
    )
  }
})

const itemProps = {
  field: {
    type: Object as PropType<DynamicFromStructureItem>,
    required: true
  },
  model: {
    type: Object as PropType<object>
  },
  name: {
    type: String as PropType<string>,
    default: ''
  }
}

const DynamicItem = defineComponent({
  name: 'DynamicItem',
  props: itemProps,
  setup(props) {
    const show = ref(false)
    const { t } = useI18n()
    const f = computed(() => props.field!)
    const showType = ['input', 'select']
    const showToolTip = computed<boolean>(
      () => showType.includes(f.value.type) && show.value
    )

    onBeforeMount(() => {
      const value = (props.model as any)[f.value.field]
      if (f.value.type === 'input' && typeof value === 'object') {
        ;(props.model as any)[f.value.field] = JSON.stringify(value)
      }
    })

    return () => (
      <NTooltip
        show={showToolTip.value}
        onClickoutside={() => (show.value = false)}
      >
        {{
          default: () =>
            f.value.placeholder ? (
              <div>
                {t(f.value.placeholder)
                  .split('\n')
                  .map((part, i, arr) => (
                    <Fragment key={i}>
                      {part}
                      {i < arr.length - 1 && <br />}
                    </Fragment>
                  ))}
              </div>
            ) : (
              ''
            ),
          trigger: () => (
            <Fragment>
              {f.value.type === 'input' && (
                <NInput
                  class={`dynamic-form_${formatClass(
                    props.name,
                    f.value.field
                  )}`}
                  placeholder={
                    f.value.placeholder ? t(f.value.placeholder) : ''
                  }
                  v-model={[(props.model as any)[f.value.field], 'value']}
                  clearable={f.value.clearable}
                  type={f.value.inputType}
                  rows={f.value.row ? f.value.row : 4}
                  onFocus={() => (show.value = true)}
                />
              )}
              {f.value.type === 'select' &&
                (f.value.show
                  ? formItemDisabled(
                      (props.model as any)[f.value.show.field],
                      f.value.show.value,
                      f.value
                    )
                  : true) && (
                  <NSelect
                    class={`dynamic-form_${formatClass(
                      props.name,
                      f.value.field
                    )}`}
                    placeholder={
                      f.value.placeholder ? t(f.value.placeholder) : ''
                    }
                    v-model={[(props.model as any)[f.value.field], 'value']}
                    options={f.value.options.map((o: SelectOption) => {
                      return {
                        label: t(o.label as string),
                        value: o.value
                      }
                    })}
                    onFocus={() => (show.value = true)}
                  />
                )}
              {f.value.type === 'checkbox' &&
                (f.value.show
                  ? formItemDisabled(
                      (props.model as any)[f.value.show.field],
                      f.value.show.value,
                      f.value
                    )
                  : true) && (
                  <NCheckboxGroup
                    class={`dynamic-form_${formatClass(
                      props.name,
                      f.value.field
                    )}`}
                    v-model={[(props.model as any)[f.value.field], 'value']}
                  >
                    <NSpace vertical={f.value.vertical}>
                      {f.value.options.map((o: any) => (
                        <NCheckbox
                          label={t(o.label as string)}
                          value={o.value}
                        />
                      ))}
                    </NSpace>
                  </NCheckboxGroup>
                )}
            </Fragment>
          )
        }}
      </NTooltip>
    )
  }
})

export { DynamicFormItem }
