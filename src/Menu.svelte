<script>
	export let color='black'
	export let bgcolor='grey'
	export let children
	export let selected = children[0]
</script>

<style>
	.nav {
		width:150px;
		margin:2px;
		cursor:default;
	}
	.mnu {
		width:150px;
		margin:0.5%;
		color:white;
	}
	.text-red {color:red}

</style>

<div class='nav' style='background-color:{bgcolor}'>
	{#each children as c}
		{#if selected==c}
			<div class="mnu text-red" on:click = {() => selected=c} >{c}</div>
		{:else}
			<div class="mnu" style='color:{color}' on:click = {() => selected=c} >{c}</div>
		{/if}
	{/each}
</div>