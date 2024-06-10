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

import _, { remove } from 'lodash'
import { defineStore } from 'pinia'
import type { ILog, ILogState } from './types'
import { PREFIX_STORE } from '@/store/utils/common'

export const useIdeLogStore = defineStore({
  id: `${PREFIX_STORE}-studio.log`,
  state: (): ILogState => ({
    logs: []
  }),
  persist: {
    storage: sessionStorage
  },
  getters: {
    getLogs(): ILog[] {
      return this.logs
    }
  },
  actions: {
    addLog(log: ILog) {
      const oldLog = _.find(this.logs, { taskCode: log.taskCode })
      if (oldLog) {
        oldLog.commandId = log.commandId
        oldLog.content = log.content
        oldLog.pause = log.pause
        oldLog.timer = log.timer
        oldLog.skipLineNum = log.skipLineNum
      } else {
        this.logs.push(log)
      }
    },
    removeLog(taskCode: number) {
      remove(this.logs, { taskCode })
    },
    clearTimer(taskCode: number) {
      const log = _.find(this.logs, { taskCode })
      log!.timer = 0
      log!.skipLineNum = 0
    },
    init() {
      this.logs = []
    }
  }
})
