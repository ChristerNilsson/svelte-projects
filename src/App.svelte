<script>
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

	const help=(keyword) => window.open('https://github.com/ChristerNilsson/svelte-projects/wiki/'+keyword, '_blank')
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

	const children0 = 'L1|L2|L3|L4|L5|L6'.split('|')
	let selected0 = ''
	$: if (selected0=='L1') children1 = 'canvas|grid|rect|circle|line|text'.split('|')
	$: if (selected0=='L2') children1 = 'each|if|range|chess'.split('|')
	$: if (selected0=='L3') children1 = 'random|button|shortcut'.split('|')
	$: if (selected0=='L4') children1 = 'colorPair'.split('|')
	$: if (selected0=='L5') children1 = 'bind:|on:keyup|guessMyNumber'.split('|')
	$: if (selected0=='L6') children1 = 'translate|rotate|scale|clock'.split('|')

	$: help(selected2)
	$: link(selected3)
	
	let children1 = ['']
	let children2 = 'bind:|button|circle|$:|each|if|line|on:click|on:keyup|random|range|rect|rotate|scale|svg|text|translate'.split('|')
	let children3 = 'Svelte|Tutorial|API|Examples|REPL'.split('|')
		
	let selected1 = ''
	let selected2 = ''
	let selected3 = ''

</script>

<style>
	:global(body) {background-color:#000}
	.left {float:left}
	.m {margin:0px}
</style>

<div class='row left s1 m'>
	<Menu children={children3} bind:selected={selected3}/>
	<Menu children={children2} bind:selected={selected2} color='yellow' bgcolor='black'/>
	<Menu children={children0} bind:selected={selected0}/>
	<Menu children={children1} bind:selected={selected1}/>
</div>

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
