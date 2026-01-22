<script>
  import { invalidateAll } from '$app/navigation';
  import { page } from '$app/stores';
  import logo from '$lib/images/logo_nobg.png';
  
  export let data;
  
  let mode = 'text';
  let prompt = '';
  let isLoading = false;
  let errorMessage = '';

  // model + image options
  let textModel = 'openai/gpt-oss-120b';
  let imageModel = 'black-forest-labs/FLUX.2-pro';
  let aspectRatio = 'square';

  let messages = [];
  let selectedImageIds = new Set();
  let fileInput;
  
  // Credits and user data
  let credits = data?.user?.credits ?? 0;
  let user = data?.user;
  
  // Sync credits when data updates
  $: if (data?.user?.credits !== undefined) {
    credits = data.user.credits;
    user = data.user;
  }

  function addMessage(partial) {
    const msg = {
      id: Date.now() + Math.random(),
      createdAt: new Date().toLocaleTimeString(),
      ...partial
    };
    messages = [...messages, msg];
    return msg.id;
  }

  function toggleImageSelection(imageId) {
    const newSet = new Set(selectedImageIds);
    if (newSet.has(imageId)) {
      newSet.delete(imageId);
    } else {
      newSet.add(imageId);
    }
    selectedImageIds = newSet; // trigger reactivity
  }

  function handleFileUpload(event) {
    const files = Array.from(event.target.files || []);
    if (files.length === 0) return;

    files.forEach((file) => {
      if (!file.type.startsWith('image/')) {
        errorMessage = 'Загружайте только файлы изображений.';
        return;
      }

      const reader = new FileReader();
      reader.onload = (e) => {
        const base64 = e.target.result;
        addMessage({
          role: 'user',
          mode: 'image',
          prompt: `Загружено: ${file.name}`,
          imageBase64: base64,
          uploadedImage: true
        });
      };
      reader.readAsDataURL(file);
    });

    // Reset input
    if (fileInput) fileInput.value = '';
  }

  async function runSandbox() {
    errorMessage = '';

    if (!prompt.trim() && selectedImageIds.size === 0) {
      errorMessage = 'Введите запрос или выберите изображения для редактирования.';
      return;
    }

    const currentMode = mode;
    const currentPrompt = prompt.trim();
    const currentTextModel = textModel;
    const currentImageModel = imageModel;
    const currentAspectRatio = aspectRatio;

    // Collect selected images (base64)
    // Need to convert URLs to base64 for generated images
    const selectedImages = [];
    if (selectedImageIds.size > 0 && currentMode === 'image') {
      for (const msg of messages) {
        if (selectedImageIds.has(msg.id)) {
          if (msg.imageBase64) {
            // Already have base64 (uploaded image)
            selectedImages.push(msg.imageBase64);
          } else if (msg.imageUrl) {
            // Generated image - need to convert URL to base64
            try {
              const base64 = await convertImageUrlToBase64(msg.imageUrl);
              selectedImages.push(base64);
            } catch (err) {
              console.error('Error converting image URL to base64:', err);
              errorMessage = 'Не удалось загрузить выбранное изображение для редактирования.';
              return;
            }
          }
        }
      }
    }

    addMessage({
      role: 'user',
      mode: currentMode,
      prompt: currentPrompt || (selectedImages.length > 0 ? `Редактировать ${selectedImages.length} ${selectedImages.length === 1 ? 'изображение' : selectedImages.length < 5 ? 'изображения' : 'изображений'}` : ''),
      selectedImageIds: Array.from(selectedImageIds)
    });

    isLoading = true;
    try {
      const res = await fetch('/api/ai/sandbox', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          mode: currentMode,
          prompt: currentPrompt,
          textModel: currentTextModel,
          imageModel: currentImageModel,
          aspectRatio: currentAspectRatio,
          imageUrls: selectedImages.length > 0 ? selectedImages : undefined
        })
      });

      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        const errorMsg = err.message || 'Не удалось сгенерировать результат';
        
        // Handle insufficient credits error
        if (res.status === 402) {
          errorMessage = errorMsg;
          // Refresh user data to get updated credits
          await invalidateAll();
        }
        
        throw new Error(errorMsg);
      }

      const responseData = await res.json();
      
      // Update credits if returned from API
      if (responseData.credits !== undefined) {
        credits = responseData.credits;
      }
      
      // Refresh layout data to ensure credits are in sync
      await invalidateAll();

      addMessage({
        role: 'assistant',
        mode: currentMode,
        text: currentMode === 'text' ? responseData.text ?? '' : '',
        imageUrl: currentMode === 'image' ? responseData.imageUrl ?? '' : ''
      });

      prompt = '';
      selectedImageIds = new Set(); // Clear selection after successful generation
    } catch (err) {
      console.error(err);
      const errMsg = err?.message ?? 'Unexpected error';
      
      // Only add error message to chat if it's not an authentication/credit error
      if (!errMsg.includes('Authentication') && !errMsg.includes('credits') && !errMsg.includes('Аутентификация') && !errMsg.includes('кредит')) {
        errorMessage = errMsg;
        addMessage({
          role: 'assistant',
          mode: currentMode,
          error: errMsg
        });
      } else {
        errorMessage = errMsg;
      }
    } finally {
      isLoading = false;
    }
  }

  async function convertImageUrlToBase64(url) {
    // Fetch image from URL and convert to base64 data URL
    const response = await fetch(`/api/ai/image-proxy?url=${encodeURIComponent(url)}`);
    if (!response.ok) {
      throw new Error('Не удалось загрузить изображение');
    }
    const blob = await response.blob();
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result);
      reader.onerror = reject;
      reader.readAsDataURL(blob);
    });
  }

  async function downloadImage(url) {
    if (!url) return;
    
    try {
      // Use our server proxy to avoid CORS issues
      const proxyUrl = `/api/ai/image-proxy?url=${encodeURIComponent(url)}`;
      const response = await fetch(proxyUrl);
      
      if (!response.ok) {
        throw new Error('Не удалось загрузить изображение');
      }
      
      // Convert to blob
      const blob = await response.blob();
      
      // Create a blob URL
      const blobUrl = URL.createObjectURL(blob);
      
      // Generate filename with timestamp (milliseconds for proper sorting)
      const timestamp = Date.now();
      const filename = `ai-image-${timestamp}.png`;
      
      // Create download link
      const a = document.createElement('a');
      a.href = blobUrl;
      a.download = filename;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      
      // Clean up the blob URL after a short delay
      setTimeout(() => URL.revokeObjectURL(blobUrl), 100);
    } catch (err) {
      console.error('Error downloading image:', err);
      errorMessage = 'Не удалось скачать изображение. Попробуйте ещё раз.';
    }
  }

  async function copyText(text) {
    if (!text) return;
    
    try {
      await navigator.clipboard.writeText(text);
      // You could show a toast notification here if desired
    } catch (err) {
      console.error('Error copying text:', err);
      // Fallback for older browsers
      const textarea = document.createElement('textarea');
      textarea.value = text;
      textarea.style.position = 'fixed';
      textarea.style.opacity = '0';
      document.body.appendChild(textarea);
      textarea.select();
      document.execCommand('copy');
      document.body.removeChild(textarea);
    }
  }
