import { defineComponent, type ExtractPropTypes } from 'vue';
import { truthProp, createNamespace, BORDER_TOP_BOTTOM } from '../utils';
import { useScopeId } from '../composables/use-scope-id';

const [name, bem] = createNamespace('cell-group');

// 单元格组的参数
export const cellGroupProps = {
  title: String,
  inset: Boolean, // 卡片风格
  border: truthProp, // 是否显示外边框
};

export type CellGroupProps = ExtractPropTypes<typeof cellGroupProps>;

export default defineComponent({
  name,
  inheritAttrs: false,
  props: cellGroupProps,
  setup(props, { slots, attrs }) {
    const renderGroup = () => {
      <div
        class={[
          bem({ inset: props.inset }),
          // 边框
          { [BORDER_TOP_BOTTOM]: props.border && !props.inset },
        ]}
        {...attrs} // 其他没有接收的属性直接放标签上
        {...useScopeId()} // 解决使用 teleport & fragment 时获取 scopeId 失败的问题
      >
        {slots.default?.()}
      </div>
    }

    const renderTitle = () => {
      <div class={bem('title', { inset: props.inset })}>
        { slots.title ? slots.title() : props.title }
      </div>
    }

    return () => {
      // 存在标题就渲染这里
      if (props.title || slots.title) {
        return (
          <>
            {renderTitle()}
            {renderGroup()}
          </>
        )
      }
      
      // 不存在标题就渲染这里
      return renderGroup()
    }
  }
})