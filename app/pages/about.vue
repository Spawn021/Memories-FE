<!-- eslint-disable vue/no-v-html -->
<template>
  <main
    ref="mainRef"
    class="min-h-screen"
  >
    <!-- Hero Section: Split Screen Philosophy -->
    <section class="flex flex-col md:flex-row min-h-230.25 gsap-section">
      <!-- Left Panel: Content -->
      <div class="w-full md:w-1/2 flex flex-col justify-center px-margin-mobile md:px-margin-desktop py-12">
        <span class="text-primary font-body text-sm font-semibold tracking-widest uppercase mb-4">{{ t('about.originLabel') }}</span>
        <h1
          class="font-title text-5xl md:text-6xl text-on-surface mb-8 leading-tight"
          v-html="t('about.heroTitle')"
        ></h1>
        <p class="font-body text-lg text-secondary max-w-md mb-10 leading-relaxed">
          {{ t('about.heroDesc') }}
        </p>
        <div class="flex gap-4">
          <button
            class="bg-primary text-white px-8 py-4 rounded-full font-title text-base font-medium hover:scale-105 active:scale-95 transition-all duration-300 ease-out"
          >
            {{ t('about.startBtn') }}
          </button>
        </div>
      </div>
      <!-- Right Panel: Nostalgia Art Panel -->
      <div class="hidden md:block md:w-1/2 relative overflow-hidden nostalgia-panel bg-surface-container">
        <div class="absolute inset-0 z-0">
          <img
            class="w-full h-full object-cover grayscale-20 sepia-10 transition-transform duration-1000 hover:scale-110"
            src="~/assets/images/hero.jpg"
          />
        </div>
        <div class="absolute inset-0 bg-primary/5 mix-blend-multiply"></div>
        <!-- Asymmetric Overlays -->
        <div class="absolute top-20 right-20 w-48 h-64 bg-surface shadow-xl p-3 rotate-6 floating-accent">
          <div class="w-full h-48 bg-surface-container overflow-hidden mb-2">
            <img
              class="w-full h-full object-cover"
              src="~/assets/images/polaroid.jpg"
            />
          </div>
          <p class="font-poetic text-primary text-sm">{{ t('about.overlayLocation') }}</p>
        </div>
      </div>
    </section>
    <!-- Mission Statement: Typographic Focus -->
    <section class="py-24 bg-surface gsap-section">
      <div class="max-w-4xl mx-auto px-margin-mobile text-center">
        <h2 class="font-title text-4xl md:text-5xl text-on-surface mb-12">{{ t('about.missionTitle') }}</h2>
        <div class="space-y-8">
          <blockquote class="font-poetic text-4xl md:text-5xl text-secondary italic leading-snug">
            {{ t('about.missionQuote') }}
          </blockquote>
          <p class="font-body text-base text-secondary max-w-2xl mx-auto">
            {{ t('about.missionDesc') }}
          </p>
        </div>
      </div>
    </section>
    <!-- Timeline: Offset Grid -->
    <section class="py-24 px-margin-mobile md:px-margin-desktop bg-background gsap-section">
      <div class="max-w-container-max mx-auto">
        <div class="grid grid-cols-1 md:grid-cols-12 gap-12 items-start">
          <div class="md:col-span-4 sticky top-32">
            <h3 class="font-title text-4xl md:text-5xl text-primary">{{ t('about.timelineTitle') }}</h3>
            <p class="text-secondary mt-4 font-body text-base">{{ t('about.timelineSubtitle') }}</p>
          </div>
          <div class="md:col-span-8">
            <v-timeline
              align="start"
              density="compact"
              class="pl-0 md:pl-8"
            >
              <v-timeline-item
                v-for="step in ['step1', 'step2', 'step3']"
                :key="step"
                dot-color="primary"
                size="small"
                fill-dot
              >
                <div class="mb-8">
                  <span class="font-body text-sm font-semibold text-primary tracking-widest uppercase">{{
                    t(`about.timeline.${step}.date`)
                  }}</span>
                  <h4 class="font-title text-2xl md:text-3xl mt-2 mb-4">{{ t(`about.timeline.${step}.title`) }}</h4>
                  <p class="text-secondary font-body text-base leading-relaxed">
                    {{ t(`about.timeline.${step}.desc`) }}
                  </p>
                </div>
              </v-timeline-item>
            </v-timeline>
          </div>
        </div>
      </div>
    </section>
    <!-- CTA Section -->
    <section class="py-32 px-margin-mobile relative overflow-hidden gsap-section">
      <div class="absolute inset-0 bg-primary-container/10 opacity-50"></div>
      <div class="max-w-container-max mx-auto relative z-10 text-center">
        <div class="bg-surface p-12 md:p-24 rounded-full max-w-5xl mx-auto shadow-2xl shadow-obsidian-ink/5">
          <h2 class="font-title text-4xl md:text-6xl text-on-surface mb-8">{{ t('about.cta.title') }}</h2>
          <p class="text-secondary font-body text-lg mb-12 max-w-xl mx-auto">
            {{ t('about.cta.subtitle') }}
          </p>
          <div class="flex flex-col md:flex-row gap-6 justify-center">
            <button
              class="bg-primary text-white px-10 py-5 rounded-full font-title text-xl md:text-2xl hover:scale-105 active:scale-95 transition-all"
            >
              {{ t('about.cta.createBtn') }}
            </button>
            <button
              class="border border-border bg-background text-on-surface px-10 py-5 rounded-full font-title text-xl md:text-2xl hover:bg-white hover:scale-105 active:scale-95 transition-all"
            >
              {{ t('about.cta.exploreBtn') }}
            </button>
          </div>
        </div>
      </div>
    </section>
  </main>
