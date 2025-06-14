document.addEventListener("DOMContentLoaded", () => {
    esconderTodasAreas();
    document.getElementById("login-section").style.display = "block";
    const btnVerSenha = document.getElementById("btn-ver-senha");
    if (btnVerSenha) {btnVerSenha.addEventListener("click", alternarSenha)}
    const disciplinaSelect = document.getElementById("disciplina");
    if (disciplinaSelect) {disciplinaSelect.addEventListener("change", exibirLivros);}
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
          if (usuario !== "") {fazerLogin();}
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
  
  function salvarUsuarios() {localStorage.setItem("usuarios", JSON.stringify(usuarios));}
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
        carregarDisciplinasParaAluno(turmaAluno || "");
        mostrarBoletimAluno(usuario);
    }

      else if (tipo === "professor") {document.getElementById("area-professor").style.display = "block";
        const prof = usuarios[usuario];
        const selectDisciplinas = document.getElementById("disciplina-boletim");
        selectDisciplinas.innerHTML = "<option value=''>-- Selecione --</option>";
        (prof.disciplinas || []).forEach(disc => {
          const opt = document.createElement("option");
          opt.value = disc.toLowerCase();
          opt.textContent = disc;
          selectDisciplinas.appendChild(opt);
        });
        const selectSerie = document.getElementById("serie-boletim");
        selectSerie.innerHTML = "<option value=''>-- Selecione --</option>";
        Object.keys(turmas).forEach(serie => {
          const opt = document.createElement("option");
          opt.value = serie;
          opt.textContent = serie;
          selectSerie.appendChild(opt);
        })}
      else if (tipo === "funcionario") document.getElementById("area-funcionario").style.display = "block";
      else if (tipo === "secretaria") document.getElementById("area-secretaria").style.display = "block";
      else if (tipo === "suporte") document.getElementById("area-suporte").style.display = "block";
      document.getElementById("login-section").style.display = "none";
      document.getElementById("btn-logout").style.display = "block"}
       else {alert("Usuário ou senha incorretos.")}
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
  adicionarAlunoNaTurma(nome, turma);
  inicializarBoletimAluno(nome);
}

  
  else if (tipo === "professor") {
    const selecionadas = Array.from(document.querySelectorAll(".disciplinas-professor:checked")).map(el => el.value);
    if (selecionadas.length === 0) {
      alert("Selecione ao menos uma disciplina que o professor leciona.");
      return;
    }
    usuarios[nome] = { senha, tipo, disciplinas: selecionadas };
  }
  
  else {usuarios[nome] = {senha, tipo}}
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

  function adicionarAlunoNaTurma(nomeAluno, nomeTurma) {
  const chave = `alunos_${nomeTurma}`;
  const lista = JSON.parse(localStorage.getItem(chave)) || [];
  if (!lista.includes(nomeAluno)) {
    lista.push(nomeAluno);
    localStorage.setItem(chave, JSON.stringify(lista));
  }
}

  
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
      div.innerHTML = `<label><input type="checkbox" id="freq-${aluno}" ${presente ? "checked" : ""} /> ${aluno}</label>`;
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
    if (nome === "suporte" && ["aluno", "professor", "funcionario"].includes(area)) {mostrarHistoricoUsuario(area);}
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
    if (tipo === "professor") {const disciplinas = ["Português", "Matemática", "História", "Geografia", "Ciências","Filosofia", "Artes", "Física", "Química"];
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
      if (Array.isArray(prof.disciplinas)) {disciplinas = prof.disciplinas}
      else if (typeof prof.disciplinas === "string") {disciplinas = [prof.disciplinas]} 
      else if (typeof prof.disciplina === "string") {disciplinas = [prof.disciplina]}
      if (disciplinas.length === 0) {
        alert("Nenhuma disciplina cadastrada para este professor.");
        return;
      }
      carregarDisciplinasParaProfessor(disciplinas);} 
      else {alert("Usuário atual não é um professor válido.");}
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

