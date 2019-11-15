<script>
	import Menu from './Menu.svelte'
	let menu
	let menuA
	let menuB
</script>

<Menu menus='Adam Bertil Cesar' bind:menu={menu}/>

{#if menu=='Adam'}
	<Menu menus='Adam1 Adam2 Adam3' bind:menu={menuA}/>{menuA}
{:else if menu=='Bertil'}
	<Menu menus='Bertil1 Bertil2 Bertil3' bind:menu={menuB}/>{menuB}
{:else}
	{menu}
{/if}
