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
		L2each:`
<svg width=... height=... >
  <rect width=... height=... style="fill:..."/>
  {#each range(...) as i}
    <circle cx={...} cy={...} r={...} style='stroke:...; stroke-width:...; fill:...'/>
  {/each}
</svg>`,
		L1canvas:`
<svg>
  <rect x=... y=... width=... height=... style='fill:...'/>
</svg>
`,
		L1grid:`
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
		L1circle:`
<circle cx=... cy=... r=.../>
`,
		L1line:`
<line x1=... y1=... x2=... y2=.../>
`,
		L2if:`
{#if ... }
  <circle ... />
{:else}
  <rect ... />
{/if}
`,
		L1text:`
<style>
  .fs40 {font: italic 1px serif}
</style>

<text x=... y=... class='fs40' text-anchor=... alignment-baseline=... >
  ....
</text>
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
		<textarea disabled style='width:500px; height:300px;'>{helpTexts[selected0+selected1]}</textarea>
	{/if}
</div>

