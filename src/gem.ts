import { collection, getDocs, doc, getDoc } from "firebase/firestore";
import { db } from "./firebase";
import type { Gem } from "./models/Gem";

export const fetchGems = async (): Promise<Gem[]> => {
    const snapshot = await getDocs(collection(db, "gems"));
    return snapshot.docs.map((docSnap) => ({
        id: docSnap.id,
        ...(docSnap.data() as Omit<Gem, "id">),
    }));
};

export const fetchGemById = async (id: string): Promise<Gem | null> => {
    const docRef = doc(db, "gems", id);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
        return { id: docSnap.id, ...(docSnap.data() as Omit<Gem, "id">) };
    }
    return null;
};