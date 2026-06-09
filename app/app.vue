<template>
  <div>
    <NuxtRouteAnnouncer />
    <NuxtPage />

    <!-- Global Snackbar/Toast -->
    <v-snackbar v-model="show" :color="color" location="top right" :timeout="timeout">
      {{ message }}

      <template #actions>
        <v-btn variant="text" density="compact" @click="show = false"> Close </v-btn>
      </template>
    </v-snackbar>
  </div>
</template>

<script setup lang="ts">
import { useToast } from '~/composables/useToast'

const { show, message, color, timeout } = useToast()
</script>
