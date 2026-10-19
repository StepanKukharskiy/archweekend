<script>
	export let locale = 'en';
	export let russianPath = '/privacy-policy';
	export let englishPath = '/en/privacy-policy';
	export let contactLabel = '';
	$: english = locale === 'en';
</script>

<main class="legal-page" lang={locale}>
	<nav aria-label={english ? 'Page navigation' : 'Навигация по странице'}>
		<a href={english ? '/en' : '/'}>← {english ? 'Back to the workshop' : 'К воркшопу'}</a>
		<div class="languages" aria-label={english ? 'Page language' : 'Язык страницы'}>
			<a href={russianPath} lang="ru" hreflang="ru" aria-current={!english ? 'page' : undefined}
				>RU</a
			>
			<a href={englishPath} lang="en" hreflang="en" aria-current={english ? 'page' : undefined}
				>EN</a
			>
		</div>
	</nav>
	<article><slot /></article>
	<footer>
		<p>
			{contactLabel ||
				(english ? 'Questions about your personal data?' : 'Вопросы о ваших персональных данных?')}
			<a href="mailto:hello@salab.org">hello@salab.org</a>
		</p>
		<a href={english ? '/en' : '/'}>← {english ? 'Back to the workshop' : 'К воркшопу'}</a>
	</footer>
</main>

<style>
	.legal-page {
		box-sizing: border-box;
		width: min(100%, 960px);
		margin: 0 auto;
		padding: 32px 28px 64px;
		font-size: 1rem;
		font-weight: 400;
		line-height: 1.75;
		overflow-wrap: anywhere;
	}
	nav {
		display: flex;
		align-items: center;
		justify-content: space-between;
		gap: 20px;
		margin-bottom: 40px;
	}
	.languages {
		display: flex;
		gap: 8px;
		flex-shrink: 0;
	}
	.languages a {
		padding: 4px 12px;
		border: 1px solid #0000eb40;
		border-radius: 20px;
		text-decoration: none;
	}
	.languages a[aria-current='page'] {
		background: #0000eb;
		color: white;
	}
	.legal-page :global(a) {
		color: #0000eb;
		text-underline-offset: 3px;
	}
	.legal-page :global(a:focus-visible) {
		outline: 2px solid #0000eb;
		outline-offset: 4px;
	}
	article {
		padding: 40px;
		border: 1px solid #0000eb20;
		border-radius: 24px;
		background: #ffffffdd;
	}
	article :global(h1) {
		margin: 0 0 16px;
		color: #0000eb;
		font-size: clamp(1.8rem, 4vw, 2.8rem);
		line-height: 1.2;
	}
	article :global(h2) {
		margin: 40px 0 16px;
		color: #0000eb;
		font-size: 1.35rem;
		line-height: 1.4;
	}
	article :global([id]) {
		scroll-margin-top: 24px;
	}
	article :global(p) {
		margin: 16px 0;
	}
	article :global(dt) {
		margin-top: 20px;
		font-weight: 600;
	}
	article :global(dd) {
		margin: 4px 0 16px;
	}
	article :global(li) {
		margin: 8px 0;
	}
	article :global(address) {
		font-style: normal;
	}
	footer {
		margin-top: 32px;
	}
	@media (max-width: 600px) {
		.legal-page {
			padding: 24px 16px 40px;
		}
		article {
			padding: 28px 20px;
			border-radius: 20px;
		}
		nav {
			gap: 12px;
			font-size: 0.9rem;
			margin-bottom: 24px;
		}
	}
</style>
