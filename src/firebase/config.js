import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';  // Importa Storage

const firebaseConfig = {
  apiKey: "AIzaSyB6JLNv0K8m05xsSo283bpFJEtQY7huYW0",
  authDomain: "reropa-7ba1a.firebaseapp.com",
  projectId: "reropa-7ba1a",
  storageBucket: "reropa-7ba1a.appspot.app",
  messagingSenderId: "23830411811",
  appId: "1:23830411811:web:3f8f57b463e81696074f96"
};

const app = initializeApp(firebaseConfig);

const auth = getAuth(app);
const db = getFirestore(app);
const storage = getStorage(app);  // Inicializa Storage

export { auth, db, storage };


