<!-- eslint-disable vue/no-v-html -->
<template>
  <main
    ref="mainContainer"
    class="pt-20 pb-24 px-margin-desktop max-w-container-max mx-auto"
  >
    <!-- Hero Section -->
    <div class="mb-24 flex flex-col md:flex-row items-end justify-between gap-12 gsap-fade-up">
      <div class="max-w-2xl">
        <span class="text-primary font-body text-sm font-semibold tracking-wider uppercase mb-4 block">{{ t('privacy.title') }}</span>
        <h1
          class="font-title text-5xl md:text-6xl text-on-surface leading-none mb-8"
          v-html="t('privacy.heroTitle')"
        ></h1>
        <p class="font-body text-lg text-secondary max-w-lg">
          {{ t('privacy.heroDesc') }}
        </p>
      </div>
      <div class="w-full md:w-1/3 aspect-4-5 relative overflow-hidden">
        <img
          class="object-cover w-full h-full grayscale hover:grayscale-0 transition-all duration-700 ease-in-out"
          data-alt="A minimalist architectural shot of a bright, sun-drenched hallway with rhythmic shadows cast by concrete columns. The aesthetic is clean and serene, utilizing a palette of warm linen and soft greys. The image evokes a sense of structure, transparency, and high-end editorial clarity, perfectly aligning with a modern sanctuary brand identity."
          :src="heroImage"
        />
      </div>
    </div>
    <!-- Asymmetric Bento-style Layout for Policy Sections -->
    <div class="grid grid-cols-1 md:grid-cols-12 gap-gutter items-start">
      <!-- Sticky Navigation for Policy Sections -->
      <aside class="md:col-span-3 sticky top-32 hidden md:block gsap-fade-up">
        <nav
          id="privacy-nav"
          class="flex flex-col gap-6"
        >
          <a
            class="nav-link group flex items-center gap-4 font-body text-sm font-semibold text-secondary hover:text-primary transition-colors"
            href="#collection"
          >
            <span class="nav-indicator w-8 h-px bg-border group-hover:bg-primary transition-all"></span>
            {{ t('privacy.nav.collection') }}
          </a>
          <a
            class="nav-link group flex items-center gap-4 font-body text-sm font-semibold text-secondary hover:text-primary transition-colors"
            href="#usage"
          >
            <span class="nav-indicator w-8 h-px bg-border group-hover:bg-primary transition-all"></span>
            {{ t('privacy.nav.usage') }}
          </a>
          <a
            class="nav-link group flex items-center gap-4 font-body text-sm font-semibold text-secondary hover:text-primary transition-colors"
            href="#security"
          >
            <span class="nav-indicator w-8 h-px bg-border group-hover:bg-primary transition-all"></span>
            {{ t('privacy.nav.security') }}
          </a>
          <a
            class="nav-link group flex items-center gap-4 font-body text-sm font-semibold text-secondary hover:text-primary transition-colors"
            href="#cookies"
          >
            <span class="nav-indicator w-8 h-px bg-border group-hover:bg-primary transition-all"></span>
            {{ t('privacy.nav.cookies') }}
          </a>
        </nav>
      </aside>
      <!-- Main Content Area -->
      <div class="md:col-span-9 space-y-32">
        <!-- Section: Data Collection -->
        <section
          id="collection"
          class="scroll-mt-40 group gsap-fade-up"
        >
          <h2 class="font-title text-4xl md:text-5xl text-on-surface mb-8 flex items-baseline gap-4">
            <span class="font-poetic text-primary italic text-3xl">01</span>
            {{ t('privacy.sections.collection.title') }}
          </h2>
          <div class="grid md:grid-cols-2 gap-12">
            <div class="space-y-6">
              <h3 class="font-title text-2xl md:text-3xl text-on-surface">{{ t('privacy.sections.collection.subtitle') }}</h3>
              <p class="font-body text-base text-secondary">
                {{ t('privacy.sections.collection.desc') }}
              </p>
              <ul class="space-y-4">
                <li class="flex items-start gap-3">
                  <span class="material-symbols-outlined text-primary text-sm mt-1">check_circle</span>
                  <span class="font-body text-sm font-semibold">{{ t('privacy.sections.collection.li1') }}</span>
                </li>
                <li class="flex items-start gap-3">
                  <span class="material-symbols-outlined text-primary text-sm mt-1">check_circle</span>
                  <span class="font-body text-sm font-semibold">{{ t('privacy.sections.collection.li2') }}</span>
                </li>
                <li class="flex items-start gap-3">
                  <span class="material-symbols-outlined text-primary text-sm mt-1">check_circle</span>
                  <span class="font-body text-sm font-semibold">{{ t('privacy.sections.collection.li3') }}</span>
                </li>
              </ul>
            </div>
            <div class="bg-surface p-12 border border-border hover:scale-[1.01] transition-transform duration-500">
              <span class="material-symbols-outlined text-primary mb-6 scale-150">visibility</span>
              <p class="font-poetic text-secondary italic">
                {{ t('privacy.sections.collection.quote') }}
              </p>
            </div>
          </div>
        </section>
        <!-- Section: Usage -->
        <section
          id="usage"
          class="scroll-mt-40 group gsap-fade-up"
        >
          <h2 class="font-title text-4xl md:text-5xl text-on-surface mb-8 flex items-baseline gap-4">
            <span class="font-poetic text-primary italic text-3xl">02</span>
            {{ t('privacy.sections.usage.title') }}
          </h2>
          <div class="space-y-8 max-w-3xl">
            <p class="font-body text-lg text-secondary">
              {{ t('privacy.sections.usage.desc') }}
            </p>
            <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div class="p-6 bg-surface-container-low border border-border">
                <h4 class="font-title text-xl md:text-2xl mb-2 text-primary">{{ t('privacy.sections.usage.feature1.title') }}</h4>
                <p class="text-xs text-secondary">{{ t('privacy.sections.usage.feature1.desc') }}</p>
              </div>
              <div class="p-6 bg-surface-container-low border border-border">
                <h4 class="font-title text-xl md:text-2xl mb-2 text-primary">{{ t('privacy.sections.usage.feature2.title') }}</h4>
                <p class="text-xs text-secondary">{{ t('privacy.sections.usage.feature2.desc') }}</p>
              </div>
              <div class="p-6 bg-surface-container-low border border-border">
                <h4 class="font-title text-xl md:text-2xl mb-2 text-primary">{{ t('privacy.sections.usage.feature3.title') }}</h4>
                <p class="text-xs text-secondary">{{ t('privacy.sections.usage.feature3.desc') }}</p>
              </div>
            </div>
          </div>
        </section>
        <!-- Section: Security (The "Vault" Visual) -->
        <section
          id="security"
          class="scroll-mt-40 relative gsap-fade-up"
        >
          <h2 class="font-title text-4xl md:text-5xl text-on-surface mb-8 flex items-baseline gap-4">
            <span class="font-poetic text-primary italic text-3xl">03</span>
            {{ t('privacy.sections.security.title') }}
          </h2>
          <div class="flex flex-col md:flex-row gap-12 items-center">
            <div class="flex-1 space-y-6">
              <p class="font-body text-base text-on-surface">
                {{ t('privacy.sections.security.desc') }}
              </p>
              <div class="flex gap-4">
                <span class="px-4 py-2 border border-primary/20 text-primary font-body text-sm font-semibold tracking-wider rounded-full">
                  {{ t('privacy.sections.security.badge1') }}
                </span>
                <span class="px-4 py-2 border border-primary/20 text-primary font-body text-sm font-semibold tracking-wider rounded-full">
                  {{ t('privacy.sections.security.badge2') }}
                </span>
              </div>
            </div>
            <div class="w-full md:w-1/2 aspect-video bg-on-background flex items-center justify-center p-8 group overflow-hidden">
              <div
                id="security-vault"
                class="relative w-full h-full flex items-center justify-center border border-white/10"
              >
                <div
                  class="absolute inset-0 bg-linear-to-tr from-primary/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700"
                ></div>
                <span
                  id="security-icon"
                  class="material-symbols-outlined text-white text-6xl font-thin tracking-widest animate-pulse"
                >
                  lock_open
                </span>
                <div class="absolute bottom-4 left-4 text-white/40 text-[10px] uppercase tracking-[0.2em] font-body text-sm font-semibold">
                  {{ t('privacy.sections.security.monitor') }}
                </div>
              </div>
            </div>
          </div>
        </section>
        <!-- Section: Cookies -->
        <section
          id="cookies"
          class="scroll-mt-40 group gsap-fade-up"
        >
          <h2 class="font-title text-4xl md:text-5xl text-on-surface mb-8 flex items-baseline gap-4">
            <span class="font-poetic text-primary italic text-3xl">04</span>
            {{ t('privacy.sections.cookies.title') }}
          </h2>
          <div class="bg-surface border border-border p-8 md:p-12">
            <div class="max-w-2xl">
              <p class="font-body text-base text-secondary mb-8">
                {{ t('privacy.sections.cookies.desc') }}
              </p>
              <div class="space-y-4">
                <div class="flex justify-between items-center py-4 border-b border-border">
                  <div>
                    <h5 class="font-title text-base font-medium">{{ t('privacy.sections.cookies.essential.title') }}</h5>
                    <p class="text-xs text-secondary">{{ t('privacy.sections.cookies.essential.desc') }}</p>
                  </div>
                  <span class="text-primary font-bold text-xs uppercase tracking-wider">{{
                    t('privacy.sections.cookies.essential.status')
                  }}</span>
                </div>
                <div class="flex justify-between items-center py-4 border-b border-border">
                  <div>
                    <h5 class="font-title text-base font-medium">{{ t('privacy.sections.cookies.preference.title') }}</h5>
                    <p class="text-xs text-secondary">{{ t('privacy.sections.cookies.preference.desc') }}</p>
                  </div>
                  <div class="w-10 h-5 bg-primary rounded-full relative flex items-center px-1">
                    <div class="w-3 h-3 bg-white rounded-full ml-auto"></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
        <!-- Final Note -->
        <div class="pt-12 border-t border-border flex flex-col md:flex-row justify-between items-start gap-8 gsap-fade-up">
          <div>
            <h4 class="font-title text-2xl md:text-3xl mb-2">{{ t('privacy.cta.title') }}</h4>
            <p class="text-secondary font-body text-base">{{ t('privacy.cta.desc') }}</p>
          </div>
          <a
            class="bg-on-surface text-pure-surface px-8 py-4 font-medium hover:bg-primary transition-colors duration-300"
            href="mailto:privacy@memories.com"
          >
            {{ t('privacy.cta.button') }}
          </a>
        </div>
      </div>
    </div>
  </main>
</template>

<script setup lang="ts">
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import heroImage from '~/assets/images/privacy-hero.jpg'

const { t } = useI18n()

useHead({
  title: t('nav.privacy'),
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
    // Fade up animations
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

    // ScrollSpy for Navigation using ScrollTrigger
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
  })

  const securityVault = document.querySelector('#security-vault')
  const securityIcon = document.querySelector('#security-icon')

  if (securityVault && securityIcon) {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    securityVault.addEventListener('mousemove', (e: any) => {
      const rect = securityVault.getBoundingClientRect()
      const x = e.clientX - rect.left
      const y = e.clientY - rect.top

      const xPercent = (x / rect.width - 0.5) * 20
      const yPercent = (y / rect.height - 0.5) * 20

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      ;(securityIcon as any).style.transform = `translate(${xPercent}px, ${yPercent}px)`
    })

    securityVault.addEventListener('mouseleave', () => {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      ;(securityIcon as any).style.transform = `translate(0px, 0px)`
    })
  }
})

onUnmounted(() => {
  if (ctx) ctx.revert()
})
</script>
