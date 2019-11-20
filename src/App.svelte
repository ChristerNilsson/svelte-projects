<script>
	import {shapeRendering} from './store.js'
	import range from 'lodash.range'
	import Menu from './Menu.svelte'

	import Canvas from './Canvas.svelte'
	import Grid from './Grid.svelte'
	import Rect from './Rect.svelte'
	import Circle from './Circle.svelte'
	import Line from './Line.svelte'
	import Text from './Text.svelte'
	import Each from './Each.svelte'
	import If from './If.svelte'
	import Range from './Range.svelte'
	import Chess from './Chess.svelte'
	import Random from './Random.svelte'
	import Button from './Button.svelte'
	import Click from './Click.svelte'
	import Shortcut from './Shortcut.svelte'
	import ColorPair from './ColorPair.svelte'
	import Bind from './Bind.svelte'
	import KeyUp from './KeyUp.svelte'
	import GuessMyNumber from './GuessMyNumber.svelte'
	import Translate from './Translate.svelte'
	import Rotate from './Rotate.svelte'
	import Scale from './Scale.svelte'
	import Clock from './Clock.svelte'

	const help=(selected0,keyword) => selected0=='keywords' && selected1!='' ? window.open('https://github.com/ChristerNilsson/svelte-projects/wiki/'+keyword, '_blank') : 0
	const link=(link) => window.open(links[link], '_blank')
	
	const links = {}
	links['Svelte'] = 'https://svelte.dev'
	links['Tutorial'] = 'https://svelte.dev/tutorial'
	links['API'] = 'https://svelte.dev/docs'
	links['Examples'] = 'https://svelte.dev/examples'
	links['REPL'] = 'https://svelte.dev/repl/hello-world?version=3.15.0'

	let selectedTree=''
	let hor = 'hor'
	let path = [""]
	const fs = 'font-size:30px'

	const children0 = 'L1|L2|L3|L4|L5|L6|keywords'.split('|')
	let selected0 = ''
	$: if (selected0=='L1') children1 = 'rect|circle|line'.split('|')
	$: if (selected0=='L2') children1 = 'each|if|range|chess'.split('|')
	$: if (selected0=='L3') children1 = 'random|button|shortcut'.split('|')
	$: if (selected0=='L4') children1 = 'canvas|grid|colorPair'.split('|')
	$: if (selected0=='L5') children1 = 'bind:|on:keyup|guessMyNumber'.split('|')
	$: if (selected0=='L6') children1 = 'text|translate|rotate|scale|clock'.split('|')
	$: if (selected0=='keywords') children1 = 'bind:|button|circle|$:|each|g|if|line|on:click|on:keyup|random|range|rect|rotate|scale|style|styles|svg|text|translate'.split('|')

	$: help(selected0,selected1)

	$: if (selected0) selected1 = ''

	$:if (selected3 == 'render:auto') $shapeRendering='auto'
		else if (selected3 == 'render:crisp') $shapeRendering='crispEdges'
		else link(selected3)
	
	let children1 = ['']
	let children3 = 'Svelte|Tutorial|API|Examples|REPL|render:auto|render:crisp'.split('|')
		
	let selected1 = ''
	let selected2 = ''
	let selected3 = ''

	let helpTexts = {
		L1rect:`
<svg>
  <rect x=... y=... width=... height=... style='stroke-width:...; stroke:...; fill:...'/>
</svg>`,
		L1circle:`
<circle cx=... cy=... r=.../>
`,
		L1line:`
<line x1=... y1=... x2=... y2=.../>
`,
		L2each:`
{#each range(...) as i}
  <circle cx={...} cy={...} r=... />
{/each}
`,
		L2if:`
{#if ... }
  <circle ... />
{:else}
  <rect ... />
{/if}
`,
		L2range:`
{#each range(...) as i}
  <circle ... />
{/each}
`,
		L2chess:`
{#each ...}
  {#each ...}
    {#if ...}
      <rect .../>
    {:else}
      <rect .../>
    {/if}
  {/each}
{/each}
`,
		L3random:`
<...>
  import range from 'lodash.range'
  import random from 'lodash.random'
</...>

{#each range(...) as ... }
  <circle cx={random(0,200)} cy=... r=... />
{/each}
`,
		L3button:`
<scrxpt>
  let i=0
</...>

<div style=...>...</div>
<button on:click = { () => i++ } > ... </button>
`,
		L3shortcut:`
<xcript>
  let ...=17
  let ...=1
  const op=(value) => ...
</...>

<div ...> {a} to {b} </div>
<button on:click={()=>op(a+2)}> ... </button>
<button on:click={...}> ... </button>
<button on:click={()=> ... ? ... : ... } > ... </button>
`,
		L4canvas:`
<svg>
  <rect x=... y=... width=... height=... style='fill:...'/>
</svg>
`,
		L4grid:`
<scxipt>
  import range from 'lodash.range'
</scrxpt>
<svg>
  {#each range(...) as i}
    <line x1={...} x2={...} y1=... y2=... style='stroke-width:...;stroke:...'/>
    <line x1=... x2=... y1={...} y2={...} style='stroke-width:...;stroke:...'/>
  {/each}
</svg>
`,
		L4colorPair:`
<xcript>
  let circles = []
  const r=...
  for (const x of [...]) {
    for (const y of [...]) {
      const color = circles.length ... == 0 ? '#00f8' : '#...'
      circles.push({..., ..., ...})
    }
  }
  const click = (...) => ... = ... .filter((...) => ... != ...)
</...>

<g stroke='#...' stroke-width=...>
  {#each ...}
    <... on:click={()=>click(c)} cx=... cy=... r=... fill=.../>
  {/each}
</g>
`,
		'L5bind:':`
<sxript>
  let i=...
</...>

<div ...>{...}</div>
<input type=number bind:value={i}/>
`,
		'L5on:keyup':`
<sxxxxt>
  let key=''
  let keyCode=''
  const handleKey = (...) => {
    ... = event.key
    ... = event.keyCode
  }
</xcripx>

<div ...>key: {...}</div>
<div ...>keycode: {...}</div>
<input on:keyup={...}/>
`,
		L5guessMyNumber:`
<...>
  import ... from 'lodash.random'
  let low = 1
  let high = 127
  let guess
  let msg =''
  let secret = random(..., ...)
  const keyup = (...)=> {
    if (event.key != 'Enter') return
    if (... < ...) low = ...
    if (... > ...) high = ...
    if (... == ...) msg = ...
  }
</...>
<div ...>
  {...} to {...} {...}
  <input on:keyup = {...} type=... bind:value={...}/>
</div>
`,
		L6text:`
<style>
  .fs40 {font: italic 1px serif}
</style>,

<text x=... y=... class='fs40' text-anchor=... alignment-baseline=... >
  ...
</text>
`,
		L6translate:`
<... y1=... y2=... style=... transform="translate(...)"/>
`,
		L6rotate:`
<... y2=... style=... transform="rotate(...)"/>
`,
		L6scale:`
<... y1=... y2=... style=... transform="rotate(...) scale(...)"/>
`,

		L6clock:`
<...>
  import range from 'lodash.range'
  import { onMount } from 'svelte'

  let time = new Date()

  $: hours = time.getHours()
  $: minutes = time.getMinutes()
  $: seconds = time.getSeconds()

  onMount(() => {
    const interval = setInterval(() => {time = new Date()}, ...)
    return () => clearInterval(interval)
  })
</...>

<style>
  svg { width: 100%; height: 100% }
  .clock-face { stroke: ...; fill: ... }
  .minor { stroke: ...; stroke-width: ... }
  .major { stroke: ...; stroke-width: ... }
  .hour { stroke: ... }
  .minute { stroke: ... }
  .second, .second-counterweight { stroke: rgb(...,...,...) }
  .second-counterweight { stroke-width: ... }
  .fs {font-size: ... }
</style>

<svg viewBox='-50 -50 100 100'>
  <circle class='...' r = ... />

  <!-- markers -->
  {#each range(...) as i}
    <g transform = 'rotate({...})'>
      <line class='major' y1=... y2=... />

      {#each range(..., ...) as offset}
        <line class='minor' y1=... y2=... transform='rotate(...)' />
      {/each}
    </g>
  {/each}

  <!-- hands -->
  <line class='hour' y1=... y2=... transform='rotate({...})' />
  <line class='minute' y1=... y2=... transform='rotate(...)' />
  <g transform='rotate(...)'>
    <line class='second' y1=... y2=... />
    <line class='second-counterweight' y1=... y2=... />
  </g>
</svg>
`,
}

