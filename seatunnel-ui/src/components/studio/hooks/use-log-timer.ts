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

import { queryTaskLog } from '@/service/modules/log'
import { LogRes } from '@/service/modules/log/types'
import _ from 'lodash'
import { computed } from 'vue'
import { useIdeLogStore } from '../store/log'
import { ILog } from '../store/log/types'

export function useLogTimer(taskCode: number) {
  const logStore = useIdeLogStore()

  const logs = logStore.getLogs
  const log = (_.find(logs, { taskCode }) || {}) as ILog

  const runFlag = computed(() => log.timer > 0)

  const getLogs = () => {
    const { commandId } = log

    queryTaskLog({
      taskCode,
      commandId,
      limit: 1000,
      skipLineNum: log.skipLineNum
    }).then((res: LogRes) => {
      if (res.log) {
        log.content += res.log
      }
      if (res.hasNext) {
        log.skipLineNum = res.currentLogLineNumber
        clearTimeout(log.timer)
        log.timer = setTimeout(() => {
          getLogs()
        }, 2000)
      } else {
        log.skipLineNum = 0
      }
    })
  }

  const pauseLog = () => {
    log.pause = true
    clearTimeout(log?.timer)
  }

  const restartLog = () => {
    log.pause = false
    getLogs()
  }

  return {
    runFlag,
    pauseLog,
    restartLog
  }
}