function mostrarRespostaSalva(tipoUsuario, destino) {
  const chave = `mensagem_${tipoUsuario}_${destino}`;
  const dados = JSON.parse(localStorage.getItem(chave));
  const respostaDiv = document.getElementById(`resposta-${tipoUsuario}`);
  if (dados && dados.resposta) {respostaDiv.innerHTML += `<p><strong>Resposta de ${destino}:</strong> ${dados.resposta}</p>`;}
}

  function enviarMensagemSuporte(tipoUsuario) {
  const tipoSelect = document.getElementById(`tipo-mensagem-${tipoUsuario}`);
  const mensagemInput = document.getElementById(`mensagem-${tipoUsuario}`);
  const respostaDiv = document.getElementById(`resposta-${tipoUsuario}`);
  const tipo = tipoSelect.value;
  const texto = mensagemInput.value.trim();
  if (!tipo || !texto) {
    alert("Por favor, selecione o tipo e escreva uma mensagem.");
    return;
  };
  const destino = tipo === "ajuda" ? "suporte" : "secretaria";
  const chave = `mensagens_${tipoUsuario}_${destino}`;
  const historico = JSON.parse(localStorage.getItem(chave)) || [];
  const novaMensagem = {
    de: tipoUsuario,
    para: destino,
    texto,
    data: new Date().toLocaleString(),
    resposta: null
  };
  historico.push(novaMensagem);
  localStorage.setItem(chave, JSON.stringify(historico));
  respostaDiv.innerHTML = `<p id="mensagem-sucesso-${tipoUsuario}" style="color: green;">Mensagem enviada para ${destino}.</p>`;
  setTimeout(() => {
    const msg = document.getElementById(`mensagem-sucesso-${tipoUsuario}`);
    if (msg) msg.remove();
    mostrarHistoricoUsuario(tipoUsuario);
  }, 3500);
  mensagemInput.value = "";
  tipoSelect.value = "";
}

function mostrarRequisicoesSuporte() {
  const container = document.getElementById("painel-ajuda-suporte");
  container.innerHTML = "";
  const mensagens = [];
  Object.keys(localStorage).forEach(chave => {
    if (chave.startsWith("mensagens_") && chave.endsWith("_suporte")) {
      const partes = chave.split("_");
      const remetente = partes[1];
      const lista = JSON.parse(localStorage.getItem(chave) || "[]");
      lista.forEach((msg, i) => {mensagens.push({ remetente, msg, chave, index: i });});
    }
  });
  if (mensagens.length === 0) {
    container.innerHTML = "<p><em>Nenhuma requisição registrada até o momento.</em></p>";
    return;
  }
  mensagens.forEach(({ remetente, msg, chave, index }) => {
    const div = document.createElement("div");
    div.style.border = "1px solid #ccc";
    div.style.marginBottom = "10px";
    div.style.padding = "10px";
    div.innerHTML = `<p><strong>De:</strong> ${remetente}</p>
                     <p><strong>Mensagem:</strong> ${msg.texto}</p>
                     <p><strong>Data:</strong> ${msg.data}</p>`;
    if (msg.resposta) {div.innerHTML += `<p style="color:lightgreen;"><strong>Resposta:</strong> ${msg.resposta}</p>`;}
    else {div.innerHTML += `<textarea id="resposta-${chave}-${index}" placeholder="Responder..." style="width:100%;margin-top:5px;"></textarea>
                            <button onclick="responderMensagem('${chave}', ${index})">Enviar resposta</button>`;
    }
    container.appendChild(div);
  });
}

function mostrarReclamacoesSecretaria() {
  const container = document.getElementById("painel-reclamacoes-secretaria");
  container.innerHTML = "";
  const mensagens = [];
  Object.keys(localStorage).forEach(chave => {
    if (chave.startsWith("mensagens_") && chave.endsWith("_secretaria")) {
      const partes = chave.split("_");
      const remetente = partes[1];
      const lista = JSON.parse(localStorage.getItem(chave) || "[]");
      lista.forEach((msg, i) => {
        mensagens.push({ remetente, msg, chave, index: i })});
    }
  });
  if (mensagens.length === 0) {
    container.innerHTML = "<p><em>Nenhuma reclamação registrada ainda.</em></p>";
    return;
  }
  mensagens.forEach(({ remetente, msg, chave, index }) => {
    const div = document.createElement("div");
    div.style.border = "1px solid #ccc";
    div.style.marginBottom = "10px";
    div.style.padding = "10px";
    div.innerHTML = `<p><strong>De:</strong> ${remetente}</p>
                     <p><strong>Mensagem:</strong> ${msg.texto}</p>
                     <p><strong>Data:</strong> ${msg.data}</p>`;
    if (msg.resposta) {div.innerHTML += `<p style="color:lightgreen;"><strong>Resposta:</strong> ${msg.resposta}</p>`}
    else {div.innerHTML += `<textarea id="resposta-${chave}-${index}" placeholder="Responder..." style="width:100%;margin-top:5px;"></textarea>
                            <button onclick="responderMensagem('${chave}', ${index})">Enviar resposta</button>`}
    container.appendChild(div);
  });
}

