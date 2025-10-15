<template>
  <header
      class="w-full fixed top-0 left-0 z-40 transition-colors duration-300"
      :class="navbarClass"
  >
    <div class="max-w-[1200px] mx-auto flex items-center justify-between py-5 px-6">
      <router-link to="/" class="text-xl font-bold tracking-wide hover:opacity-80 transition">
        Nextlevel Gems
      </router-link>

      <!-- Desktop navigace -->
      <nav class="hidden md:flex items-center gap-6">
        <a href="/#home" class="hover:underline">Home</a>
        <a href="/#new-gems" class="hover:underline">New Gems</a>
        <a href="/#about" class="hover:underline">About us</a>
        <a href="/#contact" class="hover:underline">Contact</a>

        <div class="relative group" v-if="categories && Object.keys(categories).length">
          <router-link to="/products" class="hover:underline cursor-pointer py-4">
            All products
          </router-link>

          <!-- 1. úroveň: kategorie -->
          <div
              class="absolute top-full right-0 invisible group-hover:visible opacity-0 group-hover:opacity-100 transition-all duration-300 pt-2"
          >
            <div
                class="bg-white text-black shadow-lg rounded-md w-44 py-2 z-50"
            >
              <div
                  v-for="(subcategories, category) in categories"
                  :key="category"
                  class="relative group/item"
              >
                <div
                    class="flex justify-between items-center px-4 py-2 text-sm hover:bg-emerald-50 cursor-pointer"
                >
                  <router-link
                      :to="`/products/${(category || '').toLowerCase()}`"
                      class="w-full text-left"
                  >
                    {{ category }}
                  </router-link>
                  <span class="pl-2 text-gray-400">&lsaquo;</span>
                </div>

                <!-- 2. úroveň: podkategorie (má scroll) -->
                <div
                    class="absolute top-0 right-full mr-1 bg-white text-black shadow-lg rounded-md w-48 py-2 z-50 invisible group-hover/item:visible opacity-0 group-hover/item:opacity-100 transition-all duration-300"
                    style="max-height: 60vh; overflow-y: auto;"
                >
                  <router-link
                      v-for="subcategory in subcategories"
                      :key="subcategory"
                      :to="`/products/${(category || '').toLowerCase()}/${(subcategory || '').toLowerCase()}`"
                      class="block px-4 py-2 text-sm hover:bg-emerald-50"
                  >
                    {{ subcategory }}
                  </router-link>
                </div>
              </div>
            </div>
          </div>
        </div>

      </nav>

      <!-- Mobilní menu tlačítko -->
      <button class="md:hidden z-50" @click="open = !open" aria-label="Toggle menu">
        <svg
            v-if="!open"
            class="h-6 w-6"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
        >
          <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M4 6h16M4 12h16M4 18h16"
          />
        </svg>
      </button>
    </div>

    <!-- Mobilní menu -->
    <transition name="fade">
      <div
          v-if="open"
          class="md:hidden fixed inset-0 bg-black/80 text-white overflow-y-auto"
      >
        <button
            @click="open = false"
            class="fixed top-5 right-6 z-50"
            aria-label="Close menu"
        >
          <svg
              class="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
          >
            <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </button>

        <div class="px-6 pt-24 pb-8 space-y-4">
          <a href="/#home" @click="open = false" class="block">Home</a>
          <a href="/#about" @click="open = false" class="block">About us</a>
          <a href="/#contact" @click="open = false" class="block">Contact</a>

          <div>
            <router-link
                to="/products"
                @click="open = false"
                class="block mb-2 font-semibold"
            >All products</router-link
            >
            <div class="pl-4 space-y-2">
              <div
                  v-for="(subcategories, category) in categories"
                  :key="category"
              >
                <button
                    @click="toggleSubCategory(category)"
                    class="w-full text-left flex justify-between items-center font-semibold"
                >
                  <span>{{ category }}</span>
                  <span>{{ openSubCategory === category ? '−' : '+' }}</span>
                </button>
                <div
                    v-if="openSubCategory === category"
                    class="pl-2 pt-2 space-y-2"
                >
                  <router-link
                      v-for="subcategory in subcategories"
                      :key="subcategory"
                      :to="`/products/${category.toLowerCase()}/${subcategory.toLowerCase()}`"
                      @click="open = false"
                      class="block text-sm hover:text-emerald-300"
                  >
                    {{ subcategory }}
                  </router-link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </transition>
  </header>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted, computed, watch } from "vue";
import { useRoute } from "vue-router";

const open = ref(false);
const scrolled = ref(false);
const route = useRoute();
const openSubCategory = ref('');

const categories: Record<string, string[]> = {
  Faceted: ["Beryl", "Garnet", "Chrysoberyl", "Kornerupine", "Quartz", "Ruby", "Sapphire", "Spinel", "Tanzanite", "Topaz", "Tourmaline"],
  Rough: ["Beryl", "Garnet", "Chrysoberyl", "Kornerupine", "Quartz", "Ruby", "Sapphire", "Spinel", "Tanzanite", "Topaz", "Tourmaline"]
};

const toggleSubCategory = (category: string) => {
  openSubCategory.value = openSubCategory.value === category ? '' : category;
};

const handleScroll = () => { scrolled.value = window.scrollY > 50; };
onMounted(() => { window.addEventListener("scroll", handleScroll); });
onUnmounted(() => { window.removeEventListener("scroll", handleScroll); });

const navbarClass = computed(() => {
  if (route.path === "/") {
    return scrolled.value ? "bg-gray-200 text-black shadow" : "bg-transparent text-white";
  } else {
    return "bg-gray-100 text-black shadow";
  }
});

// Zablokuj scroll při otevřeném mobilním menu
watch(open, (isOpen) => {
  document.body.style.overflow = isOpen ? 'hidden' : '';
  openSubCategory.value = '';
});
</script>

<style scoped>
.fade-enter-active, .fade-leave-active { transition: opacity .15s; }
.fade-enter-from, .fade-leave-to { opacity: 0; }
</style>
