<template>
  <div class="bg-black text-white overflow-x-hidden">
  <Navbar />

    <section id = "home" class="relative pt-[80px] h-[350px] ">
      <div class="absolute inset-0 bg-cover bg-center scale-110" :style="`background-image: url('${heroImage}')`" aria-hidden="true" ></div>
      <!-- dark overlay -->
      <div class="absolute inset-0 bg-black/55">

      </div> <!-- content -->
      <div class="relative z-10 max-w-5xl mx-2 px-6 pt-12 pb-20 flex flex-col items-start text-left">
        <h1 class="text-4xl md:text-6xl font-extrabold leading-tight"> Transparency<br/>is the key</h1>
        <router-link to="/products" class="mt-8 inline-block px-6 py-3 rounded-full font-semibold shadow-green-600 bg-emerald-700 text-black hover:bg-amber-500 transition" > View products </router-link>
      </div>
      <div class="relative z-10 max-w-5xl mx-auto px-6 pb-20 text-center text-sm text-gray-300">
      </div>
    </section>

    <!-- New Gems -->
    <section id="new-gems" class="bg-gray-100 text-black pt-10">
      <div class="max-w-6xl mx-auto px-6">
        <h2 class="text-3xl font-bold mb-8 text-center ">New Gems</h2>
        <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
          <GemCard v-for="gem in newGems" :key="gem.id" :gem="gem" />
        </div>
      </div>
    </section>

    <!-- About -->
    <section id="about" class="bg-gray-100 text-black pt-4">
      <div class="max-w-6xl mx-auto px-6 grid md:grid-cols-2 gap-12 items-center">
        <div>
          <h2 class="text-4xl font-bold mb-6 ">About us</h2>
          <p class="text-lg leading-relaxed mb-10">
            At Nextlevel Gems, we believe that transparency is the key to building trust with our clients.
            Every gem we provide comes with verified details about its origin, quality, and value.
          </p>
        </div>
        <div class="flex justify-center">
          <img src="/about-us.png" alt="About Nextlevel Gems" class="rounded-lg w-full max-w-md" />
        </div>
      </div>
    </section>

    <!-- Contact -->
    <section id="contact" class="bg-gray-100 text-black">
      <div class="max-w-6xl mx-auto px-6">
        <h2 class="text-4xl font-bold text-center mb-12">Contact Us</h2>
        <div class="grid md:grid-cols-2 gap-12">
          <form class="space-y-6">
            <input type="text" placeholder="Your Name" class="w-full border rounded-lg px-4 py-2" />
            <input type="email" placeholder="you@example.com" class="w-full border rounded-lg px-4 py-2" />
            <textarea rows="5" placeholder="Write your message..." class="w-full border rounded-lg px-4 py-2"></textarea>
            <button type="submit" class="bg-black text-white px-6 py-3 rounded-lg hover:bg-gray-800 transition">
              Send Message
            </button>
          </form>
          <div class="space-y-6">
            <p class="text-lg">Have any questions? Reach out to us and we’ll get back to you as soon as possible.</p>
            <div>
              <p><strong>Email:</strong> info@nextlevelgems.com</p>
              <p><strong>Phone:</strong> +420 123 456 789</p>
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

const heroImage = "/emerald-hero.png";

const allGems: Gem[] = [
  { id: "1", name: "Emerald Radiance", price: 1200, images: ["/emerald-1.png"], isNew: true },
  { id: "2", name: "Ruby Flame", price: 1500, images: ["/ruby-1.png"], isNew: true },
  { id: "3", name: "Sapphire Sky", price: 980, images: ["/saphire-1.png"], isNew: true },
];
const newGems = allGems.filter(g => g.isNew);
</script>
