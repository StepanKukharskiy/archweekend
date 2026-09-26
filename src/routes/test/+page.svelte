<script>
	import photo from '$lib/images/photo.jpg';
	import logo from '$lib/images/logo_nobg.png';
    import viewsGIF from '$lib/images/views_4.gif';
	import aw1 from '$lib/images/aw1.webp';
	import { Canvas } from '@threlte/core';
	import Scene from '$lib/Scene.svelte';

	let popupState = false;
    let popupRecordState = false;
</script>

<main>
	{#if popupState}
		<div class="popupContainer">
			<button
				class="panelButton"
				on:click={() => {
					popupState = false;
				}}
			>
				<svg xmlns="http://www.w3.org/2000/svg" width="10" height="10" viewBox="0 0 19.02 19.02"
					><title>icon_quit</title><line
						x1="0.5"
						y1="0.5"
						x2="18.52"
						y2="18.52"
						style="fill:none;stroke: blue; stroke-linecap:round;stroke-linejoin:round; stroke-width: 3;"
					/><line
						x1="0.5"
						y1="18.52"
						x2="18.52"
						y2="0.5"
						style="fill:none;stroke: blue; stroke-linecap:round;stroke-linejoin:round; stroke-width: 3;"
					/></svg
				>
			</button>
			<h3>Запись закрыта</h3>
			<p>Приём оплаты за воркшоп завершён.</p>
			<button class="registerButton" on:click={() => { popupState = false; }}>OK</button>
		</div>
	{/if}

    {#if popupRecordState}
		<div class="popupContainer">
			<button
				class="panelButton"
				on:click={() => {
					popupRecordState = false;
				}}
			>
				<svg xmlns="http://www.w3.org/2000/svg" width="10" height="10" viewBox="0 0 19.02 19.02"
					><title>icon_quit</title><line
						x1="0.5"
						y1="0.5"
						x2="18.52"
						y2="18.52"
						style="fill:none;stroke: blue; stroke-linecap:round;stroke-linejoin:round; stroke-width: 3;"
					/><line
						x1="0.5"
						y1="18.52"
						x2="18.52"
						y2="0.5"
						style="fill:none;stroke: blue; stroke-linecap:round;stroke-linejoin:round; stroke-width: 3;"
					/></svg
				>
			</button>
			<h3>Запись закрыта</h3>
			<p>Приём оплаты за воркшоп завершён.</p>
			<button class="registerButton" on:click={() => { popupRecordState = false; }}>OK</button>
		</div>
	{/if}
	<h1>SA lab <span class="logo" style="background-image: url({logo});"></span> ARCH WEEKEND</h1>
	<div class="canvasContainer">
		<!-- <div style="width: 100%; height: 100%; position: absolute; z-index: 2;"></div>
		<Canvas>
			<Scene />
		</Canvas> -->
        <img src={viewsGIF} alt='views animation' style='margin-bottom: 20px; width: 100%; max-width: 800px;'/>
	</div>
	<!-- <div class="imageContainer"></div> -->

	<div class="running-text-container">
		<h3 class="running-text">Rhino + Grasshopper + Blender + HTML + CSS + JavaScript</h3>
	</div>

	<div class="gridContainer">
		<div class="gridSmallCard">
			<h3>7 сентября, 11:00-15:00 GMT+3</h3>
		</div>
		<div class="gridSmallCard">
			<h3>online + запись</h3>
		</div>
		<div class="gridSmallCard">
			<h3>4 часа</h3>
		</div>
		<div class="gridSmallCard">
			<h3>5500₽</h3>
		</div>
		<div class="gridBigCard" style="padding: 0;">
			<button
				class="registerButton"
				on:click={() => {
					popupState = true;
				}}>ХОЧУ С ВАМИ</button
			>
		</div>
	</div>

	<div class="gridContainer" style="border: none;">
		<div class="gridBigCard" style="border: none; padding-top: 10px;">
			<div class="gridCardContainer statement">
				<h3 style="align-self: start;">ARCH WEEKEND —</h3>
				<p>
					<span style="font-size: 1.8rem; font-weight: 500;"
						>Это смелый прыжок в мир алгоритмического проектирования для архитекторов и дизайнеров,
						который научит ориентироваться в технологиях в контексте стремительно развивающегося
						мира.</span
					>
					<br /><br />
					Архитекторы SA lab придумали ARCH WEEKEND, потому что знают, что учиться новому может быть
					<span style="text-decoration: line-through;">больно</span>
					весело. Мы предлагаем быстрое погружение в генеративный дизайн, цифровые миры, искусственный
					интеллект и геймдизайн.
					<br /><br />
					Более 10 лет мы используем в архитектурной практике цифровые технологии, а последние 5 лет
					учим студентов из 22 стран. Полученные навыки помогают шире взглянуть на архитектуру, выстроить
					собственный профессиональный трек в российских и зарубежных компаниях.
					<br /><br />
					Мы предлагаем посвятить выходные интенсивным занятиям, по результатам которых будет сделан
					небольшой итоговый проект.
				</p>
			</div>
		</div>
	</div>
	<div class="gridContainer">
		<div class="gridSmallCard">
			<div class="gridCardContainer">
				<h3>ARCHWEEKEND vol 2.0</h3>
			</div>
		</div>
		<div class="gridSmallCard">
			<div class="gridCardContainer">
				<p><b>В этот раз мы встретимся, чтобы:</b></p>
				<ul class="noDots">
					<li>👀 научиться работать с данными OSM,</li>
					<li>🐆 разработать алгоритм анализа видимости на плане участка и здания,</li>
					<li>🦄 разобраться с генеративными алгоритмами построения формы здания с учетом наилучшей видимости,</li>
					<li>
						⭐ добавить немного магии с HTML + CSS + JavaScript, чтобы создать интерактивную карту.
					</li>
				</ul>
			</div>
		</div>

		<div class="gridSmallCard" style="justify-content: start; align-items: center;">
			<div class="gridCardContainer">
				<h3>Часть 1</h3>
				<ul>
					<li>Основы моделирования в Grasshopper</li>
					<li>Использование плагина Elk 2 и работа с OSM данными</li>
					<li>Анализ видимости с помощью IsoVist</li>
                    <li>Работа с эволюционными алгоритмами и Galapagos</li>
				</ul>
			</div>
		</div>

		<div class="gridSmallCard" style="justify-content: start; align-items: center;">
			<div class="gridCardContainer">
				<h3>Часть 2</h3>
				<ul>
					<li>Основы работы с HTML, CSS, JavaScript</li>
					<li>Основы работы с библиотекой p5.js или paper.js</li>
					<li>Создание интерактивной карты, которая будет работать в браузере</li>
				</ul>
			</div>
		</div>
	</div>

	<!-- <video src="{demo}" autoplay={true} muted={true} preload="auto" loop={true} playsinline={true} style='width: 100%;'></video> -->

	<div class="gridContainer" style="border: none;">
		<div class="gridBigCard" style="border: none; padding-top: 10px;">
			<div class="gridCardContainer">
				<h3>Куратор :: Степан Кухарский</h3>
				<div class="curatorTextContainer">
					<img src={photo} alt="curator" />
					<p>
						Привет!
						<br /><br />Меня зовут Степан Кухарский. Я архитектор и вычислительный дизайнер, более
						10 лет использую алгоритмы в работе с городскими территориями, общественными
						пространствами, зданиями, разрабатываю игры и виртуальную архитектуру.
						<br />Я люблю делиться опытом и преподаю на международных площадках и конференциях:
						DigitalFUTURES, CDRF, eCAADe, LiveAcademy. На воркшопах я выстраиваю дружелюбную
						атмосферу, открытую для экспериментов и неожиданных решений.
						<br /><br />Присоединяйтесь к ARCHWEEKEND — проведём архитектурно выходные. 😎
					</p>
				</div>
			</div>
		</div>
	</div>

	<div class="gridContainer">
		<div class="gridSmallCard" style="justify-content: start; align-items: start;">
			<div class="gridCardContainer">
				<h3>Для кого</h3>
				<ul>
					<li>для новичков</li>
					<li>для тех, кто начал изучать Rhino</li>
					<li>для всех, кто хочет разобраться с основами работы в HTML, CSS, JavaScript.</li>
				</ul>
			</div>
		</div>

		<div class="gridSmallCard" style="justify-content: start; align-items: start;">
			<div class="gridCardContainer">
				<h3>Технические требования</h3>
				<ul>
					<li>наличие ноутбука или ПК с выходом в интернет</li>
					<li>установленные Rhino, Grasshopper, Elk 2</li>
					<li>
						регистрация на платформе <a href="https://kodiia.com" target="_blank">Kodiia.com</a>
					</li>
				</ul>
			</div>
		</div>

        <div class="gridBigCard" style="padding: 0;">
			<button
				class="registerButton"
				on:click={() => {
					popupState = true;
				}}>ХОЧУ С ВАМИ</button
			>
		</div>
	</div>

	<div class="gridContainer" style="border: none;">
		<div class="gridBigCard" style="border: none; padding-top: 10px;">
			<div class="gridCardContainer">
				<h3>Прошедшие интенсивы</h3>
			</div>
		</div>
	</div>
	<div class="gridContainer" style="border: none;">

			<div class="gridCardContainer" style='width: 100%; position: static;'>
					<!-- <Canvas>
						<Scene />
					</Canvas> -->
					<img src={aw1} alt='archweekend 1' style='width: 100%;' />
			</div>


		<div class="gridCardContainer">
			<p><b>ARCH WEEKEND vol 1.0</b></p>
			<p>В первый раз мы встретились, чтобы:</p>
			<ul class="noDots">
				<li>👀 рассмотреть принципы формообразования воксельной архитектуры,</li>
				<li>🐆 создать модель с использованием Rhino+Grasshopper,</li>
				<li>🦄 создать на ее основе ассет в Blender для использования в браузере,</li>
				<li>
					⭐ добавить немного магии с HTML + CSS + JavaScript, чтобы создать интерактивную сцену.
				</li>
		</div>

        <div class="gridBigCard" style="padding: 0;">
			<button
				class="registerButton"
                style='border: 1px solid black; border-bottom: none;'
				on:click={() => {
					popupRecordState = true;
				}}>СМОТРЕТЬ В ЗАПИСИ</button
			>
		</div>

	</div>

	<div class="gridContainer">
		

		<div class="gridBigCard">
			<div class="gridCardContainer">
				<h3>Мы на связи:</h3>
			</div>
		</div>

		<div class="gridSmallCard">
			<a href="mailto:hello@salab.org">hello@salab.org</a>
		</div>
		<div class="gridSmallCard">
			<a href="https://t.me/SAlab_daily" target="_blank">@salab.daily</a>
		</div>
	</div>
</main>
<footer>
	<div class="footerContainer">
		<a href="requisites">реквизиты</a>
		<a href="/privacy-policy">политика конфиденциальности</a>
		<a href="/oferta">публичная оферта</a>
	</div>
	<p style="text-align: center;">© 2024 SA lab</p>
</footer>

<style>
	.popupContainer {
		width: min(400px, calc(100% - 10px));
		/* max-width: 800px; */
		padding: 10px;
		box-sizing: border-box;
		margin: auto;
		border: 2px solid blue;
		position: sticky;
		top: 10px;
		background: #f9f9f9;
		z-index: 10;
	}
	.popupContainer button {
		border: none;
		background: none;
		cursor: pointer;
		position: absolute;
		right: 10px;
	}
	main {
		padding: 0 10px;
		width: 100%;
		max-width: 1800px;
		font-weight: 300;
		box-sizing: border-box;
	}
	h1 {
		/* background-color: #f9f9f9; */
		margin: 0;
		padding: 20px 0;
		display: flex;
		justify-content: center;
		align-items: center;
		text-align: center;
	}
	.logo {
		display: block;
		width: 80px;
		height: 80px;
		background-size: 100px 100px;
		background-position: center;
	}
	.logo:hover {
		transform: rotateZ(360deg);
		transition: all 1s;
	}
	h3 {
		/* font-size: 42px; */
		font-weight: 500;
	}
	a {
		color: blue;
	}
	ul {
		max-width: 90%;
	}

	.canvasContainer {
		width: 100%;
		height: 100%;
		box-sizing: border-box;
		/* cursor: pointer; */
		/* background: radial-gradient(circle, white, blue); */
        display: flex;
        justify-content: center;
        align-items: center;
		filter: brightness(1.025) contrast(1.25);
	}
	.running-text-container {
		border: 1.5px solid #1a1a1a;
		border-bottom: none;
		box-sizing: border-box;
		white-space: nowrap;
		text-transform: uppercase;
		overflow: hidden;
		text-overflow: ellipsis;
		color: blue;
		/* background-color: #f9f9f9; */
		/* font-size: 30px; */
	}

	.running-text {
		margin: 5px 0;
		/* animation properties */
		-moz-transform: translateX(100%);
		-webkit-transform: translateX(100%);
		transform: translateX(100%);

		-moz-animation: my-animation 15s linear infinite;
		-webkit-animation: my-animation 15s linear infinite;
		animation: my-animation 15s linear infinite;
	}
	.statement {
		max-width: 800px;
		font-size: 1.8rem;
		margin: auto;
	}
	.statement p {
		font-size: 1.5rem;
		columns: 1;
	}

	.gridContainer {
		width: 100%;
		display: grid;
		grid-template-columns: 1fr 1fr;
		border: 1px solid #1a1a1a;
		box-sizing: border-box;

		/* color: blue; */
	}
	.gridCardContainer {
		padding: 10px;
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: center;
	}
	.gridSmallCard {
		min-height: 80px;
		/* padding: 10px; */
		border: 1px solid #1a1a1a;
		/* box-shadow: 0 0 2px #1a1a1a; */
		/* background-color: #f9f9f9; */
		box-sizing: border-box;
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: center;
	}
	.gridSmallCard h3 {
		text-align: center;
	}
	.gridBigCard {
		border: 1px solid #1a1a1a;
		grid-column: span 2;
		/* background-color: #f9f9f9; */
		box-sizing: border-box;
		display: flex;
		flex-direction: column;
	}
	.gridContainer h3 {
		margin: 0;
		font-weight: 500;
		color: blue;
	}
	.noDots li::marker {
		content: '';
	}
	.curatorTextContainer {
		max-width: 800px;
		margin: auto;
		margin-top: 20px;
		display: grid;
		grid-template-columns: 1fr 1fr;
		gap: 10px;
		padding: 10px;
		box-sizing: border-box;
	}
	.curatorTextContainer img {
		width: 80%;
		max-width: 300px;
	}
	.curatorTextContainer p {
		margin: 0;
	}
	.registerButton {
		/* width: 100%; */
		height: 100%;
		min-height: 80px;
		margin: 0;
		border: none;
		text-transform: uppercase;
		font-family: 'Montserrat', sans-serif;
		/* font-size: 20px; */
		font-weight: 500;
		font-size: 1.3rem;
		background: #0000ff10;
		color: blue;
		cursor: pointer;
		transition: all 0.25s;
		padding: 10px;
		text-decoration: underline;
		display: flex;
		justify-content: center;
		align-items: center;
	}
	.registerButton:hover {
		background-color: blue;
		color: #f9f9f9;
	}

	footer {
		/* border: 0.5px solid blue; */
		/* width: calc(100% - 19px); */
		width: 100%;
		/* max-width: 800px; */
		padding: 0 10px;
		box-sizing: border-box;
		font-size: 1rem;
		color: #919191;
		font-weight: 300;
	}
	footer a {
		color: #919191;
		text-decoration: none;
		margin: 10px 0;
	}
	.footerContainer {
		/* border: 0.5px solid blue; */
		/* background: #f9f9f9; */
		padding: 10px;
		box-sizing: border-box;

		display: grid;
		grid-template-columns: 1fr 1fr 1fr;
		text-align: center;
	}

	/* for Firefox */
	@-moz-keyframes my-animation {
		from {
			-moz-transform: translateX(100%);
		}
		to {
			-moz-transform: translateX(-100%);
		}
	}

	/* for Chrome */
	@-webkit-keyframes my-animation {
		from {
			-webkit-transform: translateX(100%);
		}
		to {
			-webkit-transform: translateX(-100%);
		}
	}

	@keyframes my-animation {
		from {
			-moz-transform: translateX(100%);
			-webkit-transform: translateX(100%);
			transform: translateX(100%);
		}
		to {
			-moz-transform: translateX(-100%);
			-webkit-transform: translateX(-100%);
			transform: translateX(-100%);
		}
	}

	@media screen and (max-width: 700px) {
		h1 {
			flex-direction: column;
			text-align: center;
		}
		.gridContainer {
			display: grid;
			grid-template-columns: 1fr;
		}
		.gridBigCard {
			grid-column: span 1;
			padding: 10px;
		}
		.footerContainer {
			display: grid;
			grid-template-columns: 1fr;
		}
		.curatorTextContainer {
			display: grid;
			grid-template-columns: 1fr;
		}
		.curatorTextContainer img {
			margin: auto;
			margin-bottom: 20px;
		}
		.statement {
			font-size: 1.5rem;
		}
		.statement p {
			columns: 1;
		}
	}
</style>
