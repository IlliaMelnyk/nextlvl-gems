<template>
  <div class="p-6">
    <h1 class="text-2xl font-bold mb-4">Admin Panel</h1>

    <div v-if="!user">
      <button @click="handleLogin" class="bg-emerald-600 text-white px-4 py-2 rounded">
        Login with Google
      </button>
    </div>

    <div v-else>
      <div class="flex justify-between items-center mb-6">
        <p>Logged in as {{ user.email }}</p>
        <button @click="handleLogout" class="bg-red-600 text-white px-4 py-2 rounded">
          Logout
        </button>
      </div>

      <form @submit.prevent="saveGem" class="space-y-4 bg-slate-50 p-4 rounded-lg">
        <h2 class="text-xl font-semibold">{{ editingId ? "Edit Gem" : "Add New Gem" }}</h2>

        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label class="block text-sm font-medium text-gray-700">Category</label>
            <select v-model="newGem.category" class="mt-1 block w-full border p-2 rounded-md" required>
              <option disabled value="">Please select one</option>
              <option v-for="cat in Object.keys(categories)" :key="cat" :value="cat">
                {{ cat }}
              </option>
            </select>
          </div>
          <div v-if="newGem.category">
            <label class="block text-sm font-medium text-gray-700">Subcategory</label>
            <select v-model="newGem.subcategory" class="mt-1 block w-full border p-2 rounded-md" required>
              <option disabled value="">Please select one</option>
              <option v-for="subcat in categories[newGem.category]" :key="subcat" :value="subcat">
                {{ subcat }}
              </option>
            </select>
          </div>
        </div>

        <input v-model="newGem.name" placeholder="Name (e.g., Tsavorite 2,98ct)" class="border p-2 w-full" required />
        <input v-model="newGem.status" placeholder="Status (e.g., Available)" class="border p-2 w-full" />
        <textarea v-model="newGem.description" placeholder="Description" class="border p-2 w-full h-24" required></textarea>
        <input v-model="newGem.origin" placeholder="Origin (e.g., Merelani-Tanzania)" class="border p-2 w-full" />
        <input v-model="newGem.weight" placeholder="Weight (e.g., 2,98ct/0,596g)" class="border p-2 w-full" />
        <input v-model="newGem.dimensions" placeholder="Dimensions (e.g., 9,15x8,15x5,9mm)" class="border p-2 w-full" />
        <input v-model="newGem.treatment" placeholder="Treatment (e.g., None)" class="border p-2 w-full" />
        <input v-model="newGem.clarity" placeholder="Clarity (e.g., Loupe-clean)" class="border p-2 w-full" />
        <input v-model="newGem.cut" placeholder="Cut (e.g., Heart)" class="border p-2 w-full" />
        <input v-model.number="newGem.price" placeholder="Price" type="number" class="border p-2 w-full" required />

        <div>
          <p class="font-medium mb-2">Upload Images & Videos (via ImageKit):</p>
          <IKContext :publicKey="publicKey" :urlEndpoint="urlEndpoint" :authenticator="authenticator">
            <IKUpload
                :multiple="true"
                @success="onUploadSuccess"
                @error="onUploadError"
                :validateFile="validateFile"
                :onUploadStart="onUploadStart"
            />
          </IKContext>

          <p class="text-sm text-gray-600 mt-1">Accepted file types: Images (jpg, png, gif, webp) and Videos (mp4, mov, webm, avi).</p>

          <p class="font-medium mt-4 mb-2">Uploaded Images:</p>
          <div class="flex flex-wrap gap-4 mt-3">
            <div v-for="(img, idx) in newGem.images" :key="'img-'+idx" class="relative">
              <img :src="img" class="w-24 h-24 object-cover rounded border" />
              <button @click="removeImage(idx)" type="button" title="Remove image" class="absolute -top-2 -right-2 bg-red-600 text-white rounded-full w-6 h-6 flex items-center justify-center font-bold text-sm leading-none">
                &times;
              </button>
            </div>
            <p v-if="!newGem.images || newGem.images.length === 0" class="text-sm text-gray-500">No images uploaded yet.</p>
          </div>
        </div>

        <div>
          <p class="font-medium mb-2">Uploaded Videos & External URLs:</p>
          <div class="flex flex-col gap-2 mt-3">
            <div
                v-for="(videoUrl, idx) in newGem.videos"
                :key="'vid-'+idx"
                class="relative flex justify-between items-center bg-white p-2 border rounded"
            >
              <span class="text-sm truncate mr-4">{{ videoUrl }}</span>
              <button
                  @click="removeVideo(idx)"
                  type="button"
                  title="Remove video"
                  class="bg-red-600 text-white rounded-full w-6 h-6 flex items-center justify-center font-bold text-sm leading-none shrink-0"
              >
                &times;
              </button>
            </div>
            <p v-if="!newGem.videos || newGem.videos.length === 0" class="text-sm text-gray-500">No videos added yet.</p>
          </div>

          <p class="font-medium mt-4 mb-2">Add External Video URL (Vimeo or YouTube):</p>
          <div class="flex gap-2">
            <input
                v-model="videoUrlInput"
                placeholder="https://vimeo.com/123456789 or https://youtube.com/watch?v=..."
                class="border p-2 w-full"
            />
            <button
                @click="addVideoUrl"
                type="button"
                class="bg-blue-600 text-white px-4 py-2 rounded shrink-0"
            >
              Add URL
            </button>
          </div>
        </div>

        <div class="flex gap-2">
          <button
              type="submit"
              class="bg-emerald-600 text-white px-4 py-2 rounded"
              :disabled="isUploading"
              :class="{ 'opacity-50 cursor-not-allowed': isUploading }"
          >
            <span v-if="isUploading">
              Uploading ({{ uploadInProgressCount }})...
            </span>
            <span v-else>
              {{ editingId ? "Update Gem" : "Add Gem" }}
            </span>
          </button>
          <button v-if="editingId" @click="cancelEdit" type="button" class="px-4 py-2 rounded border">
            Cancel
          </button>
        </div>
      </form>

      <h2 class="text-xl font-semibold mt-8 mb-3">All Gems</h2>

      <div class="flex flex-col sm:flex-row gap-4 mb-4 p-4 bg-white rounded-md shadow-sm">
        <div>
          <label class="block text-sm font-medium text-gray-700">Filter by Category</label>
          <select v-model="filterCategory" class="mt-1 block w-full sm:w-56 border p-2 rounded-md">
            <option value="all">All Categories</option>
            <option v-for="cat in Object.keys(categories)" :key="cat" :value="cat">
              {{ cat }}
            </option>
          </select>
        </div>
        <div v-if="filterCategory !== 'all'">
          <label class="block text-sm font-medium text-gray-700">Filter by Subcategory</label>
          <select v-model="filterSubcategory" class="mt-1 block w-full sm:w-56 border p-2 rounded-md">
            <option value="all">All Subcategories</option>
            <option v-for="subcat in availableFilterSubcategories" :key="subcat" :value="subcat">
              {{ subcat }}
            </option>
          </select>
        </div>
      </div>

      <div v-if="gems.length === 0" class="text-gray-500">Loading gems...</div>

      <div v-else-if="filteredGemsList.length === 0" class="text-gray-500 p-4 bg-white rounded-md shadow-sm">
        No gems found for the selected filter.
      </div>

      <ul v-else class="space-y-2">
        <li v-for="gem in filteredGemsList" :key="gem.id" class="flex flex-col sm:flex-row justify-between sm:items-center p-3 border-b bg-white rounded-md shadow-sm">
          <span class="font-medium text-gray-900 mb-2 sm:mb-0">
            {{ gem.name }}
            <span class="text-sm text-gray-500 font-normal ml-2">
              ({{ gem.category }} / {{ gem.subcategory }})
            </span>
          </span>

          <div class="flex items-center gap-4 flex-shrink-0">
            <label class="flex items-center gap-2 cursor-pointer">
              <input
                  type="checkbox"
                  :checked="gem.isNew"
                  @change="toggleNewStatus(gem)"
                  class="form-checkbox h-5 w-5"
              />
              <span class="text-sm">Is New</span>
            </label>
            <div>
              <button @click="editGem(gem)" class="text-blue-500 mr-2 hover:underline">Edit</button>
              <button @click="deleteGem(gem.id)" class="text-red-500 hover:underline">Delete</button>
            </div>
          </div>
        </li>
      </ul>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch, computed } from "vue";
