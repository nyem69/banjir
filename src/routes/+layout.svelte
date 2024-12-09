<script lang="ts">
  import { t } from '$lib/i18n';
  import { ParaglideJS } from '@inlang/paraglide-sveltekit';
  import { page } from '$app/stores';
  import '../app.css';
  let { children } = $props();
</script>

<ParaglideJS>
  <div class="min-h-screen bg-white">
    <header class="bg-blue-600 text-white">
      <div class="container mx-auto px-4 py-4">
        <h1 class="text-2xl font-bold mb-4">{t('app.title')}</h1>
        <nav class="space-x-4">
          <a 
            href="/" 
            class="hover:text-blue-200 {$page.url.pathname === '/' ? 'text-blue-200' : ''}"
          >
            Dashboard
          </a>
          <a 
            href="/map" 
            class="hover:text-blue-200 {$page.url.pathname === '/map' ? 'text-blue-200' : ''}"
          >
            Map
          </a>
        </nav>
      </div>
    </header>

    <main class="container mx-auto px-4 py-8">
      {@render children()}
    </main>

    <footer class="mt-8 py-4 text-center text-gray-600">
      <p>&copy; 2024 {t('app.footer')}</p>
    </footer>
  </div>
</ParaglideJS>
