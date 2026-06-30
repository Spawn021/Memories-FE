<template>
  <main ref="mainContainer">
    <!-- Hero Section -->
    <section class="relative min-h-230.25 flex items-center px-margin-desktop py-20 overflow-hidden">
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center w-full max-w-container-max mx-auto">
        <!-- Left Content -->
        <div class="z-10 flex flex-col items-start gap-8 gsap-hero-stagger">
          <h1 class="font-title text-5xl md:text-6xl hero-title text-on-background max-w-lg leading-[0.95]">{{ t('home.heroTitle') }}</h1>
          <p class="font-poetic text-xl text-secondary max-w-md italic leading-relaxed">
            {{ t('home.heroSubtitle') }}
          </p>
          <div class="flex flex-wrap gap-4 pt-4">
            <button
              class="bg-primary text-white px-8 py-4 rounded-full font-title text-xl md:text-2xl hover:scale-105 active:scale-95 transition-all duration-300 shadow-xl shadow-primary/10 font-semibold!"
            >
              {{ t('home.beginJourney') }}
            </button>
            <button
              class="flex items-center gap-2 px-8 py-4 rounded-full border border-border bg-surface hover:bg-background transition-colors font-title text-xl md:text-2xl group font-semibold!"
            >
              {{ t('home.exploreArchive') }}
              <span class="material-symbols-outlined transition-transform group-hover:translate-x-1">arrow_forward</span>
            </button>
          </div>
        </div>
        <!-- Right Visual Anchor: Collage -->
        <div class="relative h-150 w-full hidden lg:block">
          <!-- Overlapping Frames based on user image style -->
          <div class="absolute top-0 right-10 w-64 polaroid-frame z-10 rotate-[-4deg] gsap-hero-image">
            <div class="aspect-3/4 bg-surface overflow-hidden">
              <img
                class="w-full h-full object-cover grayscale-[0.2] sepia-[0.1]"
                data-alt="A macro photograph of a vintage leather-bound journal sitting on a sun-drenched wooden desk next to a classic fountain pen. Soft, warm sunlight filters through a linen curtain, creating a nostalgic and intellectual atmosphere. The color palette is rich with earth tones, deep sienna, and warm creams, emphasizing a timeless, analog aesthetic."
                src="~/assets/images/hero-1.jpg"
              />
            </div>
          </div>
          <div class="absolute bottom-10 right-48 w-72 polaroid-frame z-20 rotate-2 gsap-hero-image">
            <div class="aspect-3/4 bg-surface overflow-hidden">
              <img
                class="w-full h-full object-cover"
                data-alt="A delicate, dried single flower held by a graceful hand against a minimalist beige wall. The lighting is soft and diffused, reminiscent of a quiet afternoon in a sunlit garden. The style is editorial and clean, featuring soft focus and a muted color palette of sand, pale terracotta, and olive greens."
                src="~/assets/images/hero-2.jpg"
              />
            </div>
          </div>
          <div class="absolute top-20 right-87.5 w-56 polaroid-frame z-0 rotate-[-8deg] opacity-80 gsap-hero-image">
            <div class="aspect-3/4 bg-surface overflow-hidden">
              <img
                class="w-full h-full object-cover"
                data-alt="A wide, atmospheric landscape shot of rolling misty hills at dawn. The morning light creates a soft golden glow over the landscape, evoking a sense of peace and retrospective beauty. The image has a painterly quality with subtle grain and a high-end scrapbook aesthetic."
                src="~/assets/images/hero-3.jpg"
              />
            </div>
          </div>
          <!-- Atmospheric Abstract Shader -->
          <div class="absolute inset-0 -z-10 opacity-20 pointer-events-none">
            <div
              class="w-full h-full bg-[radial-gradient(circle_at_center,var(--tw-gradient-stops))] from-primary/20 via-transparent to-transparent"
            ></div>
          </div>
        </div>
      </div>
    </section>
    <!-- Quote Section -->
    <section class="py-24 md:py-32 px-margin-desktop bg-surface border-y border-border">
      <div class="max-w-3xl mx-auto text-center">
        <blockquote class="relative gsap-quote-section">
          <span
            class="material-symbols-outlined text-6xl text-primary opacity-20 absolute -top-12 left-1/2 -translate-x-1/2 gsap-quote-icon"
            style="font-variation-settings: 'FILL' 1"
          >
            format_quote
          </span>
          <p class="font-poetic text-5xl italic text-on-background leading-tight font-semibold gsap-quote-text">
            {{ t('auth.quote') }}
          </p>
          <cite class="font-body text-sm font-semibold tracking-wider uppercase text-secondary not-italic mt-4 block gsap-quote-author">
            {{ t('auth.quoteAuthor') }}
          </cite>
        </blockquote>
      </div>
    </section>
    <!-- Features Grid -->
    <section class="py-32 px-margin-desktop max-w-container-max mx-auto">
      <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
        <!-- Card 1 -->
        <div
          class="glass-card p-10 rounded-xl flex flex-col gap-6 md:mt-12 transition-transform hover:-translate-y-2 duration-500 gsap-feature-card"
        >
          <div class="w-14 h-14 rounded-full flex items-center justify-center text-primary bg-danger-container">
            <span class="material-symbols-outlined text-3xl">auto_stories</span>
          </div>
          <h3 class="font-title text-2xl md:text-3xl text-on-background">{{ t('home.features.scrapbook.title') }}</h3>
          <p class="text-secondary leading-relaxed">
            {{ t('home.features.scrapbook.desc') }}
          </p>
          <a
            class="text-primary font-bold inline-flex items-center gap-2 group"
            href="#"
          >
            {{ t('home.features.scrapbook.link') }}
            <span class="material-symbols-outlined text-sm group-hover:translate-x-1 transition-transform">arrow_right_alt</span>
          </a>
        </div>
        <!-- Card 2 -->
        <div
          class="glass-card p-10 rounded-xl flex flex-col gap-6 transition-transform hover:-translate-y-2 duration-500 gsap-feature-card"
        >
          <div class="w-14 h-14 rounded-full flex items-center justify-center text-secondary bg-secondary/30">
            <span class="material-symbols-outlined text-3xl">verified</span>
          </div>
          <h3 class="font-title text-2xl md:text-3xl text-on-background">{{ t('home.features.archival.title') }}</h3>
          <p class="text-secondary leading-relaxed">
            {{ t('home.features.archival.desc') }}
          </p>
          <a
            class="text-primary font-bold inline-flex items-center gap-2 group"
            href="#"
          >
            {{ t('home.features.archival.link') }}
            <span class="material-symbols-outlined text-sm group-hover:translate-x-1 transition-transform">arrow_right_alt</span>
          </a>
        </div>
        <!-- Card 3 -->
        <div
          class="glass-card p-10 rounded-xl flex flex-col gap-6 md:mt-24 transition-transform hover:-translate-y-2 duration-500 gsap-feature-card"
        >
          <div class="w-14 h-14 rounded-full bg-danger-container flex items-center justify-center text-tertiary">
            <span class="material-symbols-outlined text-3xl">group_work</span>
          </div>
          <h3 class="font-title text-2xl md:text-3xl text-on-background">{{ t('home.features.intimate.title') }}</h3>
          <p class="text-secondary leading-relaxed">
            {{ t('home.features.intimate.desc') }}
          </p>
          <a
            class="text-primary font-bold inline-flex items-center gap-2 group"
            href="#"
          >
            {{ t('home.features.intimate.link') }}
            <span class="material-symbols-outlined text-sm group-hover:translate-x-1 transition-transform">arrow_right_alt</span>
          </a>
        </div>
      </div>
    </section>
    <!-- CTA Section -->
    <section class="mb-32 px-margin-desktop">
      <div
        class="max-w-container-max mx-auto bg-on-background rounded-4xl p-12 md:p-24 relative overflow-hidden text-center text-background gsap-cta-box"
      >
        <div class="relative z-10 flex flex-col items-center gap-8">
          <h2 class="font-title text-5xl md:text-6xl max-w-2xl leading-tight">{{ t('home.cta.title') }}</h2>
          <p class="font-body text-lg text-surface-variant max-w-lg">
            {{ t('home.cta.subtitle') }}
          </p>
          <button
            class="bg-primary text-white px-12 py-5 rounded-full font-title text-xl md:text-2xl hover:scale-105 active:scale-95 transition-all duration-300 shadow-2xl shadow-black/40"
          >
            {{ t('home.cta.button') }}
          </button>
        </div>
        <!-- Decorative element -->
        <div class="absolute -bottom-24 -right-24 w-96 h-96 bg-primary opacity-20 blur-[100px] rounded-full"></div>
        <div class="absolute -top-24 -left-24 w-64 h-64 bg-primary opacity-10 blur-[80px] rounded-full"></div>
      </div>
    </section>
  </main>