</script>

<style>
	:global(body) {background-color:#000}
	.left {float:left}
	.m {margin:0px}
	.s8 {width: 67%}
	textarea {font-size:20px}
</style>

<div class='row left s1 m'>
	<Menu children={children3} bind:selected={selected3}/>
	<Menu children={children0} bind:selected={selected0}/>
	{#if selected0=='keywords'}
		<Menu children={children1} bind:selected={selected1} color='yellow' bgcolor='black'/>
	{:else}
		<Menu children={children1} bind:selected={selected1}/>
	{/if}
</div>

<div class='col left s2 m'>

	<!-- L1 -->
	{#if selected1 == 'svg'}<Canvas />{/if}
	{#if selected1 == 'canvas'}<Canvas />{/if}
	{#if selected1 == 'grid'}<Grid />{/if}
	{#if selected1 == 'rect'}<Rect />{/if}
	{#if selected1 == 'circle'}<Circle />{/if}
	{#if selected1 == 'line'}<Line />{/if}
	{#if selected1 == 'text'}<Text />{/if}

	<!-- L2 -->
	{#if selected1 == 'each'}<Each />{/if}
	{#if selected1 == 'if'}<If />{/if}
	{#if selected1 == 'range'}<Range />{/if}
	{#if selected1 == 'chess'}<Chess />{/if}

	<!-- L3 -->
	{#if selected1 == 'random'}<Random />{/if}
	{#if selected1 == 'button'}<Button />{/if}
	{#if selected1 == 'on:click'}<Click />{/if}
	{#if selected1 == 'shortcut'}<Shortcut />{/if}

	<!-- L4 -->
	{#if selected1 == 'colorPair'}<ColorPair />{/if}

	<!-- L5 -->
	{#if selected1 == 'bind:'}<Bind />{/if}
	{#if selected1 == 'on:keyup'}<KeyUp />{/if}
	{#if selected1 == 'guessMyNumber'}<GuessMyNumber />{/if}

	<!-- L6 -->
	{#if selected1 == 'translate'}<Translate />{/if}
	{#if selected1 == 'rotate'}<Rotate />{/if}
	{#if selected1 == 'scale'}<Scale />{/if}
	{#if selected1 == 'clock'}<Clock />{/if}

</div>

<div class='col left s8 m'>
	{#if helpTexts[selected0+selected1]}
		<textarea disabled style='width:500px; height:500px;'>{helpTexts[selected0+selected1]}</textarea>
	{/if}
</div>

