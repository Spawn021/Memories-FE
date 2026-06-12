<template>
  <div class="relative inline-block text-left select-none z-50">
    <!-- Dropdown Trigger Button -->
    <button
      type="button"
      class="spring-btn flex items-center gap-2 px-3 py-1.5 rounded-full border border-border text-secondary hover:text-primary hover:border-primary/20 bg-surface text-[12px] font-medium tracking-wider cursor-pointer uppercase transition-colors"
      @click="isOpen = !isOpen"
      v-click-outside="closeDropdown"
    >
      <span class="material-symbols-outlined !text-[16px]">language</span>
      <span>{{ currentLocaleName }}</span>
      <span
        class="material-symbols-outlined !text-[14px] transition-transform duration-300"
        :class="{ 'rotate-180': isOpen }"
      >
        keyboard_arrow_down
      </span>
    </button>

    <!-- Dropdown Menu -->
    <transition name="dropdown-fade">
      <div
        v-if="isOpen"
        class="absolute right-0 mt-2 w-36 bg-surface border border-border rounded-lg shadow-xl py-1 overflow-hidden"
      >
        <button
          v-for="loc in localesList"
          :key="loc.code"
          type="button"
          class="w-full text-left px-4 py-2 text-[12px] tracking-wide font-medium flex items-center justify-between transition-colors duration-150 cursor-pointer"
          :class="
            locale === loc.code
              ? 'bg-primary/10 text-primary font-bold'
              : 'text-secondary hover:bg-background hover:text-primary'
          "
          @click="selectLocale(loc.code)"
        >
          <span>{{ loc.name }}</span>
          <span
            v-if="locale === loc.code"
            class="material-symbols-outlined !text-[14px] text-primary"
          >
            check
          </span>
        </button>
      </div>
    </transition>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'

const { locale, setLocale } = useI18n()

interface LocaleItem {
  code: string
  name: string
}

// Available locales list (must match those in nuxt.config.ts)
const localesList: LocaleItem[] = [
  { code: 'vi', name: 'Tiếng Việt' },
  { code: 'en', name: 'English' },
  { code: 'ja', name: '日本語' },
]

const isOpen = ref(false)

const currentLocaleName = computed(() => {
  const found = localesList.find(l => l.code === locale.value)
  return found ? found.name : locale.value
})

const selectLocale = async (code: string) => {
  isOpen.value = false
  await setLocale(code)
}

const closeDropdown = () => {
  isOpen.value = false
}

// Custom directive to handle click outside
const vClickOutside = {
  mounted(el: any, binding: any) {
    el.clickOutsideEvent = (event: Event) => {
      if (!(el === event.target || el.contains(event.target))) {
        binding.value()
      }
    }
    document.addEventListener('click', el.clickOutsideEvent)
  },
  unmounted(el: any) {
    document.removeEventListener('click', el.clickOutsideEvent)
  },
}
</script>

<style scoped>
.dropdown-fade-enter-active {
  transition: all 0.2s cubic-bezier(0.16, 1, 0.3, 1);
}
.dropdown-fade-leave-active {
  transition: all 0.15s cubic-bezier(0.16, 1, 0.3, 1);
}
.dropdown-fade-enter-from,
.dropdown-fade-leave-to {
  opacity: 0;
  transform: translateY(-8px) scale(0.96);
}
</style>
