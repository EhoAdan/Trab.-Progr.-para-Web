document.addEventListener("DOMContentLoaded", () => {
    esconderTodasAreas();
    document.getElementById("login-section").style.display = "block";
  
    const btnVerSenha = document.getElementById("btn-ver-senha");
    if (btnVerSenha) {
      btnVerSenha.addEventListener("click", alternarSenha);
    }
  
    const disciplinaSelect = document.getElementById("disciplina");
    if (disciplinaSelect) {
      disciplinaSelect.addEventListener("change", exibirLivros);
    }
  
    const selectProf = document.getElementById("disciplina-prof");
    if (selectProf) {
      selectProf.addEventListener("change", () => {
        const disciplina = selectProf.value;
        const container = document.getElementById("livros-container-prof");
        container.innerHTML = "";
  
        if (livrosDidaticos[disciplina]) {
          livrosDidaticos[disciplina].forEach(livro => {
            const divLivro = document.createElement("div");
            divLivro.className = "livro";
            divLivro.innerHTML = `<strong>${livro.titulo}</strong> - <a href="${livro.link}" target="_blank">Acessar</a>`;
            container.appendChild(divLivro);
          });
        }
      });
    }
    const temaSalvo = localStorage.getItem("tema") || "claro";
    document.body.classList.toggle("dark-mode", temaSalvo === "escuro");
    const seletor = document.getElementById("seletor-tema");
    if (seletor) {seletor.value = temaSalvo;}


    const loginInput = document.getElementById("login");
    const senhaInput = document.getElementById("senha");
  
    [loginInput, senhaInput].forEach(input => {
      input.addEventListener("keypress", function (e) {
        if (e.key === "Enter") {
          const usuario = loginInput.value.trim();
          if (usuario !== "") {
            fazerLogin();
          }
        }
      });
    });

  });const usuariosFixos = {
    "telaalunofund": {senha: "0", tipo: "aluno", turma: "7º ano" },
    "telaalunomed": { senha: "1", tipo: "aluno", turma: "9º ano" },
    "telaprofessor": { senha: "2", tipo: "professor", disciplinas: ["historia", "geografia", "fisica"]},
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
  
  function fecharTodasFuncionalidades() {
    const todas = document.querySelectorAll(".funcionalidade");
    todas.forEach(div => div.style.display = "none");
  
    const todosMenus = document.querySelectorAll("#aluno-menu, #professor-menu, #funcionario-menu, #secretaria-menu, #suporte-menu");
    todosMenus.forEach(menu => menu.style.display = "block");}
  

  function fazerLogin() {
    const usuario = document.getElementById('login').value.trim().toLowerCase();
    const senha = document.getElementById('senha').value;
    esconderTodasAreas();
  
    if (usuarios[usuario] && usuarios[usuario].senha === senha) {
      const tipo = usuarios[usuario].tipo;
      if (tipo === "aluno") {
        document.getElementById("area-aluno").style.display = "block";
        const turmaAluno = usuarios[usuario].turma || "";
        carregarDisciplinasParaAluno(turmaAluno || "")
      }
      else if (tipo === "professor") document.getElementById("area-professor").style.display = "block";
      else if (tipo === "funcionario") document.getElementById("area-funcionario").style.display = "block";
      else if (tipo === "secretaria") document.getElementById("area-secretaria").style.display = "block";
      else if (tipo === "suporte") document.getElementById("area-suporte").style.display = "block";
  
      document.getElementById("login-section").style.display = "none";
      document.getElementById("btn-logout").style.display = "block";}
      
       else {alert("Usuário ou senha incorretos.");}
  }
  
  function logout() {
    esconderTodasAreas();
    fecharTodasFuncionalidades();
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
  
    if (tipo === "aluno") {
    const turma = document.getElementById("turma-aluno")?.value;
    if (!turma) {
      alert("Selecione a turma do aluno.");
      return;
    }
    usuarios[nome] = { senha, tipo, turma };
  }
  
  else if (tipo === "professor") {
    const selecionadas = Array.from(document.querySelectorAll(".disciplinas-professor:checked"))
      .map(el => el.value);
  
    if (selecionadas.length === 0) {
      alert("Selecione ao menos uma disciplina que o professor leciona.");
      return;
    }
  
    usuarios[nome] = { senha, tipo, disciplinas: selecionadas };
  }
  
  else {
    usuarios[nome] = { senha, tipo };
  }
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
    ],
    fisica: [
      {titulo: "Cinemática", link: "#"},
      {titulo: "Eletromagnetismo", link: "#"}
    ],
    quimica: [
      {titulo: "Modelos Atômicos", link: "#"},
      {titulo: "Tabela Periódica", link: "#"}
    ]
  };
  
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
    "1º ano": ["ana", "mario", "carla"],
    "2º ano": ["joao", "livia"],
    "3º ano": ["felipe", "bruna"],
    "4º ano": ["lucas"],
    "5º ano": ["jose"],
    "6º ano": ["marco"],
    "7º ano": ["edenilson", "telaalunofund"],
    "8º ano": ["roberto"],
    "9º ano": ["carlos", "telaalunomed"],
    "1ª série": ["florinda"],
    "2ª série": ["edmundo"],
    "3ª série": ["romario"],
  
  };
  
  const professoresPorSerie = {"telaprofessor": ["1º ano","2º ano","3º ano", "4ª ano", "5º ano", "6º ano", "7º ano", "8º ano", "9º ano", "1ª série", "2ª série", "3ª série"]};
  
  function mostrarFrequencia() {
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
    const container = document.getElementById("alunos-frequencia");
    if (container) container.innerHTML = "";
  }
  
  function carregarAlunosTurma() {
    const turma = document.getElementById("turma-frequencia").value;
    const alunos = turmas[turma] || [];
    const container = document.getElementById("alunos-frequencia");
    container.innerHTML = "";
  
    const hoje = new Date().toLocaleDateString();
    const chave = `frequencia_${turma}_${hoje}`;
    const dadosSalvos = JSON.parse(localStorage.getItem(chave) || "{}");
  
    alunos.forEach(aluno => {
      const presente = dadosSalvos[aluno] === "Presente";
      const div = document.createElement("div");
      div.innerHTML = `
        <label>
          <input type="checkbox" id="freq-${aluno}" ${presente ? "checked" : ""} /> ${aluno}
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
  
  function abrirFuncionalidade(area, nome) {
    fecharFuncionalidade(area);
    const menu = document.getElementById(`${area}-menu`);
    if (menu) menu.style.display = "none";
  
    const conteudo = document.getElementById(`${area}-funcionalidade-${nome}`);
    if (conteudo) conteudo.style.display = "block";
  }
  
  function fecharFuncionalidade(area) {
    const funcionalidades = document.querySelectorAll(`#area-${area} .funcionalidade`);
    funcionalidades.forEach(div => div.style.display = "none");
  
    const menu = document.getElementById(`${area}-menu`);
    if (menu) menu.style.display = "block";
  }
  
  
  function mostrarHistoricoFrequencia() {
    const container = document.getElementById("historico-frequencia-container");
    container.innerHTML = "";
  
    const dados = Object.keys(localStorage)
      .filter(chave => chave.startsWith("frequencia_"))
      .map(chave => {
        const partes = chave.split("_");
        const turma = partes[1];
        const data = partes.slice(2).join("_");
        const registros = JSON.parse(localStorage.getItem(chave));
        return { turma, data, registros };
      });
  
    if (dados.length === 0) {
      container.innerHTML = "<p>Nenhuma frequência registrada ainda.</p>";
      return;
    }
  
    dados.forEach(item => {
      const bloco = document.createElement("div");
      bloco.className = "bloco-frequencia";
      bloco.innerHTML = `<h3>${item.turma} - ${item.data}</h3>`;
  
      const lista = document.createElement("ul");
      for (const aluno in item.registros) {
        const li = document.createElement("li");
        li.textContent = `${aluno}: ${item.registros[aluno]}`;
        lista.appendChild(li);
      }
  
      bloco.appendChild(lista);
      container.appendChild(bloco);
    });
  }
  
  function carregarDisciplinasParaAluno(turmaAluno) {
    const disciplinasBase = [
      { nome: "Português", valor: "portugues" },
      { nome: "Matemática", valor: "matematica" },
      { nome: "História", valor: "historia" },
      { nome: "Geografia", valor: "geografia" },
      { nome: "Ciências", valor: "ciencias" },
      { nome: "Filosofia", valor: "filosofia" },
      { nome: "Artes", valor: "artes" },
    ];
  
    const disciplinasAvancadas = [
      { nome: "Física", valor: "fisica" },
      { nome: "Química", valor: "quimica" }
    ];
  
    const select = document.getElementById("disciplina");
    select.innerHTML = "<option value=''>-- Escolha --</option>";
  
    disciplinasBase.forEach(d => {
      const option = document.createElement("option");
      option.value = d.valor;
      option.textContent = d.nome;
      select.appendChild(option);
    });
  
    const turmasComFisicaQuimica = ["9º ano", "1ª série", "2ª série", "3ª série"];
    if (turmasComFisicaQuimica.includes(turmaAluno)) {
      disciplinasAvancadas.forEach(d => {
        const option = document.createElement("option");
        option.value = d.valor;
        option.textContent = d.nome;
        select.appendChild(option);
      });
    }
  }
  
  function atualizarCamposExtras() {
    const tipo = document.getElementById("tipo-usuario").value;
    const container = document.getElementById("campos-extras");
    container.innerHTML = "";
  
    if (tipo === "aluno") {
      const select = document.createElement("select");
      select.id = "turma-aluno";
  
      const turmasDisponiveis = Object.keys(turmas);
      select.innerHTML = "<option value=''>Selecione a turma</option>";
      turmasDisponiveis.forEach(turma => {
        const option = document.createElement("option");
        option.value = turma;
        option.textContent = turma;
        select.appendChild(option);
      });
  
      container.appendChild(document.createTextNode("Turma do Aluno:"));
      container.appendChild(select);
    }
  
    if (tipo === "professor") {
      const disciplinas = [
        "Português", "Matemática", "História", "Geografia", "Ciências",
        "Filosofia", "Artes", "Física", "Química"
      ];
  
      container.appendChild(document.createTextNode("Disciplinas que leciona:"));
  
      disciplinas.forEach(disc => {
        const label = document.createElement("label");
        label.style.display = "block";
  
        const checkbox = document.createElement("input");
        checkbox.type = "checkbox";
        checkbox.value = disc;
        checkbox.className = "disciplinas-professor";
  
        label.appendChild(checkbox);
        label.appendChild(document.createTextNode(" " + disc));
        container.appendChild(label);
      });
    }
  }
  function mostrarMaterialProfessor() {
    const usuario = document.getElementById("login").value.trim().toLowerCase();
    const prof = usuarios[usuario];
  
    if (prof && prof.tipo === "professor") {
      let disciplinas = [];
  
      if (Array.isArray(prof.disciplinas)) {
        disciplinas = prof.disciplinas;
      } else if (typeof prof.disciplinas === "string") {
        disciplinas = [prof.disciplinas];
      } else if (typeof prof.disciplina === "string") {
        disciplinas = [prof.disciplina];
      }
      if (disciplinas.length === 0) {
        alert("Nenhuma disciplina cadastrada para este professor.");
        return;
      }
      carregarDisciplinasParaProfessor(disciplinas);
    } else {
      alert("Usuário atual não é um professor válido.");
    }
  }
  
  function carregarDisciplinasParaProfessor(disciplinas) {
    const select = document.getElementById("disciplina-prof");
    select.innerHTML = "<option value=''>-- Escolha --</option>";
  
    disciplinas.forEach(disc => {
      const valor = disc.toLowerCase();
      const option = document.createElement("option");
      option.value = valor;
      option.textContent = disc;
      select.appendChild(option);
    });
    const container = document.getElementById("livros-container-prof");
    container.innerHTML = "";
  }
  function mudarTemaPorSelecao(select) {
    const tema = select.value;
    document.body.classList.toggle("dark-mode", tema === "escuro");
    localStorage.setItem("tema", tema);
  }
  
