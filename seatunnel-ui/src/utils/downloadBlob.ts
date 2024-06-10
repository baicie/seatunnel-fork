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

const downloadBlob = (data: any, fileName = 'json') => {
  if (!data) {
    return
  }
  const blob = new Blob([data])
  if ('download' in document.createElement('a')) {
    // Not IE
    const url = window.URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.style.display = 'none'
    link.href = url
    link.setAttribute('download', fileName)
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link) // remove element after downloading is complete.
    window.URL.revokeObjectURL(url) // release blob object
  } else {
    // IE 10+
    if (window.navigator.msSaveBlob) {
      window.navigator.msSaveBlob(blob, fileName)
    }
  }
}

export default downloadBlob
