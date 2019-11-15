<script>
	import Menu from './Menu2.svelte'
	let menus = {
		Adam: {
			Adam1: {},
			Adam2: {},
			Adam3: {}
		},
		Bertil: {
			Bertil1: {},
			Bertil2: {},
			Bertil3: {}
		},
		Cesar
	}
	let menu = ['Adam','Adam1']
</script>

<Menu {menus} bind:menu={menu}/>
{menu}
