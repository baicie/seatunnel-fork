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
import { utils, writeFile, read } from 'xlsx'
import type { WorkBook } from 'xlsx'

export function exportExcelFile(
  array: any[],
  sheetName = 'sheet1',
  fileName = 'example.xlsx'
) {
  const jsonWorkSheet = utils.json_to_sheet(array)
  const workBook: WorkBook = {
    SheetNames: [sheetName],
    Sheets: {
      [sheetName]: jsonWorkSheet
    }
  }
  return writeFile(workBook, fileName)
}

export function getJsonFromExcel<Item = any>(
  excelRcFileBuffer: ArrayBuffer
): Item[] {
  const workbook = read(excelRcFileBuffer, { type: 'buffer' })
  const sheetNames = workbook.SheetNames
  const sheet1 = workbook.Sheets[sheetNames[0]]
  return utils.sheet_to_json(sheet1)
}
