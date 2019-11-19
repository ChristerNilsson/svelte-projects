<script>
	import Canvas from './Canvas.svelte'
</script>

<style>
	text {fill:red}
	.small { font: italic 13px sans-serif}
	.heavy { font: bold 30px sans-serif}
	.Rrrrr { font: italic 40px serif; fill: yellow}
</style>

<Canvas>
	<text x=20 y=35 class=small>My</text>
	<text x=40 y=35 class=heavy>cat</text>
	<text x=45 y=75 class="small">is</text>
	<text x="55" y="75" class="Rrrrr">Grumpy!</text>
</Canvas>
