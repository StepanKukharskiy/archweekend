<script>
	import { onMount } from 'svelte';
	import LanguageSwitcher from '$lib/LanguageSwitcher.svelte';
	import ProjectCarousel from '$lib/ProjectCarousel.svelte';
	import WorkshopProgram from '$lib/WorkshopProgram.svelte';
	import photo from '$lib/images/photo.jpg';
	import bg from '$lib/images/archweekend_flowfield.webp';
	import logo from '$lib/images/logo_nobg.png';
	import img0 from '$lib/images/0.webp';
	import img1 from '$lib/images/1.webp';
	import img2 from '$lib/images/2.webp';
	import img3 from '$lib/images/3.webp';
	import img4 from '$lib/images/4.webp';
	import img5 from '$lib/images/5.webp';
	import img6 from '$lib/images/6.webp';
	import img7 from '$lib/images/7.webp';

	export let data = { user: undefined };

	const paymentUrl = 'https://auth.robokassa.ru/merchant/Invoice/CqW6kKkzoUSlCWSCttF5Cg';

	/** @type {HTMLDialogElement} */
	let registrationDialog;

	function openRegistration() {
		registrationDialog.showModal();
	}

	function closeRegistration() {
		registrationDialog.close();
	}

	let stickyNavVisible = false;

	// Placeholder images for the grid (Replace these with your actual imports)
	const projectImages = [img0, img1, img2, img3, img4, img5, img6, img7];

	onMount(() => {
		// Sticky navigation
		const handleScroll = () => {
			stickyNavVisible = window.pageYOffset > 300;
		};

		window.addEventListener('scroll', handleScroll);

		// Scroll animations
		const observer = new IntersectionObserver(
			(entries) => {
				entries.forEach((entry) => {
					if (entry.isIntersecting) {
						entry.target.classList.add('visible');
					}
				});
			},
			{ threshold: 0.1, rootMargin: '0px 0px -50px 0px' }
		);

		document.querySelectorAll('.scroll-section').forEach((section) => {
			observer.observe(section);
		});

		return () => {
			window.removeEventListener('scroll', handleScroll);
			observer.disconnect();
		};
	});

	// Determine if user is logged in
	$: isLoggedIn = data?.user || false;

	async function handleSignOut() {
		try {
			await fetch('/api/user/signout', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json'
				}
			});
			// The redirect will happen on the server side
			window.location.href = '/en';
		} catch (err) {
			console.error('Logout failed:', err);
		}
	}
</script>

<svelte:head>
	<title>AI Agents for Architects — 7–8 November 2026 | SA lab</title>
	<meta
		name="description"
		content="From initial research to an architectural concept. A practical online workshop with Stepan Kukharsky. 7–8 November 2026 · 5 hours across two days."
	/>
</svelte:head>

