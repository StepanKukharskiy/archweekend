import { redirect } from '@sveltejs/kit';

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

/** @type {import('./$types').PageServerLoad} */
export function load({ locals }) {
  if (!locals.user) redirect(303, '/user/signin');
  return { videos };
}
