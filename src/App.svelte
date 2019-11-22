<script>

	let a=1,b=2,c=3

	$: d=a+b
	$: e=c+d
	let col='green'

	const divStyle = `color:${col}`
	console.log(divStyle)

	const st = () => 'font-size:'+e+'px'

</script>

<input type=number bind:value={a}/> 
<input type=number bind:value={b}/>
<input type=number bind:value={c}/>
<input type=number bind:value={d}/>
<input type=number bind:value={e}/>
<div style={`font-size:${e}px`}>
{a}
</div>
