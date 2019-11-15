<script>

	const bag = {coin:20}
	const price = {}
	price.coin = -1
	price.key = 10
	price.torch = 10
	price.knife = 6
	const mud = {}

	const make = (s) => {
		const result = {}
		for (const thing of s.split(' ')) {
			result[thing] = result[thing] ? result[thing] + 1 : 1
		}
		return result
	}

	mud.village = {places:'river shop farm'.split(' '), things:make('coin'), desc:'There is a well here'}
	mud.shop = {places:'village'.split(' '), things:make('coin key torch'), desc:'The owner greets you!'}
	mud.river = {places:'farm'.split(' '), things:make('coin'), desc:'It is a cold day'}
	mud.farm = {places:'village'.split(' '), things:make('coin coin'), desc:'No carrots here'}

	let location = 'village'
	$: curr = mud[location]
	$: things = curr.things
	$: places = curr.places

	const take = (thing) => {
		if (things[thing]>0) {
			bag[thing] = bag[thing] ? bag[thing] + 1 : 1
			things[thing]--
			bag = bag
		}
	}

</script>

<div class="container">

	<p>You are at the {location}.</p>

	<p>{curr.desc}.</p>

	{#each Object.keys(bag) as name}
		<div>You have {bag[name]} {name}</div>
	{/each}

	<hr>
	<hr>

	{#each Object.keys(things) as name}
		{#if things[name]>0}	
			<div>Take <button on:click={()=> take(name)}>{name}</button></div>
		{/if}
	{/each}

	{#each places as place}
		<div>Goto <button on:click={()=>location=place}>{place}</button></div>
	{/each}

</div>