<!-- Sticky Navigation -->
<div class="sticky-nav {stickyNavVisible ? 'visible' : ''}" id="stickyNav">
	<nav>
		<div style="display: flex; gap: 20px; flex-wrap: wrap;">
			<a href="#about">About the workshop</a>
			<a href="#program">Programme</a>
			<a href="#instructor">Instructor</a>
			<a href="#contact">Contact</a>
			{#if isLoggedIn}
				<a href="/en/course">Materials</a>
			{/if}
		</div>
		<div>
			{#if !isLoggedIn}
				<a href="/en/user/signin" style="margin-right: 20px;">Sign in</a>
			{:else}
				<button
					class="nav-link-btn"
					on:click={handleSignOut}
					style="margin-right: 20px; background:none; border:none; cursor:pointer; font-size:0.95rem; font-weight:500; color:var(--color-text);"
				>
					Sign out
				</button>
			{/if}
			<button type="button" on:click={openRegistration} class="nav-cta">Join the workshop</button>
		</div>
	</nav>
</div>

<!-- Hero Section -->
<section
	class="hero"
	style="background-image: url({bg}); background-size: cover; background-position: center;"
>
	<LanguageSwitcher locale="en" />
	<!-- Added Glass Wrapper -->
	<div class="hero-content-glass">
		<img src={logo} alt="SA lab" class="hero-logo-img" />

		<h1>AI Agents<br />for Architects</h1>

		<p class="subtitle">From initial research to an architectural concept</p>

		<div class="hero-stats">
			<div class="stat">
				<span class="stat-number">7–8</span>
				<span class="stat-label">November 2026</span>
			</div>
			<div class="stat">
				<span class="stat-number">5 hours</span>
				<span class="stat-label">online · two days</span>
			</div>
		</div>

		<button class="hero-cta" type="button" on:click={openRegistration}>Join the workshop →</button>
	</div>
</section>

<div class="container">
	<!-- Running Text -->
	<div class="running-text">
		<div class="running-text-inner">
			<span>Codex • Perplexity • Rhino • GPT Image 2.5 • Nano Banana 2</span>
			<span>Codex • Perplexity • Rhino • GPT Image 2.5 • Nano Banana 2</span>
			<span>Codex • Perplexity • Rhino • GPT Image 2.5 • Nano Banana 2</span>
		</div>
	</div>

	<!-- Key Info -->
	<div class="info-grid">
		<div class="info-item">
			<h3>7–8 November 2026</h3>
		</div>
		<div class="info-item">
			<h3>Online</h3>
		</div>
		<div class="info-item">
			<h3>Beginner-friendly</h3>
		</div>
		<div class="info-item">
			<h3>5 hours across two days</h3>
		</div>
	</div>

	<!-- About Section -->
	<section id="about" class="scroll-section">
		<div class="highlight-card workshop-intro">
			<h2>From initial research to an architectural concept</h2>
			<p>
				An architectural idea takes shape through many stages: understanding the site, interpreting
				the brief, exploring form, testing it in a model and developing a compelling presentation.
				This practical workshop guides you through that process with an AI agent, while keeping you
				in control of design decisions.
			</p>
			<p>
				Led by architect and computational designer Stepan Kukharsky, the workshop connects
				research, 3D modelling and visualisation through a real architectural case study. You’ll
				explore Codex for coordinating tasks, Perplexity for research, Rhino for modelling, and Nano
				Banana 2 and GPT Image 2.5 for image generation.
			</p>
			<p>
				Learn to give an agent clear instructions, define constraints, evaluate results and guide
				revisions. Organise project materials into a connected knowledge base, test ideas in 3D and
				identify inconsistencies between drawings and visualisations.
			</p>
			<p>
				The focus is a practical methodology you can adapt to your own projects as tools evolve.
			</p>
		</div>
	</section>

	<section id="workshop-project" class="scroll-section">
		<h2 class="section-title">Linha do Horizonte</h2>
		<p class="project-intro">
			<strong>We’ll work with a real site and design brief.</strong> Using the ARCH CHALLENGE: Linha
			do Horizonte competition as a case study, we’ll develop a housing concept in Cidade Velha on Santiago
			Island. The terrain, ocean, historic context, light and shade all shape the architecture. The AI
			agent will work with data, build models and create visualisations as you learn to guide the process.
		</p>
		<ProjectCarousel locale="en" />
	</section>

	<!-- Program Section -->
	<section id="program" class="scroll-section">
		<h2 class="section-title">Workshop programme</h2>
		<p class="section-subtitle">
			<strong>5 hours across two days.</strong> Follow the Linha do Horizonte architectural project from
			initial materials to a design proposal.
		</p>
		<WorkshopProgram locale="en" />
		<p class="program-outro">
			We’ll finish with an introduction to tools developed by <strong>SA lab</strong> for an integrated
			design process, using agents to connect work across different applications.
		</p>
	</section>

	<!-- Instructor Section -->
	<section id="instructor" class="scroll-section">
		<h2 class="section-title">Instructor</h2>

		<div class="instructor">
			<img src={photo} alt="Stepan Kukharsky" />

			<div class="instructor-content">
				<h3>Stepan Kukharsky</h3>
				<p>
					Hello! I’m Stepan Kukharsky, an architect and computational designer. For more than 10
					years, I’ve used algorithms to design urban areas, public spaces and buildings, as well as
					games and virtual architecture.
				</p>
				<p>
					I enjoy sharing my experience and teaching on international platforms and at conferences:
					DigitalFUTURES, CDRF, eCAADe, LiveAacademy.
				</p>
				<p>
					<strong>More than 500 students from 22 countries</strong> have taken my courses in parametric
					design and digital technologies.
				</p>
				<p>
					My classes offer a friendly atmosphere that welcomes experiments and unexpected solutions.
				</p>
			</div>
		</div>
	</section>

	<!-- Projects Section -->
	<section id="projects" class="scroll-section">
		<h2 class="section-title">Projects</h2>
		<p class="section-subtitle">Selected projects created with AI by the SA lab team</p>

		<div class="grid-images">
			{#each projectImages as img, i}
				<a
					href="https://www.behance.net/SAlab_architecture"
					target="_blank"
					rel="noopener noreferrer"
					class="project-image"
				>
					<img src={img} alt="SA lab project {i + 1}" loading="lazy" />
				</a>
			{/each}
		</div>
	</section>

	<!-- Benefits Section -->
	<section class="scroll-section">
		<h2 class="section-title">Who is this workshop for?</h2>

		<div class="grid grid-3">
			<div class="card">
				<h3>Architects</h3>
				<p>Looking to integrate AI into their design practice and stay competitive</p>
			</div>

			<div class="card">
				<h3>Designers</h3>
				<p>Looking to expand their toolkit and speed up their workflow</p>
			</div>

			<div class="card">
				<h3>Students</h3>
				<p>Looking to build skills that will strengthen their portfolios</p>
			</div>
		</div>

		<div class="grid grid-2" style="margin-top: 40px;">
			<div class="card">
				<h3>What you’ll gain</h3>
				<ul>
					<li>A methodology for using AI in architectural design</li>
					<li>Skills for defining tasks and guiding an AI agent</li>
					<li>A real project for your portfolio</li>
					<li>A practical workflow you can adapt to your own projects</li>
					<li>A connected wiki of project materials and design decisions</li>
				</ul>
			</div>

			<div class="card">
				<h3>Technical requirements</h3>
				<ul>
					<li>A laptop or desktop computer with internet access</li>
					<li>Basic computer skills</li>
					<li>A willingness to experiment</li>
					<li>Access to Codex and the AI tools used in the workshop</li>
				</ul>
			</div>
		</div>
	</section>

	<!-- Registration Section -->
	<section id="register" class="scroll-section">
		<div class="highlight-card">
			<h2 style="text-align: center;">Reserve your place at the workshop</h2>
			<p style="text-align: center;">7–8 November 2026 · Online · 5 hours across two days</p>
			<button
				class="hero-cta"
				type="button"
				on:click={openRegistration}
				style="margin: 40px auto 0;"
			>
				Join the workshop →
			</button>
		</div>
	</section>

	<!-- Contact Section -->
	<section id="contact" class="scroll-section">
		<h2 class="section-title">Get in touch</h2>

		<div class="contact-grid">
			<div class="contact-item">
				<a href="mailto:hello@salab.org">hello@salab.org</a>
			</div>
			<div class="contact-item">
				<a href="https://t.me/SAlab_daily" target="_blank">@salab.daily</a>
			</div>
		</div>
	</section>
</div>

<!-- Footer -->
<footer>
	<div class="footer-links">
		<a href="/en/business-details">Business details</a>
		<a href="/en/privacy-policy">Privacy policy</a>
		<a href="/en/terms">Terms and refund conditions</a>
	</div>
	<p class="footer-copy">© 2026 SA lab</p>
</footer>

<!-- Registration popup -->
<dialog
	bind:this={registrationDialog}
	class="registration-modal"
	aria-labelledby="registration-title"
	aria-describedby="registration-description"
>
	<button
		class="modal-backdrop"
		type="button"
		aria-label="Close registration"
		tabindex="-1"
		on:click={closeRegistration}
	></button>
	<div class="modal-content">
		<button class="modal-close" type="button" aria-label="Close" on:click={closeRegistration}
			>✕</button
		>
		<h3 id="registration-title">Join the workshop</h3>
		<p id="registration-description">
			After payment, we’ll get in touch within 24 hours with the workshop details.
		</p>
		<p class="modal-policy">
			By proceeding to payment, you agree to our <a href="/en/terms">terms and refund conditions</a>
			and <a href="/en/privacy-policy">personal data policy</a>.
		</p>
		<p class="modal-policy"><a href="/en/business-details">Business details</a></p>
		<a href={paymentUrl} class="modal-btn">Proceed to payment →</a>
	</div>
</dialog>

<!-- Mobile Sticky CTA -->
<div class="mobile-cta">
	<button type="button" on:click={openRegistration}>Reserve your place</button>
</div>

<style>
	.registration-modal {
		position: fixed;
		inset: 0;
		width: 100%;
		height: 100%;
		max-width: none;
		max-height: none;
		margin: 0;
		padding: 20px;
		border: 0;
		background: transparent;
		color: var(--color-text);
	}
	.registration-modal[open] {
		display: flex;
		align-items: center;
		justify-content: center;
	}
	.registration-modal::backdrop {
		background: rgba(255, 255, 255, 0.6);
		backdrop-filter: blur(4px);
	}
	.modal-backdrop {
		position: absolute;
		inset: 0;
		width: 100%;
		height: 100%;
		border: 0;
		background: transparent;
	}
	.modal-content {
		position: relative;
		width: 100%;
		max-width: 600px;
		max-height: 100%;
		overflow-y: auto;
		padding: 48px;
		border: 1px solid rgba(0, 102, 255, 0.4);
		border-radius: 24px;
		background: rgba(255, 255, 255, 0.85);
		backdrop-filter: blur(24px);
		box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
	}
	.modal-close {
		position: absolute;
		top: 16px;
		right: 16px;
		width: 32px;
		height: 32px;
		border: 0;
		border-radius: 4px;
		background: transparent;
		color: var(--color-text);
		font-size: 24px;
		cursor: pointer;
	}
	.modal-content h3 {
		margin-bottom: 20px;
		color: var(--color-blue-500);
		font-size: 1.8rem;
	}
	.modal-content p {
		margin-bottom: 24px;
		font-size: 1.05rem;
		line-height: 1.6;
	}
	.modal-btn {
		margin-top: 24px;
		display: block;
		padding: 16px;
		border-radius: 8px;
		background: var(--color-blue-500);
		color: white;
		font-size: 1.1rem;
		font-weight: 600;
		text-align: center;
		text-decoration: none;
	}
	.modal-content .modal-policy {
		margin: 20px 0 0;
		font-size: 0.9rem;
	}
	.modal-policy a {
		color: var(--color-blue-500);
	}
	@media (max-width: 768px) {
		.modal-content {
			padding: 48px 24px 32px;
		}
	}

	.workshop-intro p + p {
		margin-top: 24px;
	}
	.project-intro,
	.program-outro {
		max-width: 900px;
		margin: 24px auto 0;
		font-size: 1.15rem;
		line-height: 1.7;
	}

	:global(body) {
		--color-bg: #f9f9f9;
		--color-surface: rgba(255, 255, 255, 0.03);
		--color-glass: rgba(255, 255, 255, 0.08);
		--color-glass-border: rgba(255, 255, 255, 0.12);
		--color-text: #1a1a1a;
		--color-text-secondary: #1a1a1a;
		--color-border: rgba(255, 255, 255, 0.1);
		--color-blue-50: rgba(0, 0, 255, 0.1);
		--color-blue-500: #0000eb;
		--color-blue-600: #0000eb;
		--color-blue-700: #0000eb;
		--color-blue-glow: rgba(0, 0, 255, 0.2);
		--font-sans: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
		--shadow-glass: 0 8px 32px rgba(0, 0, 0, 0.4);
		--shadow-glow: 0 0 40px var(--color-blue-glow);
		--transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
		margin: 0 !important;
		padding: 0 !important;
		background: var(--color-bg) !important;
		color: var(--color-text) !important;
		font-family: var(--font-sans) !important;
		line-height: 1.6 !important;
		overflow-x: hidden !important;
		display: block !important;
		align-items: unset !important;
		font-size: 16px !important;
		min-height: 100vh !important;
	}

	* {
		box-sizing: border-box;
	}

	/* Glass morphism utilities */
	.glass {
		background: var(--color-glass);
		backdrop-filter: blur(20px);
		-webkit-backdrop-filter: blur(20px);
		border: 1px solid var(--color-glass-border);
	}

	.glass-strong {
		background: rgba(255, 255, 255, 0.42);
		backdrop-filter: blur(24px);
		-webkit-backdrop-filter: blur(24px);
		border: 1px solid rgba(255, 255, 255, 0.18);
	}

	:global(html) {
		scroll-behavior: smooth;
	}

	* {
		margin: 0;
		padding: 0;
		box-sizing: border-box;
	}

	p,
	span,
	li {
		font-weight: 500;
	}

	/* Sticky Navigation */
	.sticky-nav {
		position: fixed;
		top: 0;
		left: 0;
		right: 0;
		background: rgba(255, 255, 255, 0.5);
		backdrop-filter: blur(24px);
		-webkit-backdrop-filter: blur(24px);
		border-bottom: 1px solid var(--color-glass-border);
		z-index: 100;
		transform: translateY(-100%);
		transition: transform 0.3s ease;
		padding: 16px 20px;
		box-shadow: 0 4px 24px rgba(0, 0, 0, 0.3);
	}

	.sticky-nav.visible {
		transform: translateY(0);
	}

	.sticky-nav nav {
		max-width: 1400px;
		margin: 0 auto;
		display: flex;
		justify-content: space-between;
		align-items: center;
		flex-wrap: wrap;
		gap: 16px;
	}

	.sticky-nav a {
		color: var(--color-text);
		text-decoration: none;
		font-size: 0.95rem;
		font-weight: 500;
		transition: color 0.2s;
	}

	.sticky-nav a:hover {
		color: var(--color-blue-500);
	}

	.sticky-nav .nav-cta {
		font: inherit;
		border: none;
		cursor: pointer;
		background: var(--color-blue-500);
		color: white;
		padding: 10px 24px;
		border-radius: 8px;
		transition: var(--transition);
		box-shadow: 0 4px 12px rgba(0, 102, 255, 0.3);
	}

	.sticky-nav .nav-cta:hover {
		background: var(--color-blue-600);
		transform: translateY(-2px);
		box-shadow: 0 6px 20px rgba(0, 102, 255, 0.4);
	}

	/* Container */
	.container {
		max-width: 1200px;
		margin: 0 auto;
		padding: 0 20px;
	}

	/* Hero Section */
	.hero {
		min-height: 95vh;
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: center;
		text-align: center;
		padding: 80px 20px 60px;
		position: relative;
		overflow: hidden;
	}

	.hero-content-glass {
		background: rgba(255, 255, 255, 0.15);
		backdrop-filter: blur(20px);
		-webkit-backdrop-filter: blur(20px);
		border: 1px solid rgba(255, 255, 255, 0.3);
		border-radius: 32px;
		padding: 60px 80px;
		box-shadow:
			0 20px 60px rgba(0, 0, 235, 0.1),
			inset 0 0 0 1px rgba(255, 255, 255, 0.2);
		max-width: 1100px;
		width: 100%;
		display: flex;
		flex-direction: column;
		align-items: center;
		margin-top: 20px;
		position: relative;
		z-index: 2;
	}

	.hero::before {
		content: '';
		position: absolute;
		top: 0;
		left: 0;
		right: 0;
		bottom: 0;
		background: repeating-linear-gradient(
				0deg,
				rgba(0, 102, 255, 0.03) 0px,
				transparent 1px,
				transparent 80px,
				rgba(0, 102, 255, 0.03) 81px
			),
			repeating-linear-gradient(
				90deg,
				rgba(0, 102, 255, 0.03) 0px,
				transparent 1px,
				transparent 80px,
				rgba(0, 102, 255, 0.03) 81px
			);
		pointer-events: none;
		opacity: 0.3;
	}

	.hero::after {
		content: '';
		position: absolute;
		top: 0;
		left: 0;
		width: 100%;
		height: 100%;
		background: linear-gradient(rgba(10, 10, 250, 0.25), rgba(250, 250, 250));
		z-index: 0;
	}

	.hero > * {
		position: relative;
		z-index: 2;
	}

	.hero-logo {
		width: 100px;
		height: 100px;
		background-size: 120px 120px;
		background-position: center;
		background-repeat: no-repeat;
		margin-bottom: 20px;
		transition: transform 1s ease;
	}

	.hero-logo:hover {
		transform: rotate(360deg);
	}

	.hero-logo-img {
		width: 120px;
		height: 120px;
		margin: 0 auto 32px;
		display: block;
		animation:
			fadeInUp 0.8s ease forwards,
			float 6s ease-in-out infinite;
		filter: drop-shadow(0 0 30px var(--color-blue-glow));
	}

	@keyframes float {
		0%,
		100% {
			transform: translateY(0px);
		}
		50% {
			transform: translateY(-10px);
		}
	}

	.hero h1 {
		font-size: clamp(2rem, 5vw, 4rem);
		font-weight: 700;
		line-height: 1.1;
		margin-bottom: 24px;
		letter-spacing: -0.03em;
		color: var(--color-text);
		animation: fadeInUp 0.8s ease forwards;
		background: linear-gradient(135deg, #0000eb 0%, var(--color-blue-500) 100%);
		-webkit-background-clip: text;
		-webkit-text-fill-color: transparent;
		background-clip: text;
		position: relative;
		z-index: 1;
	}

	.hero .subtitle {
		font-size: clamp(1.1rem, 2.5vw, 1.5rem);
		color: var(--color-text-secondary);
		max-width: 800px;
		margin: 0 auto 40px;
		line-height: 1.5;
		animation: fadeInUp 0.8s ease 0.2s forwards;
	}

	.hero-stats {
		display: flex;
		gap: 40px;
		justify-content: center;
		flex-wrap: wrap;
		margin-bottom: 40px;
		animation: fadeInUp 0.8s ease 0.4s forwards;
	}

	.stat {
		text-align: center;
	}

	.stat-number {
		font-size: 2.5rem;
		font-weight: 700;
		color: var(--color-blue-500);
		display: block;
	}

	.stat-label {
		font-size: 0.95rem;
		color: var(--color-text-secondary);
		margin-top: 4px;
	}

	.hero-cta {
		display: inline-flex;
		align-items: center;
		gap: 12px;
		background: var(--color-blue-500);
		color: white;
		padding: 20px 48px;
		font-size: 1.2rem;
		font-weight: 700;
		border: none;
		border-radius: 12px;
		cursor: pointer;
		transition: var(--transition);
		text-decoration: none;
		animation: fadeInUp 0.8s ease 0.6s forwards;
		box-shadow:
			0 8px 32px var(--color-blue-glow),
			0 0 0 1px rgba(255, 255, 255, 0.2) inset;
		position: relative;
		overflow: hidden;
	}

	.hero-cta::before {
		content: '';
		position: absolute;
		top: 0;
		left: -100%;
		width: 100%;
		height: 100%;
		background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.2), transparent);
		transition: left 0.5s ease;
	}

	.hero-cta:hover::before {
		left: 100%;
	}

	.hero-cta:hover {
		background: var(--color-blue-600);
		transform: translateY(-3px) scale(1.02);
		box-shadow:
			0 12px 48px var(--color-blue-glow),
			0 0 60px var(--color-blue-glow),
			0 0 0 1px rgba(255, 255, 255, 0.3) inset;
	}

	/* Video Section */
	.video-section {
		margin: 60px 0;
		border: 1.5px solid var(--color-border);
		overflow: hidden;
		border-radius: 12px;
		position: relative;
	}

	.video-section video {
		width: 100%;
		display: block;
		filter: brightness(1.025) contrast(1.25);
	}

	.video-overlay {
		position: absolute;
		bottom: 0;
		left: 0;
		right: 0;
		background: linear-gradient(to top, rgba(0, 0, 0, 0.8), transparent);
		padding: 40px;
		color: white;
		transform: translateY(100%);
		transition: transform 0.4s ease;
	}

	.video-section:hover .video-overlay {
		transform: translateY(0);
	}

	/* Running Text */
	.running-text {
		border: 1px solid var(--color-glass-border);
		border-radius: 12px;
		overflow: hidden;
		background: var(--color-glass);
		backdrop-filter: blur(20px);
		-webkit-backdrop-filter: blur(20px);
		margin: 60px 0;
		box-shadow: 0 4px 16px rgba(0, 0, 0, 0.2);
	}

	.running-text-inner {
		display: flex;
		white-space: nowrap;
		animation: scroll 20s linear infinite;
		padding: 16px 0;
	}

	.running-text span {
		padding: 0 40px;
		font-size: 1.3rem;
		font-weight: 600;
		color: var(--color-blue-500);
		text-transform: uppercase;
	}

	@keyframes scroll {
		0% {
			transform: translateX(0);
		}
		100% {
			transform: translateX(-50%);
		}
	}

	/* Section */
	section {
		scroll-margin-top: 80px;
		padding: 80px 20px;
		transform: translateY(0);
		transition:
			opacity 0.6s ease,
			transform 0.6s ease;
	}

	section.visible {
		opacity: 1;
		transform: translateY(0);
	}

	.section-title {
		font-size: clamp(1.8rem, 4vw, 3rem);
		font-weight: 700;
		line-height: 1.2;
		margin-bottom: 16px;
		color: var(--color-blue-500);
		text-align: center;
	}

	.section-subtitle {
		font-size: 1.2rem;
		color: var(--color-text-secondary);
		text-align: center;
		max-width: 800px;
		margin: 0 auto 60px;
	}

	/* Grid System */
	.grid {
		display: grid;
		gap: 24px;
		margin-top: 40px;
	}

	.grid-2 {
		grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
	}

	.grid-3 {
		grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
	}

	/* Image Grid */
	.grid-images {
		display: grid;
		grid-template-columns: repeat(4, 1fr);
		gap: 16px;
		margin-top: 40px;
	}

	.project-image {
		position: relative;
		aspect-ratio: 1/1.32;
		border-radius: 12px;
		overflow: hidden;
		box-shadow: var(--shadow-glass);
		transition: var(--transition);
		cursor: pointer;

		/* Added properties for the link tag: */
		display: block;
		text-decoration: none;
		color: inherit;
	}

	.project-image:hover {
		transform: scale(1.03);
		box-shadow: 0 12px 32px rgba(0, 0, 235, 0.3);
		z-index: 2;
	}

	.project-image img {
		width: 100%;
		height: 100%;
		object-fit: cover;
		display: block;
	}

	.grid-asymmetric {
		grid-template-columns: 2fr 1fr;
	}

	/* Cards */
	.card {
		background: var(--color-glass);
		backdrop-filter: blur(20px);
		-webkit-backdrop-filter: blur(20px);
		border: 1px solid var(--color-glass-border);
		border-radius: 16px;
		padding: 32px;
		transition: var(--transition);
		box-shadow: var(--shadow-glass);
	}

	.card:hover {
		transform: translateY(-6px);
		box-shadow:
			0 12px 48px rgba(0, 0, 0, 0.5),
			0 0 0 1px rgba(0, 102, 255, 0.3);
		border-color: rgba(0, 102, 255, 0.5);
		background: rgba(255, 255, 255, 0.1);
	}

	.card h3 {
		font-size: 1.4rem;
		line-height: 1.3;
		font-weight: 600;
		margin-bottom: 16px;
		color: var(--color-blue-500);
	}

	.card ul {
		list-style: none;
		margin-top: 16px;
	}

	.card ul li {
		padding: 12px 0;
		border-bottom: 1px solid rgba(42, 42, 42, 0.1);
		display: flex;
		align-items: flex-start;
		gap: 12px;
	}

	.card ul li:last-child {
		border-bottom: none;
	}

	.card ul li::before {
		content: '→';
		color: var(--color-blue-500);
		font-weight: 700;
		flex-shrink: 0;
	}

	/* Highlight Card */
	.highlight-card {
		max-width: 1200px;
		background: var(--color-glass-strong);
		backdrop-filter: blur(24px);
		-webkit-backdrop-filter: blur(24px);
		border: 1px solid rgba(0, 102, 255, 0.3);
		padding: 60px 48px;
		border-radius: 24px;
		text-align: center;
		box-shadow:
			var(--shadow-glass),
			0 0 80px rgba(0, 102, 255, 0.15);
		position: relative;
		overflow: hidden;
	}

	.highlight-card p {
		text-align: left;
	}

	.highlight-card::before {
		content: '';
		position: absolute;
		top: -50%;
		left: -50%;
		width: 200%;
		height: 200%;
		background: radial-gradient(circle, rgba(0, 102, 255, 0.1) 0%, transparent 70%);
	}

	@keyframes rotate {
		from {
			transform: rotate(0deg);
		}
		to {
			transform: rotate(360deg);
		}
	}

	.highlight-card > * {
		position: relative;
		z-index: 1;
	}

	.highlight-card h2 {
		font-size: clamp(1.8rem, 4vw, 2.5rem);
		line-height: 1.25;
		text-align: left;
		margin: 0 auto;
		margin-bottom: 24px;
		max-width: 900px;
		color: var(--color-blue-500);
	}

	.highlight-card p {
		font-size: 1.15rem;
		line-height: 1.6;
		color: var(--color-text-secondary);
		max-width: 900px;
		margin: 0 auto;
	}

	/* Info Grid */
	.info-grid {
		display: grid;
		grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
		gap: 20px;
		margin: 40px 0;
	}

	.info-item {
		background: var(--color-glass);
		backdrop-filter: blur(20px);
		-webkit-backdrop-filter: blur(20px);
		border: 1px solid var(--color-glass-border);
		padding: 28px 24px;
		border-radius: 12px;
		text-align: center;
		transition: var(--transition);
		box-shadow: 0 4px 16px rgba(0, 0, 0, 0.2);
	}

	.info-item:hover {
		border-color: rgba(0, 102, 255, 0.5);
		transform: translateY(-4px);
		box-shadow:
			0 8px 32px rgba(0, 0, 0, 0.4),
			0 0 0 1px rgba(0, 102, 255, 0.2) inset;
		background: rgba(255, 255, 255, 0.12);
	}

	.info-item h3 {
		font-size: 1.3rem;
		font-weight: 600;
		color: var(--color-text);
	}

	/* Instructor Section */
	.instructor {
		display: grid;
		grid-template-columns: 1fr 2fr;
		gap: 48px;
		align-items: center;
		background: var(--color-glass);
		backdrop-filter: blur(20px);
		-webkit-backdrop-filter: blur(20px);
		border: 1px solid var(--color-glass-border);
		border-radius: 24px;
		padding: 60px;
		margin: 80px 0;
		box-shadow: var(--shadow-glass);
	}
	.instructor img {
		width: 100%;
		max-width: 300px;
		border-radius: 16px;
		border: 1px solid var(--color-glass-border);
		box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);
	}

	.instructor-content h3 {
		font-size: 2rem;
		color: var(--color-text);
		margin-bottom: 20px;
	}

	.instructor-content h3::after {
		content: '';
		display: block;
		width: 60px;
		height: 3px;
		background: linear-gradient(90deg, var(--color-blue-500), transparent);
		margin-top: 12px;
	}

	.instructor-content p {
		font-size: 1.1rem;
		line-height: 1.7;
		color: var(--color-text-secondary);
		margin-bottom: 16px;
	}

	/* Contact */
	.contact-grid {
		display: flex;
		justify-content: center;
		gap: 40px;
		flex-wrap: wrap;
		margin-top: 40px;
	}

	.contact-item {
		text-align: center;
	}

	.contact-item a {
		display: inline-block;
		padding: 16px 32px;
		background: var(--color-surface);
		border: 1.5px solid var(--color-border);
		border-radius: 8px;
		color: var(--color-text);
		text-decoration: none;
		font-size: 1.1rem;
		font-weight: 500;
		transition: var(--transition);
	}

	.contact-item a:hover {
		border-color: var(--color-blue-500);
		color: var(--color-blue-500);
		transform: translateY(-2px);
		box-shadow: 0 4px 20px var(--color-blue-glow);
	}

	/* Footer */
	footer {
		background: var(--color-glass);
		backdrop-filter: blur(20px);
		-webkit-backdrop-filter: blur(20px);
		border-top: 1px solid var(--color-glass-border);
		padding: 60px 20px 32px;
		margin-top: 120px;
	}

	.footer-links {
		display: flex;
		justify-content: center;
		gap: 32px;
		flex-wrap: wrap;
		margin-bottom: 24px;
	}

	.footer-links a {
		color: var(--color-text-secondary);
		text-decoration: none;
		font-size: 0.95rem;
		transition: color 0.2s;
	}

	.footer-links a:hover {
		color: var(--color-blue-500);
	}

	.footer-copy {
		text-align: center;
		color: var(--color-text-secondary);
		font-size: 0.9rem;
	}

	/* Animations */
	@keyframes fadeInUp {
		from {
			opacity: 0;
			transform: translateY(20px);
		}
		to {
			opacity: 1;
			transform: translateY(0);
		}
	}

	/* Mobile Sticky CTA */
	.mobile-cta {
		display: none;
		position: fixed;
		bottom: 0;
		left: 0;
		right: 0;
		background: var(--color-surface);
		border-top: 1.5px solid var(--color-border);
		padding: 16px 20px;
		z-index: 90;
		box-shadow: 0 -4px 12px rgba(0, 0, 0, 0.1);
		backdrop-filter: blur(20px);
		-webkit-backdrop-filter: blur(20px);
	}

	.mobile-cta button {
		display: block;
		text-align: center;
		text-decoration: none;
		width: 100%;
		padding: 16px;
		background: var(--color-blue-500);
		color: white;
		border: none;
		border-radius: 8px;
		font-size: 1.1rem;
		font-weight: 600;
		cursor: pointer;
	}

	/* Responsive */
	@media (max-width: 1024px) {
		.grid-images {
			grid-template-columns: repeat(2, 1fr); /* 2 columns on tablet */
		}
	}

	@media (max-width: 768px) {
		section {
			scroll-margin-top: 140px;
		}
		.hero {
			min-height: auto;
			padding: 40px 20px;
		}

		.hero-content-glass {
			padding: 40px 24px;
			border-radius: 24px;
			background: rgba(255, 255, 255, 0.3);
			backdrop-filter: blur(24px);
		}

		.hero-stats {
			gap: 24px;
		}

		.stat-number {
			font-size: 2rem;
		}

		.grid-asymmetric,
		.instructor {
			grid-template-columns: 1fr;
		}

		.instructor img {
			max-width: 200px;
			margin: 0 auto;
		}

		.sticky-nav nav {
			font-size: 0.85rem;
			gap: 8px;
		}

		.mobile-cta {
			display: block;
		}

		section {
			padding: 60px 20px;
		}

		.section-subtitle {
			margin-bottom: 32px;
		}
	}

	@media (max-width: 480px) {
		.container {
			padding: 0;
		}
		.info-grid {
			padding: 20px;
		}

		.card,
		.highlight-card,
		.instructor,
		.running-text,
		.hero-content-glass {
			border-radius: 20px;
			border-left: none;
			border-right: none;
			width: 100%;
			padding: 30px 20px;
		}

		.hero-cta {
			padding: 14px 32px;
			font-size: 1rem;
		}

		.instructor {
			display: flex;
			flex-direction: column;
		}

		.grid {
			gap: 16px;
		}

		.grid-images {
			grid-template-columns: 1fr; /* 1 column on mobile */
			padding: 0 20px; /* Restore padding for edge-to-edge container logic */
		}
	}
	@media (max-width: 480px) {
		.grid-2,
		.grid-3 {
			grid-template-columns: minmax(0, 1fr);
		}
		footer {
			padding-bottom: 110px;
		}
	}
</style>
