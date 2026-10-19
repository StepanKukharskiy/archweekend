<script>
	export let locale = 'ru';
	const englishDays = [
		{
			date: 'Day 1 · 7 November 2026',
			title: 'How do you organise work with AI agents?',
			items: [
				[
					'What are AI agents and how do they work?',
					'Explore how an agent understands a task, uses tools and checks results.'
				],
				[
					'What is Codex and how can you use it in design?',
					'Learn to work within a project folder: analysing documents and images and creating project materials.'
				],
				[
					'What is an API and how can you connect AI models to Codex?',
					'Understand how APIs work and follow a prepared example of connecting Codex to external models.'
				],
				[
					'How do you give an agent tasks and guide its actions?',
					'Learn to define goals, constraints and success criteria, give feedback and guide revisions.'
				],
				[
					'Why do you need AGENTS.md?',
					'Define the rules for working on a project: what to save, what to check and how to record decisions.'
				],
				[
					'How do you turn a folder of materials into a knowledge base?',
					'Build a connected wiki from the brief, photographs and drawings, separate facts from assumptions and define design tasks.'
				]
			]
		},
		{
			date: 'Day 2 · 8 November 2026',
			title: 'How do you move from a brief to a design proposal?',
			items: [
				[
					'How do you develop a concept with an agent?',
					'Follow a real project, explore alternatives and choose a direction based on the brief.'
				],
				[
					'How do you test an idea in a Rhino 3D model and check it against the programme?',
					'Build a 3D model in Rhino with an agent, check volumes and spatial relationships, and compare the concept with the room schedule, floor areas and site constraints.'
				],
				[
					'How do you guide image generation in Nano Banana 2 and GPT Image 2.5?',
					'Define the role of each reference and learn to change individual aspects of the project while preserving the core idea.'
				],
				[
					'How do you create visualisations, video and 3D with Weavy?',
					'Explore the Weavy workflow and the transition from a still image to a video presentation. Get an introduction to generating 3D models with Hunyuan and Tripo.'
				],
				[
					'How do you find errors and coordinate different views of a project?',
					'Compare plans, sections and visualisations, identify inconsistencies and define targeted corrections.'
				],
				[
					'How do you put together a compelling design proposal?',
					'Bring the concept, diagrams and images into a coherent narrative, recording decisions and open questions in the wiki.'
				]
			]
		}
	];
</script>

{#if locale === 'en'}
	<div class="days">
		{#each englishDays as day}
			<article>
				<p class="day">{day.date}</p>
				<h3>{day.title}</h3>
				<ol>
					{#each day.items as [title, description]}
						<li>
							<strong>{title}</strong>
							<p>{description}</p>
						</li>
					{/each}
				</ol>
			</article>
		{/each}
	</div>
{:else}
	<div class="days">
		<article>
			<p class="day">День 1 · 26 сентября</p>
			<h3>Как организовать работу с ИИ-агентами?</h3>
			<ol>
				<li>
					<strong>Что такое ИИ-агенты и как они работают?</strong>
					<p>Разберём, как агент понимает задачу, использует инструменты и проверяет результаты.</p>
				</li>
				<li>
					<strong>Что такое Codex и как применять его в проектировании?</strong>
					<p>
						Познакомимся с работой в проектной папке: анализом документов, изображений и созданием
						материалов.
					</p>
				</li>
				<li>
					<strong>Что такое API и как подключать к Codex разные нейросети?</strong>
					<p>
						Разберём принцип работы API и на подготовленном примере покажем настройку обращения к
						внешним моделям из Codex.
					</p>
				</li>
				<li>
					<strong>Как ставить задачи агенту и управлять его действиями?</strong>
					<p>
						Научимся задавать цели, ограничения и критерии результата, давать обратную связь и
						корректировать работу.
					</p>
				</li>
				<li>
					<strong>Зачем нужен AGENTS.md?</strong>
					<p>
						Сформулируем правила работы с проектом: что сохранять, что проверять и как фиксировать
						решения.
					</p>
				</li>
				<li>
					<strong>Как превратить папку с материалами в базу знаний?</strong>
					<p>
						Соберём связанную wiki из брифа, фотографий и чертежей, отделим факты от предположений и
						сформулируем проектные задачи.
					</p>
				</li>
			</ol>
		</article>
		<article>
			<p class="day">День 2 · 27 сентября</p>
			<h3>Как перейти от брифа к проектному предложению?</h3>
			<ol>
				<li>
					<strong>Как разработать концепцию вместе с агентом?</strong>
					<p>
						Проследим развитие реального проекта, предложим варианты и выберем направление по
						требованиям брифа.
					</p>
				</li>
				<li>
					<strong>Как проверить идею в 3D-модели Rhino и сопоставить её с программой?</strong>
					<p>
						Построим 3D-модель в Rhino с помощью агента, проверим объёмы и пространственные связи.
						Сопоставим концепцию с составом помещений, площадями и ограничениями участка.
					</p>
				</li>
				<li>
					<strong>Как управлять генерацией изображений в Nano Banana 2 и GPT Image 2.5?</strong>
					<p>
						Определим роль каждого референса и научимся менять отдельные свойства проекта, сохраняя
						основную идею.
					</p>
				</li>
				<li>
					<strong>Как создавать визуализации, видео и 3D с помощью Weavy?</strong>
					<p>
						Познакомимся с процессом работы в Weavy и разберём переход от статичного изображения к
						видеопрезентации проекта. Познакомимся с генерацией 3D-моделей с помощью Hunyan и Tripo.
					</p>
				</li>
				<li>
					<strong>Как находить ошибки и согласовывать разные изображения проекта?</strong>
					<p>
						Сравним планы, разрезы и визуализации, выявим противоречия и сформулируем точечные
						исправления.
					</p>
				</li>
				<li>
					<strong>Как собрать убедительное проектное предложение?</strong>
					<p>
						Объединим концепцию, схемы и изображения в последовательный рассказ, сохранив решения и
						открытые вопросы в wiki.
					</p>
				</li>
			</ol>
		</article>
	</div>
{/if}

<style>
	.days {
		display: grid;
		grid-template-columns: repeat(2, minmax(0, 1fr));
		gap: 24px;
	}
	article {
		padding: 32px;
		border: 1px solid #0000eb25;
		border-radius: 20px;
		background: #fff9;
	}
	.day {
		color: #0000eb;
		font-size: 1rem;
		margin: 0 0 16px;
	}
	h3 {
		font-size: 1.5rem;
		line-height: 1.35;
		color: #0000eb;
		margin: 0 0 24px;
	}
	ol {
		margin: 0;
		padding-left: 24px;
	}
	li {
		padding: 18px 0 18px 8px;
		border-top: 1px solid #0000eb18;
	}
	li::marker {
		color: #0000eb;
		font-weight: 600;
	}
	strong {
		font-size: 1.15rem;
		line-height: 1.5;
	}
	li p {
		margin: 8px 0 0;
		font-size: 1.1rem;
		line-height: 1.65;
	}
	@media (max-width: 800px) {
		.days {
			grid-template-columns: minmax(0, 1fr);
		}
	}
	@media (max-width: 480px) {
		article {
			padding: 24px 20px;
		}
		h3 {
			font-size: 1.3rem;
		}
	}
</style>