import { IKContext, IKUpload } from "imagekitio-vue";
import { db, auth, login, logout } from "../../firebase";
import {
  collection,
  addDoc,
  getDocs,
  deleteDoc,
  doc,
  updateDoc,
} from "firebase/firestore";
import { onAuthStateChanged, type User } from "firebase/auth";
import type { Gem } from "../../models/Gem.ts"; // Uprav cestu pokud je potřeba

const publicKey = import.meta.env.VITE_IMAGEKIT_PUBLIC_KEY;
const urlEndpoint = import.meta.env.VITE_IMAGEKIT_URL_ENDPOINT;

const categories: Record<string, string[]> = {
  Faceted: ["Beryl", "Garnet", "Chrysoberyl", "Kornerupine", "Quartz", "Ruby", "Peridot", "Sapphire", "Spinel", "Tanzanite", "Topaz", "Tourmaline"],
  Rough: ["Beryl", "Garnet", "Chrysoberyl", "Kornerupine", "Quartz", "Ruby", "Peridot", "Sapphire", "Spinel", "Tanzanite", "Topaz", "Tourmaline"]
};

const authenticator = async () => {
  try {
    const response = await fetch("https://imagekitauth-vinocveq4q-uc.a.run.app"); // Nahraď svou URL
    if (!response.ok) {
      throw new Error(`Auth request failed with status ${response.status}`);
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("🔥 Authentication request failed:", error);
    throw error; // Rethrow error to notify ImageKit component
  }
};

const ADMIN_EMAILS = ["illimelnik2706@gmail.com","gadasp@gmail.com"]; // Příklad
const user = ref<User | null>(null);
const gems = ref<Gem[]>([]);
const editingId = ref<string | null>(null);

const uploadInProgressCount = ref(0);
const isUploading = computed(() => uploadInProgressCount.value > 0);

const getInitialGemState = (): Gem => ({
  name: "", status: "Available", description: "", origin: "", weight: "",
  dimensions: "", treatment: "", clarity: "", cut: "", price: 0,
  image: "", images: [], videos: [], isNew: false, category: "", subcategory: "",
});

const newGem = ref<Gem>(getInitialGemState());
const videoUrlInput = ref("");

watch(() => newGem.value.category, () => {
  newGem.value.subcategory = "";
});

const filterCategory = ref<string>('all');
const filterSubcategory = ref<string>('all');

// Computed pro podkategorie ve FILTRU
const availableFilterSubcategories = computed(() => {
  if (filterCategory.value && filterCategory.value !== 'all') {
    return categories[filterCategory.value] || [];
  }
  return [];
});

// Watcher pro resetování filtru podkategorií
watch(filterCategory, () => {
  filterSubcategory.value = 'all';
});

// Computed pro FILTROVANÝ seznam drahokamů
const filteredGemsList = computed(() => {
  let list = [...gems.value]; // Začneme se všemi

  // 1. Filtrování podle kategorie
  if (filterCategory.value !== 'all') {
    list = list.filter(gem => gem.category === filterCategory.value);
  }

  // 2. Filtrování podle podkategorie
  if (filterSubcategory.value !== 'all') {
    list = list.filter(gem => gem.subcategory === filterSubcategory.value);
  }

  // 3. Seřadíme filtrovaný seznam podle jména
  return list.sort((a, b) => a.name.localeCompare(b.name));
});

const validateFile = (file: File): boolean => {
  const isImageMime = file.type.startsWith('image/');
  const isVideoMime = file.type.startsWith('video/');
  const allowedImageExt = ['.jpg', '.jpeg', '.png', '.gif', '.webp'];
  const allowedVideoExt = ['.mp4', '.mov', '.webm', '.avi', '.mkv'];

  const fileNameLower = file.name.toLowerCase();
  const isImageExt = allowedImageExt.some(ext => fileNameLower.endsWith(ext));
  const isVideoExt = allowedVideoExt.some(ext => fileNameLower.endsWith(ext));

  return isImageMime || isVideoMime || isImageExt || isVideoExt;
};

const removeImage = (indexToRemove: number) => {
  if (!newGem.value.images) return;
  const removedUrl = newGem.value.images[indexToRemove];
  newGem.value.images.splice(indexToRemove, 1);
  if (newGem.value.image === removedUrl) {
    newGem.value.image = newGem.value.images[0] || "";
  }
};

const addVideoUrl = () => {
  const url = videoUrlInput.value.trim();
  if (url) {
    if (!newGem.value.videos) newGem.value.videos = [];
    if (url.includes("vimeo.com") || url.includes("youtube.com") || url.includes("youtu.be")) {
      if (newGem.value.videos.includes(url)) {
        alert("This video URL is already added.");
        return;
      }
      newGem.value.videos.push(url);
      videoUrlInput.value = "";
    } else {
      alert("Please enter a valid Vimeo or YouTube URL.");
    }
  }
};

const removeVideo = (indexToRemove: number) => {
  if (newGem.value.videos) {
    newGem.value.videos.splice(indexToRemove, 1);
  }
};

const onUploadStart = () => {
  uploadInProgressCount.value++;
};

const onUploadFinished = () => {
  if (uploadInProgressCount.value > 0) {
    uploadInProgressCount.value--;
  }
};

const onUploadSuccess = (response: any) => {
  console.log("Upload success:", response);
  if (!response?.url) {
    console.error("Invalid response from ImageKit");
    onUploadFinished();
    return;
  }

  if (!newGem.value.images) newGem.value.images = [];
  if (!newGem.value.videos) newGem.value.videos = [];

  if (response.fileType === 'image') {
    newGem.value.images.push(response.url);
    if (!newGem.value.image) {
      newGem.value.image = response.url;
    }
  } else if (response.fileType === 'video') {
    newGem.value.videos.push(response.url);
  } else {
    // Fallback based on extension
    const urlLower = response.url.toLowerCase();
    if (['.jpg', '.jpeg', '.png', '.gif', '.webp'].some(ext => urlLower.endsWith(ext))) {
      newGem.value.images.push(response.url);
      if (!newGem.value.image) newGem.value.image = response.url;
    } else if (['.mp4', '.mov', '.webm', '.avi', '.mkv'].some(ext => urlLower.endsWith(ext))) {
      newGem.value.videos.push(response.url);
    } else {
      console.warn("Uploaded file type unknown, adding to images as fallback:", response.url);
      newGem.value.images.push(response.url);
    }
  }
  onUploadFinished();
};

const onUploadError = (error: any) => {
  console.error("❌ Upload failed:", error);
  let message = "Upload failed. Check console for details.";
  if (error?.message) {
    message += `\nError: ${error.message}`;
  }
  alert(message);
  onUploadFinished();
};

onAuthStateChanged(auth, (u) => {
  if (u && ADMIN_EMAILS.includes(u.email ?? "")) {
    user.value = u;
    fetchGems();
  } else {
    user.value = null;
    gems.value = [];
  }
});

const handleLogin = () => login();
const handleLogout = () => logout();

const fetchGems = async () => {
  try {
    const snapshot = await getDocs(collection(db, "gems"));
    gems.value = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() })) as Gem[];
  } catch (error) {
    console.error("Error fetching gems:", error);
  }
};

