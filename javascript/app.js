import { initializeApp } from "https://www.gstatic.com/firebasejs/9.0.0/firebase-app.js";
import { getDatabase, ref, set } from "https://www.gstatic.com/firebasejs/9.0.0/firebase-database.js";
import { getStorage, ref as storageRef, uploadBytes, getDownloadURL } from "https://www.gstatic.com/firebasejs/9.0.0/firebase-storage.js";

// Configurações do Firebase
const firebaseConfig = {
    apiKey: "AIzaSyC5A5vvzMLaIFXZ6E-LFF4iKLTjCR4prCo",
    authDomain: "demandasproject.firebaseapp.com",
    databaseURL: "https://demandasproject-default-rtdb.firebaseio.com",
    projectId: "demandasproject",
    storageBucket: "demandasproject.appspot.com",
    messagingSenderId: "463000200167",
    appId: "1:463000200167:web:da60108422c9a8a54f9342"
  };

// Inicializa o Firebase
const app = initializeApp(firebaseConfig);
const db = getDatabase(app);
const storage = getStorage(app);

// Função para enviar uma nova demanda
document.getElementById('demanda-form').addEventListener('submit', async (event) => {
    event.preventDefault();

    const usuario = document.getElementById('usuario').value;
    const problemaResumido = document.getElementById('problemaResumido').value;
    const email = document.getElementById('email').value;
    const servidor = document.getElementById('servidor').value;
    const descricao = document.getElementById('descricao').value;
    const imagemFile = document.getElementById('imagem').files[0];
    const status = document.getElementById('status').value;
    const numero = new Date().getTime();

    let imagemUrl = "";

    if (imagemFile) {
        const imageRef = storageRef(storage, 'images/' + imagemFile.name);
        try {
            const snapshot = await uploadBytes(imageRef, imagemFile);
            imagemUrl = await getDownloadURL(snapshot.ref);
        } catch (error) {
            document.getElementById('edit-message').classList.add('error');
            document.getElementById('edit-message').innerText = 'Erro ao fazer upload da imagem: ' + error.message;
            return;
        }
    }

    try {
        await set(ref(db, 'demandas/' + numero), {
            usuario,
            descricao,
            email,
            imagemUrl, // URL da imagem no Firebase Storage
            numero,
            problemaResumido,
            servidor,
            status // Adiciona o status
        });
        document.getElementById('edit-message').classList.add ('success');
        document.getElementById('edit-message').innerText = 'Demanda registrada com sucesso!';
        document.getElementById('demanda-form').reset(); // Limpa o formulário
    } catch (error) {
        document.getElementById('edit-message').classList.add('error');
        document.getElementById('edit-message').innerText = 'Erro ao registrar demanda: ' + error.message;
    }
});
