<script setup>
  import { ref } from "vue"
  import PanelMenu from "primevue/panelmenu"

  const menuItems = ref([
    { label: "Home", to: "/" },
    { label: "Settings", to: "/settings" },
    { label: "Profile", to: "/profile" },
  ])
</script>

<template>
  <div class="flex h-screen">
    <aside class="w-64 bg-gray-700 text-white p-4">
      <h2 class="text-lg font-bold text-center mb-4 py-10">Get Productive</h2>
      <PanelMenu :model="menuItems" class="w-full" />
    </aside>

    <main class="flex-1 p-6">
      <router-view />
    </main>
  </div>
</template>
