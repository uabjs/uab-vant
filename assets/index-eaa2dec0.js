import{g as Q,a as X,o as k,i as z,b as A,q as Y,r as Z,l as I,s as p}from"./use-translate-39e9697c.js";import{d as c,t as d,n as h,w as ee}from"./index-594801ee.js";import{A as te,y as _,C as v,u as T,e as S,j as x,v as C,D as q,q as ne}from"./vue-libs-cca96e89.js";import{H as R}from"./constant-a3e7c845.js";import{c as ae}from"./interceptor-771d0e71.js";const[le,P]=X("stepper"),H=200,V=(e,i)=>String(e)===String(i),ie={min:c(1),max:c(1/0),name:c(""),step:c(1),theme:String,integer:Boolean,disabled:Boolean,showPlus:d,showMinus:d,showInput:d,longPress:d,autoFixed:d,allowEmpty:Boolean,modelValue:h,inputWidth:h,buttonSize:h,placeholder:String,disablePlus:Boolean,disableMinus:Boolean,disableInput:Boolean,beforeChange:Function,defaultValue:c(1),decimalLength:h},ue=te({name:le,props:ie,emits:["plus","blur","minus","focus","change","overlimit","update:modelValue"],setup(e,{emit:i}){const o=(t,n=!0)=>{const{min:u,max:g,allowEmpty:l,decimalLength:b}=e;return l&&t===""||(t=k(String(t),!e.integer),t=t===""?0:+t,t=Number.isNaN(t)?+u:t,t=n?Math.max(Math.min(+g,t),+u):t,z(b)&&(t=t.toFixed(+b))),t},W=()=>{const t=e.modelValue??e.defaultValue,n=o(t);return V(n,e.modelValue)||i("update:modelValue",n),n};let s;const N=_(),a=_(W()),m=v(()=>e.disabled||e.disableMinus||+a.value<=+e.min),r=v(()=>e.disabled||e.disablePlus||+a.value>=+e.max),$=v(()=>({width:A(e.inputWidth),height:A(e.buttonSize)})),B=v(()=>Y(e.buttonSize)),j=()=>{const t=o(a.value);V(t,a.value)||(a.value=t)},E=t=>{e.beforeChange?ae(e.beforeChange,{args:[t],done(){a.value=t}}):a.value=t},w=()=>{if(s==="plus"&&r.value||s==="minus"&&m.value){i("overlimit",s);return}const t=s==="minus"?-e.step:+e.step,n=o(p(+a.value,t));E(n),i(s)},G=t=>{const n=t.target,{value:u}=n,{decimalLength:g}=e;let l=k(String(u),!e.integer);if(z(g)&&l.includes(".")){const D=l.split(".");l=`${D[0]}.${D[1].slice(0,+g)}`}e.beforeChange?n.value=String(a.value):V(u,l)||(n.value=l);const b=l===String(+l);E(b?+l:l)},K=t=>{var n;e.disableInput?(n=N.value)==null||n.blur():i("focus",t)},O=t=>{const n=t.target,u=o(n.value,e.autoFixed);n.value=String(u),a.value=u,ne(()=>{i("blur",t),Z()})};let y,f;const F=()=>{f=setTimeout(()=>{w(),F()},H)},U=()=>{e.longPress&&(y=!1,clearTimeout(f),f=setTimeout(()=>{y=!0,w(),F()},H))},L=t=>{e.longPress&&(clearTimeout(f),y&&I(t))},J=t=>{e.disableInput&&I(t)},M=t=>({onClick:n=>{I(n),s=t,w()},onTouchstartPassive:()=>{s=t,U()},onTouchend:L,onTouchcancel:L});return T(()=>[e.max,e.min,e.integer,e.decimalLength],j),T(()=>e.modelValue,t=>{V(t,a.value)||(a.value=o(t))}),T(a,t=>{i("update:modelValue",t),i("change",t,{name:e.name})}),Q(()=>(console.log("props.modelValue====11== ",e.modelValue),e.modelValue)),()=>S("div",{role:"group",class:P([e.theme])},[x(S("button",q({type:"button",style:B.value,class:[P("minus",{disabled:m.value}),{[R]:!m.value}],"aria-disabled":m.value||void 0},M("minus")),null),[[C,e.showMinus]]),x(S("input",{ref:N,type:e.integer?"tel":"text",role:"spinbutton",class:P("input"),value:a.value,style:$.value,disabled:e.disabled,readonly:e.disableInput,inputmode:e.integer?"numeric":"decimal",placeholder:e.placeholder,"aria-valuemax":e.max,"aria-valuemin":e.min,"aria-valuenow":a.value,onBlur:O,onInput:G,onFocus:K,onMousedown:J},null),[[C,e.showInput]]),x(S("button",q({type:"button",style:B.value,class:[P("plus",{disabled:r.value}),{[R]:!r.value}],"aria-disabled":r.value||void 0},M("plus")),null),[[C,e.showPlus]])])}}),re=ee(ue);export{re as S};
