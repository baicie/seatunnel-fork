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

import { defineComponent } from 'vue'

const CubeIcon = defineComponent({
  name: 'cube',
  setup() {
    return () => (
      <svg
        class='icon'
        viewBox='0 0 1024 1024'
        version='1.1'
        xmlns='http://www.w3.org/2000/svg'
        p-id='116470'
        width='200'
        height='200'
      >
        <path
          d='M908.8 264.533333L526.933333 46.933333c-10.666667-4.266667-21.333333-4.266667-32 0L115.2 264.533333c-10.666667 4.266667-14.933333 14.933333-14.933333 27.733334v437.333333c0 12.8 4.266667 21.333333 14.933333 27.733333l381.866667 219.733334c4.266667 2.133333 10.666667 4.266667 14.933333 4.266666 4.266667 0 10.666667-2.133333 14.933333-4.266666l381.866667-217.6c10.666667-4.266667 14.933333-14.933333 14.933333-27.733334V292.266667c-2.133333-10.666667-6.4-21.333333-14.933333-27.733334z m-49.066667 448L512 915.2 164.266667 712.533333V311.466667L512 108.8l347.733333 200.533333v403.2z'
          fill='#8a8a8a'
          p-id='116471'
        ></path>
        <path
          d='M251.733333 373.333333c-6.4 14.933333-2.133333 34.133333 12.8 42.666667l217.6 125.866667V789.333333c0 17.066667 14.933333 32 32 32s32-14.933333 32-32V541.866667l217.6-125.866667c14.933333-6.4 19.2-27.733333 12.8-42.666667-6.4-14.933333-27.733333-19.2-42.666666-12.8L512 486.4l-217.6-125.866667c-14.933333-6.4-34.133333-2.133333-42.666667 12.8z'
          fill='#8a8a8a'
          p-id='116472'
        ></path>
      </svg>
    )
  }
})

export default CubeIcon
