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

const workshopVideos = [
	{
		id: 'workshop-day-1',
		title: 'День 1 · 26 сентября',
		description:
			'Как организовать работу с ИИ-агентами? Первый день посвящён работе в Codex: от постановки задачи и подключения инструментов до создания базы знаний для архитектурного проекта Linha do Horizonte.',
		topics: [
			{
				title: 'ИИ-агенты: устройство и принцип работы',
				description:
					'Как агент понимает задачу, выбирает и использует инструменты, выполняет действия и проверяет полученный результат.'
			},
			{
				title: 'Codex в архитектурном проектировании',
				description:
					'Работа с проектной папкой: анализ документов и изображений, подготовка материалов и организация процесса взаимодействия с агентом.'
			},
			{
				title: 'API и подключение внешних нейросетей',
				description:
					'Принцип работы API и пример настройки обращения к внешним моделям из Codex, чтобы объединять разные инструменты в одном процессе.'
			},
			{
				title: 'Постановка задач и управление агентом',
				description:
					'Как задавать цели, ограничения и критерии результата, давать обратную связь, контролировать действия агента и корректировать его работу.'
			},
			{
				title: 'Правила проекта в AGENTS.md',
				description:
					'Как сформулировать инструкции для агента: какие материалы сохранять, что проверять и как фиксировать принятые проектные решения.'
			},
			{
				title: 'База знаний и проектная wiki',
				description:
					'Как собрать связанную wiki из брифа, фотографий и чертежей, отделить факты от предположений и на этой основе сформулировать проектные задачи.'
			}
		],
		url: 'https://player.mux.com/yhBL4kNmT59YMeINGemruJ02iVh9CctblQLMU2HyvgFQ',
		aspectRatio: '895 / 478'
	},
	{
		id: 'workshop-day-2',
		title: 'День 2 · 27 сентября',
		description:
			'Как перейти от брифа к проектному предложению? Второй день продолжает работу над Linha do Horizonte: развитие концепции, проверка в Rhino, генерация изображений и видео, согласование материалов и сборка подачи.',
		topics: [
			{
				title: 'Разработка концепции вместе с агентом',
				description:
					'Развитие реального проекта: поиск вариантов, сравнение архитектурных решений и выбор направления по требованиям брифа.'
			},
			{
				title: '3D-модель в Rhino и проверка программы',
				description:
					'Построение модели с помощью агента, проверка объёмов и пространственных связей. Сопоставление концепции с составом помещений, площадями и ограничениями участка.'
			},
			{
				title: 'Изображения в Nano Banana 2 и GPT Image 2.5',
				description:
					'Как определять роль каждого референса и управлять генерацией: менять отдельные свойства проекта, сохраняя основную архитектурную идею.'
			},
			{
				title: 'Визуализации, видео и 3D в Weavy',
				description:
					'Процесс работы в Weavy и переход от статичного изображения к видеопрезентации проекта. Знакомство с генерацией 3D-моделей с помощью Hunyuan и Tripo.'
			},
			{
				title: 'Поиск ошибок и согласование изображений',
				description:
					'Сравнение планов, разрезов и визуализаций, выявление противоречий между материалами и постановка задач на точечные исправления.'
			},
			{
				title: 'Сборка проектного предложения',
				description:
					'Как объединить концепцию, схемы и изображения в последовательный рассказ и сохранить проектные решения и открытые вопросы в wiki.'
			}
		],
		url: 'https://player.mux.com/sJjLk1RR1LUPW008qqmgFWJ6pep302jVwWiI2ZdvrXLQc',
		aspectRatio: '16 / 9'
	}
];

const englishVideos = [
	{
		title: 'Lesson 1: The history of transformers',
		description: 'An introduction to LLM architecture and why AI has become relevant today.'
	},
	{
		title: 'Lesson 2: Choosing your tools',
		description: 'ChatGPT vs Perplexity: analysing project briefs and regulations.'
	},
	{
		title: 'Lesson 3: Image generation',
		description: 'ControlNet, Stable Diffusion and controlled image generation.'
	},
	{ title: 'Lesson 4: Fine-tuning', description: 'Training an AI model for architectural tasks.' }
];

const englishWorkshops = [
	{
		title: 'Day 1 · 26 September',
		description:
			'How do you organise work with AI agents? The first day focuses on Codex: defining tasks, connecting tools and building a knowledge base for the Linha do Horizonte architectural project.',
		topics: [
			{
				title: 'AI agents: structure and how they work',
				description:
					'How an agent understands a task, selects and uses tools, takes action and checks the results.'
			},
			{
				title: 'Codex in architectural design',
				description:
					'Working in a project folder: analysing documents and images, preparing materials and organising collaboration with an agent.'
			},
			{
				title: 'APIs and external AI models',
				description:
					'How APIs work, with an example of connecting external models to Codex to bring different tools into one workflow.'
			},
			{
				title: 'Defining tasks and guiding an agent',
				description:
					'Setting goals, constraints and success criteria, giving feedback, monitoring the agent’s actions and guiding revisions.'
			},
			{
				title: 'Project rules in AGENTS.md',
				description:
					'Writing instructions for the agent: which materials to save, what to check and how to record design decisions.'
			},
			{
				title: 'Knowledge base and project wiki',
				description:
					'Building a connected wiki from the brief, photographs and drawings, separating facts from assumptions and defining design tasks.'
			}
		]
	},
	{
		title: 'Day 2 · 27 September',
		description:
			'How do you move from a brief to a design proposal? The second day continues the Linha do Horizonte project: developing the concept, testing it in Rhino, generating images and video, coordinating materials and assembling the presentation.',
		topics: [
			{
				title: 'Developing a concept with an agent',
				description:
					'Following a real project: exploring alternatives, comparing architectural solutions and choosing a direction based on the brief.'
			},
			{
				title: 'Rhino 3D model and programme checks',
				description:
					'Building a model with an agent and checking volumes and spatial relationships. Comparing the concept with the room schedule, floor areas and site constraints.'
			},
			{
				title: 'Images in Nano Banana 2 and GPT Image 2.5',
				description:
					'Defining the role of each reference and guiding generation: changing individual aspects of the project while preserving the core architectural idea.'
			},
			{
				title: 'Visualisations, video and 3D in Weavy',
				description:
					'The Weavy workflow and the transition from a still image to a project video presentation. An introduction to generating 3D models with Hunyuan and Tripo.'
			},
			{
				title: 'Finding errors and coordinating images',
				description:
					'Comparing plans, sections and visualisations, identifying inconsistencies and specifying targeted corrections.'
			},
			{
				title: 'Assembling a design proposal',
				description:
					'Bringing the concept, diagrams and images into a coherent narrative and recording design decisions and open questions in the wiki.'
			}
		]
	}
];

/** @param {'en' | 'ru'} locale */
export function getCourseData(locale = 'ru') {
	if (locale === 'ru') return { videos, workshopVideos };
	return {
		videos: videos.map((video, index) => ({ ...video, ...englishVideos[index] })),
		workshopVideos: workshopVideos.map((video, index) => ({ ...video, ...englishWorkshops[index] }))
	};
}
