<script>
	export let menus
	menus = menus.split(' ')
	export let menu=menus[0]
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
	.sel {color:yellow}
</style>

<div class='nav'>
	{#each menus as m}
		<div class='mnu {m==menu?'sel':''}' on:click={()=>menu=m}>{m}</div>
	{/each}
</div>
