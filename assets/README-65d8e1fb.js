import{o as s,a,z as e}from"./vue-libs-cca96e89.js";const n={class:"van-doc-markdown-body"},d=e(`<h1>Stepper</h1><div class="van-doc-card"><h3 id="intro" tabindex="-1">Intro</h3><p>The stepper component consists of an increase button, a decrease button and an input box, which are used to input and adjust numbers within a certain range.</p></div><div class="van-doc-card"><h3 id="install" tabindex="-1">Install</h3><p>Register component globally via <code>app.use</code>, refer to <a href="#/en-US/advanced-usage#zu-jian-zhu-ce" target="_blank">Component Registration</a> for more registration ways.</p><pre><code class="language-js"><span class="hljs-keyword">import</span> { createApp } <span class="hljs-keyword">from</span> <span class="hljs-string">&#39;vue&#39;</span>;
<span class="hljs-keyword">import</span> { <span class="hljs-title class_">Stepper</span> } <span class="hljs-keyword">from</span> <span class="hljs-string">&#39;vant&#39;</span>;

<span class="hljs-keyword">const</span> app = <span class="hljs-title function_">createApp</span>();
app.<span class="hljs-title function_">use</span>(<span class="hljs-title class_">Stepper</span>);
</code></pre></div><h2 id="usage" tabindex="-1">Usage</h2><div class="van-doc-card"><h3 id="basic-usage" tabindex="-1">Basic Usage</h3><pre><code class="language-html"><span class="hljs-tag">&lt;<span class="hljs-name">van-stepper</span> <span class="hljs-attr">v-model</span>=<span class="hljs-string">&quot;value&quot;</span> /&gt;</span>
</code></pre><pre><code class="language-js"><span class="hljs-keyword">import</span> { ref } <span class="hljs-keyword">from</span> <span class="hljs-string">&#39;vue&#39;</span>;

<span class="hljs-keyword">export</span> <span class="hljs-keyword">default</span> {
  <span class="hljs-title function_">setup</span>(<span class="hljs-params"></span>) {
    <span class="hljs-keyword">const</span> value = <span class="hljs-title function_">ref</span>(<span class="hljs-number">1</span>);
    <span class="hljs-keyword">return</span> { value };
  },
};
</code></pre></div><div class="van-doc-card"><h3 id="step" tabindex="-1">Step</h3><pre><code class="language-html"><span class="hljs-tag">&lt;<span class="hljs-name">van-stepper</span> <span class="hljs-attr">v-model</span>=<span class="hljs-string">&quot;value&quot;</span> <span class="hljs-attr">step</span>=<span class="hljs-string">&quot;2&quot;</span> /&gt;</span>
</code></pre></div><div class="van-doc-card"><h3 id="range" tabindex="-1">Range</h3><pre><code class="language-html"><span class="hljs-tag">&lt;<span class="hljs-name">van-stepper</span> <span class="hljs-attr">v-model</span>=<span class="hljs-string">&quot;value&quot;</span> <span class="hljs-attr">min</span>=<span class="hljs-string">&quot;5&quot;</span> <span class="hljs-attr">max</span>=<span class="hljs-string">&quot;8&quot;</span> /&gt;</span>
</code></pre></div><div class="van-doc-card"><h3 id="integer" tabindex="-1">Integer</h3><pre><code class="language-html"><span class="hljs-tag">&lt;<span class="hljs-name">van-stepper</span> <span class="hljs-attr">v-model</span>=<span class="hljs-string">&quot;value&quot;</span> <span class="hljs-attr">integer</span> /&gt;</span>
</code></pre></div><div class="van-doc-card"><h3 id="disabled" tabindex="-1">Disabled</h3><pre><code class="language-html"><span class="hljs-tag">&lt;<span class="hljs-name">van-stepper</span> <span class="hljs-attr">v-model</span>=<span class="hljs-string">&quot;value&quot;</span> <span class="hljs-attr">disabled</span> /&gt;</span>
</code></pre></div><div class="van-doc-card"><h3 id="disable-input" tabindex="-1">Disable Input</h3><pre><code class="language-html"><span class="hljs-tag">&lt;<span class="hljs-name">van-stepper</span> <span class="hljs-attr">v-model</span>=<span class="hljs-string">&quot;value&quot;</span> <span class="hljs-attr">disable-input</span> /&gt;</span>
</code></pre></div><div class="van-doc-card"><h3 id="decimal-length" tabindex="-1">Decimal Length</h3><pre><code class="language-html"><span class="hljs-tag">&lt;<span class="hljs-name">van-stepper</span> <span class="hljs-attr">v-model</span>=<span class="hljs-string">&quot;value&quot;</span> <span class="hljs-attr">step</span>=<span class="hljs-string">&quot;0.2&quot;</span> <span class="hljs-attr">:decimal-length</span>=<span class="hljs-string">&quot;1&quot;</span> /&gt;</span>
</code></pre></div><div class="van-doc-card"><h3 id="custom-size" tabindex="-1">Custom Size</h3><pre><code class="language-html"><span class="hljs-tag">&lt;<span class="hljs-name">van-stepper</span> <span class="hljs-attr">v-model</span>=<span class="hljs-string">&quot;value&quot;</span> <span class="hljs-attr">input-width</span>=<span class="hljs-string">&quot;40px&quot;</span> <span class="hljs-attr">button-size</span>=<span class="hljs-string">&quot;32px&quot;</span> /&gt;</span>
</code></pre></div><div class="van-doc-card"><h3 id="before-change" tabindex="-1">Before Change</h3><pre><code class="language-html"><span class="hljs-tag">&lt;<span class="hljs-name">van-stepper</span> <span class="hljs-attr">v-model</span>=<span class="hljs-string">&quot;value&quot;</span> <span class="hljs-attr">:before-change</span>=<span class="hljs-string">&quot;beforeChange&quot;</span> /&gt;</span>
</code></pre><pre><code class="language-js"><span class="hljs-keyword">import</span> { ref } <span class="hljs-keyword">from</span> <span class="hljs-string">&#39;vue&#39;</span>;
<span class="hljs-keyword">import</span> { closeToast, showLoadingToast } <span class="hljs-keyword">from</span> <span class="hljs-string">&#39;vant&#39;</span>;

<span class="hljs-keyword">export</span> <span class="hljs-keyword">default</span> {
  <span class="hljs-title function_">setup</span>(<span class="hljs-params"></span>) {
    <span class="hljs-keyword">const</span> value = <span class="hljs-title function_">ref</span>(<span class="hljs-number">1</span>);

    <span class="hljs-keyword">const</span> <span class="hljs-title function_">beforeChange</span> = (<span class="hljs-params">value</span>) =&gt; {
      <span class="hljs-title function_">showLoadingToast</span>({ <span class="hljs-attr">forbidClick</span>: <span class="hljs-literal">true</span> });

      <span class="hljs-keyword">return</span> <span class="hljs-keyword">new</span> <span class="hljs-title class_">Promise</span>(<span class="hljs-function">(<span class="hljs-params">resolve</span>) =&gt;</span> {
        <span class="hljs-built_in">setTimeout</span>(<span class="hljs-function">() =&gt;</span> {
          <span class="hljs-title function_">closeToast</span>();
          <span class="hljs-comment">// resolve &#39;true&#39; or &#39;false&#39;</span>
          <span class="hljs-title function_">resolve</span>(<span class="hljs-literal">true</span>);
        }, <span class="hljs-number">500</span>);
      });
    };

    <span class="hljs-keyword">return</span> {
      value,
      beforeChange,
    };
  },
};
</code></pre></div><div class="van-doc-card"><h3 id="round-theme" tabindex="-1">Round Theme</h3><pre><code class="language-html"><span class="hljs-tag">&lt;<span class="hljs-name">van-stepper</span> <span class="hljs-attr">v-model</span>=<span class="hljs-string">&quot;value&quot;</span> <span class="hljs-attr">theme</span>=<span class="hljs-string">&quot;round&quot;</span> <span class="hljs-attr">button-size</span>=<span class="hljs-string">&quot;22&quot;</span> <span class="hljs-attr">disable-input</span> /&gt;</span>
</code></pre></div><h2 id="api" tabindex="-1">API</h2><div class="van-doc-card"><h3 id="props" tabindex="-1">Props</h3><table><thead><tr><th>Attribute</th><th>Description</th><th>Type</th><th>Default</th></tr></thead><tbody><tr><td>v-model</td><td>Current value</td><td><em>number | string</em></td><td>-</td></tr><tr><td>min</td><td>Min value</td><td><em>number | string</em></td><td><code>1</code></td></tr><tr><td>max</td><td>Max value</td><td><em>number | string</em></td><td>-</td></tr><tr><td>auto-fixed</td><td>Whether to auto fix value that is out of range, set to <code>false</code> and value that is out of range won’t be auto fixed</td><td><em>boolean</em></td><td><code>true</code></td></tr><tr><td>default-value</td><td>Default value, valid when v-model is empty</td><td><em>number | string</em></td><td><code>1</code></td></tr><tr><td>step</td><td>Value change step</td><td><em>number | string</em></td><td><code>1</code></td></tr><tr><td>name</td><td>Stepper name, usually a unique string or number</td><td><em>number | string</em></td><td>-</td></tr><tr><td>input-width</td><td>Input width</td><td><em>number | string</em></td><td><code>32px</code></td></tr><tr><td>button-size</td><td>Button size</td><td><em>number | string</em></td><td><code>28px</code></td></tr><tr><td>decimal-length</td><td>Decimal length</td><td><em>number | string</em></td><td>-</td></tr><tr><td>theme</td><td>Theme, can be set to <code>round</code></td><td><em>string</em></td><td>-</td></tr><tr><td>placeholder</td><td>Input placeholder</td><td><em>string</em></td><td>-</td></tr><tr><td>integer</td><td>Whether to allow only integers</td><td><em>boolean</em></td><td><code>false</code></td></tr><tr><td>disabled</td><td>Whether to disable value change</td><td><em>boolean</em></td><td><code>false</code></td></tr><tr><td>disable-plus</td><td>Whether to disable plus button</td><td><em>boolean</em></td><td><code>false</code></td></tr><tr><td>disable-minus</td><td>Whether to disable minus button</td><td><em>boolean</em></td><td><code>false</code></td></tr><tr><td>disable-input</td><td>Whether to disable input</td><td><em>boolean</em></td><td><code>false</code></td></tr><tr><td>before-change</td><td>Callback function before changing, return <code>false</code> to prevent change, support return Promise</td><td><em>(value: number | string) =&gt; boolean | Promise&lt;boolean&gt;</em></td><td><code>false</code></td></tr><tr><td>show-plus</td><td>Whether to show plus button</td><td><em>boolean</em></td><td><code>true</code></td></tr><tr><td>show-minus</td><td>Whether to show minus button</td><td><em>boolean</em></td><td><code>true</code></td></tr><tr><td>show-input</td><td>Whether to show input</td><td><em>boolean</em></td><td><code>true</code></td></tr><tr><td>long-press</td><td>Whether to enable the long press gesture, when enabled you can long press the increase and decrease buttons</td><td><em>boolean</em></td><td><code>true</code></td></tr><tr><td>allow-empty</td><td>Whether to allow the input value to be empty, set to <code>true</code> to allow an empty string to be passed in</td><td><em>boolean</em></td><td><code>false</code></td></tr></tbody></table></div><div class="van-doc-card"><h3 id="events" tabindex="-1">Events</h3><table><thead><tr><th>Event</th><th>Description</th><th>Arguments</th></tr></thead><tbody><tr><td>change</td><td>Emitted when value changed</td><td><em>value: string, detail: { name: string }</em></td></tr><tr><td>overlimit</td><td>Emitted when a disabled button is clicked</td><td>-</td></tr><tr><td>plus</td><td>Emitted when the plus button is clicked</td><td>-</td></tr><tr><td>minus</td><td>Emitted when the minus button is clicked</td><td>-</td></tr><tr><td>focus</td><td>Emitted when the input is focused</td><td><em>event: Event</em></td></tr><tr><td>blur</td><td>Emitted when the input is blurred</td><td><em>event: Event</em></td></tr></tbody></table></div><div class="van-doc-card"><h3 id="types" tabindex="-1">Types</h3><p>The component exports the following type definitions:</p><pre><code class="language-ts"><span class="hljs-keyword">import</span> <span class="hljs-keyword">type</span> { <span class="hljs-title class_">StepperTheme</span>, <span class="hljs-title class_">StepperProps</span> } <span class="hljs-keyword">from</span> <span class="hljs-string">&#39;vant&#39;</span>;
</code></pre></div><h2 id="theming" tabindex="-1">Theming</h2><div class="van-doc-card"><h3 id="css-variables" tabindex="-1">CSS Variables</h3><p>The component provides the following CSS variables, which can be used to customize styles. Please refer to <a href="#/en-US/config-provider" target="_blank">ConfigProvider component</a>.</p><table><thead><tr><th>Name</th><th>Default Value</th><th>Description</th></tr></thead><tbody><tr><td>--van-stepper-background</td><td><em>var(--van-active-color)</em></td><td>-</td></tr><tr><td>--van-stepper-button-icon-color</td><td><em>var(--van-text-color)</em></td><td>-</td></tr><tr><td>--van-stepper-button-disabled-color</td><td><em>var(--van-background)</em></td><td>-</td></tr><tr><td>--van-stepper-button-disabled-icon-color</td><td><em>var(--van-gray-5)</em></td><td>-</td></tr><tr><td>--van-stepper-button-round-theme-color</td><td><em>var(--van-primary-color)</em></td><td>-</td></tr><tr><td>--van-stepper-input-width</td><td><em>32px</em></td><td>-</td></tr><tr><td>--van-stepper-input-height</td><td><em>28px</em></td><td>-</td></tr><tr><td>--van-stepper-input-font-size</td><td><em>var(--van-font-size-md)</em></td><td>-</td></tr><tr><td>--van-stepper-input-line-height</td><td><em>normal</em></td><td>-</td></tr><tr><td>--van-stepper-input-text-color</td><td><em>var(--van-text-color)</em></td><td>-</td></tr><tr><td>--van-stepper-input-disabled-text-color</td><td><em>var(--van-text-color-3)</em></td><td>-</td></tr><tr><td>--van-stepper-input-disabled-background</td><td><em>var(--van-active-color)</em></td><td>-</td></tr><tr><td>--van-stepper-radius</td><td><em>var(--van-radius-md)</em></td><td>-</td></tr></tbody></table></div>`,20),l=[d],h={__name:"README",setup(r,{expose:t}){return t({frontmatter:{}}),(o,c)=>(s(),a("div",n,l))}};export{h as default};
