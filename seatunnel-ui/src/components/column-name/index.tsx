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
import { NEllipsis, NSpace, NTag } from 'naive-ui'
import { Fragment, PropType, defineComponent } from 'vue'

const props = {
  text: {
    type: String as PropType<string>,
    default: ''
  },
  width: {
    type: Number as PropType<number>,
    default: 120
  },
  globalResource: {
    type: Boolean as PropType<boolean>,
    default: false
  }
}

const ColumnName = defineComponent({
  name: 'column-name',
  props,
  setup(props) {
    const { t } = useI18n()

    return () => (
      <Fragment>
        <NSpace justify='start' wrap={false}>
          <NEllipsis style={{ maxWidth: `${props.width}px` }}>
            {props.text}
          </NEllipsis>
          {props.globalResource && (
            <NTag type='info' round size='small'>
              {t('resource.auth.public')}
            </NTag>
          )}
        </NSpace>
      </Fragment>
    )
  }
})

export default ColumnName
