<template>
  <main
    class="h-screen w-screen bg-background text-on-background p-margin-mobile md:p-margin-desktop flex flex-col justify-between overflow-hidden selection:bg-primary/30"
  >
    <!-- Top Decorative Header -->
    <header
      class="flex justify-between items-center text-secondary/40 font-body text-[11px] tracking-widest reveal-item"
      style="animation-delay: 50ms"
    >
      <span>MEMORIES ARCHIVE // LEGAL</span>
      <span>SECURE END-TO-END</span>
    </header>

    <!-- Center Document Card -->
    <div class="my-auto mx-auto w-full max-w-[640px] z-10 px-2">
      <div
        class="reveal-item"
        style="animation-delay: 150ms"
      >
        <div
          class="bg-surface border border-border p-6 md:p-10 shadow-2xl relative rotate-[-0.5deg] max-h-[72vh] flex flex-col transition-all duration-300 hover:rotate-0"
        >
          <!-- Back Link & Header -->
          <div class="shrink-0 mb-6">
            <button
              class="spring-btn flex items-center gap-2 font-body text-[11px] uppercase tracking-widest text-secondary hover:text-primary transition-colors cursor-pointer"
              @click="goBack"
            >
              <span class="material-symbols-outlined !text-[14px]">arrow_back</span>
              Back to space creator
            </button>

            <h1 class="font-poetic text-4xl md:text-5xl italic font-normal text-on-background mb-2 mt-5">Terms of Service</h1>
            <p class="font-body text-[11px] uppercase tracking-widest text-secondary/50 border-b border-border pb-4">
              Last Updated: June 08, 2026 // Vol. 2026
            </p>
          </div>

          <!-- Scrollable Content -->
          <div class="flex-1 overflow-y-auto pr-3 space-y-6 text-[14px] leading-relaxed font-body text-on-background/80 custom-scroll">
            <section class="space-y-2">
              <h2 class="font-title font-bold text-[12px] uppercase tracking-wider text-primary">01 // Archive Purpose</h2>
              <p>
                Welcome to Memories. This application is designed as a secure, personal digital journal and gallery. By creating a space,
                you register an intimate vault dedicated to collecting, cataloging, and reflecting on your personal history.
              </p>
            </section>

            <section class="space-y-2">
              <h2 class="font-title font-bold text-[12px] uppercase tracking-wider text-primary">02 // User Space & Security</h2>
              <p>
                You are solely responsible for maintaining the confidentiality of your credentials. Any activity originating from your space
                is your sole responsibility. We employ industry-standard encryption practices to protect your archive, but encourage the use
                of unique, complex passwords.
              </p>
            </section>

            <section class="space-y-2">
              <h2 class="font-title font-bold text-[12px] uppercase tracking-wider text-primary">03 // Acceptable Content</h2>
              <p>
                This space is yours. You may upload texts, photographs, and records for your private archive. However, any content violating
                intellectual property rights or engaging in malicious activities targeting the platform infrastructure is strictly
                prohibited and subject to immediate space deletion.
              </p>
            </section>

            <section class="space-y-2">
              <h2 class="font-title font-bold text-[12px] uppercase tracking-wider text-primary">04 // Limitation of Liability</h2>
              <p>
                The platform is provided "as is" and "as available". We do not warrant that the services will be completely uninterrupted or
                error-free. Memories is not liable for accidental data loss; we advise maintaining offline backups of critical personal
                artifacts.
              </p>
            </section>

            <section class="space-y-2">
              <h2 class="font-title font-bold text-[12px] uppercase tracking-wider text-primary">05 // Modifications</h2>
              <p>
                We reserve the right to refine these terms at any time. Your continued use of the platform constitutes agreement to the
                updated framework. Significant updates will be communicated directly within your space dashboard.
              </p>
            </section>
          </div>

          <!-- Card Footer Seal -->
          <div
            class="shrink-0 pt-4 mt-4 border-t border-border flex justify-between items-center text-secondary/40 font-body text-[10px] tracking-widest"
          >
            <span>MEMORIES INC. // OFFICE OF PRIVACY</span>
            <span class="italic">Authorized Archive</span>
          </div>
        </div>
      </div>
    </div>

    <!-- Bottom Footer -->
    <footer
      class="flex justify-between items-center text-secondary/30 font-body text-[11px] tracking-widest reveal-item"
      style="animation-delay: 250ms"
    >
      <span>© 2026 MEMORIES</span>
      <span>ALL RIGHTS PRESERVED</span>
    </footer>
  </main>
</template>

<script setup lang="ts">
import { useHead } from '#imports'
import { navigateTo } from '#app'

useHead({
  title: 'Terms of Service',
})
import { useRouter } from 'vue-router'

const localePath = useLocalePath()
const router = useRouter()

const goBack = () => {
  if (window.history.length > 1) {
    router.back()
  } else {
    navigateTo(localePath('/register'))
  }
}
</script>

<style scoped>
.custom-scroll::-webkit-scrollbar {
  width: 3px;
}
.custom-scroll::-webkit-scrollbar-track {
  background: transparent;
}
.custom-scroll::-webkit-scrollbar-thumb {
  background-color: var(--border-strong);
  border-radius: 9px;
}
.custom-scroll::-webkit-scrollbar-thumb:hover {
  background-color: var(--primary);
}
</style>
