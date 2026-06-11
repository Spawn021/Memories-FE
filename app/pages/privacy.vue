<template>
  <main class="h-screen w-screen bg-background text-on-background p-margin-mobile md:p-margin-desktop flex flex-col justify-between overflow-hidden selection:bg-primary/30">
    <!-- Top Decorative Header -->
    <header class="flex justify-between items-center text-secondary/40 font-body text-[11px] tracking-widest reveal-item" style="animation-delay: 50ms;">
      <span>MEMORIES ARCHIVE // PRIVACY</span>
      <span>SECURE END-TO-END</span>
    </header>

    <!-- Center Document Card -->
    <div class="my-auto mx-auto w-full max-w-[640px] z-10 px-2">
      <div class="reveal-item" style="animation-delay: 150ms;">
        <div class="bg-surface border border-border p-6 md:p-10 shadow-2xl relative rotate-[0.5deg] max-h-[72vh] flex flex-col transition-all duration-300 hover:rotate-0">
          <!-- Back Link & Header -->
          <div class="shrink-0 mb-6">
            <button 
              class="spring-btn flex items-center gap-2 font-body text-[11px] uppercase tracking-widest text-secondary hover:text-primary transition-colors cursor-pointer"
              @click="goBack"
            >
              <span class="material-symbols-outlined !text-[14px]">arrow_back</span>
              Back to space creator
            </button>

            <h1 class="font-poetic text-4xl md:text-5xl italic font-normal text-on-background mb-2 mt-5">
              Privacy Policy
            </h1>
            <p class="font-body text-[11px] uppercase tracking-widest text-secondary/50 border-b border-border pb-4">
              Last Updated: June 08, 2026 // Vol. 2026
            </p>
          </div>

          <!-- Scrollable Content -->
          <div class="flex-1 overflow-y-auto pr-3 space-y-6 text-[14px] leading-relaxed font-body text-on-background/80 custom-scroll">
            <section class="space-y-2">
              <h2 class="font-title font-bold text-[12px] uppercase tracking-wider text-primary">
                01 // Information Collection
              </h2>
              <p>
                We value your privacy above all. The only information we collect to create your space is your display name, username, email address, and hashed credentials. The media assets and written text entries you store are kept securely in your private gallery.
              </p>
            </section>

            <section class="space-y-2">
              <h2 class="font-title font-bold text-[12px] uppercase tracking-wider text-primary">
                02 // Use of Data
              </h2>
              <p>
                Your data is exclusively used to operate, secure, and maintain your personal archive. We do not sell, rent, or distribute your account info or uploaded content to any third-party marketing companies, advertisers, or aggregators.
              </p>
            </section>

            <section class="space-y-2">
              <h2 class="font-title font-bold text-[12px] uppercase tracking-wider text-primary">
                03 // Storage & Security
              </h2>
              <p>
                All data, images, and text entries are transmitted using Secure Socket Layer (SSL) encryption. Database items are protected using modern authentication protocols and restricted file access patterns on the backend server, preventing unauthorized retrieval.
              </p>
            </section>

            <section class="space-y-2">
              <h2 class="font-title font-bold text-[12px] uppercase tracking-wider text-primary">
                04 // User Rights & Portability
              </h2>
              <p>
                Your archive belongs entirely to you. You reserve the right to delete your account and clear all stored information and file assets from our servers at any time. To request a complete export of your stored memories, you can use the profile actions in your dashboard.
              </p>
            </section>

            <section class="space-y-2">
              <h2 class="font-title font-bold text-[12px] uppercase tracking-wider text-primary">
                05 // Cookies & Tracking
              </h2>
              <p>
                We utilize minimal functional cookies and local storage tokens solely to maintain authenticated sessions and remember layout preferences. No behavioral tracking cookies or third-party analytics scripts are running on the platform.
              </p>
            </section>
          </div>

          <!-- Card Footer Seal -->
          <div class="shrink-0 pt-4 mt-4 border-t border-border flex justify-between items-center text-secondary/40 font-body text-[10px] tracking-widest">
            <span>MEMORIES INC. // SECURITY & AUDITS</span>
            <span class="italic">Encryption Active</span>
          </div>
        </div>
      </div>
    </div>

    <!-- Bottom Footer -->
    <footer class="flex justify-between items-center text-secondary/30 font-body text-[11px] tracking-widest reveal-item" style="animation-delay: 250ms;">
      <span>© 2026 MEMORIES</span>
      <span>ALL RIGHTS PRESERVED</span>
    </footer>
  </main>
</template>

<script setup lang="ts">
import { navigateTo } from '#app'
import { useRouter } from 'vue-router'

const router = useRouter()

const goBack = () => {
  if (window.history.length > 1) {
    router.back()
  } else {
    navigateTo('/register')
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
</style>>
