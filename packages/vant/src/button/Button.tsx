import { defineComponent } from 'vue';

const name = 'van-button'

export default defineComponent({
  name,
  props: {
    tag: {
      default: 'button'
    },
  },
  emits: ['click'],
  setup(props, { slots, emit }) {
    const onClick = (event: MouseEvent) => {
      emit('click', event);
    };

    return () => {
      const { tag } = props
      return (
        <tag>
          <div onClick={onClick}>
            {slots?.default?.()}
          </div>
        </tag>
      );
    }

  }
})
