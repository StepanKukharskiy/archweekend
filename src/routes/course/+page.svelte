<script>
    // Removed lang="ts" and type annotations to fix the syntax error
	import logo from '$lib/images/logo_nobg.png'; 
    import { goto, invalidateAll } from '$app/navigation';

    export let data = {}; 

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

	// Video Data
	const videos = [
		{
			id: 1,
			title: 'Занятие 1: История трансформеров',
			description: 'Погружение в архитектуру LLM и почему AI стал актуален сейчас.',
            url: 'https://player.mux.com/02MrQKlt6ZVUfm5tB7OeHT9vq9qFUNuHl4Gd83A9nuOM?metadata-video-title=1&video-title=1&accent-color=%230000ff'
		},
		{
			id: 2,
			title: 'Занятие 2: Выбор инструмента',
			description: 'ChatGPT vs Perplexity. Как анализировать ТЗ и нормативы.',
            url: 'https://player.mux.com/U00YpiJjEkjoF8cClUBRvAD3BblIP58TaV4B13Rpycac?metadata-video-title=2&video-title=2&accent-color=%230000ff'
		},
		{
			id: 3,
			title: 'Занятие 3: Генерация изображений',
			description: 'ControlNet, Stable Diffusion. Управляемая генерация.',
            url: 'https://player.mux.com/NP6eheOmkJmohqq4pMrofr5Lhaj8Atv01vTNjriSa66w?metadata-video-title=3&video-title=3&accent-color=%230000ff'
		},
		{
			id: 4,
			title: 'Занятие 4: Fine-tuning',
			description: 'Тренируем свою нейронку под архитектурные задачи.',
            url: 'https://player.mux.com/r7UNFA95REKx02IcpEHk8HGuuoPViW02fPaGIp6a8mPwU?metadata-video-title=4&video-title=4&accent-color=%230000ff'
		}
	];
</script>

<svelte:head>
	<title>Видеолекции | SA lab</title>
</svelte:head>

<!-- Sticky Navigation -->
<div class="sticky-nav visible">
    <nav>
        <div style="display: flex; gap: 20px; align-items: center;">
            <a href="/" style="display:flex; align-items:center; gap:10px;">
                <img src={logo} alt="Logo" style="width:64px; height:64px;">
            </a>
            
            <div class="nav-links">
                <nav>
                    <div style="display: flex; gap: 20px; flex-wrap: wrap;">
                        <a href="/">О курсе</a>
                    </div>
                    
                </nav>
            </div>
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
        <!-- <a href="#register" class="nav-cta">Присоединиться</a> -->
            </div>
    </nav>
</div>

<main class="container">
    <section class="page-header">
        <h1 class="section-title">Видеолекции курса</h1>
        <p class="section-subtitle">Доступ к материалам и записям занятий</p>
    </section>

    <div class="video-grid">
        {#each videos as video}
            <div class="video-card glass">
                <div class="video-wrapper">
                    <iframe
                        src={video.url}
                        title={video.title}
                        allow="accelerometer; gyroscope; autoplay; encrypted-media; picture-in-picture;"
                        allowfullscreen
                    ></iframe>
                </div>
                <div class="card-content">
                    <h3>{video.title}</h3>
                    <p>{video.description}</p>
                </div>
            </div>
        {/each}
    </div>
</main>

<footer>
    <p class="footer-copy">© 2025 SA lab</p>
</footer>

<style>
    :global(body) {
        --color-bg: #f9f9f9;
        --color-glass: rgba(255, 255, 255, 0.08);
        --color-glass-border: rgba(255, 255, 255, 0.12);
        --color-text: #1a1a1a;
        --color-text-secondary: #1a1a1a;
        --color-blue-500: #0000eb;
        --color-blue-600: #0000cc;
        --color-blue-glow: rgba(0, 0, 255, 0.2);
        --font-sans: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
        --transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        
        background: var(--color-bg);
        color: var(--color-text);
        font-family: var(--font-sans);
        margin: 0;
    }

    /* Sticky Navigation */
    .sticky-nav {
        position: sticky;
        top: 0;
        left: 0;
        right: 0;
        background: rgba(255, 255, 255, 0.85);
        backdrop-filter: blur(24px);
        -webkit-backdrop-filter: blur(24px);
        border-bottom: 1px solid var(--color-glass-border);
        z-index: 100;
        padding: 0 20px;
        box-shadow: 0 4px 24px rgba(0, 0, 0, 0.05);
        width: calc(100% - 40px);
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

    .sticky-nav a:hover, .sticky-nav a.active {
        color: var(--color-blue-500);
    }

    .sticky-nav .nav-links {
        display: flex; 
        gap: 20px; 
        flex-wrap: wrap;
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

    /* Glass Utility */
    .glass {
        background: var(--color-glass);
        backdrop-filter: blur(20px);
        -webkit-backdrop-filter: blur(20px);
        border: 1px solid rgba(0,0,0,0.08);
    }

    /* Layout */
    .container {
        max-width: 1200px;
        margin: 0 auto;
        padding: 60px 20px;
        min-height: 80vh;
    }

    .page-header {
        text-align: center;
        margin-bottom: 60px;
    }

    .section-title {
        font-size: clamp(1.8rem, 4vw, 3rem);
        font-weight: 700;
        line-height: 1.2;
        margin-bottom: 16px;
        color: var(--color-blue-500);
    }

    .section-subtitle {
        font-size: 1.2rem;
        color: #555;
    }

    /* Video Grid */
    .video-grid {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(500px, 1fr));
        gap: 40px;
    }

    .video-card {
        border-radius: 20px;
        overflow: hidden;
        background: white;
        box-shadow: 0 10px 30px rgba(0,0,0,0.05);
        transition: var(--transition);
    }

    .video-card:hover {
        transform: translateY(-5px);
        box-shadow: 0 20px 40px rgba(0,0,235,0.1);
        border-color: var(--color-blue-500);
    }

    .video-wrapper {
        width: 100%;
        aspect-ratio: 16/9;
        background: #000;
    }

    .video-wrapper iframe {
        width: 100%;
        height: 100%;
        border: none;
    }

    .card-content {
        padding: 24px 32px;
    }

    .card-content h3 {
        font-size: 1.4rem;
        font-weight: 600;
        margin-bottom: 12px;
        color: var(--color-blue-500);
    }

    .card-content p {
        color: #555;
        font-size: 1rem;
        line-height: 1.5;
    }

    /* Footer */
    footer {
        margin-top: 80px;
        padding: 40px;
        text-align: center;
        border-top: 1px solid var(--color-glass-border);
        color: #888;
    }

    @media (max-width: 768px) {
        .video-grid { grid-template-columns: 1fr; }
        .sticky-nav { padding: 0 16px; }
        .section-title { font-size: 2rem; }
    }
</style>
