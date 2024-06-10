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

const ContainerServicesIcon = defineComponent({
  name: 'container-services',
  setup() {
    return () => (
      <svg
        class='icon'
        viewBox='0 0 1024 1024'
        version='1.1'
        xmlns='http://www.w3.org/2000/svg'
        p-id='209478'
        width='200'
        height='200'
      >
        <path
          d='M864 704v-160a64.064 64.064 0 0 0-64-64h-256v-160h96a64.064 64.064 0 0 0 64-64V128a64.064 64.064 0 0 0-64-64h-256a64.064 64.064 0 0 0-64 64v128a64.064 64.064 0 0 0 64 64h96v160H224a64.064 64.064 0 0 0-64 64v160H64v256h256v-256H224v-160h256v160h-96v256h256v-256h-96v-160h256v160h-96v256h256v-256zM384 128h256v128h-256zM256 896H128v-128h128z m320 0h-128v-128h128z m320 0h-128v-128h128z'
          p-id='209479'
          fill='#8a8a8a'
        ></path>
      </svg>
    )
  }
})

export default ContainerServicesIcon
