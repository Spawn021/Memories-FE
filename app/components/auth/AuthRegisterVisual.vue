<template>
  <div class="absolute inset-0 flex items-center justify-center pointer-events-none">
    <!-- Asymmetric Collage Container -->
    <div class="grid grid-cols-2 gap-8 max-w-lg relative z-10 p-4 pointer-events-auto">
      <!-- Polaroid 1 -->
      <div class="animate-waterfall self-start delay-600">
        <div
          class="polaroid sienna-overlay"
          :style="getPolaroidStyle('-4deg', 0.5)"
        >
          <img
            alt="Memory fragment 1"
            class="w-full aspect-3/4 object-cover"
            src="~/assets/images/polaroid_1.png"
          />
        </div>
      </div>
      <!-- Polaroid 2 -->
      <div class="animate-waterfall mt-12 delay-700">
        <div
          class="polaroid sienna-overlay"
          :style="getPolaroidStyle('2deg', 1.0)"
        >
          <img
            alt="Memory fragment 2"
            class="w-full aspect-4/3 object-cover"
            src="~/assets/images/polaroid_2.png"
          />
        </div>
      </div>
      <!-- Polaroid 3 -->
      <div class="animate-waterfall -mt-6 delay-800">
        <div
          class="polaroid sienna-overlay"
          :style="getPolaroidStyle('-2deg', 1.5)"
        >
          <img
            alt="Memory fragment 3"
            class="w-full aspect-square object-cover"
            src="~/assets/images/polaroid_3.png"
          />
        </div>
      </div>
      <!-- Polaroid 4 -->
      <div class="animate-waterfall self-end delay-900">
        <div
          class="polaroid sienna-overlay"
          :style="getPolaroidStyle('5deg', 2.0)"
        >
          <img
            alt="Memory fragment 4"
            class="w-full aspect-3/4 object-cover"
            src="~/assets/images/polaroid_4.png"
          />
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

const getPolaroidStyle = (baseRotation: string, depth: number) => {
  const rotationVar = { '--rotation': baseRotation } as Record<string, string | number>
  if (!props.isAnimated) {
    return rotationVar
  }
  const x = props.moveX * depth * 3.0
  const y = props.moveY * depth * 3.0
  return {
    ...rotationVar,
    transform: `rotate(${baseRotation}) translate(${x}px, ${y}px)`,
    transition: 'transform 0.15s ease-out',
  }
}
</script>
