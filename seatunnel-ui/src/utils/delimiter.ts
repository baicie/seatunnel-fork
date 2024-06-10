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

// field delimiter; row delimiter
// If '[]' or '{}' appears, do not process it.
// otherwise, convert '\t' and '\n' to '\\t' and '\\n'.

const blacks = ['[', '{']
export function enDelimiter(str = ''): string {
  const isBlack = blacks.some((b: string) => {
    return str.includes(b)
  })
  if (isBlack) return str

  return str.replace(/\n/g, '\\n').replace(/\t/g, '\\t')
}

export function deDelimiter(str = ''): string {
  const isBlack = blacks.some((b: string) => {
    return str.includes(b)
  })
  if (isBlack) return str

  const res = str.replace(/\\n/g, '\n').replace(/\\t/g, '\t')
  return res
}

// Unicode \u0001
export function enFormatUnicode(str = ''): string {
  // After applying JSON.stringify, the result is '"str"'
  const newStr = JSON.stringify(str).replace(/^\"|\"$/g, '')
  if (newStr.startsWith('\\u')) {
    return newStr
  }
  return str
}

export function deFormatUnicode(str = ''): string {
  // After applying JSON.stringify, the result is '"str"'
  if (str.startsWith('\\u')) {
    const res = JSON.parse(`"${str}"`)
    return res
  }
  return str
}
