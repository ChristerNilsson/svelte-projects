<script>
	export let selected
</script>

{#if selected=='point_1'}
	<circle r=10 style='fill:white'/>
	<circle cx=100 r=10 style='fill:white'/>
	<circle cx=200 r=10 style='fill:white'/>
{/if}

{#if selected=='point_2'}
	<circle cx=0 cy=0 r=5 style='fill:red'/>
	<circle cx=0 cy=100 r=5 style='fill:red'/>
	<circle cx=0 cy=200 r=5 style='fill:red'/>
{/if}

{#if selected=='point_3'}
	<circle cx=0 cy=0 r=5 style='fill:#f00'/>
	<circle cx=0 cy=200 r=5 style='fill:#ff0'/>
	<circle cx=200 cy=0 r=5 style='fill:#0f0'/>
	<circle cx=200 cy=200 r=5 style='fill:#000'/>
{/if}

{#if selected=='point_4'}
	<circle cx=100 cy=0 r=5 style='fill:#0f0'/>
	<circle cx=200 cy=100 r=5 style='fill:#000'/>
	<circle cx=100 cy=200 r=5 style='fill:#fff'/>
	<circle cx=0 cy=100 r=5 style='fill:#ff0'/>
	<circle cx=100 cy=100 r=5 style='fill:#f00'/>
{/if}

{#if selected=='point_5'}
	<g fill=#f00>
		<circle cx=30 cy=0 r=5/>
		<circle cx=30 cy=10 r=5/>
		<circle cx=30 cy=20 r=5/>
		<circle cx=30 cy=30 r=5/>
		<circle cx=20 cy=30 r=5/>
		<circle cx=10 cy=30 r=5/>
		<circle cx=0  cy=30 r=5/>
	</g>
	<g fill=#0f0>
		<circle cx=170 cy=200 r=5/>
		<circle cx=170 cy=190 r=5/>
		<circle cx=170 cy=180 r=5/>
		<circle cx=170 cy=170 r=5/>
		<circle cx={200-20} cy=170 r=5/>
		<circle cx=190 cy=170 r=5/>
		<circle cx=200  cy=170 r=5/>
	</g>
{/if}

{#if selected=='point_6'}
	<g fill=#f00>
		<circle cx=20 cy=20 r=5/>
		<circle cx=0 cy=20 r=5/>
		<circle cx=20 cy=0 r=5/>
	</g>
	<g fill=#0f0>
		<circle cx=200 cy=20 r=5/>
		<circle cx=180 cy=0 r=5/>
		<circle cx=180 cy=20 r=5/>
	</g>
	<g fill=#ff0>
		<circle cx=0 cy=180 r=5/>
		<circle cx=20 cy=180 r=5/>
		<circle cx=20 cy=200 r=5/>
	</g>
	<g fill=#fff>
		<circle cx=200 cy=180 r=5/>
		<circle cx=180 cy=200 r=5/>
		<circle cx=180 cy=180 r=5/>
	</g>
{/if}

{#if selected=='point_7'}
	<rect width=200 height=200 style="fill:0f0"/>
	<circle cx=0 cy=0 r=10 style='fill:#000'/>
	<circle cx=200 cy=200 r=10 style='fill:#ff0'/>
	<circle cx=100 cy=100 r=10 style='fill:#880'/>
{/if}

{#if selected=='point_8'}
	<circle cx=0 cy=200 r=10 style='fill:#0f0'/>
	<circle cx=200 cy=0 r=10 style='fill:#f00'/>
	<circle cx=100 cy=100 r=10 style='fill:#880'/>
	<circle cx=50 cy=150 r=10 style='fill:#4c0'/>
	<circle cx=150 cy=50 r=10 style='fill:#c40'/>
{/if}

{#if selected=='point_9'}
	<circle cx=10 cy=10 r=1 style='fill:#fff'/>

	<circle cx=185 cy=5 r=1 style='fill:#f00'/>
	<circle cx=195 cy=15 r=1 style='fill:#f00'/>

	<g fill=#0f0>
		<circle cx=90 cy=70 r=1 />
		<circle cx=85 cy=65 r=1 />
		<circle cx=95 cy=75 r=1 />
	</g>

	<g fill=#ff0>
		<circle cx=175 cy=115 r=1 />
		<circle cx=175 cy=105 r=1 />
		<circle cx=165 cy=115 r=1 />
		<circle cx=165 cy=105 r=1 />
	</g>

	<g fill=#f0f>
		<circle cx=50 cy=130 r=1 />
		<circle cx=55 cy=135 r=1 />
		<circle cx=45 cy=125 r=1 />
		<circle cx=45 cy=135 r=1 />
		<circle cx=55 cy=125 r=1 />
	</g>

	<g fill=#0ff>
		<circle cx=105 cy=165 r=1 />
		<circle cx=105 cy=170 r=1 />
		<circle cx=105 cy=175 r=1 />
		<circle cx=115 cy=165 r=1 />
		<circle cx=115 cy=170 r=1 />
		<circle cx=115 cy=175 r=1 />
	</g>

{/if}
