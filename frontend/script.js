const usuariosFixos = {
  "telaaluno": { senha: "1", tipo: "aluno" },
  "telaprofessor": { senha: "2", tipo: "professor" },
  "telafuncionario": { senha: "3", tipo: "funcionario" },
  "telasecretaria": { senha: "4", tipo: "secretaria" },
  "suporte": { senha: "suporte12", tipo: "suporte" }
};

let usuarios = {
  ...usuariosFixos,
  ...JSON.parse(localStorage.getItem("usuarios") || "{}")
};

function salvarUsuarios() {
  localStorage.setItem("usuarios", JSON.stringify(usuarios));
}
salvarUsuarios();

function fazerLogin() {
  const usuario = document.getElementById('login').value.trim().toLowerCase();
  const senha = document.getElementById('senha').value;
  esconderTodasAreas();

  if (usuarios[usuario] && usuarios[usuario].senha === senha) {
    const tipo = usuarios[usuario].tipo;
    if (tipo === "aluno") document.getElementById("area-aluno").style.display = "block";
    else if (tipo === "professor") document.getElementById("area-professor").style.display = "block";
    else if (tipo === "funcionario") document.getElementById("area-funcionario").style.display = "block";
    else if (tipo === "secretaria") document.getElementById("area-secretaria").style.display = "block";
    else if (tipo === "suporte") document.getElementById("area-suporte").style.display = "block";

    document.getElementById("login-section").style.display = "none";
    document.getElementById("btn-logout").style.display = "block";
  } else {
    alert("Usuário ou senha incorretos.");
  }
}

function logout() {
  esconderTodasAreas();
  document.getElementById("login-section").style.display = "block";
  document.getElementById("btn-logout").style.display = "none";
  document.getElementById("login").value = "";
  document.getElementById("senha").value = "";
  document.getElementById("criar-usuario-section").style.display = "none";
  document.getElementById("redefinir-senha-section").style.display = "none";
}

function esconderTodasAreas() {
  document.getElementById("area-aluno").style.display = "none";
  document.getElementById("area-professor").style.display = "none";
  document.getElementById("area-funcionario").style.display = "none";
  document.getElementById("area-secretaria").style.display = "none";
  document.getElementById("area-suporte").style.display = "none";
}

function alternarSenha() {
  const senhaInput = document.getElementById("senha");
  senhaInput.type = senhaInput.type === "password" ? "text" : "password";
}

function mostrarCriarUsuario() {
  document.getElementById("login-section").style.display = "none";
  document.getElementById("criar-usuario-section").style.display = "block";
  document.getElementById("btn-logout").style.display = "none";
}

function mostrarRedefinirSenha() {
  document.getElementById("login-section").style.display = "none";
  document.getElementById("redefinir-senha-section").style.display = "block";
  document.getElementById("btn-logout").style.display = "none";
}

function voltarLogin() {
  document.getElementById("criar-usuario-section").style.display = "none";
  document.getElementById("redefinir-senha-section").style.display = "none";
  document.getElementById("login-section").style.display = "block";
}

function criarUsuario() {
  const nome = document.getElementById("novo-usuario").value.trim().toLowerCase();
  const senha = document.getElementById("nova-senha").value;
  const tipo = document.getElementById("tipo-usuario").value;

  if (!nome || !senha || !tipo) {
    alert("Preencha todos os campos.");
    return;
  }

  if (usuariosFixos[nome]) {
    alert("Esse nome de usuário é reservado e não pode ser usado.");
    return;
  }

  if (usuarios[nome]) {
    alert("Usuário já existe.");
    return;
  }

  usuarios[nome] = { senha, tipo };
  salvarUsuarios();
  alert("Usuário criado com sucesso!");
  voltarLogin();
}

function redefinirSenha() {
  const nome = document.getElementById("usuario-redefinir").value.trim().toLowerCase();
  const novaSenha = document.getElementById("nova-senha-redefinir").value;

  if (!usuarios[nome]) {
    alert("Usuário não encontrado.");
    return;
  }

  usuarios[nome].senha = novaSenha;
  salvarUsuarios();
  alert("Senha redefinida com sucesso!");
  voltarLogin();
}

