									<script>
										import { onMount } from 'svelte';
										import { goto, invalidateAll } from '$app/navigation';
										import photo from '$lib/images/photo.jpg';
										import bg from '$lib/images/archweekend_flowfield.webp';
										import logo from '$lib/images/logo_nobg.png';
										import img0 from '$lib/images/0.webp'
										import img1 from '$lib/images/1.webp'
										import img2 from '$lib/images/2.webp'
										import img3 from '$lib/images/3.webp'
										import img4 from '$lib/images/4.webp'
										import img5 from '$lib/images/5.webp'
										import img6 from '$lib/images/6.webp'
										import img7 from '$lib/images/7.webp'

										export let data = {}; 

										let modalActive = false;
										let modalType = '';
										let stickyNavVisible = true;

											// Placeholder images for the grid (Replace these with your actual imports)
											const projectImages = [
													img0, img1, img2, img3, img4, img5, img6, img7
											];

										onMount(() => {
											// Sticky navigation
											const handleScroll = () => {
												stickyNavVisible = window.pageYOffset > 300;
											};

											window.addEventListener('scroll', handleScroll);

											// Animate numbers
											const statNumbers = document.querySelectorAll('.stat-number');
											statNumbers.forEach((stat) => {
												const target = parseInt(stat.dataset.target);
												animateNumber(stat, target);
											});

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
											};
										});

										function animateNumber(element, target, duration = 2000) {
											const increment = target / (duration / 16);
											let current = 0;

											const timer = setInterval(() => {
												current += increment;
												if (current >= target) {
													current = target;
													clearInterval(timer);
												}
												element.textContent = Math.floor(current) + (target > 100 ? '+' : '');
											}, 16);
										}

										function openModal(type) {
											modalType = type;
											modalActive = true;
										}

										function closeModal() {
											modalActive = false;
										}

										const modals = {
											register: {
												title: 'ГАЙД ПО AI для архитекторов',
												text: `Оплачивая курс, вы получаете вечный доступ к записям всех 4-х занятий (теория + практика) и вступаете в закрытое комьюнити для обсуждения любых вопросов.
													Мы свяжемся с вами по email в течение 24 часов после оплаты и откроем доступ к материалам.
													Рады видеть вас на курсе! Успехов в освоении ИИ!`,
												link: 'https://auth.robokassa.ru/merchant/Invoice/oIQ40XC4GE-M0dX3TKatSQ',
												linkText: 'Перейти к оплате'
											}
										};

										$: currentModal = modals[modalType] || modals.register;
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
												window.location.href = '/';
											} catch (err) {
												console.error('Logout failed:', err);
											}
										}
									</script>

									<svelte:head>
										<title>ГАЙД ПО AI для архитекторов | SA lab</title>
									</svelte:head>

									<style>
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

										p, span, li{
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
											animation: fadeInUp 0.8s ease forwards, float 6s ease-in-out infinite;
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
											box-shadow: 0 8px 32px var(--color-blue-glow), 0 0 0 1px rgba(255, 255, 255, 0.2) inset;
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
											box-shadow: 0 12px 48px var(--color-blue-glow), 0 0 60px var(--color-blue-glow),
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
											padding: 80px 20px;
											transform: translateY(0);
											transition: opacity 0.6s ease, transform 0.6s ease;
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
											box-shadow: 0 12px 48px rgba(0, 0, 0, 0.5), 0 0 0 1px rgba(0, 102, 255, 0.3);
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
											box-shadow: var(--shadow-glass), 0 0 80px rgba(0, 102, 255, 0.15);
											position: relative;
											overflow: hidden;
										}

										.highlight-card p{
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
											box-shadow: 0 8px 32px rgba(0, 0, 0, 0.4), 0 0 0 1px rgba(0, 102, 255, 0.2) inset;
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

										/* Popup Modal */
										.modal {
											display: none;
											position: fixed;
											top: 0;
											left: 0;
											right: 0;
											bottom: 0;
											background: rgba(255, 255, 255, 0.6);
											backdrop-filter: blur(4px);
											z-index: 1000;
											padding: 20px;
											overflow-y: auto;
										}

										.modal.active {
											display: flex;
											align-items: center;
											justify-content: center;
											animation: fadeIn 0.3s ease;
										}

										@keyframes fadeIn {
											from {
												opacity: 0;
											}
											to {
												opacity: 1;
											}
										}

										.modal-content {
											background: var(--color-glass);
											backdrop-filter: blur(40px);
											-webkit-backdrop-filter: blur(24px);
											border: 1px solid rgba(0, 102, 255, 0.4);
											border-radius: 24px;
											padding: 48px;
											max-width: 600px;
											width: 100%;
											position: relative;
											animation: slideUp 0.3s ease;
											box-shadow: 0 20px 60px rgba(0, 0, 0, 0.6), 0 0 0 1px rgba(255, 255, 255, 0.1) inset;
										}

										@keyframes slideUp {
											from {
												transform: translateY(30px);
												opacity: 0;
											}
											to {
												transform: translateY(0);
												opacity: 1;
											}
										}

										.modal-close {
											position: absolute;
											top: 16px;
											right: 16px;
											background: none;
											border: none;
											font-size: 24px;
											cursor: pointer;
											color: var(--color-text-secondary);
											width: 32px;
											height: 32px;
											display: flex;
											align-items: center;
											justify-content: center;
											border-radius: 4px;
											transition: var(--transition);
										}

										.modal-close:hover {
											background: var(--color-blue-50);
											color: var(--color-blue-500);
										}

										.modal-content h3 {
											font-size: 1.8rem;
											color: var(--color-blue-500);
											margin-bottom: 20px;
										}

										.modal-content p {
											font-size: 1.05rem;
											line-height: 1.6;
											color: var(--color-text-secondary);
											margin-bottom: 24px;
										}

										.modal-btn {
											display: block;
											width: 100%;
											padding: 16px;
											background: var(--color-blue-500);
											color: white;
											border: none;
											border-radius: 8px;
											font-size: 1.1rem;
											font-weight: 600;
											cursor: pointer;
											transition: var(--transition);
											text-decoration: none;
											text-align: center;
										}

										.modal-btn:hover {
											background: var(--color-blue-600);
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

											.modal-content {
												padding: 32px 24px;
											}

											section {
												padding: 60px 20px;
											}

											.section-subtitle {
												margin-bottom: 32px;
											}
										}

										@media (max-width: 480px) {
											.container{
												padding: 0;
											}
											.info-grid{
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
									</style>

									<!-- Sticky Navigation -->
									<div class="sticky-nav {stickyNavVisible ? 'visible' : ''}" id="stickyNav">
										<nav>
											<div style="display: flex; gap: 20px; flex-wrap: wrap;">
												<a href="#about">О курсе</a>
												<a href="#program">Программа</a>
												<a href="#instructor">Куратор</a>
												<a href="#contact">Контакты</a>
												{#if isLoggedIn}
													<a href="/course">Материалы</a>
												{/if}
											</div>
											<div>
												{#if !isLoggedIn}
											<a href="/user/signin" style='margin-right: 20px;'>Войти</a>
												{:else}
													<button 
														class="nav-link-btn" 
														on:click={handleSignOut} 
														style='margin-right: 20px; background:none; border:none; cursor:pointer; font-size:0.95rem; font-weight:500; color:var(--color-text);'
													>
														Выход
													</button>
												{/if}
											<a href="#register" class="nav-cta">Присоединиться</a>
												</div>
										</nav>
									</div>

									<!-- Hero Section -->
									<section class="hero" style="background-image: url({bg}); background-size: cover; background-position: center;">

										<!-- Added Glass Wrapper -->
										<div class="hero-content-glass">
											<img src={logo} alt="SA lab" class="hero-logo-img" />

											<h1>ГАЙД ПО AI<br />для архитекторов</h1>

											<p class="subtitle">
												Учим методологии использования AI в архитектурной практике
											</p>

											<div class="hero-stats">
												<div class="stat">
													<span class="stat-number" data-target="20">0</span>
													<span class="stat-label">Нейронок</span>
												</div>
												<div class="stat">
													<span class="stat-number" data-target="4">0</span>
													<span class="stat-label">Занятия</span>
												</div>
											</div>

											<button class="hero-cta" on:click={() => openModal('register')}> Присоединиться → </button>
										</div>

									</section>

									<div class="container">
										<!-- Running Text -->
										<div class="running-text">
											<div class="running-text-inner">
												<span>Nano Banana • ChatGPT • Perplexity • Stable Diffusion • ControlNet</span>
												<span>Nano Banana • ChatGPT • Perplexity • Stable Diffusion • ControlNet</span>
												<span>Nano Banana • ChatGPT • Perplexity • Stable Diffusion • ControlNet</span>
											</div>
										</div>

										<!-- Key Info -->
										<div class="info-grid">
											<div class="info-item">
												<h3>Теория + Практика</h3>
											</div>
											<div class="info-item">
												<h3>Online курс</h3>
											</div>
											<div class="info-item">
												<h3>Для новичков</h3>
											</div>
											<div class="info-item">
												<h3><s>7500₽</s>&nbsp;6000₽</h3>
											</div>
										</div>

										<!-- About Section -->
										<section id="about" class="scroll-section">
											<div class="highlight-card">
												<h2>AI уже работает в архитектуре. Вопрос не в том, использовать ли, вопрос в том, как начать и не потеряться среди тысячи нейронок.</h2>
												<p>
													Как не утонуть в информационном шуме, когда новые инструменты появляются каждый месяц? Как встроить искусственный интеллект в архитектурную проектирование? Как быстро адаптироваться к скорости внедрения AI? На этом курсе мы рассказываем о <strong>методологии работы с AI</strong>, который не будет привязан к выходу новой нейронки, а создаст фундамент интеграции в практику.<br><br>
													За четыре занятия вы с нуля создадите деревянный павильон для тестирования методологии. Поймете, как выбирать нейронку под конкретную задачу, писать промпт, который работает, научитесь делегировать рутинные задачи и экспериментировать.
												</p>
											</div>
										</section>

										<!-- Program Section -->
										<section id="program" class="scroll-section">
											<h2 class="section-title">Программа курса</h2>
											<p class="section-subtitle">4 практических занятия с реальными инструментами и задачами</p>

											<div class="grid grid-2">
												<div class="card">
													<h3>Занятие 1: Как мы сюда пришли</h3>
													<ul>
														<li>История трансформеров и LLM</li>
														<li>Почему AI стал актуален именно сейчас</li>
														<li>Обзор ландшафта AI-инструментов для архитекторов</li>
														<li>Понимание возможностей и ограничений</li>
													</ul>
												</div>

												<div class="card">
													<h3>Занятие 2: Как выбрать инструмент?</h3>
													<ul>
														<li>ChatGPT и Perplexity — тестируем на практике</li>
														<li>Как анализировать техническое задание и нормативы</li>
														<li>Учимся выбирать модель под архитектурную задачу</li>
														<li>Практика: исследования с помощью AI и анализ ТЗ</li>
													</ul>
												</div>

												<div class="card">
													<h3>Занятие 3: Делаем красивые картинки</h3>
													<ul>
														<li>Как текст становится изображением</li>
														<li>ControlNet, Stable Diffusion, Nano Banana</li>
														<li>Управляемая генерация изображений</li>
														<li>Почему Replicate удобнее Midjourney</li>
														<li>Практика: генерируем концепции павильона</li>
													</ul>
												</div>

												<div class="card">
													<h3>Занятие 4: Тренируем нейронки</h3>
													<ul>
														<li>Язык, на котором разговаривают с AI</li>
														<li>Fine-tuning и transfer learning</li>
														<li>Практика: тренируем свою нейронку</li>
														<li>Создаем итоговый проект — деревянный павильон</li>
													</ul>
												</div>
											</div>
										</section>

										<!-- Instructor Section -->
										<section id="instructor" class="scroll-section">
											<h2 class="section-title">Куратор</h2>

											<div class="instructor">
												<img src={photo} alt="Степан Кухарский" />

												<div class="instructor-content">
													<h3>Степан Кухарский</h3>
													<p>
														Привет! Меня зовут Степан Кухарский. Я архитектор и вычислительный дизайнер, более 10 лет
														использую алгоритмы в работе с городскими территориями, общественными пространствами,
														зданиями, разрабатываю игры и виртуальную архитектуру.
													</p>
													<p>
														Я люблю делиться опытом и преподаю на международных площадках и конференциях:
														DigitalFUTURES, CDRF, eCAADe, LiveAacademy.
													</p>
													<p>
														<strong>Более 500 студентов из 22 стран</strong> прошли мои курсы по параметрическому дизайну
														и цифровым технологиям.
													</p>
													<p>
														На занятиях я выстраиваю дружелюбную атмосферу, открытую для экспериментов и неожиданных
														решений.
													</p>
												</div>
											</div>
										</section>

										<!-- Projects Section -->
										<section id="projects" class="scroll-section">
												<h2 class="section-title">Проекты</h2>
												<p class="section-subtitle">Примеры работ, созданных с использованием AI командой SA lab</p>

												<div class="grid-images">
														{#each projectImages as img, i}
																<a 
																		href="https://www.behance.net/SAlab_architecture" 
																		target="_blank" 
																		rel="noopener noreferrer" 
																		class="project-image"
																>
																		<img src={img} alt="Студенческий проект {i+1}" loading="lazy"/>
																</a>
														{/each}
												</div>
										</section>

										<!-- Benefits Section -->
										<section class="scroll-section">
											<h2 class="section-title">Для кого этот курс?</h2>

											<div class="grid grid-3">
												<div class="card">
													<h3>Архитекторы</h3>
													<p>
														Которые хотят интегрировать AI в проектирование и оставаться конкурентоспособными
													</p>
												</div>

												<div class="card">
													<h3>Дизайнеры</h3>
													<p>Стремящиеся расширить инструментарий и ускорить рабочий процесс</p>
												</div>

												<div class="card">
													<h3>Студенты</h3>
													<p>Желающие получить навыки, которые усилят портфолио</p>
												</div>
											</div>

											<div class="grid grid-2" style="margin-top: 40px;">
												<div class="card">
													<h3>Что вы получите</h3>
													<ul>
														<li>Методологию выбора AI-инструментов под задачу</li>
														<li>Навык написания эффективных промптов</li>
														<li>Реальный проект для портфолио</li>
														<li>Понимание, как делегировать задачи AI</li>
														<li>Доступ к записям навсегда</li>
													</ul>
												</div>

												<div class="card">
													<h3>Технические требования</h3>
													<ul>
														<li>Ноутбук или ПК с выходом в интернет</li>
														<li>Базовые навыки работы с компьютером</li>
														<li>Желание экспериментировать</li>
														<li>Аккаунты в ChatGPT/Perplexity (бесплатные версии подойдут)</li>
													</ul>
												</div>
											</div>
										</section>

										<!-- Intro Video Section -->
										<section id="intro_vid" class="scroll-section">
											<h2 class="section-title">Введение</h2>
											<div class="highlight-card">
												<iframe
													src="https://player.mux.com/KEwmiM2Gs02c7oIacWMK4JUixwwj4WKvCTYDsMnif6no?metadata-video-title=lesson+1o&video-title=intro&accent-color=%230000ff"
													style="width: 100%; border: none; aspect-ratio: 16/9;"
													allow="accelerometer; gyroscope; autoplay; encrypted-media; picture-in-picture;"
													allowfullscreen
												></iframe>
											</div>
										</section>

										<!-- Registration Section -->
										<section id="register" class="scroll-section">
											<div class="highlight-card">
												<h2 style='text-align: center;'>Забронируйте место на курсе</h2>
												<p style='text-align: center;'>Начните свой путь интеграции AI в архитектурную практику уже сейчас</p>
												<button class="hero-cta" on:click={() => openModal('register')} style="margin: 40px auto 0;">
													Присоединиться →
												</button>
											</div>
										</section>

										<!-- Contact Section -->
										<section id="contact" class="scroll-section">
											<h2 class="section-title">Мы на связи</h2>

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
											<a href="/requisites">Реквизиты</a>
											<a href="/privacy-policy">Политика конфиденциальности</a>
											<a href="/oferta">Публичная оферта</a>
										</div>
										<p class="footer-copy">© 2025 SA lab</p>
									</footer>

									<!-- Modal -->
									{#if modalActive}
										<div
											class="modal active"
											on:click={closeModal}
											on:keydown={(e) => e.key === 'Escape' && closeModal()}
											role="button"
											tabindex="0"
										>
											<div class="modal-content" on:click|stopPropagation role="dialog">
												<button class="modal-close" on:click={closeModal}>✕</button>
												<h3>{currentModal.title}</h3>
												<p style="white-space: pre-line;">{currentModal.text}</p>
												{#if currentModal.link !== '#'}
													<a href={currentModal.link} class="modal-btn">{currentModal.linkText}</a>
													<p style="font-size: 0.9rem; margin-top: 20px; color: var(--color-text-secondary);">
														Нажимая на кнопку «Перейти к оплате», вы соглашаетесь с <a
															href="/privacy-policy"
															style="color: var(--color-blue-500);">политикой обработки персональных данных</a
														>.
													</p>
												{:else}
													<button class="modal-btn" on:click={closeModal}>{currentModal.linkText}</button>
												{/if}
											</div>
										</div>
									{/if}

									<!-- Mobile Sticky CTA -->
									<div class="mobile-cta">
										<button on:click={() => openModal('register')}>Забронировать место</button>
									</div>
