import { initializeApp } from "https://www.gstatic.com/firebasejs/9.0.0/firebase-app.js";
import {
  getDatabase,
  ref,
  get,
  update,
  remove,
} from "https://www.gstatic.com/firebasejs/9.0.0/firebase-database.js";
import {
  getStorage,
  ref as storageRef,
  uploadBytes,
  getDownloadURL,
} from "https://www.gstatic.com/firebasejs/9.0.0/firebase-storage.js";

// Configurações do Firebase

const firebaseConfig = {
  apiKey: "AIzaSyC5A5vvzMLaIFXZ6E-LFF4iKLTjCR4prCo",
  authDomain: "demandasproject.firebaseapp.com",
  databaseURL: "https://demandasproject-default-rtdb.firebaseio.com",
  projectId: "demandasproject",
  storageBucket: "demandasproject.appspot.com",
  messagingSenderId: "463000200167",
  appId: "1:463000200167:web:da60108422c9a8a54f9342",
};

// Inicializa o Firebase
const app = initializeApp(firebaseConfig);
const db = getDatabase(app);
const storage = getStorage(app);

function contarCards() {
  const cards = document.querySelectorAll(".card");
  const quantidadeDeCards = cards.length;
  return quantidadeDeCards;
}

export async function fetchDemandas() {
  const demandasContainer = document.getElementById("demandas-container");

  const demandasRef = ref(db, "demandas");
  try {
    const snapshot = await get(demandasRef);
    if (snapshot.exists()) {
      const demandas = snapshot.val();
      demandasContainer.innerHTML = ""; // Limpa o container
      for (const id in demandas) {
        const data = demandas[id];
        const card = document.createElement("div");
        card.className = "card";
        const statusClass = `status-${data.status
          .toLowerCase()
          .replace(/\s+/g, "-")}`;

        switch (data.status) {
          case "Cadastrada":
            card.classList.add("cadastrada");
            break;
          case "Enviado":
            card.classList.add("enviado");
            break;
          case "Verificando":
            card.classList.add("verificando");
            break;
          case "Corrigido":
            card.classList.add("corrigido");
            break;
          default:
            break;
        }

        card.innerHTML = `
            <h2>Demanda #${data.numero}</h2>
            <div class="conteudo">
            <p><span>Registrado por:</span> ${
              data.usuario ? data.usuario : "Sem dados"
            }</p>
            <p><span>Problema:</span> ${data.problemaResumido}</p>
            <p><span>Usuário:</span> <span class=usuarios>${
              data.email
            }</span></p>
            <p><span>Servidor:</span> ${data.servidor}</p>
            <p><span>Descrição:</span> <span class=description>${
              data.descricao
            } </span></p>
            <p><span>Status:</span> <span class="status ${statusClass}">${
          data.status
        }</span></p>
            <p><span>Imagem:</span> ${
              data.imagemUrl
                ? `<a href="${data.imagemUrl}" target="_blank">Visualizar Imagem</a>`
                : "Nenhuma imagem enviada"
            }</p>
            
            <p class="dataHoraCad">${
              data.dataHora
                ? new Date(data.dataHora).toLocaleString([], {
                    year: "numeric",
                    month: "2-digit",
                    day: "2-digit",
                    hour: "2-digit",
                    minute: "2-digit",
                  })
                : ""
            }</p>

            </div>
            <div class="buttons-container">
              <button data-id="${id}" class="edit-status-btn editar">Status</button>
              <button data-id="${id}" class="edit-other-btn demanda">Demanda</button>
              <button data-id="${id}" class="delete-btn excluir">Excluir</button>
            </div>
          `;
        demandasContainer.appendChild(card);
      }

      updateCounters();
      // Adiciona event listeners aos botões de edição e exclusão
      document.querySelectorAll(".edit-status-btn").forEach((button) => {
        button.addEventListener("click", handleEditStatusClick);
      });
      document.querySelectorAll(".edit-other-btn").forEach((button) => {
        button.addEventListener("click", handleEditOtherClick);
      });
      document.querySelectorAll(".delete-btn").forEach((button) => {
        button.addEventListener("click", handleDeleteClick);
      });

      const totalDeCards = contarCards();
      document.getElementById(
        "totalDemandas"
      ).textContent = `(${totalDeCards})`;
    } else {
      demandasContainer.innerHTML = "<p>Nenhuma demanda encontrada.</p>";
    }
  } catch (error) {
    document.getElementById("edit-message").innerText =
      "Erro ao buscar demandas: " + error.message;
  }
}

