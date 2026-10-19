<script>
	import '../style.css';
	import { page } from '$app/stores';
	import { browser } from '$app/environment';

	/** @type {Record<string, { title: string, description: string }>} */
	const pageMetadata = {
		'/en/user/signin': {
			title: 'Sign in to course materials | Archweekend',
			description: 'Sign in to access your Archweekend course recordings and materials.'
		},
		'/en/course': {
			title: 'Course recordings | SA lab',
			description: 'Your Archweekend course materials and session recordings.'
		},
		'/en/register': {
			title: 'Thank you | Archweekend',
			description:
				'After your workshop payment, we’ll email you within 24 hours with the next steps.'
		},
		'/privacy-policy': {
			title: 'Политика обработки персональных данных | SA lab',
			description: 'Политика обработки персональных данных Archweekend и контакты оператора.'
		},
		'/en/privacy-policy': {
			title: 'Privacy policy | SA lab',
			description: 'Personal data processing policy for Archweekend and operator contact details.'
		},
		'/en/terms': {
			title: 'Terms and refund conditions | SA lab',
			description:
				'Archweekend public offer: workshop participation, payment, cancellation and refund conditions.'
		},
		'/en/business-details': {
			title: 'Business details | SA lab',
			description:
				'Archweekend service provider: business registration, address, bank details and contact information.'
		}
	};
	$: pathname = $page.url.pathname.replace(/\/$/, '') || '/';
	$: englishPage = pathname === '/en' || pathname.startsWith('/en/');
	// Keep the chosen language on client-side navigation and on checkout returns.
	$: if (browser) {
		const locale = englishPage ? 'en' : 'ru';
		document.cookie = `archweekend_locale=${locale}; Path=/; Max-Age=2592000; SameSite=Lax${window.location.protocol === 'https:' ? '; Secure' : ''}`;
		document.documentElement.lang = locale;
	}
	$: routeMetadata = pageMetadata[pathname];
	$: socialTitle =
		routeMetadata?.title || (englishPage ? 'AI Agents for Architects | SA lab' : 'ARCH WEEKEND');
	$: description =
		routeMetadata?.description ||
		(englishPage
			? 'AI Agents for Architects. From initial research to an architectural concept. 7–8 November 2026 · Online · 5 hours across two days.'
			: 'Grasshopper, Blender, Web для архитекторов');
	$: socialUrl = routeMetadata
		? `https://archweekend.pro${pathname}`
		: englishPage
			? 'https://archweekend.pro/en'
			: 'https://archweekend.pro';
</script>

<svelte:head>
	<meta property="og:title" content={socialTitle} />
	<meta property="og:description" content={description} />
	<meta property="og:url" content={socialUrl} />
	<meta itemprop="description" content={description} />
	{#if (pathname !== '/' && !englishPage && !routeMetadata) || pathname === '/en/user/signin' || pathname === '/en/course'}
		<meta name="description" content={description} />
	{/if}
</svelte:head>

<slot />
