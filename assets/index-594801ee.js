import{c as B,a as h,b as s,i as P,d as I}from"./use-translate-39e9697c.js";import{A as x,C as $,e as g,D as N}from"./vue-libs-cca96e89.js";const L=null,i=[Number,String],w={type:Boolean,default:!0},M=e=>({type:e,required:!0}),R=()=>({type:Array,default:()=>[]}),p=e=>({type:String,default:e}),T=e=>({type:Number,default:e}),U=e=>({type:i,default:e});function k(e){return e.install=n=>{const{name:r}=e;r&&(n.component(r,e),n.component(B(`-${r}`),e))},e}const[z,y]=h("badge"),A={dot:Boolean,max:i,tag:p("div"),color:String,offset:Array,content:i,showZero:w,position:p("top-right")},C=x({name:z,props:A,setup(e,{slots:n}){const r=()=>{if(n.content)return!0;const{content:t,showZero:o}=e;return P(t)&&t!==""&&(o||t!==0&&t!=="0")},b=()=>{const{dot:t,max:o,content:a}=e;if(!t&&r())return n.content?n.content():P(o)&&I(a)&&+a>+o?`${o}+`:a},u=t=>t.startsWith("-")?t.replace("-",""):`-${t}`,c=$(()=>{const t={background:e.color};if(e.offset){const[o,a]=e.offset,{position:d}=e,[l,m]=d.split("-");n.default?(typeof a=="number"?t[l]=s(l==="top"?a:-a):t[l]=l==="top"?s(a):u(a),typeof o=="number"?t[m]=s(m==="left"?o:-o):t[m]=m==="left"?s(o):u(o)):(t.marginTop=s(a),t.marginLeft=s(o))}return t}),f=()=>{if(r()||e.dot)return g("div",{class:y([e.position,{dot:e.dot,fixed:!!n.default}]),style:c.value},[b()])};return()=>{if(n.default){const{tag:t}=e;return g(t,{class:y("wrapper")},{default:()=>[n.default(),f()]})}return f()}}}),v=k(C),[q,S]=h("icon"),D=e=>e==null?void 0:e.includes("/"),O={dot:Boolean,tag:p("i"),name:String,size:i,badge:i,color:String,badgeProps:Object,classPrefix:String},W=x({name:q,props:O,setup(e,{slots:n}){const r=$(()=>e.classPrefix||S());return()=>{const{tag:b,dot:u,name:c,size:f,badge:t,color:o}=e,a=D(c);return g(v,N({dot:u,tag:b,class:[r.value,a?"":`${r.value}-${c}`],style:{color:o,fontSize:s(f)},content:t},e.badgeProps),{default:()=>{var d;return[(d=n.default)==null?void 0:d.call(n),a&&g("img",{class:S("image"),src:c},null)]}})}}}),V=k(W);export{v as B,V as I,R as a,M as b,W as c,U as d,T as e,p as m,i as n,w as t,L as u,k as w};
