import {
  computed,
  defineComponent,
  type PropType,
  type CSSProperties,
  type ExtractPropTypes,
} from 'vue';
import {
  isDef,
  addUnit,
  isNumeric,
  truthProp,
  numericProp,
  makeStringProp,
  createNamespace,
  type Numeric,
} from '../utils';

const [name, bem] = createNamespace('badge');

// Badge 组件的类型
import { BadgePosition } from './types';

export const badgeProps = {
  dot: Boolean,
  max: numericProp,
  tag: makeStringProp<keyof HTMLElementTagNameMap>('div'),
  color: String,
  offset: Array as unknown as PropType<[Numeric, Numeric]>,
  content: numericProp,
  showZero: truthProp,
  position: makeStringProp<BadgePosition>('top-right'),
};

export type BadgeProps = ExtractPropTypes<typeof badgeProps>;

export default defineComponent({
  name,
  props: badgeProps,
  setup(props, { slots }) {

    /** 是否存在自定义徽标内容 */
    const hasContent = () => {
      if (slots.content) {
        return true;
      }
      const { content, showZero } = props;
      return (
        isDef(content) &&
        content !== '' &&
        (showZero || (content !== 0 && content !== '0'))
      );
    };

    /** 渲染内容 */
    const renderContent = () => {
      const { dot, max, content } = props;

      if (!dot && hasContent()) {
        if (slots.content) {
          return slots.content()
        }

        // 如果数量大于 99 就取 99+
        if (isDef(max) && isNumeric(content!) && +content > +max) {
          return `${max}+`;
        }

        return content;
      }
    }

    /** 取反 '10' => '-10' */
    const getOffsetWithMinusString = (val: string) =>
      val.startsWith('-') ? val.replace('-', '') : `-${val}`;

    const style = computed(() => {
      const style: CSSProperties = {
        background: props.color,
      }

      if (props.offset) {
        const [x, y] = props.offset;
        const { position } = props;
        const [offsetY, offsetX] = position.split('-') as [
          'top' | 'bottom',
          'left' | 'right',
        ];

        if (slots.default) {
          if (typeof y === 'number') {
            style[offsetY] = addUnit(offsetY === 'top' ? y : -y);
          } else {
            style[offsetY] =
              offsetY === 'top' ? addUnit(y) : getOffsetWithMinusString(y);
          }

          if (typeof x === 'number') {
            style[offsetX] = addUnit(offsetX === 'left' ? x : -x);
          } else {
            style[offsetX] =
              offsetX === 'left' ? addUnit(x) : getOffsetWithMinusString(x);
          }
        } else {
          style.marginTop = addUnit(y);
          style.marginLeft = addUnit(x);
        }
      }

      return style;
    })

    const renderBadge = () => {
      if (hasContent() || props.dot) {
        return (
          <div
            class={bem([
              props.position,
              { dot: props.dot, fixed: !!slots.default },
            ])}
            style={style.value}
          >
            {renderContent()}
          </div>
        );
      }
    };

    return () => {
      // 存在子级元素
      if (slots.default) {
        const { tag } = props;
        return (
          <tag class={bem('wrapper')}>
            {slots.default()}
            {renderBadge()}
          </tag>
        );
      }

      // 直接显示徽标
      return renderBadge();
    }
  }
})