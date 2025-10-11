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
          <p class="font-medium mb-2">Upload Images:</p>
          <IKContext
              :publicKey="publicKey"
              :urlEndpoint="urlEndpoint"
              :authenticator="authenticator"
          >
            <IKUpload
                :multiple="true"
                @success="onUploadSuccess"
                @error="onUploadError"
            />
          </IKContext>

          <div class="flex flex-wrap gap-3 mt-3">
            <img
                v-for="(img, idx) in newGem.images"
                :key="idx"
                :src="img"
                class="w-24 h-24 object-cover rounded border"
            />
          </div>
        </div>

        <div class="flex gap-2">
          <button type="submit" class="bg-emerald-600 text-white px-4 py-2 rounded">
            {{ editingId ? "Update Gem" : "Add Gem" }}
          </button>
          <button v-if="editingId" @click="cancelEdit" type="button" class="px-4 py-2 rounded border">
            Cancel
          </button>
        </div>
      </form>

      <h2 class="text-xl font-semibold mt-8 mb-3">All Gems</h2>
      <ul>
        <li v-for="gem in gems" :key="gem.id" class="flex justify-between items-center p-2 border-b">
          <span>{{ gem.name }} - ${{ gem.price }}</span>
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
import { ref } from "vue";
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
// ZMĚNA ZDE: Importujeme typ 'Gem' z externího souboru
import type { Gem } from "../../models/Gem.ts";

const publicKey = import.meta.env.VITE_IMAGEKIT_PUBLIC_KEY;
const urlEndpoint = import.meta.env.VITE_IMAGEKIT_URL_ENDPOINT;

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

const ADMIN_EMAILS = ["illimelnik2706@gmail.com"];
const user = ref<User | null>(null);
const gems = ref<Gem[]>([]);
const editingId = ref<string | null>(null);

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
  images: [], // přidáno
  isNew: false,
});
const newGem = ref<Gem>(getInitialGemState());

const onUploadSuccess = (response: any) => {
  console.log("✅ Upload success:", response);
  newGem.value.images.push(response.url);

  if (!newGem.value.image) {
    newGem.value.image = response.url;
  }
};

const onUploadError = (error: any) => {
  console.error("❌ Upload failed:", error);
  alert("Image upload failed. Check console for details.");
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
  if (!newGem.value.name || !newGem.value.price || newGem.value.images.length === 0) {
    alert("Name, price and at least one image are required.");
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
  newGem.value = { ...gem };
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