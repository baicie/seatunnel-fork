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

type Base = { [key: string]: any }

export type ITabPanelType = 'setting' | 'script' | 'sql-lineage' | 'initScript'

export interface IHandler {
  name: string
  key: string
}

export interface ITab extends Base {
  name?: string
  code: number
  script?: string
  language: string
  log: string
  paneType: ITabPanelType
  handlers: IHandler[]
}