</script>

<svelte:head>
  <title>AI Песочница | Archweekend</title>
</svelte:head>

<!-- Frosty Glass Nav Bar -->
<nav class="frosty-nav">
  <div class="nav-content">
    <a href="/" class="logo-link">
      <img src={logo} alt="Archweekend" class="nav-logo" />
    </a>
    <div class="nav-credits">
      <span class="credits-label">Кредиты:</span>
      <span class="credits-value">{credits}</span>
    </div>
  </div>
</nav>

<main class="page">
  <section class="shell">
    <header class="header">
      <div>
        <h1>AI Песочница</h1>
        <p>Чат‑песочница Archweekend для текстов и изображений под архитектурные задачи.</p>
      </div>
      <div class="header-right">
        <div class="mode-switch">
        <button
          type="button"
          class:selected={mode === 'text'}
          on:click={() => (mode = 'text')}
        >
          Текст
        </button>
        <button
          type="button"
          class:selected={mode === 'image'}
          on:click={() => (mode = 'image')}
        >
          Изображения
        </button>
        </div>
      </div>
    </header>

    <section class="chat-panel">
      {#if messages.length === 0}
        <p class="placeholder">
          Начните с промпта внизу — здесь появятся ваши сообщения и ответы модели (текст и изображения),
          как в обычном мессенджере.
        </p>
      {:else}
        <div class="messages">
          {#each messages as msg (msg.id)}
            <article class={`message ${msg.role === 'user' ? 'user' : 'assistant'}`}>
              <div class="message-header">
                <span class="tag">{msg.role === 'user' ? 'Вы' : 'AI'}</span>
                <span class="tag mode-tag">{msg.mode === 'text' ? 'Текст' : 'Изображение'}</span>
                <span class="time">{msg.createdAt}</span>
              </div>

              <div class="message-body">
                {#if msg.role === 'user'}
                  {#if msg.imageBase64}
                    <!-- Uploaded image -->
                    <div class="image-wrapper">
                      <img 
                        src={msg.imageBase64} 
                        alt="Загруженное изображение" 
                        loading="lazy"
                        class:selected={selectedImageIds.has(msg.id)}
                        on:click={() => mode === 'image' && toggleImageSelection(msg.id)}
                      />
                      {#if mode === 'image'}
                        <button
                          type="button"
                          class="select-btn"
                          class:selected={selectedImageIds.has(msg.id)}
                          on:click={() => toggleImageSelection(msg.id)}
                          title={selectedImageIds.has(msg.id) ? 'Снять выбор' : 'Выбрать для редактирования'}
                        >
                          {selectedImageIds.has(msg.id) ? '✓ Выбрано' : 'Выбрать'}
                        </button>
                      {/if}
                    </div>
                  {/if}
                  {#if msg.prompt}
                    <div class="text-content">
                      <p>{msg.prompt}</p>
                      <button
                        type="button"
                        class="copy-btn"
                        on:click={() => copyText(msg.prompt)}
                        title="Копировать текст"
                      >
                        📋
                      </button>
                    </div>
                  {/if}
                {:else}
                  {#if msg.error}
                    <p class="error">{msg.error}</p>
                  {:else if msg.mode === 'text'}
                    {#if msg.text}
                      <div class="text-content">
                        <pre>{msg.text}</pre>
                        <button
                          type="button"
                          class="copy-btn"
                          on:click={() => copyText(msg.text)}
                          title="Копировать текст"
                        >
                          📋
                        </button>
                      </div>
                    {:else}
                      <p class="placeholder">Ответ модели появится через несколько секунд...</p>
                    {/if}
                  {:else}
                    {#if msg.imageUrl}
                      <div class="image-wrapper">
                        <img 
                          src={msg.imageUrl} 
                          alt="Сгенерировано Archweekend" 
                          loading="lazy"
                          class:selected={selectedImageIds.has(msg.id)}
                          on:click={() => mode === 'image' && toggleImageSelection(msg.id)}
                        />
                        <div class="image-actions">
                          <button
                            type="button"
                            class="download-btn"
                            on:click={() => downloadImage(msg.imageUrl)}
                          >
                            Скачать изображение
                          </button>
                          {#if mode === 'image'}
                            <button
                              type="button"
                              class="select-btn"
                              class:selected={selectedImageIds.has(msg.id)}
                              on:click={() => toggleImageSelection(msg.id)}
                              title={selectedImageIds.has(msg.id) ? 'Снять выбор' : 'Выбрать для редактирования'}
                            >
                              {selectedImageIds.has(msg.id) ? '✓ Выбрано' : 'Выбрать'}
                            </button>
                          {/if}
                        </div>
                      </div>
                    {:else}
                      <p class="placeholder">Изображение генерируется...</p>
                    {/if}
                  {/if}
                {/if}
              </div>
            </article>
          {/each}
        </div>
      {/if}
    </section>

    <section class="input-panel">
      {#if mode === 'image' && selectedImageIds.size > 0}
        <div class="selection-info">
          <span>Выбрано {selectedImageIds.size} {selectedImageIds.size === 1 ? 'изображение' : selectedImageIds.size < 5 ? 'изображения' : 'изображений'} для редактирования</span>
          <button
            type="button"
            class="clear-selection-btn"
            on:click={() => { selectedImageIds = new Set(); }}
          >
            Очистить
          </button>
        </div>
      {/if}
      
      <div class="model-row">
        {#if mode === 'text'}
          <div class="model-select">
            <label for="text-model">Текстовая модель</label>
            <select id="text-model" bind:value={textModel}>
              <option value="meta-llama/Llama-4-Maverick-17B-128E-Instruct-FP8">Llama 4 Maverick</option>
              <option value="openai/gpt-oss-120b">GPT OSS 120B</option>
            </select>
          </div>
        {:else}
          <div class="model-select">
            <label for="image-model">Модель изображений</label>
            <select id="image-model" bind:value={imageModel}>
              <option value="black-forest-labs/FLUX.2-pro">FLUX.2 Pro</option>
              <option value="google/gemini-3-pro-image">Nano Banana Pro</option>
            </select>
          </div>

          <div class="model-select">
            <label for="aspect">Соотношение сторон</label>
            <select id="aspect" bind:value={aspectRatio}>
              <option value="square">Квадрат 1:1</option>
              {#if imageModel.includes('gemini') || imageModel.includes('google/')}
                <option value="landscape">Горизонтальное 3:2</option>
                <option value="portrait">Вертикальное 2:3</option>
              {:else}
                <option value="landscape">Горизонтальное 16:9</option>
                <option value="portrait">Вертикальное 9:16</option>
              {/if}
            </select>
          </div>
        {/if}
      </div>

      <div class="input-row">
        {#if mode === 'image'}
          <label for="file-upload" class="upload-label">
            <input
              bind:this={fileInput}
              id="file-upload"
              type="file"
              accept="image/*"
              multiple
              on:change={handleFileUpload}
              style="display: none;"
            />
            📷 Загрузить
          </label>
        {/if}
        <label for="prompt" class="prompt-label">Ваш запрос</label>
      </div>
      <textarea
        id="prompt"
        bind:value={prompt}
        rows="3"
        placeholder={mode === 'text'
          ? 'Опишите, какой текст вам нужен: концепция павильона, описание проекта, пояснительная записка...'
          : 'Опишите желаемое изображение или выберите изображения для редактирования...'}
      ></textarea>

      {#if errorMessage}
        <p class="error">{errorMessage}</p>
      {/if}

      <div class="input-actions">
        <button 
          type="button" 
          class="run" 
          on:click={runSandbox} 
          disabled={isLoading || (mode === 'text' && credits < 1) || (mode === 'image' && credits < 5)}
        >
          {#if isLoading}
            Генерация...
          {:else if mode === 'text' && credits < 1}
            Недостаточно кредитов (нужно 1)
          {:else if mode === 'image' && credits < 5}
            Недостаточно кредитов (нужно 5)
          {:else}
            Отправить
          {/if}
        </button>

        <div class="hint-row">
          <p class="hint">
            Текст — диалог в стиле ChatGPT, Изображения — генерация визуализаций с кнопкой скачивания.
          </p>
          <p class="cost-hint">
            Стоимость: {mode === 'text' ? '1 кредит' : '5 кредитов'}
          </p>
        </div>
      </div>
    </section>
  </section>
</main>

<style>
  .frosty-nav {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    z-index: 1000;
    background: rgba(255, 255, 255, 0.7);
    backdrop-filter: blur(20px);
    -webkit-backdrop-filter: blur(20px);
    border-bottom: 1px solid rgba(255, 255, 255, 0.3);
    box-shadow: 0 4px 24px rgba(0, 0, 0, 0.1);
    padding: 12px 24px;
  }

  .nav-content {
    max-width: 1200px;
    margin: 0 auto;
    display: flex;
    justify-content: space-between;
    align-items: center;
    gap: 16px;
  }

  .logo-link {
    display: flex;
    align-items: center;
    text-decoration: none;
    transition: transform 0.2s ease;
  }

  .logo-link:hover {
    transform: scale(1.05);
  }

  .nav-logo {
    height: 40px;
    width: auto;
    object-fit: contain;
  }

  .nav-credits {
    display: flex;
    align-items: center;
    gap: 8px;
    padding: 8px 16px;
    border-radius: 12px;
    background: rgba(255, 255, 255, 0.5);
    border: 1px solid rgba(37, 99, 235, 0.2);
    backdrop-filter: blur(10px);
    -webkit-backdrop-filter: blur(10px);
  }

  .nav-credits .credits-label {
    font-size: 0.9rem;
    color: #6b7280;
    font-weight: 500;
  }

  .nav-credits .credits-value {
    font-size: 1rem;
    font-weight: 700;
    color: #2563eb;
  }

  .page {
    min-height: 100vh;
    padding: 100px 16px 80px;
    background: radial-gradient(circle at top, rgba(191, 219, 254, 0.7), transparent 55%),
      #f3f4f6;
    color: #0f172a;
    font-family: system-ui, -apple-system, BlinkMacSystemFont, 'SF Pro Text', 'Segoe UI', sans-serif;
    display: flex;
    justify-content: center;
  }

  .shell {
    width: 100%;
    max-width: 960px;
    padding: 20px 20px 16px;
    border-radius: 24px;
    background: #ffffff;
    border: 1px solid rgba(209, 213, 219, 0.9);
    box-shadow:
      0 18px 50px rgba(15, 23, 42, 0.12),
      0 0 0 1px rgba(148, 163, 184, 0.4);
    display: flex;
    flex-direction: column;
    gap: 12px;
  }

  .header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    gap: 16px;
    margin-bottom: 24px;
    flex-wrap: wrap;
  }

  .header-right {
    display: flex;
    align-items: center;
    gap: 16px;
    flex-wrap: wrap;
  }

  h1 {
    font-size: clamp(1.8rem, 4vw, 2.4rem);
    font-weight: 700;
    letter-spacing: -0.03em;
    background: linear-gradient(135deg, #e5e7eb, #60a5fa);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    margin-bottom: 4px;
  }

  .header p {
    color: #4b5563;
    max-width: 520px;
    font-size: 0.96rem;
  }

  .mode-switch {
    display: inline-flex;
    padding: 3px;
    border-radius: 999px;
    background: #e5e7eb;
    border: 1px solid #d1d5db;
  }

  .mode-switch button {
    border: none;
    background: transparent;
    color: #4b5563;
    padding: 5px 12px;
    border-radius: 999px;
    font-size: 0.88rem;
    cursor: pointer;
    transition: all 0.18s ease;
  }

  .mode-switch button.selected {
    background: #2563eb;
    color: #ffffff;
    box-shadow: 0 6px 18px rgba(37, 99, 235, 0.4);
  }

  .chat-panel {
    min-height: 260px;
    padding: 12px 14px;
    border-radius: 18px;
    background: #f9fafb;
    border: 1px solid #e5e7eb;
    display: flex;
    flex-direction: column;
  }

  .input-panel {
    padding: 10px 12px 0;
    border-top: 1px solid #e5e7eb;
    display: flex;
    flex-direction: column;
    gap: 8px;
  }

  .selection-info {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 8px 12px;
    border-radius: 8px;
    background: #eff6ff;
    border: 1px solid #bfdbfe;
    font-size: 0.85rem;
    color: #1e40af;
  }

  .clear-selection-btn {
    padding: 4px 10px;
    border-radius: 6px;
    border: 1px solid #93c5fd;
    background: #ffffff;
    color: #1e40af;
    font-size: 0.8rem;
    cursor: pointer;
    transition: all 0.15s ease;
  }

  .clear-selection-btn:hover {
    background: #dbeafe;
  }

  .input-row {
    display: flex;
    align-items: center;
    gap: 12px;
  }

  .upload-label {
    padding: 6px 12px;
    border-radius: 8px;
    border: 1px solid #d1d5db;
    background: #ffffff;
    color: #4b5563;
    font-size: 0.85rem;
    cursor: pointer;
    transition: all 0.15s ease;
    display: inline-flex;
    align-items: center;
    gap: 6px;
  }

  .upload-label:hover {
    background: #f3f4f6;
    border-color: #2563eb;
    color: #2563eb;
  }

  .prompt-label {
    flex: 1;
  }

  label {
    display: block;
    font-size: 0.86rem;
    color: #4b5563;
    margin-bottom: 6px;
  }

  textarea {
    width: 100%;
    resize: vertical;
    min-height: 72px;
    max-height: 164px;
    padding: 10px 12px;
    border-radius: 12px;
    border: 1px solid #d1d5db;
    background: #ffffff;
    color: #111827;
    font-size: 0.95rem;
    line-height: 1.5;
    outline: none;
    box-shadow: inset 0 0 0 1px rgba(15, 23, 42, 0.9);
  }

  textarea::placeholder {
    color: #9ca3af;
  }

  textarea:focus {
    border-color: #2563eb;
    box-shadow: 0 0 0 1px rgba(37, 99, 235, 0.8);
  }

  .run {
    margin-top: 4px;
    padding: 8px 18px;
    border-radius: 999px;
    border: none;
    cursor: pointer;
    font-size: 0.95rem;
    font-weight: 600;
    background: linear-gradient(135deg, #2563eb, #1d4ed8);
    color: #f9fafb;
    display: inline-flex;
    align-items: center;
    gap: 6px;
    box-shadow: 0 12px 36px rgba(37, 99, 235, 0.4);
    transition: transform 0.14s ease, box-shadow 0.14s ease, filter 0.14s ease;
  }

  .run:hover:not(:disabled) {
    transform: translateY(-1px);
    filter: brightness(1.05);
    box-shadow: 0 18px 55px rgba(37, 99, 235, 0.65);
  }

  .run:disabled {
    opacity: 0.6;
    cursor: default;
    box-shadow: none;
  }

  .hint-row {
    margin-top: 4px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    gap: 12px;
    flex-wrap: wrap;
  }

  .hint {
    font-size: 0.8rem;
    color: #6b7280;
    margin: 0;
  }

  .cost-hint {
    font-size: 0.8rem;
    color: #2563eb;
    font-weight: 500;
    margin: 0;
  }

  .error {
    margin-top: 4px;
    font-size: 0.86rem;
    color: #b91c1c;
  }

  .messages {
    margin-top: 2px;
    display: flex;
    flex-direction: column;
    gap: 10px;
    padding-right: 4px;
  }

  .message {
    padding: 9px 11px;
    border-radius: 14px;
    border: 1px solid #e5e7eb;
    background: #ffffff;
    max-width: min(80%, 620px);
  }

  .message.user {
    align-self: flex-end;
    background: #2563eb;
    color: #f9fafb;
    border-color: #2563eb;
  }

  .message.assistant {
    align-self: flex-start;
    background: #f9fafb;
    color: #111827;
    border-color: #e5e7eb;
  }

  .message-header {
    display: flex;
    align-items: center;
    gap: 6px;
    margin-bottom: 4px;
  }

  .tag {
    font-size: 0.7rem;
    text-transform: uppercase;
    letter-spacing: 0.06em;
    padding: 1px 5px;
    border-radius: 999px;
    border: 1px solid #e5e7eb;
    color: #6b7280;
    background: rgba(243, 244, 246, 0.9);
  }

  .mode-tag {
    border-color: rgba(59, 130, 246, 0.9);
    color: #1d4ed8;
    background: rgba(219, 234, 254, 0.9);
  }

  .time {
    margin-left: auto;
    font-size: 0.7rem;
    color: #9ca3af;
  }

  .message-body p {
    margin: 2px 0;
    font-size: 0.9rem;
    color: inherit;
  }

  .text-content {
    position: relative;
    display: flex;
    align-items: flex-start;
    gap: 8px;
  }

  .text-content p,
  .text-content pre {
    flex: 1;
    margin: 0;
  }

  .copy-btn {
    flex-shrink: 0;
    padding: 4px 8px;
    border-radius: 6px;
    border: 1px solid rgba(37, 99, 235, 0.3);
    background: rgba(239, 246, 255, 0.8);
    color: #1d4ed8;
    font-size: 0.85rem;
    cursor: pointer;
    transition: all 0.15s ease;
    opacity: 0.7;
  }

  .copy-btn:hover {
    opacity: 1;
    background: rgba(239, 246, 255, 1);
    border-color: rgba(37, 99, 235, 0.5);
    transform: scale(1.05);
  }

  .message.user .copy-btn {
    background: rgba(255, 255, 255, 0.2);
    border-color: rgba(255, 255, 255, 0.3);
    color: #ffffff;
  }

  .message.user .copy-btn:hover {
    background: rgba(255, 255, 255, 0.3);
    border-color: rgba(255, 255, 255, 0.5);
  }

  pre {
    margin: 0;
    padding: 8px 10px;
    border-radius: 10px;
    background: #f3f4f6;
    border: 1px solid #e5e7eb;
    font-size: 0.9rem;
    line-height: 1.5;
    white-space: pre-wrap;
    max-height: 260px;
    overflow: auto;
  }

  .image-wrapper {
    display: flex;
    flex-direction: column;
    gap: 6px;
  }

  .image-wrapper img {
    display: block;
    width: 100%;
    border-radius: 12px;
    border: 1px solid #e5e7eb;
    background: #f9fafb;
    max-height: 360px;
    object-fit: contain;
    transition: all 0.2s ease;
    cursor: pointer;
  }

  .image-wrapper img.selected {
    border: 3px solid #2563eb;
    box-shadow: 0 0 0 2px rgba(37, 99, 235, 0.2), 0 8px 24px rgba(37, 99, 235, 0.3);
  }

  .image-actions {
    display: flex;
    gap: 8px;
    flex-wrap: wrap;
  }

  .download-btn,
  .select-btn {
    align-self: flex-start;
    padding: 7px 12px;
    border-radius: 999px;
    border: 1px solid rgba(37, 99, 235, 0.85);
    background: #eff6ff;
    color: #1d4ed8;
    font-size: 0.8rem;
    cursor: pointer;
    display: inline-flex;
    align-items: center;
    gap: 6px;
    transition: background 0.15s ease, transform 0.15s ease, box-shadow 0.15s ease;
  }

  .download-btn:hover,
  .select-btn:hover {
    background: #2563eb;
    color: #f9fafb;
    transform: translateY(-1px);
    box-shadow: 0 10px 26px rgba(37, 99, 235, 0.6);
  }

  .select-btn.selected {
    background: #2563eb;
    color: #f9fafb;
    border-color: #1d4ed8;
  }

  .placeholder {
    font-size: 0.9rem;
    color: #9ca3af;
    margin-top: 4px;
  }

  @media (max-width: 900px) {
    .shell {
      padding-inline: 16px;
    }
  }

  @media (max-width: 640px) {
    .page {
      padding-top: 80px;
    }

    .frosty-nav {
      padding: 10px 16px;
    }

    .nav-logo {
      height: 32px;
    }

    .nav-credits {
      padding: 6px 12px;
    }

    .nav-credits .credits-label {
      font-size: 0.8rem;
    }

    .nav-credits .credits-value {
      font-size: 0.9rem;
    }
  }
</style>

