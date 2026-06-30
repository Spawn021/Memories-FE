<template>
  <main
    ref="mainContainer"
    class="pt-20 pb-24 px-margin-mobile md:px-margin-desktop max-w-container-max mx-auto"
  >
    <!-- Header Section -->
    <section class="mb-32 max-w-4xl animate-reveal">
      <span class="font-body text-sm font-semibold text-primary tracking-widest uppercase mb-4 block">{{ t('terms.subtitle') }}</span>
      <h1 class="font-title text-5xl md:text-6xl text-on-surface mb-8">{{ t('terms.title') }}</h1>
      <p class="font-body text-lg text-secondary max-w-2xl">
        {{ t('terms.description') }}
      </p>
    </section>
    <!-- Content Grid (Architectural Editorial) -->
    <div class="grid grid-cols-1 md:grid-cols-12 gap-16 md:gap-24 items-start">
      <!-- Sticky Navigation/Index -->
      <aside class="md:col-span-3 sticky top-32 hidden md:block animate-reveal reveal-delay-1">
        <nav class="flex flex-col gap-6">
          <a
            class="nav-link group flex items-center gap-4 font-body text-sm font-semibold text-secondary hover:text-primary transition-colors"
            href="#acceptance"
          >
            <span class="nav-indicator w-8 h-px bg-border group-hover:bg-primary transition-all"></span>
            {{ t('terms.nav.acceptance') }}
          </a>
          <a
            class="nav-link group flex items-center gap-4 font-body text-sm font-semibold text-secondary hover:text-primary transition-colors"
            href="#conduct"
          >
            <span class="nav-indicator w-8 h-px bg-border group-hover:bg-primary transition-all"></span>
            {{ t('terms.nav.conduct') }}
          </a>
          <a
            class="nav-link group flex items-center gap-4 font-body text-sm font-semibold text-secondary hover:text-primary transition-colors"
            href="#intellectual-property"
          >
            <span class="nav-indicator w-8 h-px bg-border group-hover:bg-primary transition-all"></span>
            {{ t('terms.nav.intellectual_property') }}
          </a>
          <a
            class="nav-link group flex items-center gap-4 font-body text-sm font-semibold text-secondary hover:text-primary transition-colors"
            href="#privacy"
          >
            <span class="nav-indicator w-8 h-px bg-border group-hover:bg-primary transition-all"></span>
            {{ t('terms.nav.privacy') }}
          </a>
          <a
            class="nav-link group flex items-center gap-4 font-body text-sm font-semibold text-secondary hover:text-primary transition-colors"
            href="#termination"
          >
            <span class="nav-indicator w-8 h-px bg-border group-hover:bg-primary transition-all"></span>
            {{ t('terms.nav.termination') }}
          </a>
        </nav>
      </aside>
      <!-- Main Text Sections -->
      <div class="md:col-span-9 flex flex-col gap-32">
        <!-- Section 01: Acceptance -->
        <section
          id="acceptance"
          class="max-w-3xl gsap-fade-up"
        >
          <h2 class="font-title text-4xl md:text-5xl text-on-surface mb-8 flex items-baseline gap-4">
            <span class="font-poetic text-primary italic text-3xl">01</span>
            {{ t('terms.sections.acceptance.title') }}
          </h2>
          <div class="space-y-6 text-body-lg text-secondary leading-relaxed">
            <p>{{ t('terms.sections.acceptance.p1') }}</p>
            <p>{{ t('terms.sections.acceptance.p2') }}</p>
          </div>
        </section>
        <!-- Visual Break (Asymmetric Image/Graphic) -->
        <div class="relative w-full aspect-21/9 overflow-hidden rounded-xl bg-surface-container-high group gsap-fade-up">
          <img
            alt="Architectural memory space"
            class="w-full h-full object-cover grayscale opacity-40 group-hover:scale-105 transition-transform duration-[2s]"
            :src="heroImage"
          />
          <div class="absolute inset-0 flex items-center justify-center">
            <div class="px-8 py-4 bg-surface/10 backdrop-blur-sm border border-white/20 rounded-full">
              <span class="text-white font-poetic italic text-xl">{{ t('terms.image_text') }}</span>
            </div>
          </div>
        </div>
        <!-- Section 02: User Conduct -->
        <section
          id="conduct"
          class="max-w-3xl ml-auto gsap-fade-up"
        >
          <h2 class="font-title text-4xl md:text-5xl text-on-surface mb-8 flex items-baseline gap-4">
            <span class="font-poetic text-primary italic text-3xl">02</span>
            {{ t('terms.sections.conduct.title') }}
          </h2>
          <div class="space-y-6 text-body-lg text-secondary leading-relaxed">
            <p>{{ t('terms.sections.conduct.p1') }}</p>
            <ul class="space-y-4 list-none pl-0">
              <li class="flex items-start gap-4">
                <span class="material-symbols-outlined text-primary shrink-0 mt-1">check_circle</span>
                <span>{{ t('terms.sections.conduct.li1') }}</span>
              </li>
              <li class="flex items-start gap-4">
                <span class="material-symbols-outlined text-primary shrink-0 mt-1">check_circle</span>
                <span>{{ t('terms.sections.conduct.li2') }}</span>
              </li>
              <li class="flex items-start gap-4">
                <span class="material-symbols-outlined text-primary shrink-0 mt-1">check_circle</span>
                <span>{{ t('terms.sections.conduct.li3') }}</span>
              </li>
            </ul>
          </div>
        </section>
        <!-- Section 03: Intellectual Property -->
        <section
          id="intellectual-property"
          class="max-w-3xl gsap-fade-up"
        >
          <h2 class="font-title text-4xl md:text-5xl text-on-surface mb-8 flex items-baseline gap-4">
            <span class="font-poetic text-primary italic text-3xl">03</span>
            {{ t('terms.sections.intellectual_property.title') }}
          </h2>
          <div class="space-y-6 text-body-lg text-secondary leading-relaxed">
            <p>
              <strong>{{ t('terms.sections.intellectual_property.your_content') }}</strong>
              {{ t('terms.sections.intellectual_property.your_content_desc') }}
            </p>
            <p>
              <strong>{{ t('terms.sections.intellectual_property.our_content') }}</strong>
              {{ t('terms.sections.intellectual_property.our_content_desc') }}
            </p>
          </div>
        </section>
        <!-- Section 04: Privacy -->
        <section
          id="privacy"
          class="max-w-3xl p-12 bg-surface border border-border rounded-xl gsap-fade-up"
        >
          <h2 class="font-title text-4xl md:text-5xl text-on-surface mb-8 flex items-baseline gap-4">
            <span class="font-poetic text-primary italic text-3xl">04</span>
            {{ t('terms.sections.privacy.title') }}
          </h2>
          <div class="space-y-6 text-body-lg text-secondary leading-relaxed">
            <p>{{ t('terms.sections.privacy.p1') }}</p>
            <p>{{ t('terms.sections.privacy.p2') }}</p>
          </div>
        </section>
        <!-- Section 05: Termination -->
        <section
          id="termination"
          class="max-w-3xl gsap-fade-up"
        >
          <h2 class="font-title text-4xl md:text-5xl text-on-surface mb-8 flex items-baseline gap-4">
            <span class="font-poetic text-primary italic text-3xl">05</span>
            {{ t('terms.sections.termination.title') }}
          </h2>
          <div class="space-y-6 text-body-lg text-secondary leading-relaxed">
            <p>{{ t('terms.sections.termination.p1') }}</p>
          </div>
        </section>
        <!-- Contact CTA -->
        <section class="mt-16 flex flex-col items-start gap-8 border-t border-border pt-16 gsap-fade-up">
          <h3 class="font-title text-2xl md:text-3xl text-on-surface">{{ t('terms.cta.title') }}</h3>
          <p class="text-body-md text-secondary max-w-lg">
            {{ t('terms.cta.description') }}
          </p>
          <a
            class="group flex items-center gap-2 text-primary font-medium"
            href="mailto:legal@memories.io"
          >
            {{ t('terms.cta.button') }}
            <span class="material-symbols-outlined group-hover:translate-x-1 transition-transform">arrow_forward</span>
          </a>
        </section>
      </div>
    </div>
  </main>