function enviarReclamacaoSuporte() {
  const texto = document.getElementById("mensagem-reclamacao-suporte").value.trim();
  if (!texto) return alert("Digite a reclamação.");
  const dados = { de: "suporte", para: "secretaria", texto, resposta: null };
  localStorage.setItem("mensagem_suporte_secretaria", JSON.stringify(dados));
  document.getElementById("confirmacao-reclamacao-suporte").innerHTML = "<p style='color:lightgreen'>Reclamação enviada à Secretaria.</p>";
  document.getElementById("mensagem-reclamacao-suporte").value = "";
}

function enviarAjudaSecretaria() {
  const texto = document.getElementById("mensagem-ajuda-secretaria").value.trim();
  if (!texto) return alert("Digite a mensagem.");
  const dados = { de: "secretaria", para: "suporte", texto, resposta: null };
  localStorage.setItem("mensagem_secretaria_suporte", JSON.stringify(dados));
  document.getElementById("confirmacao-ajuda-secretaria").innerHTML = "<p style='color:lightgreen'>Mensagem enviada ao Suporte.</p>";
  document.getElementById("mensagem-ajuda-secretaria").value = "";
}

function responderMensagem(chave, index) {
  const textarea = document.getElementById(`resposta-${chave}-${index}`);
  const resposta = textarea.value.trim();
  if (!resposta) return alert("Digite a resposta.");
  const mensagens = JSON.parse(localStorage.getItem(chave) || "[]");
  if (mensagens[index].resposta) {
    alert("Esta mensagem já foi respondida.");
    return;
  }
  mensagens[index].resposta = resposta;
  localStorage.setItem(chave, JSON.stringify(mensagens));
  alert("Resposta enviada.");
  textarea.parentElement.querySelector("button").remove();
  textarea.remove();
  const respostaVisual = document.createElement("p");
  respostaVisual.style.color = "lightgreen";
  respostaVisual.innerHTML = `<strong>Resposta:</strong> ${resposta}`;
  textarea.parentElement.appendChild(respostaVisual);
}

function mostrarHistoricoMensagens(tipoUsuario, destino) {
  const container = document.getElementById(`resposta-${tipoUsuario}`);
  container.innerHTML = "";
  const chave = `mensagens_${tipoUsuario}_${destino}`;
  const mensagens = JSON.parse(localStorage.getItem(chave) || "[]");
  if (mensagens.length === 0) {
    container.innerHTML = `<p style="color: lightgray;"><em>Nenhuma solicitação registrada ainda.</em></p>`;
    return;
  }
  mensagens.forEach((msg) => {
    const bloco = document.createElement("div");
    bloco.style.border = "1px solid #ccc";
    bloco.style.padding = "10px";
    bloco.style.marginBottom = "10px";
    bloco.innerHTML = `
      <p><strong>Enviado em:</strong> ${msg.data}</p>
      <p><strong>Mensagem:</strong> ${msg.texto}</p>
      ${msg.resposta ? `<p style="color:lightgreen"><strong>Resposta:</strong> ${msg.resposta}</p>` : "<p style='color:lightgray'><em>Aguardando resposta</em></p>"}`;
    container.appendChild(bloco);
  });
}

function mostrarHistoricoUsuario(tipoUsuario) {
  const container = document.getElementById(`resposta-${tipoUsuario}`);
  container.innerHTML = "";
  const chaveReq = `mensagens_${tipoUsuario}_suporte`;
  const requisicoes = JSON.parse(localStorage.getItem(chaveReq) || "[]");
  const blocoReq = document.createElement("div");
  blocoReq.innerHTML = `<h3>Histórico de Requisições</h3>`;
  if (requisicoes.length === 0) {
    const vazio = document.createElement("p");
    vazio.style.color = "lightgray";
    vazio.innerHTML = "<em>Nenhuma solicitação registrada ainda.</em>";
    blocoReq.appendChild(vazio);
  } 
  else {
    requisicoes.forEach(msg => {
      const div = document.createElement("div");
      div.className = "bloco-mensagem";
      div.innerHTML = `<p><strong>Data:</strong> ${msg.data}</p>
                       <p><strong>Mensagem:</strong> ${msg.texto}</p>
                       ${msg.resposta ? `<p style="color:lightgreen;"><strong>Resposta:</strong> ${msg.resposta}</p>` : `<p><em>Aguardando resposta</em></p>`}`;
      blocoReq.appendChild(div);
    });
  }
  const chaveRec = `mensagens_${tipoUsuario}_secretaria`;
  const reclamacoes = JSON.parse(localStorage.getItem(chaveRec) || "[]");
  const blocoRec = document.createElement("div");
  blocoRec.innerHTML = `<h3>Histórico de Reclamações</h3>`;
  if (reclamacoes.length === 0) {
    const vazio = document.createElement("p");
    vazio.style.color = "lightgray";
    vazio.innerHTML = "<em>Nenhuma reclamação registrada ainda.</em>";
    blocoRec.appendChild(vazio);
  }
  else {
    reclamacoes.forEach(msg => {
      const div = document.createElement("div");
      div.className = "bloco-mensagem";
      div.innerHTML = `<p><strong>Data:</strong> ${msg.data}</p>
                       <p><strong>Mensagem:</strong> ${msg.texto}</p>
                      ${msg.resposta ? `<p style="color:lightgreen;"><strong>Resposta:</strong> ${msg.resposta}</p>` : `<p><em>Aguardando resposta</em></p>`}`;
      blocoRec.appendChild(div);
    });
  }
  container.appendChild(blocoReq);
  container.appendChild(blocoRec);
}

