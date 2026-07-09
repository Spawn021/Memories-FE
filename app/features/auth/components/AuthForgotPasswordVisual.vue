<template>
  <div class="absolute inset-0 flex items-center justify-center pointer-events-none">
    <!-- Main Collage Image Container -->
    <div class="absolute top-[45%] left-1/2 -translate-x-1/2 -translate-y-1/2 w-[65%] max-w-md pointer-events-auto">
      <div
        class="reveal-item"
        style="animation-delay: 600ms"
      >
        <div
          class="shadow-2xl bg-surface p-5"
          :style="getImageStyle"
        >
          <div class="aspect-3-4 overflow-hidden grayscale-20 sepia-10">
            <img
              alt="Vintage Key Collage"
              class="w-full h-full object-cover"
              src="~/assets/images/forgot_password_collage.png"
            />
          </div>
        </div>
      </div>
    </div>

    <!-- Floating Label Element -->
    <div class="absolute bottom-[20%] right-[15%] z-20 pointer-events-auto">
      <div
        class="reveal-item"
        style="animation-delay: 800ms"
      >
        <div
          class="bg-surface p-4 shadow-sm border border-border"
          :style="getFloatingLabelStyle"
        >
          <div class="italic font-title text-primary text-xl">Recall</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
const props = defineProps<{
  moveX: number
  moveY: number
  isAnimated: boolean
}>()

const getImageStyle = computed(() => {
  if (!props.isAnimated) {
    return {
      transform: 'rotate(-2deg)',
    }
  }
  const x = props.moveX * 1.5
  const y = props.moveY * 1.5
  return {
    transform: `translate(${x}px, ${y}px) rotate(-2deg)`,
    transition: 'transform 0.15s ease-out',
  }
})

const getFloatingLabelStyle = computed(() => {
  if (!props.isAnimated) {
    return {
      transform: 'rotate(6deg)',
    }
  }
  const x = props.moveX * 3.0
  const y = props.moveY * 3.0
  return {
    transform: `translate(${x}px, ${y}px) rotate(6deg)`,
    transition: 'transform 0.15s ease-out',
  }
})
</script>