</template>

<script setup lang="ts">
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import heroImage from '~/assets/images/hero.jpg'

const { t } = useI18n()

useHead({
  title: 'Terms of Service',
})

definePageMeta({
  layout: 'marketing',
})

const mainContainer = ref(null)
let ctx: gsap.Context

onMounted(() => {
  gsap.registerPlugin(ScrollTrigger)
  if (!mainContainer.value) return

  ctx = gsap.context(() => {
    // Fade up animations for sections
    const fadeUpElements = gsap.utils.toArray('.gsap-fade-up')
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    fadeUpElements.forEach((el: any) => {
      gsap.from(el, {
        scrollTrigger: {
          trigger: el,
          start: 'top 85%',
        },
        y: 40,
        opacity: 0,
        duration: 0.8,
        ease: 'power3.out',
      })
    })

    // Scrollspy for navigation
    const sections = gsap.utils.toArray('section[id]')
    const navLinks = gsap.utils.toArray('.nav-link')

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    sections.forEach((section: any) => {
      ScrollTrigger.create({
        trigger: section,
        start: 'top 50%',
        end: 'bottom 50%',
        onToggle: self => {
          if (self.isActive) {
            const id = section.getAttribute('id')
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            navLinks.forEach((link: any) => {
              const indicator = link.querySelector('.nav-indicator')
              if (link.getAttribute('href') === `#${id}`) {
                link.classList.add('text-primary')
                link.classList.remove('text-secondary')
                if (indicator) {
                  indicator.classList.add('bg-primary', 'w-12')
                  indicator.classList.remove('bg-border', 'w-8')
                }
              } else {
                link.classList.remove('text-primary')
                link.classList.add('text-secondary')
                if (indicator) {
                  indicator.classList.remove('bg-primary', 'w-12')
                  indicator.classList.add('bg-border', 'w-8')
                }
              }
            })
          }
        },
      })
    })
  }, mainContainer.value)
})

onUnmounted(() => {
  ctx?.revert()
})
</script>

<style scoped>
.reveal-delay-1 {
  animation-delay: 100ms;
}
.reveal-delay-2 {
  animation-delay: 200ms;
}
.reveal-delay-3 {
  animation-delay: 300ms;
}
@keyframes fadeInSlideUp {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
.animate-reveal {
  animation: fadeInSlideUp 0.8s cubic-bezier(0.16, 1, 0.3, 1) forwards;
  opacity: 0;
}
::-webkit-scrollbar {
  width: 4px;
}
::-webkit-scrollbar-track {
  background: transparent;
}
::-webkit-scrollbar-thumb {
  background: #e26a4a;
  border-radius: 10px;
}
</style>
