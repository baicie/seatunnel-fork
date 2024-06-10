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

import { reactive, ref } from 'vue'
import { useFormLocales } from './use-form-locales'
import { useFormField } from './use-form-field'
import { useFormValidate } from './use-form-validate'
import { useFormStructure } from './use-form-structure'
import { useFormRequest } from './use-form-request'
import { useI18n } from 'vue-i18n'

export function useForm(data: any) {
  const { t } = useI18n()

  const variables = reactive({
    dynamicForm: ref(),
    formStructure: [],
    model: {},
    rules: {}
  })

  data.locales && useFormLocales(data.locales)
  variables.model = useFormField(data.forms)
  variables.rules = useFormValidate(data.forms, variables.model, t)
  variables.formStructure = useFormStructure(
    data.apis ?
      useFormRequest(data.apis, data.forms) :
      data.forms
  ) as any

  const handleValidate = () => {
    variables.dynamicForm.validate((err: any) => {
      if (err) return
    })
  }


  return {
    variables,
    handleValidate
  }
}