// Função para abrir o modal de edição de status
function handleEditStatusClick(event) {
  const id = event.target.getAttribute("data-id");
  document.getElementById("edit-id").value = id;

  // Tente encontrar o card mais próximo
  const card = event.target.closest(".card");
  if (card) {
    const statusElement = card.querySelector(".status");
    if (statusElement) {
      document.getElementById("edit-status").value = statusElement.textContent;
    } else {
      console.error("Elemento .status não encontrado dentro do card.");
    }
  } else {
    console.error("Elemento card não encontrado.");
  }

  document.getElementById("edit-modal").style.display = "flex";
}

// Função para abrir o modal de edição de outros itens
function handleEditOtherClick(event) {
  const id = event.target.getAttribute("data-id");
  document.getElementById("edit-other-id").value = id;
  const card = event.target.closest(".card");
  document.getElementById("edit-other-usuario").value = card
    .querySelector("p:nth-of-type(1)")
    .textContent.split(": ")[1];
  document.getElementById("edit-other-problemaResumido").value = card
    .querySelector("p:nth-of-type(2)")
    .textContent.split(": ")[1];
  document.getElementById("edit-other-email").value = card
    .querySelector("p:nth-of-type(3)")
    .textContent.split(": ")[1];
  document.getElementById("edit-other-servidor").value = card
    .querySelector("p:nth-of-type(4)")
    .textContent.split(": ")[1];
  document.getElementById("edit-other-descricao").value = card
    .querySelector("p:nth-of-type(5)")
    .textContent.split(": ")[1];

  document.getElementById("edit-other-modal").style.display = "flex";
}

// Função para abrir o modal de confirmação de exclusão
function handleDeleteClick(event) {
  const id = event.target.getAttribute("data-id");
  document.getElementById("delete-modal").style.display = "flex";
  document.getElementById("confirm-delete-btn").onclick = () =>
    handleDeleteConfirm(id);
  document.getElementById("cancel-delete-btn").onclick = () =>
    (document.getElementById("delete-modal").style.display = "none");
}

// Função para fechar modais
function closeModal(modalId) {
  document.getElementById(modalId).style.display = "none";
}

// Adiciona event listeners aos botões de fechar
document.querySelectorAll(".close-btn").forEach((button) => {
  button.addEventListener("click", function () {
    // Obtém o modal pai do botão
    const modal = button.closest(".modal");
    if (modal) {
      closeModal(modal.id);
    }
  });
});

// Função para salvar alterações no status
document
  .getElementById("edit-status-form")
  .addEventListener("submit", async (event) => {
    event.preventDefault();
    const id = document.getElementById("edit-id").value;
    const status = document.getElementById("edit-status").value;
    const messageElement = document.getElementById("edit-message");

    try {
      await update(ref(db, "demandas/" + id), { status });
      messageElement.classList.add("success");
      messageElement.innerText = "Status atualizado com sucesso!";
      document.getElementById("edit-modal").style.display = "none";
      fetchDemandas(); // Atualiza a lista de demandas

      // Configura o timer para ocultar a mensagem após 3 segundos (3000 milissegundos)
      setTimeout(() => {
        messageElement.innerText = ""; // Limpa o texto da mensagem
        messageElement.classList.remove("success");
      }, 3000);
    } catch (error) {
      messageElement.classList.add("error");
      messageElement.innerText = "Erro ao atualizar status: " + error.message;

      // Configura o timer para ocultar a mensagem após 5 segundos (5000 milissegundos)
      setTimeout(() => {
        messageElement.innerText = ""; // Limpa o texto da mensagem
        messageElement.classList.remove("error");
      }, 5000);
    }
  });

