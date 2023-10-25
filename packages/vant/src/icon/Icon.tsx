import {
  inject,
  computed,
  defineComponent,
  type PropType,
  type ExtractPropTypes,
} from 'vue';

import {
  addUnit,
  numericProp,
  makeStringProp,
  createNamespace,
} from '../utils';

import { Badge, type BadgeProps } from '../badge';

const [name, bem] = createNamespace('icon');

/** 判断是否是图片，有‘/’说明是 */
const isImage = (name?: string) => name?.includes('/');

export const iconProps = {
  dot: Boolean,
  tag: makeStringProp<keyof HTMLElementTagNameMap>('i'),
  name: String,
  size: numericProp,
  badge: numericProp,
  color: String,
  badgeProps: Object as PropType<Partial<BadgeProps>>,
  classPrefix: String,
};


export type IconProps = ExtractPropTypes<typeof iconProps>;


export default defineComponent({
  name,
  props: iconProps,
  setup(props, { slots }) {
    /** 取全局设置的配置前缀 */
    // const config = inject('CONFIG_PROVIDER_KEY', null);

    /** 图标前缀 van-icon 最终拼接 van-icon-arrow */
    const classPrefix = computed(
      () => props.classPrefix || bem(),
    );

    return () => {
      const { tag, dot, name, size, badge, color } = props;
      const isImageIcon = isImage(name);

      return (
        <Badge
          dot={dot}
          tag={tag}
          class={[
            classPrefix.value,
            isImageIcon ? '' : `${classPrefix.value}-${name}`,
          ]}
          style={{
            color,
            fontSize: addUnit(size),
          }}
          content={badge}
          {...props.badgeProps}
        >
          {slots.default?.()}
          {isImageIcon && <img class={bem('image')} src={name} />}
        </Badge>
      )
    }
  }
})