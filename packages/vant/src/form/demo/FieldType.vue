<script setup lang="ts">
import { ref } from 'vue';
import { cdnURL, useTranslate } from '../../../docs/site';
import VanForm from '..';
import VanField from '../../field';
import VanButton from '../../button';
import VanSwitch from '../../switch';
import VanCellGroup from '../../cell-group';

const t = useTranslate({
  'zh-CN': {
    rate: '评分',
    radio: '单选框',
    submit: '提交',
    switch: '开关',
    slider: '滑块',
    picker: '选择器',
    stepper: '步进器',
    checkbox: '复选框',
    uploader: '文件上传',
    fieldType: '表单项类型',
    checkboxGroup: '复选框组',
    requireCheckbox: '请勾选复选框',
  },
  'en-US': {
    rate: 'Rate',
    radio: 'Radio',
    submit: 'Submit',
    switch: 'Switch',
    slider: 'Slider',
    picker: 'Picker',
    stepper: 'Stepper',
    checkbox: 'Checkbox',
    uploader: 'Uploader',
    fieldType: 'Field Type',
    checkboxGroup: 'Checkbox Group',
    requireCheckbox: 'Checkbox is required',
  },
});

const switchChecked = ref(false);


const onSubmit = (values: Record<string, string>) => {
  console.log(values);
};
</script>


<template>
  <demo-block :title="t('fieldType')">
    <van-form @submit="onSubmit">
      <van-cell-group inset>
        <van-field name="switch" :label="t('switch')">
          <template #input>
            <van-switch v-model="switchChecked" />
          </template>
        </van-field>
      </van-cell-group>

      <div style="margin: 16px 16px 0">
        <van-button round block type="primary" native-type="submit">
          {{ t('submit') }}
        </van-button>
      </div>
    </van-form>
  </demo-block>
</template>