function preencherAlunosDaSerie() {
  const serie = document.getElementById("serie-boletim").value;
  const select = document.getElementById("aluno-boletim");
  select.innerHTML = "<option value=''>-- Selecione --</option>";
  const lista = turmas[serie] || [];
  lista.forEach(nome => {
    const opt = document.createElement("option");
    opt.value = nome;
    opt.textContent = nome;
    select.appendChild(opt);
  });
}
function salvarNota() {
  const serie = document.getElementById("serie-boletim").value;
  const aluno = document.getElementById("aluno-boletim").value;
  const disciplina = document.getElementById("disciplina-boletim").value;
  const tipoNota = document.getElementById("tipo-nota").value;
  const valor = document.getElementById("nota").value;
  if (!serie || !aluno || !disciplina || !tipoNota || valor === "") {
    alert("Preencha todos os campos.");
    return;
  }
  const chave = `boletim_${aluno}_${disciplina}`;
  const boletim = JSON.parse(localStorage.getItem(chave)) || {prova1: "Ainda sem notas", prova2: "Ainda sem notas",trabalho: "Ainda sem notas"};
  boletim[tipoNota] = valor;
  localStorage.setItem(chave, JSON.stringify(boletim));
  alert("Nota salva com sucesso!");
  document.getElementById("nota").value = "";
}

function inicializarBoletimAluno(nome) {
  const turma = usuarios[nome]?.turma || "";
  const turmasComFisicaQuimica = ["9º ano", "1ª série", "2ª série", "3ª série"];
  const disciplinasBase = ["matematica", "portugues", "historia", "geografia", "ciencias", "filosofia", "artes"];
  const disciplinasAvancadas = ["fisica", "quimica"];
  const incluirAvancadas = turmasComFisicaQuimica.includes(turma.toLowerCase());
  const disciplinas = incluirAvancadas ? disciplinasBase.concat(disciplinasAvancadas) : disciplinasBase;
  disciplinas.forEach(disciplina => {
    const chave = `boletim_${nome}_${disciplina}`;
    const boletim = {prova1: "Ainda sem notas", prova2: "Ainda sem notas", trabalho: "Ainda sem notas"};
    localStorage.setItem(chave, JSON.stringify(boletim));
  });
}

function mostrarBoletimAluno(nome) {
  const container = document.getElementById("aluno-funcionalidade-boletim");
  container.innerHTML = "<h2>Boletim</h2>";
  const turma = (usuarios[nome]?.turma || "").toLowerCase();
  const disciplinasBase = ["matematica", "portugues", "historia", "geografia", "ciencias", "filosofia", "artes"];
  const disciplinasAvancadas = ["fisica", "quimica"];
  const turmasComFisicaQuimica = ["9º ano", "1ª série", "2ª série", "3ª série"];
  const incluirAvancadas = turmasComFisicaQuimica.map(t => t.toLowerCase()).includes(turma);
  const disciplinas = incluirAvancadas ? disciplinasBase.concat(disciplinasAvancadas) : disciplinasBase;
  let totalMedias = [];
  let todasNotasPreenchidas = true;
  disciplinas.forEach(disciplina => {
    const chave = `boletim_${nome}_${disciplina}`;
    const dados = JSON.parse(localStorage.getItem(chave)) || {prova1: "Ainda sem notas", prova2: "Ainda sem notas", trabalho: "Ainda sem notas"};
    const notas = [dados.prova1, dados.prova2, dados.trabalho];
    const notasNumericas = notas.map(n => parseFloat(n)).filter(n => !isNaN(n));
    let mediaTexto = "Média: Disponível após receber as 3 notas";
    if (notasNumericas.length === 3) {
      const media = ((notasNumericas[0] + notasNumericas[1] + notasNumericas[2]) / 3).toFixed(2);
      mediaTexto = `Média: ${media}`;
      totalMedias.push(parseFloat(media));
    } 
    else {todasNotasPreenchidas = false;}
    const div = document.createElement("div");
    div.className = "bloco-mensagem";
    div.innerHTML = `<h3>${disciplina.toUpperCase()}</h3>
                     <p><strong>Prova 1:</strong> ${dados.prova1}</p>
                     <p><strong>Prova 2:</strong> ${dados.prova2}</p>
                     <p><strong>Trabalho:</strong> ${dados.trabalho}</p>
                     <p><strong>${mediaTexto}</strong></p>`;
    container.appendChild(div);
  });
  const situacao = document.createElement("div");
  situacao.className = "bloco-mensagem";
  let statusFinal = "Em andamento";
  if (totalMedias.length === disciplinas.length) {statusFinal = totalMedias.every(m => m >= 7) ? "Aprovado" : "Reprovado";}
  situacao.innerHTML = `<h3>Situação Final: ${statusFinal}</h3>`;
  container.appendChild(situacao);
  const btnVoltar = document.createElement("button");
  btnVoltar.textContent = "Voltar";
  btnVoltar.onclick = () => fecharFuncionalidade('aluno');
  container.appendChild(btnVoltar);
}