</template>

<script setup>
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

const { t } = useI18n()
gsap.registerPlugin(ScrollTrigger)

useHead({
  title: t('nav.about'),
})

definePageMeta({
  layout: 'marketing',
})

const mainRef = ref(null)
let ctx

onMounted(() => {
  ctx = gsap.context(() => {
    // Reveal sections
    gsap.utils.toArray('.gsap-section').forEach(section => {
      gsap.from(section, {
        opacity: 0,
        y: 30,
        duration: 1,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: section,
          start: 'top 80%',
        },
      })
    })

    // Float animation
    gsap.to('.floating-accent', {
      y: -15,
      duration: 3,
      yoyo: true,
      repeat: -1,
      ease: 'sine.inOut',
    })

    // Mouse move effect for floating accent
    const floatingElement = document.querySelector('.floating-accent')
    if (floatingElement) {
      floatingElement.addEventListener('mousemove', e => {
        const rect = floatingElement.getBoundingClientRect()
        const x = e.clientX - rect.left
        const y = e.clientY - rect.top
        const xc = rect.width / 2
        const yc = rect.height / 2
        const dx = x - xc
        const dy = y - yc
        gsap.to(floatingElement, {
          rotateY: dx / 10,
          rotateX: -dy / 10,
          y: -20,
          duration: 0.3,
          ease: 'power2.out',
        })
      })
      floatingElement.addEventListener('mouseleave', () => {
        gsap.to(floatingElement, {
          rotateY: 0,
          rotateX: 0,
          y: 0,
          duration: 0.5,
          ease: 'power2.out',
        })
      })
    }
  }, mainRef.value)
})

onUnmounted(() => {
  ctx?.revert()
})
</script>

<style scoped>
.material-symbols-outlined {
  font-variation-settings:
    'FILL' 0,
    'wght' 400,
    'GRAD' 0,
    'opsz' 24;
}

.nostalgia-panel {
  clip-path: polygon(10% 0%, 100% 0%, 100% 100%, 0% 100%);
}
</style>
