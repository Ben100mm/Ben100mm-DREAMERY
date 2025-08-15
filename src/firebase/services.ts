import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  User,
} from "firebase/auth";
import {
  ref,
  set,
  get,
  push,
  update,
  remove,
  query,
  orderByChild,
  equalTo,
} from "firebase/database";
import { auth, database } from "./config";
import { brandColors } from "../theme";

// Authentication services
export const signIn = async (email: string, password: string) => {
  try {
    const userCredential = await signInWithEmailAndPassword(
      auth,
      email,
      password,
    );
    return { success: true, user: userCredential.user };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
};

export const signUp = async (email: string, password: string) => {
  try {
    const userCredential = await createUserWithEmailAndPassword(
      auth,
      email,
      password,
    );
    return { success: true, user: userCredential.user };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
};

export const signOutUser = async () => {
  try {
    await signOut(auth);
    return { success: true };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
};

export const getCurrentUser = (): User | null => {
  return auth.currentUser;
};

export const onAuthChange = (callback: (user: User | null) => void) => {
  return onAuthStateChanged(auth, callback);
};

// Deal data services
export const saveDealToCloud = async (dealData: any, dealId?: string) => {
  try {
    const user = getCurrentUser();
    if (!user) {
      throw new Error("User not authenticated");
    }

    const userId = user.uid;
    const dealsRef = ref(database, `users/${userId}/deals`);

    if (dealId) {
      // Update existing deal
      await update(ref(database, `users/${userId}/deals/${dealId}`), {
        ...dealData,
        updatedAt: new Date().toISOString(),
        updatedBy: user.email,
      });
      return { success: true, dealId };
    } else {
      // Create new deal
      const newDealRef = push(dealsRef);
      await set(newDealRef, {
        ...dealData,
        createdAt: new Date().toISOString(),
        createdBy: user.email,
        updatedAt: new Date().toISOString(),
        updatedBy: user.email,
      });
      return { success: true, dealId: newDealRef.key };
    }
  } catch (error: any) {
    return { success: false, error: error.message };
  }
};

export const loadDealsFromCloud = async () => {
  try {
    const user = getCurrentUser();
    if (!user) {
      throw new Error("User not authenticated");
    }

    const userId = user.uid;
    const dealsRef = ref(database, `users/${userId}/deals`);
    const snapshot = await get(dealsRef);

    if (snapshot.exists()) {
      const deals: Record<string, any> = {};
      snapshot.forEach((childSnapshot) => {
        deals[childSnapshot.key!] = childSnapshot.val();
      });
      return { success: true, deals };
    } else {
      return { success: true, deals: {} };
    }
  } catch (error: any) {
    return { success: false, error: error.message, deals: {} };
  }
};

export const deleteDealFromCloud = async (dealId: string) => {
  try {
    const user = getCurrentUser();
    if (!user) {
      throw new Error("User not authenticated");
    }

    const userId = user.uid;
    const dealRef = ref(database, `users/${userId}/deals/${dealId}`);
    await remove(dealRef);

    return { success: true };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
};

export const searchDealsByPropertyType = async (propertyType: string) => {
  try {
    const user = getCurrentUser();
    if (!user) {
      throw new Error("User not authenticated");
    }

    const userId = user.uid;
    const dealsRef = ref(database, `users/${userId}/deals`);
    const dealsQuery = query(
      dealsRef,
      orderByChild("propertyType"),
      equalTo(propertyType),
    );
    const snapshot = await get(dealsQuery);

    if (snapshot.exists()) {
      const deals: Record<string, any> = {};
      snapshot.forEach((childSnapshot) => {
        deals[childSnapshot.key!] = childSnapshot.val();
      });
      return { success: true, deals };
    } else {
      return { success: true, deals: {} };
    }
  } catch (error: any) {
    return { success: false, error: error.message };
  }
};
