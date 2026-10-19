<script>
	import { goto, invalidateAll } from '$app/navigation';

	// Ensure these paths match your actual file structure
	import logo from '$lib/images/logo_nobg.png';

	export let locale = 'ru';
	$: english = locale === 'en';
	$: homeUrl = english ? '/en' : '/';
	$: courseUrl = english ? '/en/course' : '/course';
	let email = '';
	let password = '';
	let loading = false;
	let errorMsg = '';

	async function handleLogin() {
		if (loading) return;
		if (!email.trim() || !password.trim()) {
			errorMsg = english ? 'Enter your email and password.' : 'Введите email и пароль.';
			return;
		}
		loading = true;
		errorMsg = '';

		const formData = new FormData();
		formData.append('email', email);
		formData.append('password', password);

		try {
			const r = await fetch('/api/user/signin', {
				method: 'POST',
				body: formData,
				headers: { 'Accept-Language': english ? 'en' : 'ru' }
			});

			const responseData = await r.json().catch(() => ({}));

			if (!r.ok) {
				// Extract error message from response
				const message =
					responseData.message ||
					(english
						? 'Unable to sign in. Please try again.'
						: 'Не удалось войти. Попробуйте ещё раз.');
				throw new Error(message);
			}

			// Check if response indicates success
			if (responseData.message === 'Success') {
				await invalidateAll();
				await goto(courseUrl);
			} else {
				throw new Error(
					english ? 'Unable to sign in. Please try again.' : 'Не удалось войти. Попробуйте ещё раз.'
				);
			}
		} catch (err) {
			errorMsg =
				err instanceof Error && !(err instanceof TypeError)
					? err.message
					: english
						? 'Unable to sign in. Please try again.'
						: 'Не удалось войти. Попробуйте ещё раз.';
		} finally {
			loading = false;
		}
	}

	/** @param {KeyboardEvent} e */
	function handleKeydown(e) {
		if (e.key === 'Enter') handleLogin();
	}
</script>

<svelte:head>
	<title
		>{english
			? 'Sign in to course materials | Archweekend'
			: 'Вход к материалам | Archweekend'}</title
	>
	<meta name="robots" content="noindex" />
</svelte:head>

<div class="page" lang={locale}>
	<div class="login-card card">
		<nav aria-label={english ? 'Page navigation' : 'Навигация'}>
			<a href={homeUrl}>← {english ? 'Workshop' : 'Воркшоп'}</a>
			<a href={english ? '/user/signin' : '/en/user/signin'} lang={english ? 'ru' : 'en'}
				>{english ? 'RU' : 'EN'}</a
			>
		</nav>
		<div class="logo-container">
			<img class="logo" src={logo} alt="Archweekend Logo" />
		</div>

		<h1>{english ? 'Sign in to your courses' : 'Вход к материалам'}</h1>
		<p>
			{english
				? 'Use the email address you registered with and your access password to view the recordings. If you need help signing in, email'
				: 'Введите email, указанный при регистрации, и пароль для доступа к записям и AI-песочнице. Если войти не получается, напишите'}
			<a href="mailto:hello@salab.org">hello@salab.org</a>.
		</p>

		<div class="input-group">
			<label for="email">Email</label>
			<input
				id="email"
				type="email"
				bind:value={email}
				on:keydown={handleKeydown}
				placeholder="ada@lovelace.com"
				autocomplete="email"
				required
			/>
		</div>

		<div class="input-group">
			<label for="password">{english ? 'Password' : 'Пароль'}</label>
			<input
				id="password"
				type="password"
				bind:value={password}
				on:keydown={handleKeydown}
				placeholder="••••••••"
				autocomplete="current-password"
				required
			/>
		</div>

		{#if errorMsg}
			<p class="error" role="alert">{errorMsg}</p>
		{/if}

		<button class="primary-btn" on:click={handleLogin} disabled={loading}>
			{#if loading}
				<div class="spinner mini"></div>
				<span>{english ? 'Signing in…' : 'Входим...'}</span>
			{:else}
				<span>{english ? 'Sign in' : 'Войти'}</span>
			{/if}
		</button>
	</div>
</div>

<style>
	nav {
		display: flex;
		justify-content: space-between;
		font-size: 0.95rem;
	}
	a {
		color: #0000eb;
	}
	h1 {
		margin: 0;
		font-size: 1.7rem;
		line-height: 1.3;
		color: #0000eb;
	}
	p {
		margin: 0;
		font-size: 1rem;
		line-height: 1.65;
	}
	.page,
	.card,
	input {
		box-sizing: border-box;
	}
	input {
		min-width: 0;
		width: 100%;
	}

	.page {
		min-height: 100vh;
		display: flex;
		justify-content: center;
		align-items: center;
		/* background: #f6f8fa; */
		padding: 1rem;
		box-sizing: border-box;
		font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
	}

	.card {
		background: #f6f8fa;
		border: 1px solid #e1e4e8;
		border-radius: 16px;
		box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
		width: 100%;
		max-width: 600px;
		padding: 40px;
		display: flex;
		flex-direction: column;
		gap: 24px;
	}

	.logo-container {
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: 12px;
		/* margin-bottom: 8px; */
	}

	.logo {
		width: 100px;
		height: 100px;
	}

	.logo-text {
		width: 160px;
		height: auto;
	}

	.input-group {
		display: flex;
		flex-direction: column;
		gap: 8px;
	}

	label {
		font-size: 0.9rem;
		font-weight: 500;
		color: #24292e;
	}

	input {
		padding: 10px 12px;
		border: 1px solid #e1e4e8;
		border-radius: 6px;
		font-size: 1rem;
		transition:
			border-color 0.2s,
			box-shadow 0.2s;
	}

	input:focus {
		outline: none;
		border-color: #0000eb;
		box-shadow: 0 0 0 3px rgba(0, 0, 235, 0.1);
	}

	.error {
		background: #ffeef0;
		color: #cf222e;
		padding: 12px;
		border-radius: 6px;
		font-size: 0.9rem;
		margin: 0;
		border: 1px solid #ffcdce;
	}

	.primary-btn {
		display: flex;
		justify-content: center;
		align-items: center;
		gap: 8px;
		padding: 12px;
		background: #0000eb;
		color: white;
		border: none;
		border-radius: 6px;
		font-size: 1rem;
		font-weight: 600;
		cursor: pointer;
		transition: background-color 0.2s;
		margin-top: 8px;
	}

	.primary-btn:hover:not(:disabled) {
		background: #0000cc;
	}

	.primary-btn:disabled {
		opacity: 0.7;
		cursor: not-allowed;
	}

	.spinner {
		width: 16px;
		height: 16px;
		border: 2px solid rgba(255, 255, 255, 0.3);
		border-top-color: white;
		border-radius: 50%;
		animation: spin 0.8s linear infinite;
	}

	@keyframes spin {
		to {
			transform: rotate(360deg);
		}
	}

	@media (max-width: 480px) {
		.card {
			padding: 24px;
			box-shadow: none;
			border: none;
			background: transparent;
		}
	}
</style>
