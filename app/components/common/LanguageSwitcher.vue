<template>
  <div class="relative inline-block text-left select-none z-50">
    <v-menu
      v-model="menuOpen"
      transition="slide-y-transition"
    >
      <template #activator="{ props }">
        <v-btn
          variant="outlined"
          color="secondary"
          class="text-none font-body text-[12px] font-medium tracking-wider !rounded-full border-border hover:border-primary/20 bg-surface !h-8 !px-3 spring-btn"
          v-bind="props"
          :ripple="false"
        >
          <template #prepend>
            <span class="material-symbols-outlined !text-[16px] text-secondary">language</span>
          </template>
          <div class="flex items-center gap-1.5">
            <img
              :src="currentLocaleFlag"
              :alt="currentLocaleName"
              class="w-4 h-3 object-cover rounded-[2px] border border-border/10"
            />
            <span>{{ currentLocaleName }}</span>
          </div>
          <template #append>
            <span
              class="material-symbols-outlined !text-[14px] text-secondary transition-transform duration-300"
              :class="{ 'rotate-180': menuOpen }"
            >
              keyboard_arrow_down
            </span>
          </template>
        </v-btn>
      </template>

      <v-list
        class="bg-surface border border-border mt-1 py-1 rounded-lg min-w-[110px]"
        density="compact"
        nav
      >
        <v-list-item
          v-for="loc in localesList"
          :key="loc.code"
          :value="loc.code"
          :active="locale === loc.code"
          color="primary"
          class="!px-3 !py-1"
          @click="selectLocale(loc.code)"
        >
          <template #prepend>
            <img
              :src="loc.flag"
              :alt="loc.name"
              class="w-4 h-3 object-cover rounded-[2px] mr-2 border border-border/10"
            />
          </template>

          <v-list-item-title class="!text-[12px] font-medium uppercase font-body">
            {{ loc.name }}
          </v-list-item-title>

          <template
            v-if="locale === loc.code"
            #append
          >
            <span class="material-symbols-outlined !text-[14px] text-primary ml-1">check</span>
          </template>
        </v-list-item>
      </v-list>
    </v-menu>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { EnglishIcon, JapaneseIcon, VietnameseIcon } from '~/assets/icons'

const { locale, setLocale } = useI18n()

interface LocaleItem {
  code: string
  name: string
  flag: string
}

// Available locales list with local SVG flag imports
const localesList: LocaleItem[] = [
  { code: 'vi', name: 'VN', flag: VietnameseIcon },
  { code: 'en', name: 'EN', flag: EnglishIcon },
  { code: 'ja', name: 'JP', flag: JapaneseIcon },
]

const menuOpen = ref(false)

const currentLocaleName = computed(() => {
  const found = localesList.find(l => l.code === locale.value)
  return found ? found.name : locale.value
})

const currentLocaleFlag = computed(() => {
  const found = localesList.find(l => l.code === locale.value)
  return found ? found.flag : ''
})

const selectLocale = async (code: string) => {
  await setLocale(code)
}
</script>
