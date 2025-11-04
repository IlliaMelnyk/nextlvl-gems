<template>
  <div class="bg-gray-100 text-black min-h-screen">
    <header class="w-full top-0 left-0 z-40 transition-colors ">
      <div class="max-w-[1200px] mx-auto flex items-center justify-between py-5 px-6">
        <router-link class="text-xl font-bold tracking-wide hover:opacity-80 " to="/">
          Nextlevel Gems
        </router-link>
      </div>
    </header>

    <section class="max-w-4xl mx-auto px-6 pb-20">
      <h2 class="text-3xl font-bold text-center mb-4 capitalize">{{ pageTitle }}</h2>

      <div class="flex flex-col md:flex-row gap-4 mb-10 w-full">
        <input
            v-model="searchQuery"
            class="flex-1 border rounded px-4 py-2 focus:outline-none focus:ring-2 focus:ring-emerald-500"
            placeholder="Search within selection..."
            type="text"
        />

        <div class="relative">
          <button
              @click="isDropdownOpen = !isDropdownOpen"
              class="border rounded px-4 py-2 w-full md:w-56 text-left flex justify-between items-center focus:outline-none focus:ring-2 focus:ring-emerald-500"
          >
            <span class="capitalize">{{ displaySelection }}</span>
            <svg class="h-4 w-4 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"/>
            </svg>
          </button>

          <div
              v-if="isDropdownOpen"
              class="absolute top-full right-0 mt-1 bg-white text-black shadow-lg rounded-md w-56 py-2 z-50 overflow-y-auto max-h-60"
          >
            <a @click="selectFilter('all')" class="block px-4 py-2 text-sm hover:bg-emerald-50 cursor-pointer">
              All Categories
            </a>
            <div
                v-for="(subcategories, category) in categories"
                :key="category"
                class="relative group/item"
            >
              <div class="flex justify-between items-center text-sm hover:bg-emerald-50 cursor-pointer">
                <a @click="selectFilter(category)" class="w-full text-left px-4 py-2">
                  {{ category }}
                </a>
              </div>
              <div v-for="subcategory in subcategories" :key="subcategory">
                <a @click="selectFilter(category, subcategory)" class="block pl-8 pr-4 py-2 text-sm hover:bg-emerald-50 cursor-pointer">
                  {{ subcategory }}
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div class="grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-3 gap-6">
        <GemCard
            v-for="gem in filteredGems"
            :key="gem.id"
            :gem="gem"
        />
        <p v-if="filteredGems.length === 0 && !loading" class="col-span-full text-center text-gray-500">
          No gems found matching your criteria.
        </p>
      </div>
      <p v-if="loading" class="text-center text-gray-500">Loading gems...</p>
    </section>
  </div>
</template>

<script lang="ts" setup>
import { ref, computed, onMounted, watch } from "vue";
import { useRoute, useRouter } from "vue-router";
import GemCard from "../../components/GemCard.vue";
import type { Gem } from "../../models/Gem";
import { fetchGems } from "../../gem.ts";

const route = useRoute();
const router = useRouter(); // Přidáno pro programovou navigaci

const allGems = ref<Gem[]>([]);
const searchQuery = ref("");
const loading = ref(true);

// --- Změny pro nový dropdown ---

// Stejná struktura kategorií jako v Navbaru
const categories: Record<string, string[]> = {
  Faceted: ["Beryl", "Garnet", "Chrysoberyl", "Kornerupine", "Quartz", "Ruby", "Peridot", "Sapphire", "Spinel", "Tanzanite", "Topaz", "Tourmaline"],
  Rough: ["Beryl", "Garnet", "Chrysoberyl", "Kornerupine", "Quartz", "Ruby", "Peridot", "Sapphire", "Spinel", "Tanzanite", "Topaz", "Tourmaline"]
};

// Stav pro ovládání dropdownu
const isDropdownOpen = ref(false);

// Refy pro uložení aktuálně vybrané cesty z URL (jen pro zobrazení)
const selectedCategory = ref<string | null>(null);
const selectedSubcategory = ref<string | null>(null);

// Funkce, která změní URL podle výběru v dropdownu
const selectFilter = (category: string, subcategory?: string) => {
  if (category === 'all') {
    router.push('/products');
  } else if (subcategory) {
    router.push(`/products/${category.toLowerCase()}/${subcategory.toLowerCase()}`);
  } else {
    router.push(`/products/${category.toLowerCase()}`);
  }
  isDropdownOpen.value = false; // Zavřít dropdown po výběru
};

// Sledovač, který aktualizuje `selectedCategory` a `selectedSubcategory` podle URL
// Toto zajistí, že se dropdown správně nastaví při příchodu z Navbaru i při navigaci
watch(() => route.params, (newParams) => {
  selectedCategory.value = (newParams.category as string) || null;
  selectedSubcategory.value = (newParams.subcategory as string) || null;
}, { immediate: true }); // `immediate: true` zajistí spuštění hned po načtení komponenty


// Computed property pro text v tlačítku dropdownu
const displaySelection = computed(() => {
  if (selectedSubcategory.value) {
    return `${selectedCategory.value} / ${selectedSubcategory.value}`;
  }
  if (selectedCategory.value) {
    return selectedCategory.value;
  }
  return 'All Categories';
});

// --- Konec změn pro dropdown ---

onMounted(async () => {
  try {
    allGems.value = await fetchGems();
  } catch (err) {
    console.error("Error fetching gems:", err);
  } finally {
    loading.value = false;
  }
});

const filteredGems = computed(() => {
  let list = allGems.value;

  const categoryFromUrl = route.params.category as string;
  const subcategoryFromUrl = route.params.subcategory as string;

  // 1. Filtrování podle URL (tato logika zůstává, je to náš hlavní zdroj pravdy)
  if (categoryFromUrl) {
    list = list.filter(gem => gem.category && gem.category.toLowerCase() === categoryFromUrl.toLowerCase());
  }
  if (subcategoryFromUrl) {
    list = list.filter(gem => gem.subcategory && gem.subcategory.toLowerCase() === subcategoryFromUrl.toLowerCase());
  }

  // 2. Filtrování podle vyhledávání (zůstává)
  if (searchQuery.value) {
    list = list.filter(gem =>
        gem.name.toLowerCase().includes(searchQuery.value.toLowerCase())
    );
  }

  return list;
});

const pageTitle = computed(() => {
  const subcategory = route.params.subcategory as string;
  const category = route.params.category as string;
  // Nahrazuje pomlčky mezerami pro hezčí zobrazení
  if (subcategory) return subcategory.replace(/-/g, ' ');
  if (category) return category.replace(/-/g, ' ');
  return "All Products";
});
</script>