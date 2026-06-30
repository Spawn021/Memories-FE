<template>
  <main
    ref="mainContainer"
    class="max-w-container-max mx-auto px-margin-desktop py-12 md:py-20"
  >
    <!-- Hero Section: Featured Story -->
    <section class="mb-24 gsap-hero">
      <div class="flex flex-col md:flex-row gap-12 items-center lg:items-start">
        <div class="w-full md:w-1/2 relative gsap-hero-item">
          <div class="polaroid-frame bg-surface p-6 pb-16 rotate-2 transform-gpu">
            <div class="aspect-4/5 overflow-hidden bg-surface-container-low mb-6">
              <img
                class="w-full h-full object-cover"
                data-alt="A nostalgic, high-end editorial photo of a vintage bicycle leaning against a weathered stone wall in a sun-drenched Italian village. The lighting is soft and golden, characteristic of a bright summer morning. The composition is asymmetrical, capturing a sense of quiet heritage and poetic simplicity in a modern scrapbook style."
                src="~/assets/images/story-hero.jpg"
              />
            </div>
            <p class="font-poetic text-2xl text-secondary text-center italic">{{ t('stories.heroPhotoQuote') }}</p>
          </div>
        </div>
        <div class="w-full md:w-1/2 flex flex-col justify-center pt-8 md:pt-16 gsap-hero-item">
          <div class="flex items-center gap-3 mb-6">
            <span class="w-12 h-px bg-primary"></span>
            <span class="font-body text-sm font-semibold tracking-wider text-primary uppercase">{{ t('stories.featuredMemory') }}</span>
          </div>
          <h1 class="font-title text-5xl md:text-6xl text-primary mb-8 leading-tight">{{ t('stories.heroTitle') }}</h1>
          <p class="font-body text-lg text-secondary mb-10 max-w-lg leading-relaxed">
            {{ t('stories.heroDesc') }}
          </p>
          <div>
            <button
              class="bg-primary text-on-primary px-8 py-4 rounded-full font-title text-base font-medium shadow-lg shadow-primary/20 hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center gap-3"
            >
              {{ t('stories.readFullStory') }}
              <span class="material-symbols-outlined text-[18px]">arrow_forward</span>
            </button>
          </div>
        </div>
      </div>
    </section>
    <!-- Divider & Action Row -->
    <div class="flex flex-col md:flex-row justify-between items-end mb-16 gap-6 gsap-feed-header">
      <div class="max-w-md">
        <h2 class="font-title text-4xl md:text-5xl text-primary mb-2">{{ t('stories.memoryFeedTitle') }}</h2>
        <p class="font-body text-base text-secondary italic">{{ t('stories.memoryFeedSubtitle') }}</p>
      </div>
      <button
        class="group flex items-center gap-3 bg-surface border border-border px-6 py-3 rounded-full hover:bg-background transition-all hover:scale-[1.02] active:scale-[0.98]"
      >
        <span class="material-symbols-outlined text-primary group-hover:rotate-12 transition-transform">edit_note</span>
        <span class="font-title text-base font-medium text-primary">{{ t('stories.writeNewStory') }}</span>
      </button>
    </div>
    <!-- Masonry Grid of Snaps -->
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-12 gap-y-12 lg:gap-y-0 items-start">
      <div
        v-for="snap in snaps"
        :key="snap.id"
        :class="['masonry-item gsap-snap group', snap.wrapperClass]"
      >
        <div
          :class="[
            'bg-surface p-4 pb-12 shadow-sm border border-border transition-transform duration-500 group-hover:rotate-0',
            snap.rotateClass,
          ]"
        >
          <div :class="['bg-surface-container overflow-hidden mb-4', snap.aspectClass]">
            <img
              class="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
              :src="snap.image"
            />
          </div>
          <span class="font-poetic text-body-md text-primary block mb-1">{{ t(`stories.snaps.${snap.id}.date`) }}</span>
          <h3 class="font-title text-2xl md:text-3xl text-primary mb-2">{{ t(`stories.snaps.${snap.id}.title`) }}</h3>
          <p class="font-body text-base text-secondary line-clamp-2">
            {{ t(`stories.snaps.${snap.id}.desc`) }}
          </p>
        </div>
      </div>
    </div>
    <!-- Load More / Footer Call to Action -->
    <div class="mt-20 text-center py-12 border-t border-border gsap-load-more">
      <button class="font-title text-base font-medium text-secondary hover:text-primary transition-colors flex items-center gap-2 mx-auto">
        {{ t('stories.discoverEarlier') }}
        <span class="material-symbols-outlined">expand_more</span>
      </button>
    </div>
  </main>