function salvarNotasMultipla() {
  const serie = document.getElementById("serie-boletim").value;
  const aluno = document.getElementById("aluno-boletim").value;
  const disciplina = document.getElementById("disciplina-boletim").value;
  const nota1 = document.getElementById("nota-prova1").value;
  const nota2 = document.getElementById("nota-prova2").value;
  const notaT = document.getElementById("nota-trabalho").value;
  if (!serie || !aluno || !disciplina) {
    alert("Selecione a série, aluno e disciplina.");
    return;
  }
  const chave = `boletim_${aluno}_${disciplina}`;
  const boletim = JSON.parse(localStorage.getItem(chave)) || {prova1: "Ainda sem notas", prova2: "Ainda sem notas", trabalho: "Ainda sem notas"};
  if (nota1 !== "") boletim.prova1 = nota1;
  if (nota2 !== "") boletim.prova2 = nota2;
  if (notaT !== "") boletim.trabalho = notaT;
  localStorage.setItem(chave, JSON.stringify(boletim));
  alert("Notas salvas com sucesso!");
  document.getElementById("nota-prova1").value = "";
  document.getElementById("nota-prova2").value = "";
  document.getElementById("nota-trabalho").value = "";
  atualizarMediaProfessor();
}

function atualizarMediaProfessor() {
  const aluno = document.getElementById("aluno-boletim").value;
  const disciplina = document.getElementById("disciplina-boletim").value;
  const mediaDiv = document.getElementById("media-professor");
  if (!aluno || !disciplina) {
    mediaDiv.innerHTML = "<strong>Média:</strong> Disponível após preencher todas as notas";
    return;
  }
  const chave = `boletim_${aluno}_${disciplina}`;
  const boletim = JSON.parse(localStorage.getItem(chave));
  if (!boletim) {
    mediaDiv.innerHTML = "<strong>Média:</strong> Disponível após preencher todas as notas";
    return;
  }
  const notas = [boletim.prova1, boletim.prova2, boletim.trabalho].map(n => parseFloat(n));
  if (notas.some(isNaN)) {
    mediaDiv.innerHTML = "<strong>Média:</strong> Disponível após preencher todas as notas";
    return;
  }
  const media = ((notas[0] + notas[1] + notas[2]) / 3).toFixed(2);
  mediaDiv.innerHTML = `<strong>Média:</strong> ${media}`;
}

function carregarNotasSalvasProfessor() {
  const aluno = document.getElementById("aluno-boletim").value;
  const disciplina = document.getElementById("disciplina-boletim").value;
  const nota1 = document.getElementById("nota-prova1");
  const nota2 = document.getElementById("nota-prova2");
  const notaT = document.getElementById("nota-trabalho");
  nota1.value = "";
  nota2.value = "";
  notaT.value = "";
  if (!aluno || !disciplina) return;
  const chave = `boletim_${aluno}_${disciplina}`;
  const boletim = JSON.parse(localStorage.getItem(chave));
  if (!boletim) return;
  if (!isNaN(parseFloat(boletim.prova1))) nota1.value = boletim.prova1;
  if (!isNaN(parseFloat(boletim.prova2))) nota2.value = boletim.prova2;
  if (!isNaN(parseFloat(boletim.trabalho))) notaT.value = boletim.trabalho;
  atualizarMediaProfessor();
}
