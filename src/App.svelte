<script>

	import Menu from './Menu2.svelte'
	let children = 'Important|Animal|Todo'

	//import Menu from './Menu.svelte'
	// let children = {'': 'Important|Animal|Todo'} 
	// children.Important = 'Quarterly'
	// children.Animal = 'Dogs|Goats|Cat|Duck|Monkey'
	// children.Dogs = 'Tread|Rope'
	// children.Goats = 'Parkour|Rampage'

	let selected

</script>

<Menu {children} bind:selected={selected} />
<div>{selected}</div>