</template>

<script setup>
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

const { t } = useI18n()

useHead({
  title: t('nav.home'),
})

definePageMeta({
  layout: 'marketing',
})

const mainContainer = ref(null)
let ctx

onMounted(() => {
  gsap.registerPlugin(ScrollTrigger)

  if (!mainContainer.value) return

  ctx = gsap.context(() => {
    // Hero Elements
    gsap.from('.gsap-hero-stagger > *', {
      y: 30,
      opacity: 0,
      duration: 1,
      stagger: 0.15,
      ease: 'power3.out',
      delay: 0.2,
    })

    // Images
    gsap.from('.gsap-hero-image', {
      y: 50,
      opacity: 0,
      duration: 1.2,
      stagger: 0.2,
      ease: 'power2.out',
      delay: 0.4,
    })

    // Quote Section
    gsap.from('.gsap-quote-icon', {
      scrollTrigger: {
        trigger: '.gsap-quote-section',
        start: 'top 80%',
      },
      scale: 0,
      opacity: 0,
      duration: 0.8,
      ease: 'back.out(1.5)',
    })

    gsap.from('.gsap-quote-text, .gsap-quote-author', {
      scrollTrigger: {
        trigger: '.gsap-quote-section',
        start: 'top 80%',
      },
      y: 20,
      opacity: 0,
      duration: 1,
      stagger: 0.2,
      ease: 'power2.out',
    })

    // Feature Cards
    gsap.from('.gsap-feature-card', {
      scrollTrigger: {
        trigger: '.gsap-feature-card',
        start: 'top 85%',
      },
      y: 40,
      opacity: 0,
      duration: 0.8,
      stagger: 0.15,
      ease: 'power2.out',
    })

    // CTA
    gsap.from('.gsap-cta-box', {
      scrollTrigger: {
        trigger: '.gsap-cta-box',
        start: 'top 85%',
      },
      y: 50,
      opacity: 0,
      duration: 1,
      ease: 'power3.out',
    })
  }, mainContainer.value)
})

onUnmounted(() => {
  ctx?.revert()
})
</script>

<style scoped>
.glass-card {
  background: rgba(255, 255, 255, 0.7);
  backdrop-filter: blur(12px);
  border: 1px solid rgba(24, 26, 26, 0.05);
}
.polaroid-frame {
  background: #ffffff;
  padding: 12px 12px 48px 12px;
  box-shadow: 0 10px 30px -10px rgba(24, 26, 26, 0.08);
  transition: transform 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
}
.polaroid-frame:hover {
  transform: scale(1.05) rotate(1deg);
}
.hero-title {
  letter-spacing: -0.04em;
}
</style>
