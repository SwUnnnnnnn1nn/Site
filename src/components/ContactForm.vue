<script setup lang="ts">
import { ref } from 'vue';
import { Icon } from '@iconify/vue';

type FormState = 'idle' | 'sending' | 'success' | 'error';

const formKey = 'neonov-contact';
const schemaRef = 'v1_bc74a629f69d';

const state = ref<FormState>('idle');
const errorMessage = ref<string>('');

const form = ref<{ name: string; email: string; message: string }>({
  name: '',
  email: '',
  message: '',
});

async function handleSubmit(e: Event) {
  e.preventDefault();
  if (state.value === 'sending') return;

  state.value = 'sending';
  errorMessage.value = '';

  try {
    const res = await fetch('/api/forms', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        formKey,
        schemaRef,
        payload: {
          name: form.value.name,
          email: form.value.email,
          message: form.value.message,
        },
      }),
    });

    if (!res.ok) {
      const errorData = await res.json().catch(() => ({}));
      throw new Error(errorData.message || `HTTP \${res.status}`);
    }

    state.value = 'success';
    form.value = { name: '', email: '', message: '' };
  } catch (err) {
    state.value = 'error';
    errorMessage.value =
      err instanceof Error ? err.message : 'Не удалось отправить. Попробуйте ещё раз.';
  }
}
</script>

<template>
  <div class="bg-surface/70 border border-border rounded-lg p-6 sm:p-8 backdrop-blur">
    <div class="flex items-center gap-2 text-[11px] uppercase tracking-widest text-muted mb-6 font-mono">
      <Icon icon="lucide:terminal" class="w-4 h-4 text-primary" />
      <span>~/contact/send.sh</span>
    </div>

    <form v-if="state !== 'success'" @submit="handleSubmit" class="space-y-5" novalidate>
      <div>
        <label for="cf-name" class="block text-xs uppercase tracking-widest text-muted mb-2 font-mono">
          // name
        </label>
        <input
          id="cf-name"
          v-model="form.name"
          type="text"
          required
          minlength="2"
          maxlength="100"
          autocomplete="name"
          placeholder="Как к вам обращаться"
          class="w-full px-4 py-3 bg-bg/60 border border-border rounded-md text-text placeholder:text-muted/60 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/40 transition-colors font-mono"
        />
      </div>

      <div>
        <label for="cf-email" class="block text-xs uppercase tracking-widest text-muted mb-2 font-mono">
          // email
        </label>
        <input
          id="cf-email"
          v-model="form.email"
          type="email"
          required
          autocomplete="email"
          placeholder="вы@example.com"
          class="w-full px-4 py-3 bg-bg/60 border border-border rounded-md text-text placeholder:text-muted/60 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/40 transition-colors font-mono"
        />
      </div>

      <div>
        <label for="cf-message" class="block text-xs uppercase tracking-widest text-muted mb-2 font-mono">
          // message <span class="normal-case text-muted/60">(необязательно)</span>
        </label>
        <textarea
          id="cf-message"
          v-model="form.message"
          rows="5"
          maxlength="1000"
          placeholder="Расскажите, зачем пишете"
          class="w-full px-4 py-3 bg-bg/60 border border-border rounded-md text-text placeholder:text-muted/60 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/40 transition-colors font-mono resize-y"
        ></textarea>
      </div>

      <button
        type="submit"
        :disabled="state === 'sending'"
        class="group w-full inline-flex items-center justify-center gap-2 px-5 py-3 bg-primary text-bg font-medium rounded-md hover:bg-primary/90 transition-all hover:shadow-[0_0_24px_rgba(0,255,170,0.35)] disabled:opacity-60 disabled:cursor-not-allowed"
      >
        <Icon v-if="state !== 'sending'" icon="lucide:send" class="w-4 h-4" />
        <Icon v-else icon="lucide:loader" class="w-4 h-4 animate-spin" />
        <span>{{ state === 'sending' ? 'Отправка…' : 'Отправить' }}</span>
      </button>

      <p v-if="state === 'error'" class="text-sm text-red-400 font-mono flex items-center gap-2">
        <Icon icon="lucide:alert-circle" class="w-4 h-4" />
        <span>Ошибка отправки: {{ errorMessage }}</span>
      </p>

      <p class="text-[11px] text-muted/80 font-mono leading-relaxed">
        Отправляя форму, вы соглашаетесь, что я получу ваше имя и email для ответа.
      </p>
    </form>

    <div v-else class="text-center py-8 fade-in-up">
      <div class="inline-flex items-center justify-center w-14 h-14 rounded-full bg-primary/10 border border-primary/40 mb-4">
        <Icon icon="lucide:check" class="w-7 h-7 text-primary" />
      </div>
      <h3 class="text-xl font-semibold text-text mb-2">Сообщение отправлено</h3>
      <p class="text-muted">Спасибо. Я отвечу на указанный email, как только смогу.</p>
      <button
        @click="state = 'idle'"
        class="mt-6 text-sm text-primary hover:text-primary/80 font-mono"
      >
        ← написать ещё
      </button>
    </div>
  </div>
</template>
