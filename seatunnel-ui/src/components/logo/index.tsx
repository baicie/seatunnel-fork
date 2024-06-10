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

import { defineComponent, ref } from 'vue'
import styles from './index.module.scss'

const Logo = defineComponent({
  name: 'Logo',
  props: {
    isBlack: {
      type: Boolean,
      default: true
    },
    width: {
      type: Number,
      default: 32
    }
  },
  setup(props) {
    const srcRef = ref(
      'https://camo.githubusercontent.com/0d6fa1cb036e5a50ac61711bc48fb968d8d218113042eed3f2f486ef9880432f/68747470733a2f2f73656174756e6e656c2e6170616368652e6f72672f696d6167652f6c6f676f2e706e67'
    )

    return () => (
      <div class={[styles['logo-box']]}>
        <img
          class={[styles['logo']]}
          style={{ width: props.width + 'px' }}
          src={srcRef.value}
        />
      </div>
    )
  }
})

export default Logo
