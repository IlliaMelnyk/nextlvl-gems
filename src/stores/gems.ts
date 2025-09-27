import { defineStore } from "pinia";
import { ref } from "vue";
import type { Gem } from "../models/Gem";

export const useGemStore = defineStore("gems", () => {
    const gems = ref<Gem[]>([]);
    const selectedGem = ref<Gem | null>(null);
    const isLoading = ref(false);
    const error = ref<string | null>(null);

    async function fetchGems() {
        try {
            isLoading.value = true;
            error.value = null;
            gems.value = [
                {
                    id: "1",
                    name: "Emerald",
                    description: "Beautiful deep green emerald.",
                    price: 2500,
                    images: ["/images/emerald.jpg"],
                    carat: 2.1,
                    origin: "Colombia",
                },
                {
                    id: "2",
                    name: "Ruby",
                    description: "Bright red ruby, perfect for jewelry.",
                    price: 3100,
                    images: ["/images/ruby.jpg"],
                    carat: 1.8,
                    origin: "Myanmar",
                },
            ];
        } catch (e) {
            error.value = "Failed to load gems.";
        } finally {
            isLoading.value = false;
        }
    }

    function getGemById(id: string) {
        return gems.value.find((g) => g.id === id) || null;
    }

    return {
        gems,
        selectedGem,
        isLoading,
        error,
        fetchGems,
        getGemById,
    };
});