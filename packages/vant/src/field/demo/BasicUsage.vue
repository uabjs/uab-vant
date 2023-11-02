<script setup lang="ts">
import VanField from '..';
import VanCellGroup from '../../cell-group';
import { ref, watch } from 'vue';
import { useTranslate } from '../../../docs/site';

console.log("VanField========", VanField)

const t = useTranslate({
  'zh-CN': {
    label: '文本',
    placeholder: '请输入文本',
  },
  'en-US': {
    label: 'Label',
    placeholder: 'Text',
  },
});

const value = ref('');
watch(value, (now, old) => {
  console.log("new, old=====", now, old)
})
</script>

<template>
  <demo-block :title="t('basicUsage')">
    <van-cell-group inset>
      <van-field
        v-model="value"
        :label="t('label')"
        :placeholder="t('placeholder')"
      />
    </van-cell-group>
  </demo-block>
</template>
