import { defineStore } from "pinia";
import { ref } from "vue";
import type { Gem } from "../models/Gem";

export const useGemStore = defineStore("gems", () => {
    const gems = ref<Gem[]>([]);
    const selectedGem = ref<Gem | null>(null);
    const isLoading = ref(false);
    const error = ref<string | null>(null);

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