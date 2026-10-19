<svelte:head>
	<title>Thank you | Archweekend</title>
	<meta
		name="description"
		content="What happens after your workshop payment: we’ll email you within 24 hours with the next steps."
	/>
	<meta name="robots" content="noindex" />
</svelte:head>

<main lang="en">
	<h1>Thank you!</h1>
	<p>
		After payment, we’ll contact you within 24 hours at the email address you provided during
		checkout.
	</p>
	<p>
		If you haven’t heard from us, check your spam folder or email <a href="mailto:hello@salab.org"
			>hello@salab.org</a
		>.
	</p>
	<a class="primary" href="/en/user/signin">Sign in to course materials</a>
	<p class="access-note">Use this link once you’ve received your access details.</p>
	<nav aria-label="Next steps">
		<a href="/en">← Back to the workshop</a>
		<a href="/en/terms">Terms and refund conditions</a>
		<a href="/en/privacy-policy">Privacy policy</a>
		<a href="/en/business-details">Business details</a>
	</nav>
</main>

<style>
	main {
		box-sizing: border-box;
		width: min(600px, 100%);
		margin: auto;
		padding: 48px 24px;
		font-size: 1.1rem;
		line-height: 1.65;
	}
	h1 {
		margin: 0 0 24px;
		font-size: 2.5rem;
		color: #0000eb;
	}
	a {
		color: #0000eb;
	}
	.primary {
		display: block;
		margin-top: 32px;
		border-radius: 10px;
		background: #0000eb;
		color: white;
		padding: 16px 20px;
		text-align: center;
		text-decoration: none;
		font-size: 1rem;
		font-weight: 500;
	}
	.access-note {
		font-size: 0.9rem;
	}
	nav {
		display: flex;
		flex-direction: column;
		gap: 12px;
		margin-top: 32px;
		font-size: 0.95rem;
	}
</style>
