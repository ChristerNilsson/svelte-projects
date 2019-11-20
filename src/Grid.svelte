<script>
	import range from 'lodash.range'
	import Canvas from './Canvas.svelte'
	export let click = () => {}
</script>

<Canvas click={click}>
	{#each range(0,200,20) as i}
		<line x1={i} x2={i} y1=0 y2=200 style='stroke-width:1;stroke:gray'/>
		<line x1=0 x2=200 y1={i} y2={i} style='stroke-width:1;stroke:gray'/>
	{/each}
	<slot/>
</Canvas>
