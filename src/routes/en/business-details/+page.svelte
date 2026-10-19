<script>
	import LegalPage from '$lib/LegalPage.svelte';
	import BusinessDetails from '$lib/BusinessDetails.svelte';
</script>

<svelte:head>
	<title>Business details | SA lab</title>
	<meta
		name="description"
		content="Archweekend service provider: business registration, address, bank details and contact information."
	/>
</svelte:head>

<LegalPage
	locale="en"
	russianPath="/requisites"
	englishPath="/en/business-details"
	contactLabel="Questions about the workshop or payment?"
>
	<h1>Business details</h1>
	<p>
		English translation of the <a href="/requisites" hreflang="ru">Russian business details</a>.
	</p>
	<BusinessDetails />
	<h2>Contact</h2>
	<p><a href="mailto:hello@salab.org">hello@salab.org</a></p>
	<p>
		Read our <a href="/en/terms">terms and refund conditions</a> and
		<a href="/en/privacy-policy">privacy policy</a>.
	</p>
</LegalPage>
