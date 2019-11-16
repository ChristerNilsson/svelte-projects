<script>
	export let children
	export let selected
	export let path = ['']

	for (const key in children) children[key] = children[key].split('|')
	
	$: selected = path[path.length-1]

	const f = (i) => {
		path = path.slice(0,i)
		path = path
	}

	const g = (p) => {
		path.push(p)
		path = path
	}

</script>

<style>
	.selected {color:yellow}
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
	.white {color:white}
	.red {color:red}

</style>

<div class='nav'>
	{#each path as p,i}
		{#if p!=''}
			<div class="mnu {selected==p ? 'red' : ''}" on:click = {() => f(i)} >{p}</div>
		{/if}
	{/each}

	{#if selected in children}
		{#each children[selected] as p}
			<div class='mnu' on:click = {() => g(p)}> {p}</div>
		{/each}
	{/if}
</div>
