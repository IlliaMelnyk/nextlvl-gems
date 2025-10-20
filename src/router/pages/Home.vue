<template>
  <div class="bg-black text-white overflow-x-hidden">
    <Navbar />

    <section id="home" class="relative pt-[80px] min-h-[450px] overflow-hidden">
      <!-- Obrázek na pozadí -->
      <div class="absolute inset-0 bg-cover bg-center scale-100" :style="`background-image: url('${heroImage}')`" aria-hidden="true" ></div>

      <!-- Tmavý překryv pro lepší kontrast -->
      <div class="absolute inset-0 bg-black/30"></div>

      <!-- Obsah -->
      <div class="relative z-10 max-w-5xl mx-2 px-6 pt-24 pb-16 flex flex-col items-start text-left">
        <h1 class="text-4xl md:text-6xl font-extrabold leading-tight"> Transparency<br/>is the key</h1>
        <router-link to="/products" class="mt-4 inline-block px-6 py-3 rounded-full font-semibold shadow-green-500 bg-emerald-700 text-black hover:bg-amber-500 transition" > View products </router-link>
      </div>

    </section>
    <!-- New Gems -->
    <section id="new-gems" class="scroll-mt-10 bg-gray-100 text-black pt-10">
      <div class="max-w-6xl mx-auto px-6">
        <h2 class="text-3xl font-bold mb-8 text-center ">New Gems</h2>
        <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
          <GemCard v-for="gem in newGems" :key="gem.id" :gem="gem" />
        </div>
      </div>
    </section>

    <!-- About -->
    <section id="about" class="scroll-mt-12 bg-gray-100 text-black pt-4">
      <div class="max-w-6xl mx-auto px-6 grid md:grid-cols-2 gap-12 items-center">
        <div>
          <h2 class="text-4xl font-bold mb-6 ">About us</h2>
          <p class="text-lg leading-relaxed mb-10">
            At Nextlevel Gems, we believe that transparency is the key to building trust with our clients.
            Every gem we provide comes with verified details about its origin, quality, and value.
          </p>
        </div>
        <div class="flex justify-center">
          <img src="/about.png" alt="About Nextlevel Gems" class="rounded-lg w-full max-w-md" />
        </div>
      </div>
    </section>

    <!-- Contact -->
    <section id="contact" class="scroll-mt-24 bg-gray-100 text-black pb-20">
      <div class="max-w-6xl mx-auto px-6">
        <h2 class="text-4xl font-bold text-center mb-12">Contact Us</h2>
        <div class="grid md:grid-cols-2 gap-10">
          <form
              action="https://formspree.io/f/xldpawoy"
              method="POST"
              class="space-y-6"
          >
            <input type="text" name="name" placeholder="Your Name" class="w-full border rounded-lg px-4 py-2" required />
            <input type="email" name="email" placeholder="you@example.com" class="w-full border rounded-lg px-4 py-2" required />
            <textarea name="message" rows="5" placeholder="Write your message..." class="w-full border rounded-lg px-4 py-2" required></textarea>
            <button type="submit" class="bg-black text-white px-6 py-3 rounded-lg hover:bg-gray-800 transition">
              Send Message
            </button>
          </form>
          <div class="space-y-6">
            <p class="text-lg">Have any questions? Reach out to us and we’ll get back to you as soon as possible.</p>
            <div>
              <p><strong>Email:</strong> nextlvlgem@gmail.com</p>
              <p><strong>Instagram:</strong> @nextlevel_gems</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
import Navbar from "../../components/Navbar.vue";
import GemCard from "../../components/GemCard.vue";
import type { Gem } from "../../models/Gem";
import { fetchGems } from "../../gem.ts";
import { ref, onMounted, computed } from "vue";

const allGems = ref<Gem[]>([]);

// ZDE JE ZMĚNA: Zobrazí se pouze první 3 nové drahokamy
const newGems = computed(() => allGems.value.filter(g => g.isNew).slice(0, 3));
const heroImage = "/emerald-hero2.jpg";
onMounted(async () => {
  try {
    const data = await fetchGems();
    allGems.value = data;
  } catch (err) {
    console.error("Error fetching gems:", err);
  }
});
</script>

