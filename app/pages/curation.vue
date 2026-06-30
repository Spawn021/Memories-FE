<!-- eslint-disable vue/no-v-html -->
<template>
  <main
    ref="mainContainer"
    class="max-w-container-max mx-auto px-margin-desktop py-12 md:py-20"
  >
    <!-- Hero Section -->
    <header class="mb-16 md:mb-24 flex flex-col md:flex-row md:items-end justify-between gap-8 gsap-hero">
      <div class="max-w-2xl gsap-hero-item">
        <span class="font-body text-sm font-semibold tracking-wider text-primary uppercase block mb-4">
          {{ t('curation.headerLabel') }}
        </span>
        <h1
          class="font-title text-5xl md:text-6xl text-on-surface mb-6 leading-none"
          v-html="t('curation.heroTitle')"
        ></h1>
        <p class="font-body text-lg text-secondary max-w-lg">
          {{ t('curation.heroDesc') }}
        </p>
      </div>
      <div class="flex gap-4 gsap-hero-item">
        <button
          class="px-8 py-3 bg-primary text-white rounded-full font-title text-base font-medium hover:scale-105 active:scale-95 transition-spring shadow-lg"
        >
          {{ t('curation.newCollectionBtn') }}
        </button>
      </div>
    </header>
    <!-- Collections Grid -->
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-y-24 gap-x-16">
      <div
        v-for="collection in collections"
        :key="collection.id"
        :class="['group relative gsap-collection', collection.wrapperClass]"
      >
        <div class="polaroid-stack relative h-80 w-full mb-12">
          <div
            v-for="(card, index) in collection.cards"
            :key="index"
            :class="[card.type, 'absolute inset-0 bg-surface p-4 pb-12 whisper-shadow transition-spring', card.rotateClass]"
          >
            <div
              class="w-full h-full overflow-hidden bg-surface-container"
              :class="{ relative: card.hasOverlay }"
            >
              <img
                :class="['w-full h-full object-cover', card.imageClass]"
                :data-alt="card.alt"
                :src="card.image"
              />
              <div
                v-if="card.hasOverlay"
                class="absolute inset-0 bg-primary/10 mix-blend-overlay"
              ></div>
            </div>
            <div
              v-if="card.isTop"
              class="mt-4 flex justify-between items-center"
            >
              <span class="font-poetic text-xl text-on-surface">{{ t(`curation.collections.${collection.id}.title`) }}</span>
              <span class="font-body text-sm font-semibold tracking-wider text-secondary">{{
                t(`curation.collections.${collection.id}.items`)
              }}</span>
            </div>
          </div>
        </div>
        <div class="flex flex-col gap-4">
          <div class="flex items-center gap-2">
            <span class="px-3 py-1 bg-secondary text-on-secondary-container rounded-full text-[10px] font-bold uppercase tracking-tighter">
              {{ t(`curation.collections.${collection.id}.badge`) }}
            </span>
            <span class="text-secondary">• {{ t(`curation.collections.${collection.id}.lastEdited`) }}</span>
          </div>
          <button
            class="w-full py-4 border border-border bg-surface text-primary font-title text-base font-medium hover:bg-primary hover:text-white hover:scale-[1.02] active:scale-95 transition-spring rounded-xl flex items-center justify-center gap-2"
          >
            <span class="material-symbols-outlined text-[20px]">auto_stories</span>
            {{ t(`curation.collections.${collection.id}.curateBtn`) }}
          </button>
        </div>
      </div>
    </div>
    <!-- Tool Bento Section -->
    <section class="mt-40 mb-20">
      <h2 class="font-title text-4xl md:text-5xl mb-12 text-on-surface gsap-tools-header">{{ t('curation.toolsTitle') }}</h2>
      <div class="grid grid-cols-1 md:grid-cols-4 grid-rows-2 gap-6 h-auto md:h-125">
        <div
          class="md:col-span-2 md:row-span-2 bg-surface p-10 rounded-2xl border border-border flex flex-col justify-between whisper-shadow group gsap-tool"
        >
          <div>
            <div class="w-12 h-12 rounded-full bg-primary/30 flex items-center justify-center mb-6 group-hover:scale-110 transition-spring">
              <span class="material-symbols-outlined text-primary">auto_fix_high</span>
            </div>
            <h3 class="font-title text-2xl md:text-3xl mb-4">{{ t('curation.tools.tool1.title') }}</h3>
            <p class="text-secondary font-body text-base leading-relaxed">
              {{ t('curation.tools.tool1.desc') }}
            </p>
          </div>
          <button class="text-primary font-semibold flex items-center gap-2 hover:translate-x-2 transition-transform">
            {{ t('curation.tools.tool1.btn') }} <span class="material-symbols-outlined">arrow_forward</span>
          </button>
        </div>
        <div class="md:col-span-2 bg-secondary/10 p-8 rounded-2xl border border-border flex items-center gap-8 gsap-tool">
          <div class="flex-1">
            <h3 class="font-title text-2xl md:text-3xl mb-2">{{ t('curation.tools.tool2.title') }}</h3>
            <p class="text-secondary">{{ t('curation.tools.tool2.desc') }}</p>
          </div>
          <span class="material-symbols-outlined text-4xl text-secondary">label_important</span>
        </div>
        <div class="md:col-span-1 bg-primary/10 p-8 rounded-2xl border border-border flex flex-col justify-center text-center gsap-tool">
          <span class="material-symbols-outlined text-3xl text-tertiary mb-3">grid_view</span>
          <h4 class="font-semibold text-on-surface">{{ t('curation.tools.tool3.title') }}</h4>
        </div>
        <div class="md:col-span-1 bg-primary/5 p-8 rounded-2xl border border-border flex flex-col justify-center text-center gsap-tool">
          <span class="material-symbols-outlined text-3xl text-primary mb-3">share</span>
          <h4 class="font-semibold text-on-surface">{{ t('curation.tools.tool4.title') }}</h4>
        </div>
      </div>
    </section>
  </main>
