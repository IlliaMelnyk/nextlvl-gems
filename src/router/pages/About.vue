<template>
  <div class="bg-gray-100 text-black min-h-screen">
    <Navbar />

    <section class="max-w-6xl mx-auto px-6 py-20">
      <div class="grid md:grid-cols-2 gap-12 items-center">
        <!-- Text -->
        <div>
          <h2 class="text-4xl font-bold mb-6">About us</h2>
          <p class="text-lg leading-relaxed mb-10">
            At Nextlevel Gems, we believe that
            transparency is the key to building trust with our clients.
            Every gem we provide comes with verified details about its
            origin, quality, and value.
          </p>
        </div>

        <!-- Image -->
        <div class="flex justify-center">
          <img
              src="/about-us.png"
              alt="About Nextlevel Gems"
              class="rounded-lg w-full max-w-md "
          >
        </div>
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
import Navbar from "../../components/Navbar.vue";
</script>

