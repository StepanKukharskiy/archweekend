<script>
	import { onDestroy, onMount, tick } from 'svelte';
	import { projectGallery as images } from './projectGallery';

	/** @type {HTMLDialogElement} */
	let dialog;
	let selected = 0;
	let isOpen = false;
	let paused = false;
	let previousOverflow = '';
	/** @type {HTMLElement | null} */
	let opener = null;
	/** @type {HTMLDivElement} */
	let viewport;
	let hovered = false;
	let cycleWidth = 0;

	// Keep native scrolling in the middle copy. Moving by a whole copy is invisible.
	function wrapScroll() {
		if (!cycleWidth) return;
		const offset = viewport.scrollLeft;
		if (offset < cycleWidth || offset >= cycleWidth * 2) {
			viewport.scrollLeft = cycleWidth + (((offset % cycleWidth) + cycleWidth) % cycleWidth);
		}
	}

	onMount(() => {
		const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
		let frame = 0;
		let lastTime = 0;
		let remainder = 0;
		const measure = () => {
			const previousWidth = cycleWidth;
			const phase = previousWidth ? (viewport.scrollLeft % previousWidth) / previousWidth : 0;
			cycleWidth = viewport.querySelector('.image-set')?.getBoundingClientRect().width || 0;
			viewport.scrollLeft = cycleWidth * (1 + phase);
		};
		const observer = new ResizeObserver(measure);
		observer.observe(viewport);
		measure();

		/** @param {number} time */
		function advance(time) {
			const elapsed = lastTime ? Math.min(time - lastTime, 64) : 0;
			lastTime = time;
			if (
				!paused &&
				!isOpen &&
				!hovered &&
				!reducedMotion.matches &&
				!viewport.matches(':focus-within')
			) {
				// Retain subpixel travel because native scrollLeft may round to whole pixels.
				remainder += elapsed * 0.034;
				const distance = Math.floor(remainder);
				if (distance) {
					viewport.scrollLeft += distance;
					remainder -= distance;
					wrapScroll();
				}
			}
			frame = requestAnimationFrame(advance);
		}
		frame = requestAnimationFrame(advance);
		return () => {
			cancelAnimationFrame(frame);
			observer.disconnect();
		};
	});

	/** @param {number} index @param {MouseEvent} event */
	async function openImage(index, event) {
		selected = index;
		opener = /** @type {HTMLElement} */ (event.currentTarget);
		previousOverflow = document.body.style.overflow;
		document.body.style.overflow = 'hidden';
		isOpen = true;
		await tick();
		dialog.showModal();
		const closeButton = /** @type {HTMLButtonElement | null} */ (dialog.querySelector('.close'));
		closeButton?.focus();
	}

	function restorePage() {
		if (!isOpen) return;
		isOpen = false;
		document.body.style.overflow = previousOverflow;
		opener?.focus({ preventScroll: true });
	}

	function closeImage() {
		dialog.close();
		restorePage();
	}

	/** @param {number} direction */
	function navigate(direction) {
		selected = (selected + direction + images.length) % images.length;
	}

	/** @param {KeyboardEvent} event */
	function handleKeydown(event) {
		if (!isOpen) return;
		if (event.key === 'ArrowRight' || event.key === 'ArrowLeft') {
			event.preventDefault();
			navigate(event.key === 'ArrowRight' ? 1 : -1);
		}
	}

	onDestroy(() => {
		if (isOpen) document.body.style.overflow = previousOverflow;
	});
</script>

<svelte:window on:keydown={handleKeydown} />