// Função para salvar alterações nos outros itens da demanda
document
  .getElementById("edit-other-form")
  .addEventListener("submit", async (event) => {
    event.preventDefault();
    const id = document.getElementById("edit-other-id").value;
    const usuario = document.getElementById("edit-other-usuario").value;
    const problemaResumido = document.getElementById(
      "edit-other-problemaResumido"
    ).value;
    const email = document.getElementById("edit-other-email").value;
    const servidor = document.getElementById("edit-other-servidor").value;
    const descricao = document.getElementById("edit-other-descricao").value;
    const imagemFile = document.getElementById("edit-other-imagem").files[0];
    const messageElement = document.getElementById("edit-message");

    try {
      let imagemUrl = "";
      if (imagemFile) {
        // Upload da imagem
        const imagemRef = storageRef(storage, "imagens/" + imagemFile.name);
        const snapshot = await uploadBytes(imagemRef, imagemFile);
        imagemUrl = await getDownloadURL(snapshot.ref);
      }

      await update(ref(db, "demandas/" + id), {
        usuario,
        problemaResumido,
        email,
        servidor,
        descricao,
        imagemUrl,
      });
      messageElement.classList.add("success");
      messageElement.innerText = "Demanda atualizada com sucesso!";
      document.getElementById("edit-other-modal").style.display = "none";
      fetchDemandas(); // Atualiza a lista de demandas

      // Configura o timer para ocultar a mensagem após 3 segundos (3000 milissegundos)
      setTimeout(() => {
        messageElement.innerText = ""; // Limpa o texto da mensagem
        messageElement.classList.remove("success");
      }, 3000);
    } catch (error) {
      messageElement.classList.add("error");
      messageElement.innerText = "Erro ao atualizar demanda: " + error.message;

      // Configura o timer para ocultar a mensagem após 5 segundos (5000 milissegundos)
      setTimeout(() => {
        messageElement.innerText = ""; // Limpa o texto da mensagem
        messageElement.classList.remove("error");
      }, 5000);
    }
  });

// Função para excluir uma demanda
async function handleDeleteConfirm(id) {
  const messageElement = document.getElementById("edit-message");

  try {
    await remove(ref(db, "demandas/" + id));
    messageElement.classList.add("success");
    messageElement.innerText = "Demanda excluída com sucesso!";
    document.getElementById("delete-modal").style.display = "none";
    fetchDemandas(); // Atualiza a lista de demandas

    // Configura o timer para ocultar a mensagem após 3 segundos (3000 milissegundos)
    setTimeout(() => {
      messageElement.innerText = ""; // Limpa o texto da mensagem
      messageElement.classList.remove("success");
    }, 3000);
  } catch (error) {
    messageElement.classList.add("error");
    messageElement.innerText = "Erro ao excluir demanda: " + error.message;

    // Configura o timer para ocultar a mensagem após 5 segundos (5000 milissegundos)
    setTimeout(() => {
      messageElement.innerText = ""; // Limpa o texto da mensagem
      messageElement.classList.remove("error");
    }, 5000);
  }
}

// // Chama a função para buscar demandas quando a página carrega
// fetchDemandas();

// Função para monitorar o campo de busca em tempo real e filtrar as demandas
document
  .getElementById("search-input")
  .addEventListener("input", function (event) {
    const keyword = event.target.value.toLowerCase(); // Obtém a palavra-chave em minúsculas
    filterDemandas(keyword);
  });

function filterDemandas(keyword) {
  const cards = document.querySelectorAll(".card");

  cards.forEach((card) => {
    const title = card.querySelector("h2").textContent.toLowerCase(); // Título da demanda
    const user = card
      .querySelector("p:nth-of-type(1)")
      .textContent.toLowerCase(); // Usuario que cadastrou a demanda
    const problem = card
      .querySelector("p:nth-of-type(2)")
      .textContent.toLowerCase(); // Problema resumido
    const email = card
      .querySelector("p:nth-of-type(3)")
      .textContent.toLowerCase(); // E-mail do usuário
    const server = card
      .querySelector("p:nth-of-type(4)")
      .textContent.toLowerCase(); // Servidor
    const stats = card
      .querySelector("p:nth-of-type(5)")
      .textContent.toLowerCase(); // Status
    const description = card
      .querySelector(".description")
      .textContent.toLowerCase(); // Descrição

    // Verifica se a palavra-chave aparece em algum dos campos
    if (
      title.includes(keyword) ||
      user.includes(keyword) ||
      problem.includes(keyword) ||
      email.includes(keyword) ||
      server.includes(keyword) ||
      stats.includes(keyword) ||
      description.includes(keyword)
    ) {
      card.style.display = ""; // Mostra o card
    } else {
      card.style.display = "none"; // Esconde o card
    }
  });
}

// Inicializa a busca de demandas ao carregar a página
document.addEventListener("DOMContentLoaded", fetchDemandas);
