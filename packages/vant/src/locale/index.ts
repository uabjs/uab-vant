import { ref, reactive } from 'vue';
import { deepAssign } from '../utils/deep-assign';
import defaultMessages from './lang/zh-CN';

type Message = Record<string, any>;
type Messages = Record<string, Message>;

// 默认使用中文
const lang = ref('zh-CN');
const messages = reactive<Messages>({
  'zh-CN': defaultMessages, // 中文语言
});


export const Locale = {
  messages(): Message {
    return messages[lang.value];
  },

  use(newLang: string, newMessages?: Message) {
    lang.value = newLang;
    this.add({ [newLang]: newMessages });
  },

  add(newMessages: Message = {}) {
    deepAssign(messages, newMessages);
  },
};


// 返回当前的语言
export const useCurrentLang = () => lang;

// 其他语言动态添加
export default Locale;
