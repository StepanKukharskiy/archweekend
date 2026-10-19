<script>
	export let locale = 'ru';
</script>

<nav class="languages" aria-label={locale === 'en' ? 'Page language' : 'Язык страницы'}>
	<a href="/" lang="ru" hreflang="ru" aria-current={locale === 'ru' ? 'page' : undefined}>RU</a>
	<a href="/en" lang="en" hreflang="en" aria-current={locale === 'en' ? 'page' : undefined}>EN</a>
</nav>

<style>
	.languages {
		display: flex;
		justify-content: flex-end;
		gap: 8px;
		width: 100%;
		max-width: 1100px;
		margin: 0 auto 16px;
	}
	a {
		padding: 6px 12px;
		border: 1px solid #0000eb40;
		border-radius: 20px;
		color: #0000eb;
		background: rgba(255, 255, 255, 0.85);
		font-size: 0.85rem;
		font-weight: 600;
		text-decoration: none;
	}
	a[aria-current='page'] {
		background: #0000eb;
		color: white;
	}
	a:focus-visible {
		outline: 2px solid #0000eb;
		outline-offset: 3px;
	}
</style>
