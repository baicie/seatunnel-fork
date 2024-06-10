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
  ArrowRightOutlined,
  ClockCircleOutlined,
  DownOutlined
} from '@vicons/antd'
import _ from 'lodash'
import { NButton, NDatePicker, NIcon, NPopselect, NSpace } from 'naive-ui'
import { PropType, computed, defineComponent, onMounted, ref, watch } from 'vue'
import { useI18n } from 'vue-i18n'
import { format, subHours, addHours } from 'date-fns'
import styles from './index.module.scss'
import { useDateTimeStore } from '@/store/datetime/datetime'
import { formatShortCutsTime } from '@/utils/datetime'
import { DATE_PICKER_TYPES } from '@/utils/types'

const FIXED_TYPES = [
  'today',
  'last_day',
  'last_three_day',
  'last_week',
  'last_month'
]

const CUSTOM_TYPE = 'custom'

const props = {
  persist: {
    type: Boolean as PropType<boolean>,
    default: true
  },
  size: {
    type: String as PropType<any>,
    default: 'small'
  },
  module: {
    type: String as PropType<string>,
    default: 'project'
  },
  type: {
    type: String as PropType<string>,
    default: 'custom'
  },
  value: {
    type: Object as PropType<[string, string] | null>,
    default: null
  },
  immediately: {
    type: Boolean as PropType<boolean>,
    default: false
  }
}

export default defineComponent({
  name: 'datetime-range',
  props,
  emits: ['update:value', 'update:type', 'updateDatePicker'],
  setup(props, ctx) {
    const { persist, module } = props

    const { t } = useI18n()
    const dateTimeStore = useDateTimeStore()
    const { getDateTimeByModule, getDateTimeFormatValue } = dateTimeStore

    const showPopover = ref(false)
    const dateTimeType = ref(props.type)
    const dateTimeValue = ref<[string, string] | null>(props.value)

    const actionShow = computed(
      () => dateTimeType.value && !FIXED_TYPES.includes(dateTimeType.value)
    )

    const initDateTime = () => {
      if (persist) {
        const dateTime = getDateTimeByModule(module)
        if (dateTime) {
          dateTimeType.value = dateTime.type
          dateTimeValue.value = dateTime.value
        }
      }
      handleUpdateValue(module, dateTimeType.value, dateTimeValue.value)
    }

    const genOptions = () => [
      ...FIXED_TYPES.map((key: string) => ({
        label: t(`project.workflow.${key}`),
        value: key
      })),
      {
        label: t('project.workflow.custom'),
        value: CUSTOM_TYPE
      }
    ]

    const datetimeRangeText = computed(() => {
      return genOptions().filter(
        (option: any) => option.value === dateTimeType.value
      )[0]?.label
    })

    const handleUpdateValue = (
      module: string,
      type: string,
      time: [string, string] | null
    ) => {
      persist && dateTimeStore.setDateTime(module, type, time)
      ctx.emit('update:type', type)
      ctx.emit('update:value', time)
      ctx.emit('updateDatePicker', type, time)
    }

    const handleDeleteValue = (module: string) => {
      persist && dateTimeStore.deleteDateTime(module)
      ctx.emit('update:type', 'custom')
      ctx.emit('update:value', null)
      ctx.emit('updateDatePicker', 'custom', null)
    }

    const handleUpdateType = (type: DATE_PICKER_TYPES) => {
      dateTimeValue.value = formatShortCutsTime(
        type,
        type === 'custom'
          ? [
              format(subHours(new Date(), 23), 'yyyy-MM-dd HH:mm:ss'),
              format(addHours(new Date(), 1), 'yyyy-MM-dd HH:mm:ss')
            ]
          : null
      )
      if (FIXED_TYPES.includes(type)) {
        showPopover.value = false
      }
      handleUpdateValue(module, type, dateTimeValue.value)
    }

    const handleDatePickerConfirm = (
      value: [number, number],
      formattedValue: [string, string]
    ) => {
      showPopover.value = false
      dateTimeValue.value = formattedValue
      handleUpdateValue(module, CUSTOM_TYPE, dateTimeValue.value)
    }

    const handleDatePickerClear = () => {
      dateTimeValue.value = null
      handleDeleteValue(module)
    }

    const reset = () => {
      let value = null
      if (persist) {
        dateTimeStore.resetDateTime(module)
        const dateTime = getDateTimeByModule(module)
        dateTimeType.value = dateTime.type
        dateTimeValue.value = dateTime.value
        value = getDateTimeFormatValue(module)
      }
      ctx.emit('update:type', 'custom')
      ctx.emit('update:value', value)
    }

    ctx.expose({ reset })

    onMounted(() => {
      initDateTime()
    })

    watch([() => props.type, () => props.value], () => {
      dateTimeType.value = props.type
      dateTimeValue.value = props.value

      props.immediately &&
        dateTimeStore.setDateTime(module, props.type, props.value)
    })

    return () => (
      <NPopselect
        options={genOptions()}
        trigger='click'
        width='trigger'
        v-model:value={dateTimeType.value}
        show={showPopover.value}
        onUpdateValue={handleUpdateType}
        onClickoutside={() => (showPopover.value = false)}
        size={props.size}
      >
        {{
          default: () => (
            <NButton
              onClick={() => (showPopover.value = !showPopover.value)}
              style={{
                width:
                  _.isArray(dateTimeType.value) ||
                  dateTimeType.value === CUSTOM_TYPE
                    ? '406px'
                    : 'auto',
                minWidth: '188px'
              }}
              class={styles.button}
              iconPlacement='right'
              size={props.size}
            >
              <NSpace justify='space-between' class={styles['time-area']}>
                {dateTimeType.value === CUSTOM_TYPE && (
                  <NIcon
                    depth={
                      dateTimeType.value === CUSTOM_TYPE && !dateTimeValue.value
                        ? 4
                        : 1
                    }
                  >
                    <ClockCircleOutlined />
                  </NIcon>
                )}
                {dateTimeType.value === CUSTOM_TYPE ? (
                  <NSpace
                    style={{ width: '100%' }}
                    justify='space-around'
                    wrap-item={false}
                  >
                    {dateTimeValue.value ? (
                      dateTimeValue.value[0]
                    ) : (
                      <span class={styles['placeholder-text']}>
                        {t('datePicker.begin_date_and_time')}
                      </span>
                    )}
                    <NIcon depth={4}>
                      <ArrowRightOutlined />
                    </NIcon>
                    {dateTimeValue.value ? (
                      dateTimeValue.value[1]
                    ) : (
                      <span class={styles['placeholder-text']}>
                        {t('datePicker.end_date_and_time')}
                      </span>
                    )}
                  </NSpace>
                ) : (
                  datetimeRangeText.value
                )}
                <NIcon depth={4}>
                  <DownOutlined />
                </NIcon>
              </NSpace>
            </NButton>
          ),
          action: () =>
            actionShow.value && (
              <NDatePicker
                type='datetimerange'
                onConfirm={handleDatePickerConfirm}
                onClear={handleDatePickerClear}
                formattedValue={dateTimeValue.value}
                clearable
              />
            )
        }}
      </NPopselect>
    )
  }
})
