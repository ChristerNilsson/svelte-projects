<script>

	// export let expanded = false
	// export let name
	export let tree
	export let path=[]

	// Important
// 	Quarterly
// Animal
// 	Dogs
// 		Tread
// 		Rope
// 	Goats
// 		Parkour
// 		Rampage
// 	Cat
// 	Duck
// 	Monkey
// Todo

// ``` // Uppercase Shows high lighted menu alternative
// {path:[],tree:tree}
// 	SHOW Important-Animal-Todo PATH []
// 	Important CLICK SHOW IMPORTANT-Quarterly PATH [Important]
// 		Important CLICK SHOW Important-Animal-Todo
// 		Quarterly CLICK SHOW Important-QUARTERLY PATH [Important,Quarterly]
// 			Quarterly CLICK SHOW IMPORTANT-Quarterly
// 	Animal CLICK SHOW ANIMAL-Dogs-Goats-Cat-Duck-Monkey
// 		Animal CLICK SHOW Important-Animal-Todo
// 		Dogs CLICK SHOW Animal-DOGS-Tread-Rope
// 			Animal CLICK SHOW ANIMAL-Dogs-Goats-Cat-Duck-Monkey
// 			Dogs CLICK SHOW ANIMAL-Dogs-Goats-Cat-Duck-Monkey
// 			Tread CLICK SHOW Animal-Dogs-TREAD
// 				Tread CLICK SHOW Animal-DOGS-Tread-Rope
// 			Rope CLICK SHOW Animal-Dogs-ROPE
// 				Rope CLICK SHOW Animal-DOGS-Tread-Rope
// 		Goats CLICK SHOW Animal-GOATS-Parkour-Rampage
// 			Parkour CLICK SHOW Animal-Goats-PARKOUR
// 				Parkour CLICK SHOW Animal-GOATS-Parkour-Rampage
// 			Rampage CLICK SHOW Animal-Goats-RAMPAGE
// 				Rampage CLICK SHOW Animal-GOATS-Parkour-Rampage
// 		Cat CLICK SHOW Animal-CAT
// 			Animal CLICK SHOW Important-Animal-Todo
// 			Cat CLICK SHOW ANIMAL-Dogs-Goats-Cat-Duck-Monkey
// 		Duck CLICK SHOW Animal-DUCK
// 			Animal CLICK SHOW Important-Animal-Todo
// 			Duck CLICK SHOW ANIMAL-Dogs-Goats-Cat-Duck-Monkey
// 		Monkey CLICK SHOW Animal-MONKEY
// 			Animal CLICK SHOW Important-Animal-Todo
// 			Monkey CLICK SHOW ANIMAL-Dogs-Goats-Cat-Duck-Monkey
// 	Todo CLICK SHOW TODO HIGH
// 		Todo CLICK SHOW Important-Animal-Todo
	
// ```


</script>

<style>
	span {
		padding: 0 0 0 1.5em;
		background-size: 1em 1em;
		font-weight: bold;
		cursor: pointer;
	}

	ul {
		padding: 0.2em 0 0 0.5em;
		margin: 0 0 0 0.5em;
		list-style: none;
		border-left: 1px solid #eee;
	}

	li {
		padding: 0.2em 0;
	}
</style>

<span class:expanded on:click={()=>expanded = !expanded}>{name}</span>

{#if expanded}
	<ul>
		{#each files as file}
			<li>
				{#if file.type === 'folder'}
					<svelte:self {...file}/>
				{:else}
					<span>{file.name}</span>
				{/if}
			</li>
		{/each}
	</ul>
{/if}