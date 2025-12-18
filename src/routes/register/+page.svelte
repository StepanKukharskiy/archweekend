<script>
	import { slide } from 'svelte/transition';
	// import {secondaryColor, textColor, primaryColor } from '$lib/store'
	let password = '',
		confirmPassword = '';
	let emailField = '',
		emailValue = '',
		nameField = '';
	let submitButtonIsHovered = false;
</script>

<div class="container">
	<h2>Спасибо!</h2>
	<p>Мы обязательно свяжемся с Вами по указанной при оплате почте в течение 24 часов.</p>
	
	<!-- <p>
		Нажимая на кнопку «Записаться», вы соглашаетесь с <a href="/policy"
			>политикой обработки персональных данных</a
		>.
	</p> -->
</div>

<style>
	.container {
		width: min(400px, calc(100% - 10px));
		padding: 10px;
		box-sizing: border-box;
		margin: auto;
	}
	/* .formFieldContainer {
		display: flex;
		flex-direction: column;
		margin: 10px 0;
	} */
	h2 {
		margin: 0;
        margin-bottom: 50px;
		font-weight: 300;
	}
	/* .submitButton {
		background: #4233fb;
		color: #f9f9f9;
		margin-top: 10px;
		transform: scale(1);
		width: 100%;
		border: none;
		border-radius: 0px;
		padding: 10px;
		font-size: 1.5rem;
		font-weight: 300;
		cursor: pointer;
	}
	.submitButton:disabled {
		background: rgb(150, 150, 150);
		border: none;
		cursor: default;
		transform: scale(1);
		width: fit-content;
		border: none;
	}
	label {
		margin-bottom: 5px;
	}
	input {
		font-family:
			Source Code Pro,
			sans-serif;
		font-size: 1rem;
	}
	.formInput {
		padding: 10px;
		border-radius: 0px;
		border: 1px solid #1a1a1a20;
	}
	a {
		color: #0000ff;
	} */
</style>