document.addEventListener("DOMContentLoaded", () => {
  esconderTodasAreas();
  document.getElementById("login-section").style.display = "block";

  const btnVerSenha = document.getElementById("btn-ver-senha");
  if (btnVerSenha) {
    btnVerSenha.addEventListener("click", alternarSenha);
  }
});

const livrosDidaticos = {
  portugues: [
    { titulo: "Gramática Completa", link: "#" },
    { titulo: "Literatura Brasileira", link: "#" }
  ],
  matematica: [
    { titulo: "Álgebra Fundamental", link: "#" },
    { titulo: "Geometria Essencial", link: "#" }
  ],
  historia: [
    { titulo: "História do Brasil", link: "#" },
    { titulo: "História Geral", link: "#" }
  ],
  geografia: [
    { titulo: "Geografia Física", link: "#" },
    { titulo: "Geopolítica Atual", link: "#" }
  ],
  ciencias: [
    { titulo: "Ciências Naturais", link: "#" },
    { titulo: "Biologia Básica", link: "#" }
  ],
  filosofia: [
    { titulo: "Sócrates", link: "#" },
    { titulo: "Platão", link: "#" }
  ],
  artes: [
    { titulo: "História da arte", link: "#" },
    { titulo: "Cubismo", link: "#" }
  ]
};

document.addEventListener("DOMContentLoaded", () => {
  const disciplinaSelect = document.getElementById("disciplina");
  if (disciplinaSelect) {
    disciplinaSelect.addEventListener("change", exibirLivros);
  }
});

function exibirLivros() {
  const disciplina = document.getElementById("disciplina").value;
  const container = document.getElementById("livros-container");
  container.innerHTML = ""; 

  if (livrosDidaticos[disciplina]) {
    livrosDidaticos[disciplina].forEach(livro => {
      const divLivro = document.createElement("div");
      divLivro.className = "livro";
      divLivro.innerHTML = `<strong>${livro.titulo}</strong> - <a href="${livro.link}" target="_blank">Acessar</a>`;
      container.appendChild(divLivro);
    });
  }
}

const turmas = {
  "1ª série": ["ana", "mario", "carla"],
  "2ª série": ["joao", "livia"],
  "3ª série": ["felipe", "bruna"],
  "4ª série": ["lucas"],
  "5ª série": [],
  "6ª série": [],
  "7ª série": [],
  "8ª série": []
};
// MEXER NISSO DEPOIS

const professoresPorSerie = {
  "telaprofessor": ["1ª série", "2ª série"]
};

//MEXER NISSO DEPOIS

function mostrarFrequencia() {
  document.getElementById("frequencia-container").style.display = "block";
  const turmaSelect = document.getElementById("turma-frequencia");
  turmaSelect.innerHTML = "<option value=''>-- Selecione --</option>";

  const usuarioLogado = document.getElementById("login").value.trim().toLowerCase();
  const series = professoresPorSerie[usuarioLogado] || [];

  series.forEach(serie => {
    const option = document.createElement("option");
    option.value = serie;
    option.textContent = serie;
    turmaSelect.appendChild(option);
  });
}

function carregarAlunosTurma() {
  const turma = document.getElementById("turma-frequencia").value;
  const alunos = turmas[turma] || [];
  const container = document.getElementById("alunos-frequencia");
  container.innerHTML = "";

  alunos.forEach(aluno => {
    const div = document.createElement("div");
    div.innerHTML = `
      <label>
        <input type="checkbox" id="freq-${aluno}" /> ${aluno}
      </label>
    `;
    container.appendChild(div);
  });
}

function salvarFrequencia() {
  const turma = document.getElementById("turma-frequencia").value;
  if (!turma) {
    alert("Selecione uma série.");
    return;
  }

  const alunos = turmas[turma] || [];
  const frequencia = {};

  alunos.forEach(aluno => {
    const presente = document.getElementById(`freq-${aluno}`).checked;
    frequencia[aluno] = presente ? "Presente" : "Faltou";
  });

  const hoje = new Date().toLocaleDateString();
  localStorage.setItem(`frequencia_${turma}_${hoje}`, JSON.stringify(frequencia));
  alert("Frequência salva com sucesso!");
}
