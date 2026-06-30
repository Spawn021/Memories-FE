<template>
  <footer class="w-full py-10 bg-background dark:bg-on-background border-t border-border">
    <div
      class="flex flex-col md:flex-row justify-between items-start md:items-center px-margin-mobile md:px-margin-desktop w-full gap-8 max-w-container-max mx-auto"
    >
      <div class="flex flex-col gap-4">
        <NuxtLink
          class="font-poetic text-primary text-3xl italic lowercase"
          :to="routes.home()"
        >
          memories
        </NuxtLink>
        <p class="font-body text-sm text-secondary">{{ t('common.copyright') }}</p>
      </div>
      <div class="flex flex-wrap gap-8">
        <NuxtLink
          :to="routes.privacy()"
          class="font-body text-sm text-secondary hover:text-primary! underline underline-offset-4 transition-all duration-300"
        >
          {{ t('nav.privacy') }}
        </NuxtLink>
        <NuxtLink
          :to="routes.terms()"
          class="font-body text-sm text-secondary hover:text-primary! underline underline-offset-4 transition-all duration-300"
        >
          {{ t('nav.terms') }}
        </NuxtLink>
        <NuxtLink
          :to="routes.about()"
          class="font-body text-sm text-secondary hover:text-primary! underline underline-offset-4 transition-all duration-300"
        >
          {{ t('nav.archiveEthics') }}
        </NuxtLink>
        <a
          href="mailto:hello@memories.io"
          class="font-body text-sm text-secondary hover:text-primary! underline underline-offset-4 transition-all duration-300"
        >
          {{ t('nav.contact') }}
        </a>
      </div>
    </div>
  </footer>
</template>
<script setup lang="ts">
const routes = useRoutes()
const { t } = useI18n()
</script>