</template>

<script setup>
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

const { t } = useI18n()

useHead({
  title: t('nav.curation'),
})

definePageMeta({
  layout: 'marketing',
})

import c1 from '~/assets/images/collection-1.jpg'
import c2 from '~/assets/images/collection-2.jpg'
import c3 from '~/assets/images/collection-3.jpg'
import c4 from '~/assets/images/collection-4.jpg'
import c5 from '~/assets/images/collection-5.jpg'
import c6 from '~/assets/images/collection-6.jpg'
import c7 from '~/assets/images/collection-7.jpg'

const collections = [
  {
    id: 'collection1',
    wrapperClass: '',
    cards: [
      {
        type: 'polaroid-1',
        rotateClass: '-rotate-3',
        image: c1,
        imageClass: 'grayscale opacity-30',
        alt: 'A warm, sun-drenched outdoor table setting at a Mediterranean villa, with soft golden hour light hitting linen napkins and wine glasses. The aesthetic is clean, minimalist, and editorial, with a palette of cream, sun-bleached wood, and soft Terracotta Rose accents. High-end lifestyle photography style.',
      },
      {
        type: 'polaroid-2',
        rotateClass: 'rotate-2',
        image: c2,
        imageClass: 'opacity-60',
        alt: 'Close up of a vintage film camera lying on a rustic wooden surface next to a dried wildflower. The lighting is soft and diffused, creating a nostalgic, airy atmosphere. Colors are muted greens and warm linens, consistent with a modern scrapbook aesthetic. Shot from a high-angle artistic perspective.',
      },
      {
        type: 'polaroid-3',
        rotateClass: '',
        image: c3,
        imageClass: '',
        hasOverlay: true,
        isTop: true,
        alt: 'A candid, joyful shot of a family laughing together at a summer garden party. The scene is bathed in natural, bright daylight. The composition is slightly asymmetrical and organic. The color palette features Sunlit Clementine and Muted Leaf, feeling energetic yet sophisticated and high-end.',
      },
    ],
  },
  {
    id: 'collection2',
    wrapperClass: 'lg:mt-12',
    cards: [
      {
        type: 'polaroid-1',
        rotateClass: 'rotate-[-5deg]',
        image: c4,
        imageClass: 'grayscale opacity-40',
        alt: 'A minimalist architectural detail of a clean white building against a clear blue sky. The composition is stark and modern, emphasizing geometric lines and shadows. The light is bright and crisp, fitting the modern minimalist visual style. No people are present, focusing on form and texture.',
      },
      {
        type: 'polaroid-3',
        rotateClass: '',
        image: c5,
        imageClass: '',
        isTop: true,
        alt: 'A cozy interior scene featuring a stacks of old books, a ceramic mug, and a soft wool blanket near a window. The morning light is cool and serene. The color palette is dominated by Canvas Linen and Muted Leaf, creating a calm and sanctuary-like atmosphere. High-end interior editorial photography.',
      },
    ],
  },
  {
    id: 'collection3',
    wrapperClass: 'lg:-mt-6',
    cards: [
      {
        type: 'polaroid-2',
        rotateClass: 'rotate-[4deg]',
        image: c6,
        imageClass: 'opacity-50',
        alt: 'A breathtaking view of a mountain range at sunrise, with mist clinging to the valleys. The light is soft and purple-toned. The style is expansive and epic, utilizing high contrast and wide-angle perspective. The mood is serene and awe-inspiring, echoing the nostalgic heritage of travel diaries.',
      },
      {
        type: 'polaroid-3',
        rotateClass: '',
        image: c7,
        imageClass: '',
        isTop: true,
        alt: 'Macro photography of a delicate blooming flower in a field, with a soft-focus background of greenery. The lighting is high-key and airy. The color palette uses vibrant Sunlit Clementine and soft Ivory. The aesthetic is youthful and energetic, focused on small, beautiful details of nature.',
      },
    ],
  },
]