<div class="gallery" role="region" aria-label="Изображения проекта Linha do Horizonte">
	<div class="gallery-tools">
		<p>{images.length} изображений проекта · Нажмите, чтобы рассмотреть</p>
		<button class="pause" on:click={() => (paused = !paused)} aria-pressed={paused}>
			{paused ? 'Продолжить прокрутку' : 'Остановить прокрутку'}
		</button>
	</div>
	<div
		bind:this={viewport}
		class="viewport"
		on:touchstart={() => (paused = true)}
		on:pointerenter={(event) => (hovered = event.pointerType === 'mouse')}
		on:pointerleave={() => (hovered = false)}
		on:scroll={wrapScroll}
	>
		<div class="track">
			{#each [true, false, true] as duplicate}
				<div class="image-set" aria-hidden={duplicate ? 'true' : undefined}>
					{#each images as image, index}
						<button
							class="image-card"
							style:--image-ratio={image.width / image.height}
							tabindex={duplicate ? -1 : 0}
							aria-label={`Увеличить: ${image.alt}`}
							on:click={(event) => openImage(index, event)}
						>
							<img
								src={image.thumbnail}
								srcset={`${image.thumbnail} 1x, ${image.src} 2x`}
								alt={image.alt}
								width={image.width}
								height={image.height}
								loading="eager"
								decoding="async"
							/>
						</button>
					{/each}
				</div>
			{/each}
		</div>
	</div>
</div>

<dialog
	bind:this={dialog}
	class="lightbox"
	aria-label="Просмотр изображений проекта"
	on:close={restorePage}
>
	{#if isOpen}
		<button class="backdrop" aria-label="Закрыть просмотр" tabindex="-1" on:click={closeImage}
		></button>
		<div class="lightbox-content">
			<div class="lightbox-toolbar">
				<span>Linha do Horizonte</span>
				<button class="close" aria-label="Закрыть" on:click={closeImage}>✕</button>
			</div>
			<img
				class="enlarged"
				src={images[selected].src}
				alt={images[selected].alt}
				width={images[selected].width}
				height={images[selected].height}
			/>
			<div class="lightbox-footer">
				<button aria-label="Предыдущее изображение" on:click={() => navigate(-1)}>←</button>
				<p aria-live="polite">{selected + 1} / {images.length}</p>
				<button aria-label="Следующее изображение" on:click={() => navigate(1)}>→</button>
			</div>
		</div>
	{/if}
</dialog>

<style>
	button {
		font: inherit;
		cursor: pointer;
	}
	button:focus-visible {
		outline: 3px solid #0000eb;
		outline-offset: 4px;
	}
	.gallery {
		--image-height: 420px;
		margin-top: 40px;
	}
	.gallery-tools {
		display: flex;
		justify-content: space-between;
		align-items: center;
		gap: 16px;
		margin-bottom: 20px;
	}
	.gallery-tools p {
		margin: 0;
		font-size: 0.9rem;
	}
	.pause {
		flex-shrink: 0;
		border: 1px solid #0000eb;
		color: #0000eb;
		border-radius: 24px;
		padding: 9px 16px;
		background: transparent;
		font-size: 0.85rem;
	}
	.viewport {
		overflow-x: auto;
		scrollbar-width: none;
		overflow-anchor: none;
		scroll-behavior: auto;
		padding: 8px 0 16px;
	}
	.viewport::-webkit-scrollbar {
		display: none;
	}
	.track,
	.image-set {
		display: flex;
		width: max-content;
	}
	.image-set {
		flex: 0 0 auto;
		gap: 16px;
		padding-right: 16px;
	}
	.image-card {
		display: block;
		flex: 0 0 auto;
		width: calc(var(--image-height) * var(--image-ratio));
		padding: 0;
		border: 0;
		color: #1a1a1a;
		background: transparent;
		text-align: left;
	}
	.image-card img {
		display: block;
		width: 100%;
		height: var(--image-height);
		object-fit: contain;
		background: #eeece6;
		border-radius: 12px;
	}
	.lightbox {
		position: fixed;
		inset: 0;
		box-sizing: border-box;
		width: 100%;
		height: 100%;
		max-width: none;
		max-height: none;
		margin: 0;
		padding: 24px;
		border: 0;
		background: transparent;
		color: white;
	}
	.lightbox[open] {
		display: flex;
		align-items: center;
		justify-content: center;
	}
	.lightbox::backdrop {
		background: rgba(12, 15, 17, 0.94);
	}
	.backdrop {
		position: absolute;
		inset: 0;
		width: 100%;
		height: 100%;
		border: 0;
		background: transparent;
	}
	.lightbox-content {
		position: relative;
		width: min(1200px, 100%);
		pointer-events: none;
	}
	.lightbox-toolbar,
	.lightbox-footer {
		display: flex;
		align-items: center;
		justify-content: space-between;
		gap: 16px;
	}
	.lightbox-toolbar {
		margin-bottom: 12px;
	}
	.lightbox button:not(.backdrop) {
		flex-shrink: 0;
		width: 44px;
		height: 44px;
		border: 1px solid #ffffff60;
		border-radius: 50%;
		background: #ffffff12;
		color: white;
		pointer-events: auto;
		font-size: 22px;
	}
	.lightbox button:focus-visible {
		outline-color: white;
	}
	.enlarged {
		pointer-events: auto;
		display: block;
		width: 100%;
		height: min(72dvh, 900px);
		object-fit: contain;
	}
	.lightbox-footer {
		margin-top: 16px;
	}
	.lightbox-footer p {
		margin: 0;
		text-align: center;
		font-size: 0.95rem;
	}
	@media (max-width: 600px) {
		.gallery {
			--image-height: 70vw;
		}
		.gallery-tools {
			align-items: flex-start;
			flex-direction: column;
		}
		.lightbox {
			padding: 12px;
		}
		.lightbox-footer p {
			font-size: 0.8rem;
		}
	}
	@media (prefers-reduced-motion: reduce) {
		.pause {
			display: none;
		}
	}
</style>
