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
import type {
  ButtonProps,
  FormItemRule,
  FormProps,
  FormRules,
  GridProps,
  InputNumberProps,
  SelectOption,
  SelectProps,
  SwitchProps
} from 'naive-ui'
import type { VNode, VNodeChild } from 'vue'
import { Ref } from 'vue'
import { SelectTree } from './fields/select-tree'

type IType =
  | 'input'
  | 'radio'
  | 'editor'
  | 'custom-parameters'
  | 'switch'
  | 'input-number'
  | 'select'
  | 'checkbox'
  | 'tree-select'
  | 'multi-input'
  | 'custom'
  | 'multi-condition'
  | 'button'
  | 'dropdown'
  | 'switch-relation'
  | 'select-tree'

interface IOption {
  [key: string]: any
}

interface IFormItem {
  showLabel?: boolean
  path: string
  label?: string | VNode
  widget: any
  span?: number | Ref<number>
  type?: 'custom'
  class?: string
}

interface IMeta extends Omit<FormProps, 'model'> {
  elements?: IFormItem[]
  model: object
}

interface IJsonItemBaseParams {
  field: string
  name?: string | VNode
  props?: any
  title?: string
  type?: IType
  validate?: FormItemRule
  value?: any
  showRequireMark?: boolean
  options?: IOption[] | Ref<IOption[]>
  children?: IJsonItem[]
  slots?: object
  span?: number | Ref<number>
  widget?: any
  class?: string
  path?: string
  rule?: FormItemRule
  content?: string
  showFeedback?: boolean
  renderLabel?: (option: SelectOption) => VNodeChild
}

interface IJsonItemInputNumberParams extends IJsonItemBaseParams {
  type: 'input-number'
  props: InputNumberProps
}

interface IJsonItemSelectTreeParams extends IJsonItemBaseParams {
  type: 'select-tree'
  props: InstanceType<typeof SelectTree>['$props']
}

interface IJsonItemSelectParams extends IJsonItemBaseParams {
  type: 'select'
  props: SelectProps
}

interface IJsonItemSwitchParams extends IJsonItemBaseParams {
  type: 'switch'
  props: SwitchProps
}

interface IJsonItemButtonParams extends IJsonItemBaseParams {
  type: 'button'
  props: ButtonProps
}

type IJsonItemParams =
  | IJsonItemBaseParams
  | IJsonItemInputNumberParams
  | IJsonItemSelectTreeParams
  | IJsonItemSelectParams
  | IJsonItemSwitchParams
  | IJsonItemButtonParams

type IJsonItemFn = (i?: number) => IJsonItemParams

type IJsonItem = IJsonItemParams | IJsonItemFn

export {
  FormItemRule,
  FormRules,
  GridProps,
  IFormItem,
  IJsonItem,
  IJsonItemParams,
  IMeta,
  IOption,
  IType
}
