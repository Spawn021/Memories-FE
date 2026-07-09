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
          class="text-none font-body text-[12px] font-medium tracking-wider rounded-full! border-border-strong! hover:border-primary/20 bg-surface h-8 px-3 spring-btn"
          v-bind="props"
          :ripple="false"
        >
          <template #prepend>
            <span class="material-symbols-outlined text-[16px]! text-primary">language</span>
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
              class="material-symbols-outlined text-sm! text-secondary transition-transform duration-300"
              :class="{ 'rotate-180': menuOpen }"
            >
              keyboard_arrow_down
            </span>
          </template>
        </v-btn>
      </template>

      <v-list
        class="bg-surface border border-border mt-1 py-1 rounded-lg min-w-27.5"
        density="compact"
      >
        <v-list-item
          v-for="loc in localesList"
          :key="loc.code"
          :value="loc.code"
          :active="locale === loc.code"
          color="primary"
          @click="selectLocale(loc.code)"
        >
          <template #prepend>
            <img
              :src="loc.flag"
              :alt="loc.name"
              class="w-4 h-3 object-cover rounded-[2px] mr-2 border border-border/10"
            />
          </template>

          <v-list-item-title class="text-xs! font-medium uppercase font-body">
            {{ loc.name }}
          </v-list-item-title>

          <template
            v-if="locale === loc.code"
            #append
          >
            <span class="material-symbols-outlined text-sm! text-primary ml-1">check</span>
          </template>
        </v-list-item>
      </v-list>
    </v-menu>
  </div>
</template>

<script setup lang="ts">
import { EnglishIcon, JapaneseIcon, VietnameseIcon } from '~/assets/icons'

const { locale, setLocale } = useI18n()

type LocaleCode = 'vi' | 'en' | 'ja'

interface LocaleItem {
  code: LocaleCode
  name: string
  flag: string
}

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

const selectLocale = async (code: LocaleCode) => {
  await setLocale(code)
}
</script>