</template>

<script setup>
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

const { t } = useI18n()

useHead({
  title: t('nav.stories'),
})

definePageMeta({
  layout: 'marketing',
})

import s1 from '~/assets/images/story-1.jpg'
import s2 from '~/assets/images/story-2.jpg'
import s3 from '~/assets/images/story-3.jpg'
import s4 from '~/assets/images/story-4.jpg'
import s5 from '~/assets/images/story-5.jpg'
import s6 from '~/assets/images/story-6.jpg'

const mainContainer = ref(null)
let ctx

const snaps = [
  {
    id: 'snap1',
    image: s1,
    wrapperClass: '',
    rotateClass: '-rotate-1',
    aspectClass: 'aspect-square',
  },
  {
    id: 'snap2',
    image: s2,
    wrapperClass: '',
    rotateClass: 'rotate-2',
    aspectClass: 'aspect-3/4',
  },
  {
    id: 'snap3',
    image: s3,
    wrapperClass: '',
    rotateClass: '-rotate-3',
    aspectClass: 'aspect-video',
  },
  {
    id: 'snap4',
    image: s4,
    wrapperClass: 'lg:-mt-32',
    rotateClass: 'rotate-1',
    aspectClass: 'aspect-4/5',
  },
  {
    id: 'snap5',
    image: s5,
    wrapperClass: 'lg:mt-8',
    rotateClass: '-rotate-2',
    aspectClass: 'aspect-square',
  },
  {
    id: 'snap6',
    image: s6,
    wrapperClass: 'lg:-mt-16',
    rotateClass: 'rotate-3',
    aspectClass: 'aspect-3/4',
  },
]

onMounted(() => {
  gsap.registerPlugin(ScrollTrigger)

  if (!mainContainer.value) return

  ctx = gsap.context(() => {
    // Hero Section staggered animation
    gsap.from('.gsap-hero-item', {
      y: 40,
      opacity: 0,
      duration: 1,
      stagger: 0.2,
      ease: 'power3.out',
    })

    // Feed Header animation
    gsap.from('.gsap-feed-header', {
      scrollTrigger: {
        trigger: '.gsap-feed-header',
        start: 'top 85%',
      },
      y: 30,
      opacity: 0,
      duration: 1,
      ease: 'power2.out',
    })

    // Snaps animations
    gsap.utils.toArray('.gsap-snap').forEach(snap => {
      gsap.from(snap, {
        scrollTrigger: {
          trigger: snap,
          start: 'top 85%',
        },
        y: 40,
        opacity: 0,
        duration: 0.8,
        ease: 'power2.out',
      })
    })

    // Load more button animation
    gsap.from('.gsap-load-more', {
      scrollTrigger: {
        trigger: '.gsap-load-more',
        start: 'top 90%',
      },
      y: 20,
      opacity: 0,
      duration: 0.8,
      ease: 'power2.out',
    })
  }, mainContainer.value)
})

onUnmounted(() => {
  ctx?.revert()
})
</script>

<style scoped>
body {
  background-color: #f7f8f6;
}
.material-symbols-outlined {
  font-variation-settings:
    'FILL' 0,
    'wght' 400,
    'GRAD' 0,
    'opsz' 24;
}
.polaroid-frame {
  box-shadow: 0 10px 30px -10px rgba(24, 26, 26, 0.12);
  transition: transform 0.6s cubic-bezier(0.34, 1.56, 0.64, 1);
}
.polaroid-frame:hover {
  transform: scale(1.02) rotate(-1deg);
}
.masonry-item:nth-child(even) {
  margin-top: 3rem;
}
.masonry-item:nth-child(odd) {
  margin-top: 0rem;
}

.fade-in-up {
  animation: fadeInUp 0.8s ease-out forwards;
  opacity: 0;
}
@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
.stagger-1 {
  animation-delay: 0.1s;
}
.stagger-2 {
  animation-delay: 0.2s;
}
.stagger-3 {
  animation-delay: 0.3s;
}
.stagger-4 {
  animation-delay: 0.4s;
}
</style>
