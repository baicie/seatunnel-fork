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

import {
  defineComponent,
  onMounted,
  ref,
  PropType,
  watch,
  onUnmounted
} from 'vue'
import * as monaco from 'monaco-editor'
import { useFormItem } from 'naive-ui/es/_mixins'
import { call } from 'naive-ui/es/_utils'
import * as rpc from 'vscode-ws-jsonrpc'
import {
  MonacoLanguageClient,
  CloseAction,
  ErrorAction,
  MessageTransports
} from 'monaco-languageclient'
import normalizeUrl from 'normalize-url'
import type {
  MaybeArray,
  OnUpdateValue,
  OnUpdateValueImpl,
  monaco as Monaco
} from './types'

const props = {
  value: {
    type: String as PropType<string>,
    default: ''
  },
  defaultValue: {
    type: String as PropType<string>
  },
  'onUpdate:value': [Function, Array] as PropType<MaybeArray<OnUpdateValue>>,
  onUpdateValue: [Function, Array] as PropType<MaybeArray<OnUpdateValue>>,
  options: {
    type: Object as PropType<Monaco.editor.IStandaloneEditorConstructionOptions>,
    default: () => ({
      readOnly: false,
      language: 'shell'
    })
  },
  height: {
    type: String
  },
  code: {
    type: Number
  },
  dataSource: {
    type: Number,
    default: 0
  }
}

const wsPortMap = {
  python: 1591,
  shell: 1592,
  sql: 1593
} as any

export const MonacoEditor = defineComponent({
  name: 'monaco-editor',
  props,
  emits: ['change', 'focus', 'blur'],
  setup(props, ctx) {
    const language =
      props.options.language && wsPortMap[props.options.language]
        ? props.options.language
        : 'shell'

    const editorRef = ref()
    let editor = null as monaco.editor.IStandaloneCodeEditor | null
    const formItem = useFormItem({})

    const getUrl = () => {
      const wsUrl =
        `${window.location.protocol}//${window.location.host}`.replace(
          'http',
          'ws'
        )
      return normalizeUrl(
        `${wsUrl}/dolphinscheduler/webSocket/studio/${language}/${props.code}/${props.dataSource}`
      )
    }

    let webSocket = new WebSocket(getUrl())

    webSocket.onopen = () => {
      const socket = rpc.toSocket(webSocket)
      const reader = new rpc.WebSocketMessageReader(socket)
      const writer = new rpc.WebSocketMessageWriter(socket)
      const languageClient = createLanguageClient({
        reader,
        writer
      })
      languageClient.start()
      reader.onClose(() => languageClient.stop())
    }

    function createLanguageClient(
      transports: MessageTransports
    ): MonacoLanguageClient {
      return new MonacoLanguageClient({
        name: 'Studio Language Client',
        clientOptions: {
          // use a language id as a document selector
          documentSelector: ['python', 'sql', 'shell'],
          // disable the default error handler
          errorHandler: {
            error: () => ({ action: ErrorAction.Continue }),
            closed: () => ({ action: CloseAction.DoNotRestart })
          }
        },
        // create a language client connection from the JSON RPC connection on demand
        connectionProvider: {
          get: () => {
            return Promise.resolve(transports)
          }
        }
      })
    }

    // function createUrl(hostname: string, port: number, path: string): string {
    //   const protocol = location.protocol === 'https:' ? 'wss' : 'ws'
    //   return normalizeUrl(`${protocol}://${hostname}:${port}${path}`)
    // }

    const initMonacoEditor = () => {
      const dom = editorRef.value
      if (dom) {
        editor = monaco.editor.create(dom, {
          ...props.options,
          model: monaco.editor.createModel(
            props.defaultValue ?? props.value,
            props.options.language || 'shell',
            monaco.Uri.parse(`inmemory://${props.code}`)
          ),
          automaticLayout: true,
          theme: 'vs',
          renderWhitespace: 'trailing'
        })
        editor.onDidChangeModelContent(() => {
          const { onUpdateValue, 'onUpdate:value': _onUpdateValue } = props
          const value = editor?.getValue() || ''

          if (onUpdateValue) call(onUpdateValue as OnUpdateValueImpl, value)
          if (_onUpdateValue) call(_onUpdateValue as OnUpdateValueImpl, value)
          ctx.emit('change', value)

          formItem.nTriggerFormChange()
          formItem.nTriggerFormInput()
        })
        editor.onDidBlurEditorWidget(() => {
          ctx.emit('blur')
          formItem.nTriggerFormBlur()
        })
        editor.onDidFocusEditorWidget(() => {
          ctx.emit('focus')
          formItem.nTriggerFormFocus()
        })
      }
    }

    onMounted(() => initMonacoEditor())

    watch(
      () => props.value,
      () => editor?.getValue() !== props.value && editor?.setValue(props.value)
    )

    watch(
      () => props.options.readOnly,
      () => {
        editor?.updateOptions({
          readOnly: props.options.readOnly || false
        })
      }
    )

    watch(
      () => props.dataSource,
      () => {
        // close old ws
        webSocket && webSocket.close()

        // create new ws
        webSocket = new WebSocket(getUrl())
      }
    )

    onUnmounted(() => {
      webSocket.close()
      monaco.editor.getModels().forEach((model) => model.dispose())
    })

    return () => (
      <div
        ref={editorRef}
        style={{
          height: props.height,
          width: '100%',
          border: '1px solid #eee'
        }}
      />
    )
  }
})
