<script>
	export let children
	children = children.split('|')
	export let selected = children[0]
</script>

<style>
	.nav {
		float:left;
		width:100%;
		background-color:grey;
	}
	.mnu {
		float:left;
		width:auto;
		margin:0.5%;
		color:white;
	}
	.red {color:red}

</style>

<div class='nav'>
	{#each children as c}
		<div class="mnu {selected==c ? 'red' : ''}" on:click = {() => selected=c} >{c}</div>
	{/each}
</div>
