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

import { cloneDeep, difference, isFunction, uniq } from 'lodash'
import { NPopover, NScrollbar, NTree, TreeOption } from 'naive-ui'
import {
  InternalSelectionInst,
  NInternalSelection
} from 'naive-ui/es/_internal'
import {
  SelectBaseOption,
  SelectOption
} from 'naive-ui/es/select/src/interface'
import {
  PropType,
  VNodeChild,
  defineComponent,
  h,
  onMounted,
  reactive,
  ref,
  unref,
  watch
} from 'vue'
import { IJsonItem } from '../types'
import styles from './index.module.scss'
import { TreeRenderProps } from 'naive-ui/es/tree/src/interface'

type RenderTag = (
  props: {
    option: SelectOption
  },
  handleClose?: (id: string) => void
) => VNodeChild

function findNode(tree: any[], id: number | string): any {
  for (const node of tree) {
    if (node.id === id) {
      return node
    }
    if (node.children) {
      const found = findNode(node.children, id)
      if (found) {
        return found
      }
    }
  }
  return null
}

export const SelectTree = defineComponent({
  name: 'select-tree',
  props: {
    options: {
      type: Array as PropType<TreeOption[]>,
      default: () => []
    },
    placeholder: {
      type: String,
      default: ''
    },
    value: {
      type: Array as PropType<string[]>,
      default: () => []
    },
    cascade: {
      type: Boolean,
      default: false
    },
    checkStrategy: {
      type: String as PropType<'all' | 'child' | 'parent'>,
      default: 'all'
    },
    checkable: {
      type: Boolean,
      default: false
    },
    filterable: {
      type: Boolean,
      default: false
    },
    keyField: {
      type: String,
      default: 'id'
    },
    labelField: {
      type: String,
      default: 'label'
    },
    loading: {
      type: Boolean,
      default: false
    },
    multiple: {
      type: Boolean,
      default: false
    },
    showPath: {
      type: Boolean,
      default: false
    },
    showIrrelevantNodes: {
      type: Boolean,
      default: false
    },
    onUpdateValue: {
      type: Function as PropType<
        (value: string[], option: (TreeOption | null)[]) => void
      >,
      default: () => {}
    },
    renderTag: {
      type: Function as PropType<RenderTag>,
      default: () => {}
    },
    renderLabel: {
      type: Function as PropType<(option: TreeRenderProps) => VNodeChild>,
      default: undefined
    },
    maxHeight: {
      type: Number,
      default: 300
    }
  },
  emits: ['update:value'],
  setup(props, { emit }) {
    const state = reactive({
      pattern: '',
      show: false,
      active: false
    })
    const selectionRef = ref<InternalSelectionInst | null>(null)

    const selectedOption = ref<SelectBaseOption[]>([])

    const onCheck = (value: any, option: any) => {
      emit('update:value', value)
      props.onUpdateValue(value, option)
      state.pattern = ''
      state.active = false
    }

    const onClickSelection = () => {
      selectionRef.value?.focusInput()
      state.show = true
    }

    const onPatternInput = (value: InputEvent) => {
      state.pattern = (value.target as HTMLInputElement).value
    }

    const onVlaueChange = () => {
      selectedOption.value = []
      props.value.forEach((id) => {
        const node = findNode(cloneDeep(props.options), id)
        if (node) selectedOption.value.push(node)
      })
    }

    const handleClose = (id: string) => {
      const value = props.value.filter((item) => item !== id)
      onVlaueChange()
      props.onUpdateValue(value, selectedOption.value as any)
    }

    const renderTagWarpper: RenderTag = ({ option }) => {
      return props.renderTag
        ? props.renderTag({ option }, handleClose)
        : undefined
    }

    watch(
      () => [props.value, props.options],
      () => {
        onVlaueChange()
      }
    )

    onMounted(() => {
      onVlaueChange()
    })

    return () => (
      <NPopover
        showArrow={false}
        width='trigger'
        onClickoutside={() => {
          state.show = false
        }}
        show={state.show}
      >
        {{
          default: () => (
            <NScrollbar style={{ maxHeight: `${props.maxHeight}px` }}>
              <NTree
                showIrrelevantNodes={props.showIrrelevantNodes}
                pattern={state.pattern}
                keyField={props.keyField}
                labelField={props.labelField}
                cascade={props.cascade}
                checkable={props.checkable}
                checkStrategy={props.checkStrategy}
                data={props.options}
                onUpdate:checkedKeys={onCheck}
                multiple={props.multiple}
                block-line
                class={styles['select-tree']}
                checkedKeys={props.value}
                renderLabel={props.renderLabel}
              ></NTree>
            </NScrollbar>
          ),
          trigger: () => (
            <NInternalSelection
              ref={selectionRef}
              style='border:1px solid rgb(224, 224, 230)'
              clsPrefix='select-tree'
              renderTag={renderTagWarpper}
              selectedOptions={selectedOption.value}
              multiple={props.multiple}
              loading={props.loading}
              filterable={props.filterable}
              placeholder={props.placeholder}
              pattern={state.pattern}
              active={state.active}
              onClick={onClickSelection}
              onPatternInput={onPatternInput}
            ></NInternalSelection>
          )
        }}
      </NPopover>
    )
  }
})

const getIds = (options: any[], filter: (item: any) => boolean) => {
  const ids: any[] = []
  options.forEach((item) => {
    if (item?.children) {
      const childIds = getIds(item.children, filter)
      ids.push(...childIds)
    }
    if (filter(item)) {
      ids.push(item.id)
    }
  })
  return ids
}

export function renderSelectTree(
  item: IJsonItem,
  fields: { [field: string]: any },
  updateValue?: (value: any, field: string) => void
) {
  const { props = {}, field, options = [] } = isFunction(item) ? item() : item

  return h(SelectTree, {
    ...props,
    value: fields[field],
    onUpdateValue: (value: number[], option: TreeOption[]) => {
      const _options = option.filter((item) => item)
      if (value.length > fields[field]?.length) {
        // add
        const ids = getIds(_options, (item) => !item.checkboxDisabled)
        value.push(...ids)
      } else {
        // remove
        const remove = difference(fields[field], value)
        remove.forEach((id) => {
          const node = findNode(unref(options), id)
          value = value.filter((id) => id !== node?.id)

          if (node?.children) {
            const ids = getIds(_options, (item) => !item.checkboxDisabled)
            value = value.filter((id) => !ids.includes(id))
          }
          if (node?.parent) {
            const parent = node?.parent
            if (parent?.children) {
              const childrenIds = parent.children?.map((child: any) => child.id)
              const some = childrenIds.some((id: number) => value.includes(id))
              if (!some) {
                value = value.filter((id) => id !== parent.id)
              }
            }
          }
        })
      }
      props.onUpdateValue(value, option)
      const _value = uniq(value)
      fields[field] = _value
      updateValue?.(_value, field)
    },
    options: unref(options)
  })
}
