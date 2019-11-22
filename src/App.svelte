<script>
	import range from 'lodash.range'
	import sample from 'lodash.sample'

	const tw = 10
	const th = 20
	const cc = 30
	const cell = []
	const matrix = []
	let x = 3
	let y = -1
	let tm = 0
	let dwn = 0
	for (const r of range(th)) {
		cell[r] = []
		matrix[r] = []
		for (const c of range(tw)) {
			cell[r][c] = 0
			matrix[r][c] = 0
		}
	}
	const shape = '00001111 01100110 00100111 01000111 00010111 00110110 01100011'.split(' ')
	const gen = () => '0000' + sample(shape) + '0000' 
	let csh = gen()

	function dr(type,row) { 
		for (const r of range(th)) {
			let cnt = 0
			for (const c of range(tw)) {
				matrix[r][c] = 0
				if (cell[r][c]) {
					matrix[r][c] = 1 
					cnt++
				}
				
				if (type==2 && th-r<row+1) cell[th-r][c] = cell[th-r-1][c]
			}
			if (cnt==tw) {
				for (const c of range(tw)) cell[r][c] = 0
				dr(2,r)
			}
		}
	}

	function chk(type,n=0) { 
		let out = ''
		let fnd = 0
		for (let r of range(4)) {
			for (let c of range(4)) {
				if (csh[c+r*4] == 1) {
					if (type == 1) matrix[r+y][c+x] = 1
					if (type == 2) if (r+y>th-2 || cell[r+y+1][c+x] == 1) {
						chk(3)
						csh = gen()
						x=3
						y=-1
						dwn=0
					}
					if (type == 3) cell[r+y][c+x] = 1
					if (type == 5) if ((c+x > tw-2 && n==1) || (c+x<1 && n==-1)) fnd = 1
				}
				if (type == 4) out += csh[r + (3-c) * 4]
			}
		}
		csh = type==4 ? out : csh
		if (!fnd) x += n
	}

	function game() {
		tm++
		if (tm>20 || dwn) {
			y++
			tm = 0
			chk(2)
		}
		dr(1,0)
		chk(1)
	}

	setInterval(game,33)

	function trigger(evt) {
		if (evt.keyCode==37) chk(5,-1)
		if (evt.keyCode==38) chk(4)
		if (evt.keyCode==39) chk(5,1)
		if (evt.keyCode==40) dwn = 1
	}
	
	document.addEventListener('keydown',trigger)

</script>

<svg width=300 height=600>
	{#each range(th) as r}
		{#each range(tw) as c}
			<rect x={cc*c} y={cc*r} width=29 height=29 style='fill:{matrix[r][c]==0? 'gray' : 'black'}' />
		{/each}
	{/each}
</svg>
