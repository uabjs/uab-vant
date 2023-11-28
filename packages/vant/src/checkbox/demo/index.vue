<script setup lang="ts">
import VanCheckbox from '..';
// import VanCheckboxGroup from '../../checkbox-group';
import VanButton from '../../button';
import VanCellGroup from '../../cell-group';
import VanCell from '../../cell';
import { ref, reactive } from 'vue';
import { cdnURL, useTranslate } from '../../../docs/site';
// import { useRefs } from '../../composables/use-refs';
import type { CheckboxInstance } from '../types';
// import type { CheckboxGroupInstance } from '../../checkbox-group';
const t = useTranslate({
  'zh-CN': {
    checkbox: '复选框',
    customIcon: '自定义图标',
    customIconSize: '自定义大小',
    customColor: '自定义颜色',
    customShape: '自定义形状',
    leftLabel: '左侧文本',
    title3: '复选框组',
    title4: '限制最大可选数',
    title5: '搭配单元格组件使用',
    toggleAll: '全选与反选',
    checkAll: '全选',
    inverse: '反选',
    horizontal: '水平排列',
    disableLabel: '禁用文本点击',
    indeterminate: '不确定状态',
  },
  'en-US': {
    checkbox: 'Checkbox',
    customIcon: 'Custom Icon',
    customIconSize: 'Custom Icon Size',
    customColor: 'Custom Color',
    customShape: 'Custom Shape',
    leftLabel: 'Left Label',
    title3: 'Checkbox Group',
    title4: 'Maximum amount of checked options',
    title5: 'Inside a Cell',
    toggleAll: 'Toggle All',
    checkAll: 'Check All',
    inverse: 'Inverse',
    horizontal: 'Horizontal',
    disableLabel: 'Disable label click',
    indeterminate: 'indeterminate',
  },
});

const state = reactive({
  checkbox1: true,
  checkbox2: true,
  checkbox3: true,
  isCheckAll: false,
  isIndeterminate: true,
  checkboxLabel: true,
  checkboxIcon: true,
  leftLabel: false,
  list: ['a', 'b'],
  result: ['a', 'b'],
  checkboxShape: ['a', 'b'],
  result2: [],
  result3: [],
  result4: ['a', 'b', 'd'],
  checkAllResult: [],
  horizontalResult: [],
});

const list = ['a', 'b', 'c', 'd'];


</script>

<template>
  <demo-block :title="t('basicUsage')">
    <van-checkbox v-model="state.checkbox1">{{ t('checkbox') }}</van-checkbox>
  </demo-block>

  <demo-block :title="t('disabled')">
    <van-checkbox :model-value="false" disabled>
      {{ t('checkbox') }}
    </van-checkbox>
    <van-checkbox :model-value="true" disabled>
      {{ t('checkbox') }}
    </van-checkbox>
  </demo-block>
</template>




<style lang="less">
.demo-checkbox {
  .van-checkbox {
    margin: 0 0 8px 20px;
  }

  .van-cell {
    .van-checkbox {
      margin: 0;
    }
  }

  img {
    height: 20px;
  }

  &-buttons {
    margin-top: var(--van-padding-md);

    .van-button {
      margin-left: var(--van-padding-md);
    }
  }

  .van-doc-demo-block__title {
    margin-top: -8px;
  }
}

.divider {
  margin: 20px;
  height: 1px;
  background: #ccc;
}
</style>
