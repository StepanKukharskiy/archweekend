<script>
	import CoursePage from '$lib/CoursePage.svelte';
	/** @type {import('./$types').PageData} */
	export let data;
</script>

<CoursePage {data} locale="ru" />