const saveGem = async () => {
  if (isUploading.value) {
    alert("Please wait for the uploads to finish.");
    return;
  }
  if (!newGem.value.name || (!newGem.value.images?.length && !newGem.value.videos?.length)) {
    alert("Name and at least one image or video are required.");
    return;
  }
  if (!newGem.value.category || !newGem.value.subcategory) {
    alert("Please select category and subcategory.");
    return;
  }

  // Zajistíme, že pole existují a hlavní obrázek je nastaven
  const gemData = {
    ...newGem.value,
    images: newGem.value.images || [],
    videos: newGem.value.videos || []
  };
  if (gemData.images.length > 0 && !gemData.image) {
    gemData.image = gemData.images[0];
  }

  delete gemData.id; // Odebereme ID před uložením/aktualizací

  try {
    if (editingId.value) {
      await updateDoc(doc(db, "gems", editingId.value), gemData);
    } else {
      await addDoc(collection(db, "gems"), gemData);
    }
    cancelEdit();
    await fetchGems();
  } catch (error) {
    console.error("Error saving gem:", error);
    alert("Failed to save gem. Please try again.");
  }
};

const deleteGem = async (id?: string) => {
  if (!id || !confirm("Are you sure you want to delete this gem?")) return;
  try {
    await deleteDoc(doc(db, "gems", id));
    await fetchGems();
  } catch (error) {
    console.error("Error deleting gem:", error);
    alert("Failed to delete gem.");
  }
};

const editGem = (gem: Gem) => {
  editingId.value = gem.id ?? null;
  // Sloučíme výchozí stav s načtenými daty a zajistíme existenci polí
  const gemToEdit = { ...getInitialGemState(), ...gem };
  gemToEdit.images = Array.isArray(gemToEdit.images) ? gemToEdit.images : [];
  gemToEdit.videos = Array.isArray(gemToEdit.videos) ? gemToEdit.videos : [];
  newGem.value = gemToEdit;
};

const cancelEdit = () => {
  editingId.value = null;
  newGem.value = getInitialGemState();
  videoUrlInput.value = "";
  uploadInProgressCount.value = 0; // Reset počítadla
};

const toggleNewStatus = async (gem: Gem) => {
  if (!gem.id) return;
  const gemRef = doc(db, "gems", gem.id);
  try {
    const newStatus = !gem.isNew;
    await updateDoc(gemRef, { isNew: newStatus });
    const index = gems.value.findIndex(g => g.id === gem.id);
    if (index !== -1) {
      gems.value[index].isNew = newStatus;
    }
  } catch (error) {
    console.error("Error updating 'isNew' status:", error);
  }
};
</script>