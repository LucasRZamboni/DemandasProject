


// Função para contar e exibir a quantidade de cards por status
function updateCounters() {
  const cards = document.querySelectorAll(".card");
  let countTodos = 0;
  let countCadastrado = 0;
  let countEnviado = 0;
  let countVerificando = 0;
  let countCorrigido = 0;

  cards.forEach((card) => {
    const statusElement = card.querySelector(".status");
    const status = statusElement ? statusElement.textContent.toLowerCase() : "";

    if (status === "cadastrada") countCadastrado++;
    if (status === "enviado") countEnviado++;
    if (status === "verificando") countVerificando++;
    if (status === "corrigido") countCorrigido++;
    countTodos++; // Contador total de cards
  });

  // Atualiza os contadores de cada status
  document.getElementById("contadorTodos").textContent = countTodos;
  document.getElementById("contadorCadastrado").textContent = countCadastrado;
  document.getElementById("contadorEnviado").textContent = countEnviado;
  document.getElementById("contadorVerificando").textContent = countVerificando;
  document.getElementById("contadorCorrigido").textContent = countCorrigido;
}

// Função para aplicar o filtro de status nas demandas
function applyStatusFilter() {
  const filtroTodos = document.getElementById("filtroTodos").checked;
  const filtroCadastrado = document.getElementById("filtroCadastrado").checked;
  const filtroEnviado = document.getElementById("filtroEnviado").checked;
  const filtroVerificando =
    document.getElementById("filtroVerificando").checked;
  const filtroCorrigido = document.getElementById("filtroCorrigido").checked;

  const cards = document.querySelectorAll(".card");

  cards.forEach((card) => {
    const statusElement = card.querySelector(".status");
    const status = statusElement ? statusElement.textContent.toLowerCase() : "";

    const showCard =
      filtroTodos ||
      (filtroCadastrado && status === "cadastrada") ||
      (filtroEnviado && status === "enviado") ||
      (filtroVerificando && status === "verificando") ||
      (filtroCorrigido && status === "corrigido");

    card.style.display = showCard ? "" : "none";
  });

  // Atualiza os contadores após aplicar o filtro
  updateCounters();
}

// Função para lidar com a seleção e desmarcação dos checkboxes
function handleCheckboxChange() {
  const filtroTodos = document.getElementById("filtroTodos");
  const checkboxes = document.querySelectorAll(
    '.filtro-control input[type="checkbox"]:not(#filtroTodos)'
  );

  if (this.id === "filtroTodos") {
    // Se o checkbox "Todos" for alterado, marque/desmarque todos os outros
    checkboxes.forEach((checkbox) => {
      checkbox.checked = filtroTodos.checked;
    });
  } else {
    // Se qualquer outro checkbox for alterado, desmarque o checkbox "Todos"
    if (!this.checked) {
      filtroTodos.checked = false;
    }
    // Verifique se todos os outros checkboxes estão marcados para marcar o "Todos"
    else if (Array.from(checkboxes).every((checkbox) => checkbox.checked)) {
      filtroTodos.checked = true;
    }
  }

  // Aplique o filtro após a mudança
  applyStatusFilter();
}

// Adicione o event listener para todos os checkboxes
document
  .querySelectorAll('.filtro-control input[type="checkbox"]')
  .forEach((checkbox) => {
    checkbox.addEventListener("change", handleCheckboxChange);
  });

// Função para garantir que todos os checkboxes estejam marcados ao carregar a página
function selectAllCheckboxesOnLoad() {
  const filtroTodos = document.getElementById("filtroTodos");
  const checkboxes = document.querySelectorAll(
    '.filtro-control input[type="checkbox"]:not(#filtroTodos)'
  );

  // Marque o checkbox "Todos" e todos os outros
  filtroTodos.checked = true;
  checkboxes.forEach((checkbox) => {
    checkbox.checked = true;
  });

  // Aplique o filtro ao carregar a página e atualize os contadores
  applyStatusFilter();
}

// Marque todos os checkboxes e aplique o filtro ao carregar a página
document.addEventListener("DOMContentLoaded", () => {
  selectAllCheckboxesOnLoad();
});

function abrirFiltro() {
  const containerFiltro = document.querySelector(".filtroContainer");
  const filtroIcon = document.getElementById("filtroIcon");

  if (containerFiltro && filtroIcon) {
      if (containerFiltro.classList.contains("open")) {
          containerFiltro.classList.remove("open");
          filtroIcon.style.color = "white";
          filtroIcon.setAttribute("name", "menu-outline");
          
      } else {
          containerFiltro.classList.add("open");
          filtroIcon.style.color = "red";
          filtroIcon.setAttribute("name", "close-outline");
          
      }
  }
}

// Adiciona o evento de clique ao ícone
const openFiltro = document.getElementById("openFiltro");
if (openFiltro) {
  openFiltro.addEventListener("click", abrirFiltro);
}