const mainContainer = ref(null)
let ctx

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

    // Collections grid
    gsap.utils.toArray('.gsap-collection').forEach(item => {
      gsap.from(item, {
        scrollTrigger: {
          trigger: item,
          start: 'top 85%',
        },
        y: 40,
        opacity: 0,
        duration: 0.8,
        ease: 'power2.out',
      })
    })

    // Tools Header animation
    gsap.from('.gsap-tools-header', {
      scrollTrigger: {
        trigger: '.gsap-tools-header',
        start: 'top 85%',
      },
      y: 30,
      opacity: 0,
      duration: 1,
      ease: 'power2.out',
    })

    // Tools Bento animation
    gsap.from('.gsap-tool', {
      scrollTrigger: {
        trigger: '.gsap-tools-header',
        start: 'top 75%',
      },
      y: 30,
      opacity: 0,
      duration: 0.8,
      stagger: 0.15,
      ease: 'power2.out',
    })
  }, mainContainer.value)
})

onUnmounted(() => {
  ctx?.revert()
})
</script>

<style scoped>
.polaroid-stack:hover .polaroid-1 {
  transform: rotate(-6deg) translateX(-10px) translateY(-5px);
}
.polaroid-stack:hover .polaroid-2 {
  transform: rotate(4deg) translateX(10px) translateY(-8px);
}
.polaroid-stack:hover .polaroid-3 {
  transform: rotate(-2deg) translateY(-12px);
}

.transition-spring {
  transition: all 0.5s cubic-bezier(0.34, 1.56, 0.64, 1);
}

.frosted-glass {
  backdrop-filter: blur(12px);
  background: rgba(247, 248, 246, 0.6);
}

.whisper-shadow {
  box-shadow: 0 20px 40px -15px rgba(24, 26, 26, 0.08);
}

.active-nav-indicator::after {
  content: '';
  position: absolute;
  bottom: -4px;
  left: 0;
  width: 100%;
  height: 2px;
  background-color: #e26a4a;
}
</style>
