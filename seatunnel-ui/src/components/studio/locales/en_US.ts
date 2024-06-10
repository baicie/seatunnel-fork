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

export const enUS = {
  success: 'Success',
  saved_successfully: 'Saved successfully',
  same_name_tips: 'Same name exits for files at the same level.',
  delete: 'Delete',
  delete_tips: 'Are you sure you want to delete {name}?',
  empty_name_tips: 'Please input the name.',
  rename: 'Rename',
  close_tips: 'Close Tips',
  close_content:
    'It has been modified and has not been saved. If you force it to close, the edited content will be lost. Do you need to save it before closing the label?',
  force_close: 'Force close',
  cannel: 'Cannel',
  confirm: 'Confirm',
  run_log: 'Run Log',
  close: 'Close',
  empty_tab_tips:
    'Please open a file by double clicking on the file name in the file list on the left.',
  resource: 'Resource',
  setting: 'Setting',
  script: 'Script',
  fullscreen: 'Fullscreen',
  save: 'Save',
  sql_lineage: 'SQL Lineage',
  resource_not_exit: 'Resource not exit',
  code: 'Code',
  debug_tips: 'Getting the log, please wait...',
  task_example: 'Example:',
  task_param_datax_tips:
    'Parameters are in kv format, key is the parameter name and value is the parameter value.',
  task_param_flinkx_tips:
    'Parameters are in list format, each parameter is an element in list, paramName of each element is parameter name, paramCommand is parameter value, type is parameter type, just set it to 1, and id is parameter ID is set to -1'
}

export type Locale = typeof enUS
