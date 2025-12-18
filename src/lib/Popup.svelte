<div class="container">
	<button
		class="panelButton"
		on:click={() => {
			isShared = false;
		}}
	>
		<svg xmlns="http://www.w3.org/2000/svg" width="10" height="10" viewBox="0 0 19.02 19.02"
			><title>icon_quit</title><line
				x1="0.5"
				y1="0.5"
				x2="18.52"
				y2="18.52"
				style="fill:none;stroke: white; stroke-linecap:round;stroke-linejoin:round; stroke-width: 3;"
			/><line
				x1="0.5"
				y1="18.52"
				x2="18.52"
				y2="0.5"
				style="fill:none;stroke: white; stroke-linecap:round;stroke-linejoin:round; stroke-width: 3;"
			/></svg
		>
	</button>

	<!-- <a class="registerButton" href="https://auth.robokassa.ru/merchant/Invoice/R2sosFTl_kmBN57ebLesEA"
		>Перейти к оплате</a
	> -->

	<p>Запись на Arch Weekend vol 1.0 завершена.</p>
	<a class="registerButton" href="/"
		>Ok</a
	>
    
	<p>
		Нажимая на кнопку «Записаться», вы соглашаетесь с <a href="/policy"
			>политикой обработки персональных данных</a
		>.
	</p>
</div>

<style>
	.container {
		width: min(400px, calc(100% - 10px));
		padding: 10px;
		box-sizing: border-box;
		margin: auto;
	}
</style>
