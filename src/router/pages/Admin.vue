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
        <div>
          <p class="font-medium mb-2">Upload Images:</p>
          <IKContext :publicKey="publicKey" :urlEndpoint="urlEndpoint" :authenticator="authenticator">
            <IKUpload
                :multiple="true"
                @success="onUploadSuccess"
                @error="onUploadError"
                :validateFile="validateImageFile" :onUploadStart="onUploadStart"
            />
          </IKContext>

          <div class="flex flex-wrap gap-4 mt-3">
            <div v-for="(img, idx) in newGem.images" :key="idx" class="relative">
              <img :src="img" class="w-24 h-24 object-cover rounded border" />
              <button @click="removeImage(idx)" type="button" title="Remove image" class="absolute -top-2 -right-2 bg-red-600 text-white rounded-full w-6 h-6 flex items-center justify-center font-bold text-sm leading-none">
                &times;
              </button>
            </div>
          </div>
        </div>

        <div>
          <p class="font-medium mb-2">Upload Videos:</p>
          <IKContext :publicKey="publicKey" :urlEndpoint="urlEndpoint" :authenticator="authenticator">
            <IKUpload
                :multiple="true"
                @success="onVideoUploadSuccess"
                @error="onUploadError"
                :validateFile="validateVideoFile" :onUploadStart="onUploadStart"
            />
          </IKContext>

          <div class="flex flex-wrap gap-4 mt-3">
            <div v-for="(videoUrl, idx) in newGem.videos" :key="idx" class="relative">
              <video :src="videoUrl" class="w-24 h-24 object-cover rounded border" muted></video>
              <button @click="removeVideo(idx)" type="button" title="Remove video" class="absolute -top-2 -right-2 bg-red-600 text-white rounded-full w-6 h-6 flex items-center justify-center font-bold text-sm leading-none">
                &times;
              </button>
            </div>
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
              Nahrávám ({{ uploadInProgressCount }})...
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
      <ul>
        <li v-for="gem in gems" :key="gem.id" class="flex justify-between items-center p-2 border-b">
          <span>{{ gem.name }}</span>
          <div class="flex items-center gap-4">
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
              <button @click="editGem(gem)" class="text-blue-500 mr-2">Edit</button>
              <button @click="deleteGem(gem.id)" class="text-red-500">Delete</button>
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
import type { Gem } from "../../models/Gem.ts";

const publicKey = import.meta.env.VITE_IMAGEKIT_PUBLIC_KEY;
const urlEndpoint = import.meta.env.VITE_IMAGEKIT_URL_ENDPOINT;

const categories: Record<string, string[]> = {
  Faceted: [
    "Beryl", "Garnet", "Chrysoberyl", "Kornerupine", "Quartz",
    "Ruby", "Sapphire", "Spinel", "Tanzanite", "Topaz", "Tourmaline"
  ],
  Rough: [
    "Beryl", "Garnet", "Chrysoberyl", "Kornerupine", "Quartz",
    "Ruby", "Sapphire", "Spinel", "Tanzanite", "Topaz", "Tourmaline"
  ]
};

const authenticator = async () => {
  try {
    const response = await fetch("https://imagekitauth-vinocveq4q-uc.a.run.app");
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("🔥 Authentication request failed:", error);
    throw error;
  }
};

const ADMIN_EMAILS = ["illimelnik2706@gmail.com","gadasp@gmail.com"];
const user = ref<User | null>(null);
const gems = ref<Gem[]>([]);
const editingId = ref<string | null>(null);

// Sledování probíhajících nahrávání
const uploadInProgressCount = ref(0);
const isUploading = computed(() => uploadInProgressCount.value > 0);

const getInitialGemState = (): Gem => ({
  name: "",
  status: "Available",
  description: "",
  origin: "",
  weight: "",
  dimensions: "",
  treatment: "",
  clarity: "",
  cut: "",
  price: 0,
  image: "",
  images: [],
  videos: [],
  isNew: false,
  category: "",
  subcategory: "",
});
const newGem = ref<Gem>(getInitialGemState());

watch(() => newGem.value.category, () => {
  newGem.value.subcategory = "";
});

// --- NOVÉ ROBUSTNÍ VALIDAČNÍ FUNKCE ---
const validateImageFile = (file: File) => {
  const isImageMime = file.type.startsWith('image/');
  // Povolíme běžné typy obrázků
  const isImageExt = ['.jpg', '.jpeg', '.png', '.gif', '.webp'].some(ext =>
      file.name.toLowerCase().endsWith(ext)
  );
  // Pokud je Mime typ v pořádku NEBO přípona v pořádku, povol nahrání
  return isImageMime || isImageExt;
};

const validateVideoFile = (file: File) => {
  const isVideoMime = file.type.startsWith('video/');
  // Povolíme běžné typy videí, včetně .mov
  const isVideoExt = ['.mp4', '.mov', '.avi', '.webm', '.mkv', '.quicktime'].some(ext =>
      file.name.toLowerCase().endsWith(ext)
  );
  // Pokud je Mime typ v pořádku NEBO přípona v pořádku, povol nahrání
  return isVideoMime || isVideoExt;
};
// --- KONEC NOVÝCH FUNKCÍ ---


const removeImage = (indexToRemove: number) => {
  const removedUrl = newGem.value.images[indexToRemove];
  newGem.value.images.splice(indexToRemove, 1);
  if (newGem.value.image === removedUrl) {
    newGem.value.image = newGem.value.images[0] || "";
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
  console.log("✅ Image upload success:", response);
  newGem.value.images.push(response.url);
  if (!newGem.value.image) {
    newGem.value.image = response.url;
  }
  onUploadFinished();
};

const onVideoUploadSuccess = (response: any) => {
  console.log("✅ Video upload success:", response);
  if (!newGem.value.videos) {
    newGem.value.videos = [];
  }
  newGem.value.videos.push(response.url);
  onUploadFinished();
};

const onUploadError = (error: any) => {
  console.error("❌ Upload failed:", error);
  alert("Upload failed. Check console for details.");
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
  const snapshot = await getDocs(collection(db, "gems"));
  gems.value = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() })) as Gem[];
};

const saveGem = async () => {
  if (!newGem.value.name || (newGem.value.images.length === 0 && newGem.value.videos.length === 0)) {
    alert("Name and at least one image or video are required.");
    return;
  }

  const gemData = { ...newGem.value };
  delete gemData.id;
  if (editingId.value) {
    await updateDoc(doc(db, "gems", editingId.value), gemData);
  } else {
    await addDoc(collection(db, "gems"), gemData);
  }
  cancelEdit();
  await fetchGems();
};

const deleteGem = async (id?: string) => {
  if (!id || !confirm("Are you sure you want to delete this gem?")) return;
  await deleteDoc(doc(db, "gems", id));
  await fetchGems();
};

const editGem = (gem: Gem) => {
  editingId.value = gem.id ?? null;

  const mergedGem = { ...getInitialGemState(), ...gem };

  if (!Array.isArray(mergedGem.images)) {
    mergedGem.images = [];
  }
  if (!Array.isArray(mergedGem.videos)) {
    mergedGem.videos = [];
  }

  newGem.value = mergedGem;
};

const cancelEdit = () => {
  editingId.value = null;
  newGem.value = getInitialGemState();
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