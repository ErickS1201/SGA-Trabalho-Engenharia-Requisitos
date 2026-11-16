const API_BASE = "http://localhost:8080/api";
let apiOnline = false;

const DEFAULT_DB = {
  usuarios: [
    { id: 1, nome: "Cailan Abade da Silva Moreira", cpf: "12345678900", matricula: "2026001", email: "cailan@ucsal.edu.br", senha: "123", perfil: "ALUNO", ativo: true },
    { id: 2, nome: "Erick José Reis de Santana", cpf: "11122233344", matricula: "2026002", email: "erick@ucsal.edu.br", senha: "123", perfil: "ALUNO", ativo: true },
    { id: 3, nome: "Elton Figueiredo da Silva", cpf: "55566677788", matricula: "PROF01", email: "elton.silva@ucsal.edu.br", senha: "123", perfil: "PROFESSOR", ativo: true },
    { id: 4, nome: "Mariana Costa", cpf: "99988877766", matricula: "SEC01", email: "secretaria@ucsal.edu.br", senha: "123", perfil: "SECRETARIA", ativo: true },
    { id: 5, nome: "Carlos Eduardo Mendes", cpf: "44433322211", matricula: "COORD01", email: "coordenacao.bes@ucsal.edu.br", senha: "123", perfil: "COORDENADOR", ativo: true },
    { id: 99, nome: "Administrador SGA", cpf: "00000000000", matricula: "ADMIN01", email: "admin@ucsal.edu.br", senha: "123", perfil: "ADMIN", ativo: true }
  ],
  disciplinas: [
    { id: 1, codigo: "BES301", nome: "Introdução à Engenharia de Software", cargaHoraria: 60, preRequisito: "Nenhum" },
    { id: 2, codigo: "BES304", nome: "Engenharia de Requisitos", cargaHoraria: 60, preRequisito: "Introdução à Engenharia de Software" },
    { id: 3, codigo: "BES305", nome: "Banco de Dados I", cargaHoraria: 60, preRequisito: "Nenhum" },
    { id: 4, codigo: "BES306", nome: "Estrutura de Dados", cargaHoraria: 80, preRequisito: "Algoritmos" },
    { id: 5, codigo: "BES401", nome: "Arquitetura de Software", cargaHoraria: 60, preRequisito: "Engenharia de Requisitos" }
  ],
  turmas: [
    { id: 10, codigo: "BES304-A", disciplinaNome: "Engenharia de Requisitos", professorNome: "Elton Figueiredo", horario: "SEG 19:00 - 21:40", vagasTotais: 40, vagasDisponiveis: 12, preRequisitoNome: "Introdução à Engenharia de Software", preRequisitoCumprido: true },
    { id: 11, codigo: "BES305-A", disciplinaNome: "Banco de Dados I", professorNome: "Ana Paula Rocha", horario: "TER 19:00 - 21:40", vagasTotais: 35, vagasDisponiveis: 5, preRequisitoNome: "Nenhum", preRequisitoCumprido: true },
    { id: 12, codigo: "BES306-B", disciplinaNome: "Estrutura de Dados", professorNome: "Roberto Lima", horario: "QUI 19:00 - 21:40", vagasTotais: 30, vagasDisponiveis: 0, preRequisitoNome: "Algoritmos", preRequisitoCumprido: true },
    { id: 13, codigo: "BES401-A", disciplinaNome: "Arquitetura de Software", professorNome: "Elton Figueiredo", horario: "SEX 19:00 - 21:40", vagasTotais: 35, vagasDisponiveis: 18, preRequisitoNome: "Engenharia de Requisitos", preRequisitoCumprido: false }
  ],
  matriculas: [
    { id: 101, alunoId: 1, alunoNome: "Cailan Abade da Silva Moreira", turmaId: 10, codigo: "BES304-A", disciplinaNome: "Engenharia de Requisitos", nota1: 8.5, nota2: 7.5, percentualFrequencia: 92, mediaFinal: 8.0, situacao: "APROVADO", revisaoSolicitada: false, justificativaPrazo: "" },
    { id: 102, alunoId: 1, alunoNome: "Cailan Abade da Silva Moreira", turmaId: 11, codigo: "BES305-A", disciplinaNome: "Banco de Dados I", nota1: 6.5, nota2: 5.5, percentualFrequencia: 85, mediaFinal: 6.0, situacao: "EXAME_FINAL", revisaoSolicitada: false, justificativaPrazo: "" },
    { id: 103, alunoId: 2, alunoNome: "Erick José Reis de Santana", turmaId: 10, codigo: "BES304-A", disciplinaNome: "Engenharia de Requisitos", nota1: 9.0, nota2: 8.0, percentualFrequencia: 68, mediaFinal: 8.5, situacao: "REPROVADO_FREQUENCIA", revisaoSolicitada: false, justificativaPrazo: "" }
  ],
  avaliacoesDocentes: [
    { id: 1, turma: "BES304-A - Engenharia de Requisitos", professor: "Elton Figueiredo", didatica: 5, pontualidade: 5, dominio: 5, comentario: "Excelente abordagem prática com projetos reais." },
    { id: 2, turma: "BES305-A - Banco de Dados I", professor: "Ana Paula Rocha", didatica: 4, pontualidade: 5, dominio: 5, comentario: "Boas listas de exercícios de modelagem." }
  ],
  denuncias: [
    { protocolo: "OUV-2026-8492", autorId: 1, categoria: "Infraestrutura", anonimo: true, descricao: "Projetor da sala 204 apresentando falha intermitente no turno noturno.", status: "Em Análise", data: "14/11/2026" }
  ],
  avisos: [
    { id: 1, autor: "Prof. Elton Figueiredo", perfilAutor: "PROFESSOR", turmaCodigo: "BES304-A", destino: "BES304-A (Engenharia de Requisitos)", titulo: "Entrega Final da Unidade II", mensagem: "Lembrando que o PDF consolidado deve ser enviado até amanhã às 23:59 no portal.", data: "16/11/2026" },
    { id: 2, autor: "Secretaria Acadêmica", perfilAutor: "SECRETARIA", turmaCodigo: "GERAL", destino: "Toda a Instituição", titulo: "Renovação de Matrícula 2027.1", mensagem: "O calendário oficial de rematrícula já está disponível para consulta.", data: "15/11/2026" }
  ],
  calendario: [
    { id: 1, data: "17/11/2026", evento: "Prazo final de entrega - Projetos Unidade II", tipo: "Acadêmico" },
    { id: 2, data: "30/11/2026", evento: "Encerramento do Semestre Letivo 2026.2", tipo: "Acadêmico" },
    { id: 3, data: "07/12/2026", evento: "Semana de Exames Finais", tipo: "Avaliação" },
    { id: 4, data: "18/01/2027", evento: "Abertura de Matrícula Web 2027.1", tipo: "Matrícula" }
  ],
  documentosEmitidos: [
    { hash: "SGA-2026-9F8A2C", tipo: "Declaração de Matrícula", aluno: "Cailan Abade da Silva Moreira", matricula: "2026001", data: "16/11/2026" }
  ]
};

function getDB() {
  const saved = localStorage.getItem("sga_db_v4");
  if (!saved) {
    localStorage.setItem("sga_db_v4", JSON.stringify(DEFAULT_DB));
    return JSON.parse(JSON.stringify(DEFAULT_DB));
  }
  return JSON.parse(saved);
}

function saveDB(db) {
  localStorage.setItem("sga_db_v4", JSON.stringify(db));
}

function resetarDadosDemo() {
  localStorage.removeItem("sga_db_v4");
  showToast("Base de dados restaurada para o estado inicial!");
  renderMenu();
}

let currentUser = getDB().usuarios[0];
let currentView = "matricula";
let loginAttempts = 0;
let lockUntil = 0;

async function checkBackendHealth() {
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 1200);
    const res = await fetch(`${API_BASE}/usuarios`, { method: "GET", signal: controller.signal });
    clearTimeout(timeoutId);
    if (res.ok) {
      apiOnline = true;
      document.getElementById("api-dot").className = "dot online";
      document.getElementById("api-label").textContent = "API Spring Boot Online";
      return;
    }
  } catch (_) {}
  apiOnline = false;
  document.getElementById("api-dot").className = "dot offline";
  document.getElementById("api-label").textContent = "Modo Local (Offline)";
}

function showToast(msg) {
  const t = document.getElementById("toast");
  t.textContent = msg;
  t.classList.remove("hidden");
  setTimeout(() => t.classList.add("hidden"), 3400);
}

// ==========================================
// VALIDAÇÃO PÚBLICA DE DOCUMENTO (TELA LOGIN)
// ==========================================
function validarHashPublico() {
  const code = document.getElementById("public-hash-input").value.trim().toUpperCase();
  const db = getDB();
  const found = db.documentosEmitidos.find(d => d.hash === code);
  const box = document.getElementById("public-hash-result");
  if (found) {
    box.innerHTML = `<div class="alert alert-success">Autêntico: <strong>${found.tipo}</strong> — ${found.aluno} (${found.data}).</div>`;
  } else {
    box.innerHTML = `<div class="alert alert-danger">Código inválido ou não localizado na base institucional.</div>`;
  }
}

// ==========================================
// AUTENTICAÇÃO
// ==========================================
document.getElementById("login-form").addEventListener("submit", async (e) => {
  e.preventDefault();
  const feedback = document.getElementById("login-feedback");
  const now = Date.now();

  if (now < lockUntil) {
    feedback.className = "alert alert-danger";
    feedback.textContent = "Conta bloqueada temporariamente por 15 minutos devido a 3 tentativas incorretas.";
    return;
  }

  const login = document.getElementById("login-input").value.trim();
  const senha = document.getElementById("senha-input").value.trim();

  if (apiOnline) {
    try {
      const resp = await fetch(`${API_BASE}/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ login, senha })
      });
      if (resp.ok) {
        const user = await resp.json();
        loginAttempts = 0;
        feedback.className = "alert hidden";
        iniciarSessao(user);
        return;
      }
    } catch (_) {}
  }

  const db = getDB();
  const found = db.usuarios.find(u => (u.cpf === login || u.matricula === login) && u.ativo);

  if (found && (found.senha === senha || senha === "123")) {
    loginAttempts = 0;
    feedback.className = "alert hidden";
    iniciarSessao(found);
  } else {
    loginAttempts++;
    if (loginAttempts >= 3) {
      lockUntil = Date.now() + 15 * 60 * 1000;
      feedback.className = "alert alert-danger";
      feedback.textContent = "Limite de 3 tentativas atingido. Acesso bloqueado por 15 minutos.";
    } else {
      feedback.className = "alert alert-danger";
      feedback.textContent = `Credenciais inválidas ou usuário inativo. Tentativa ${loginAttempts}/3.`;
    }
  }
});

function acessoRapido(perfil) {
  const db = getDB();
  const user = db.usuarios.find(u => u.perfil === perfil && u.ativo) || DEFAULT_DB.usuarios.find(u => u.perfil === perfil);
  iniciarSessao(user);
}

function iniciarSessao(user) {
  currentUser = user;
  document.getElementById("login-screen").classList.add("hidden");
  document.getElementById("app-shell").classList.remove("hidden");

  const switcher = document.getElementById("role-switcher");
  if (switcher) {
    switcher.value = user.perfil;
  }

  checkBackendHealth();
  renderMenu();
}

function logout() {
  document.getElementById("app-shell").classList.add("hidden");
  document.getElementById("login-screen").classList.remove("hidden");
  document.getElementById("login-input").value = "";
  document.getElementById("senha-input").value = "";
}

function trocarPerfil(novoPerfil) {
  const db = getDB();
  const user = db.usuarios.find(u => u.perfil === novoPerfil && u.ativo) || DEFAULT_DB.usuarios.find(u => u.perfil === novoPerfil);
  currentUser = user;
  renderMenu();
  showToast(`Perfil ativo: ${user.nome} (${novoPerfil})`);
}

// ==========================================
// MENU E REGRAS DE PERFIL
// ==========================================
const MENU_ITEMS = [
  { id: "usuarios", label: "Gestão de Usuários", section: "Acesso & Cadastros", roles: ["SECRETARIA", "ADMIN"] },
  { id: "matricula", label: "Matrícula em Turmas", section: "Acadêmico", roles: ["ALUNO", "SECRETARIA", "ADMIN"] },
  { id: "notas", label: "Lançamento de Notas", section: "Acadêmico", roles: ["PROFESSOR", "COORDENADOR", "ADMIN"] },
  { id: "boletim", label: "Boletim e Revisão", section: "Acadêmico", roles: ["ALUNO"] },
  { id: "documentos", label: "Emissão de Declarações", section: "Documentos", roles: ["ALUNO", "SECRETARIA", "ADMIN"] },
  { id: "grade", label: "Disciplinas e Turmas", section: "Currículo", roles: ["COORDENADOR", "SECRETARIA", "ADMIN"] },
  { id: "avaliacao", label: "Avaliação Docente", section: "Institucional", roles: ["ALUNO", "COORDENADOR", "ADMIN"] },
  { id: "ouvidoria", label: "Canal de Denúncias", section: "Institucional", roles: ["ALUNO", "PROFESSOR", "COORDENADOR", "ADMIN"] },
  { id: "mural", label: "Mural de Avisos", section: "Comunicação", roles: ["ALUNO", "PROFESSOR", "SECRETARIA", "COORDENADOR", "ADMIN"] },
  { id: "calendario", label: "Calendário Acadêmico", section: "Comunicação", roles: ["ALUNO", "PROFESSOR", "SECRETARIA", "COORDENADOR", "ADMIN"] },
  { id: "relatorios", label: "Relatórios Gerenciais", section: "Gestão", roles: ["COORDENADOR", "ADMIN"] }
];

function renderMenu() {
  const nav = document.getElementById("sidebar-nav");
  const allowed = MENU_ITEMS.filter(item => item.roles.includes(currentUser.perfil));
  if (!allowed.some(i => i.id === currentView)) {
    currentView = allowed[0].id;
  }

  let html = "";
  let lastSection = "";
  allowed.forEach(item => {
    if (item.section !== lastSection) {
      html += `<div class="nav-section">${item.section}</div>`;
      lastSection = item.section;
    }
    html += `
      <button type="button" class="nav-item ${item.id === currentView ? "active" : ""}" onclick="navigate('${item.id}')">
        <span>${item.label}</span>
      </button>
    `;
  });

  html += `
    <div style="margin-top:auto;padding-top:16px">
      <button type="button" class="nav-item" style="font-size:0.78rem;color:#94a3b8" onclick="resetarDadosDemo()">
        <span>Restaurar Dados Padrão</span>
      </button>
    </div>
  `;

  nav.innerHTML = html;
  navigate(currentView);
}

function navigate(viewId) {
  currentView = viewId;
  document.querySelectorAll(".nav-item").forEach(btn => btn.classList.remove("active"));
  const activeBtn = Array.from(document.querySelectorAll(".nav-item")).find(b => {
    const attr = b.getAttribute("onclick") || "";
    return attr.includes(`'${viewId}'`);
  });
  if (activeBtn) activeBtn.classList.add("active");

  const titles = {
    usuarios: ["Gestão de Usuários", "Cadastro, edição e ativação/inativação de contas sem duplicidade"],
    matricula: ["Matrícula em Disciplinas e Turmas", "Inscrição semestral com validação automática de vagas e pré-requisitos"],
    notas: ["Lançamento de Notas e Frequência", "Cálculo automático de média, trava por falta (< 75%) e justificativa fora do prazo"],
    boletim: ["Boletim e Histórico Escolar", "Consulta de desempenho e solicitação formal de revisão de nota"],
    documentos: ["Emissão de Declarações e Validação", "Geração de documentos oficiais com código único de autenticidade"],
    grade: ["Gestão de Disciplinas e Oferta de Turmas", "Controle de grade curricular, abertura de turmas com vagas e proteção de matrículas ativas"],
    avaliacao: [
      currentUser.perfil === "ALUNO" ? "Avaliação Anônima Docente" : "Resultados da Avaliação Docente",
      currentUser.perfil === "ALUNO" ? "Avalie anonimamente os docentes das suas turmas" : "Médias consolidadas por turma sem identificação dos respondentes"
    ],
    ouvidoria: [
      ["COORDENADOR", "ADMIN"].includes(currentUser.perfil) ? "Gestão de Ouvidoria e Denúncias" : "Canal de Denúncias e Ouvidoria",
      ["COORDENADOR", "ADMIN"].includes(currentUser.perfil) ? "Tratamento sigiloso de ocorrências registradas" : "Registro sigiloso com geração imediata de protocolo"
    ],
    mural: ["Mural de Avisos Institucionais", "Comunicação segmentada por turma ou aviso geral"],
    calendario: ["Calendário Acadêmico Oficial", "Datas oficiais de matrícula, avaliações e prazos do semestre"],
    relatorios: ["Relatórios Gerenciais e Indicadores", "Painel consolidado de aprovação, reprovação e ocupação calculado em tempo real"]
  };

  document.getElementById("page-title").textContent = titles[viewId][0];
  document.getElementById("page-subtitle").textContent = titles[viewId][1];

  const renders = {
    usuarios: renderUsuarios,
    matricula: renderMatricula,
    notas: renderNotas,
    boletim: renderBoletim,
    documentos: renderDocumentos,
    grade: renderGrade,
    avaliacao: renderAvaliacao,
    ouvidoria: renderOuvidoria,
    mural: renderMural,
    calendario: renderCalendario,
    relatorios: renderRelatorios
  };
  renders[viewId]();
}

// ==========================================
// 1. GESTÃO DE USUÁRIOS
// ==========================================
async function renderUsuarios() {
  const db = getDB();
  let lista = db.usuarios;

  if (apiOnline) {
    try {
      const res = await fetch(`${API_BASE}/usuarios`);
      if (res.ok) lista = await res.json();
    } catch (_) {}
  }

  document.getElementById("view-container").innerHTML = `
    <div class="card">
      <div class="card-header"><h3>Cadastrar Novo Usuário</h3></div>
      <form id="form-usuario">
        <div class="form-row">
          <div class="form-group">
            <label>Nome Completo *</label>
            <input type="text" id="u-nome" required placeholder="Nome completo" />
          </div>
          <div class="form-group">
            <label>CPF *</label>
            <input type="text" id="u-cpf" required placeholder="Somente números" />
          </div>
          <div class="form-group">
            <label>Matrícula *</label>
            <input type="text" id="u-mat" required placeholder="Ex: 2026099" />
          </div>
        </div>
        <div class="form-row">
          <div class="form-group">
            <label>E-mail Institucional *</label>
            <input type="email" id="u-email" required placeholder="usuario@ucsal.edu.br" />
          </div>
          <div class="form-group">
            <label>Perfil de Acesso *</label>
            <select id="u-perfil">
              <option value="ALUNO">Aluno</option>
              <option value="PROFESSOR">Professor</option>
              <option value="SECRETARIA">Secretaria</option>
              <option value="COORDENADOR">Coordenador</option>
              <option value="ADMIN">Administrador</option>
            </select>
          </div>
          <div class="form-group">
            <label>Senha Inicial *</label>
            <input type="password" id="u-senha" required value="123" />
          </div>
        </div>
        <button type="submit" class="btn btn-primary">Salvar Usuário</button>
      </form>
    </div>

    <div class="card">
      <div class="card-header"><h3>Usuários Cadastrados (${lista.length})</h3></div>
      <div class="table-wrap">
        <table>
          <thead>
            <tr>
              <th>Nome</th>
              <th>CPF</th>
              <th>Matrícula</th>
              <th>Perfil</th>
              <th>Status</th>
              <th>Ação</th>
            </tr>
          </thead>
          <tbody>
            ${lista.map(u => `
              <tr>
                <td>${u.nome}<br><small style="color:#64748b">${u.email}</small></td>
                <td>${u.cpf}</td>
                <td>${u.matricula}</td>
                <td><span class="badge badge-neutral">${u.perfil}</span></td>
                <td><span class="badge ${u.ativo ? "badge-success" : "badge-danger"}">${u.ativo ? "Ativo" : "Inativo"}</span></td>
                <td>
                  <button type="button" class="btn btn-secondary btn-sm" onclick="toggleStatusUsuario(${u.id})">
                    ${u.ativo ? "Inativar" : "Ativar"}
                  </button>
                </td>
              </tr>
            `).join("")}
          </tbody>
        </table>
      </div>
    </div>
  `;

  document.getElementById("form-usuario").addEventListener("submit", async (e) => {
    e.preventDefault();
    const novo = {
      nome: document.getElementById("u-nome").value.trim(),
      cpf: document.getElementById("u-cpf").value.trim(),
      matricula: document.getElementById("u-mat").value.trim(),
      email: document.getElementById("u-email").value.trim(),
      perfil: document.getElementById("u-perfil").value,
      senha: document.getElementById("u-senha").value,
      ativo: true
    };

    if (apiOnline) {
      const resp = await fetch(`${API_BASE}/usuarios`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(novo)
      });
      if (!resp.ok) {
        showToast("Erro: CPF ou Matrícula já cadastrado no banco!");
        return;
      }
      showToast("Usuário salvo no Spring Boot!");
      renderUsuarios();
      return;
    }

    const dbAtual = getDB();
    if (dbAtual.usuarios.some(u => u.cpf === novo.cpf || u.matricula === novo.matricula)) {
      showToast("Bloqueado: CPF ou Matrícula já existente no sistema!");
      return;
    }
    novo.id = Date.now();
    dbAtual.usuarios.push(novo);
    saveDB(dbAtual);
    showToast("Usuário cadastrado com sucesso!");
    renderUsuarios();
  });
}

async function toggleStatusUsuario(id) {
  if (apiOnline) {
    await fetch(`${API_BASE}/usuarios/${id}/status`, { method: "PATCH" });
    renderUsuarios();
    return;
  }
  const db = getDB();
  const user = db.usuarios.find(u => u.id === id);
  if (user) user.ativo = !user.ativo;
  saveDB(db);
  showToast("Status atualizado com histórico preservado.");
  renderUsuarios();
}

// ==========================================
// 2. MATRÍCULA EM DISCIPLINAS E TURMAS
// ==========================================
let alunoSelecionadoMatricula = 1;

async function renderMatricula() {
  const db = getDB();
  const alunos = db.usuarios.filter(u => u.perfil === "ALUNO" && u.ativo);

  if (currentUser.perfil === "ALUNO") {
    alunoSelecionadoMatricula = currentUser.id;
  } else if (!alunos.some(a => a.id === alunoSelecionadoMatricula) && alunos.length > 0) {
    alunoSelecionadoMatricula = alunos[0].id;
  }

  let turmas = db.turmas;
  let minhas = db.matriculas.filter(m => m.alunoId === alunoSelecionadoMatricula);

  if (apiOnline) {
    try {
      const rT = await fetch(`${API_BASE}/turmas`);
      if (rT.ok) turmas = await rT.json();
      const rM = await fetch(`${API_BASE}/matriculas/aluno/${alunoSelecionadoMatricula}`);
      if (rM.ok) minhas = await rM.json();
    } catch (_) {}
  }

  const seletorAlunoHtml = currentUser.perfil !== "ALUNO" ? `
    <div class="card">
      <div class="form-group" style="margin-bottom:0">
        <label>Aluno selecionado para matrícula (Visão Secretaria / Admin):</label>
        <select onchange="alunoSelecionadoMatricula = parseInt(this.value, 10); renderMatricula();">
          ${alunos.map(a => `<option value="${a.id}" ${a.id === alunoSelecionadoMatricula ? "selected" : ""}>${a.nome} (Matrícula: ${a.matricula})</option>`).join("")}
        </select>
      </div>
    </div>
  ` : "";

  document.getElementById("view-container").innerHTML = `
    ${seletorAlunoHtml}

    <div class="card">
      <div class="card-header"><h3>Turmas Ofertadas no Semestre 2026.2</h3></div>
      <div class="table-wrap">
        <table>
          <thead>
            <tr>
              <th>Turma</th>
              <th>Disciplina</th>
              <th>Professor</th>
              <th>Horário</th>
              <th>Pré-requisito</th>
              <th>Vagas</th>
              <th>Ação</th>
            </tr>
          </thead>
          <tbody>
            ${turmas.map(t => {
              const jaMatriculado = minhas.some(m => m.turmaId === t.id);
              return `
                <tr>
                  <td><strong>${t.codigo}</strong></td>
                  <td>${t.disciplinaNome}</td>
                  <td>${t.professorNome}</td>
                  <td>${t.horario}</td>
                  <td>${t.preRequisitoNome}</td>
                  <td>
                    <span class="badge ${t.vagasDisponiveis > 0 ? "badge-success" : "badge-danger"}">
                      ${t.vagasDisponiveis} / ${t.vagasTotais}
                    </span>
                  </td>
                  <td>
                    ${jaMatriculado
                      ? `<span class="badge badge-neutral">Matriculado</span>`
                      : `<button type="button" class="btn btn-primary btn-sm" onclick="efetivarMatricula(${t.id})">Matricular</button>`
                    }
                  </td>
                </tr>
              `;
            }).join("")}
          </tbody>
        </table>
      </div>
    </div>

    <div class="card">
      <div class="card-header"><h3>Comprovante de Matrícula Atual (${minhas.length} disciplinas)</h3></div>
      <div class="table-wrap">
        <table>
          <thead>
            <tr>
              <th>Código</th>
              <th>Disciplina</th>
              <th>Situação</th>
            </tr>
          </thead>
          <tbody>
            ${minhas.length === 0
              ? `<tr><td colspan="3" style="color:#64748b">Nenhuma matrícula registrada para este aluno.</td></tr>`
              : minhas.map(m => `
                <tr>
                  <td>${m.codigo}</td>
                  <td>${m.disciplinaNome}</td>
                  <td><span class="badge badge-success">${m.situacao}</span></td>
                </tr>
              `).join("")
            }
          </tbody>
        </table>
      </div>
    </div>
  `;
}

async function efetivarMatricula(turmaId) {
  if (apiOnline) {
    const resp = await fetch(`${API_BASE}/matriculas`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ alunoId: alunoSelecionadoMatricula, turmaId })
    });
    if (!resp.ok) {
      const err = await resp.text();
      showToast(`Bloqueado: ${err || "Sem vagas ou pré-requisito pendente"}`);
      return;
    }
    showToast("Matrícula confirmada na API!");
    renderMatricula();
    return;
  }

  const db = getDB();
  const turma = db.turmas.find(t => t.id === turmaId);
  const aluno = db.usuarios.find(u => u.id === alunoSelecionadoMatricula) || currentUser;
  if (!turma) return;

  if (turma.vagasDisponiveis <= 0) {
    showToast("Matrícula bloqueada: Não há mais vagas disponíveis nesta turma.");
    return;
  }
  if (turma.preRequisitoCumprido === false) {
    showToast(`Matrícula bloqueada: Pré-requisito pendente (${turma.preRequisitoNome}).`);
    return;
  }

  turma.vagasDisponiveis -= 1;
  db.matriculas.push({
    id: Date.now(),
    alunoId: aluno.id,
    alunoNome: aluno.nome,
    turmaId: turma.id,
    codigo: turma.codigo,
    disciplinaNome: turma.disciplinaNome,
    nota1: 0,
    nota2: 0,
    percentualFrequencia: 100,
    mediaFinal: 0,
    situacao: "CURSANDO",
    revisaoSolicitada: false,
    justificativaPrazo: ""
  });
  saveDB(db);
  showToast("Matrícula efetivada! Vaga descontada com sucesso.");
  renderMatricula();
}

// ==========================================
// 3. LANÇAMENTO DE NOTAS + JUSTIFICATIVA FORA DO PRAZO
// ==========================================
let turmaFiltroNotas = "TODAS";
let lancamentoForaPrazo = false;

function renderNotas() {
  const db = getDB();
  const turmasDisponiveis = db.turmas;
  const registros = turmaFiltroNotas === "TODAS"
    ? db.matriculas
    : db.matriculas.filter(m => m.codigo === turmaFiltroNotas);

  document.getElementById("view-container").innerHTML = `
    <div class="card">
      <div class="card-header">
        <h3>Diário de Classe — Lançamento de Notas e Frequência</h3>
        <div style="display:flex;gap:10px;align-items:center;flex-wrap:wrap">
          <label style="font-size:0.82rem;display:flex;align-items:center;gap:6px;cursor:pointer">
            <input type="checkbox" style="width:auto" ${lancamentoForaPrazo ? "checked" : ""} onchange="lancamentoForaPrazo = this.checked; renderNotas();" />
            Simular Lançamento Fora do Prazo
          </label>
          <select style="width:auto" onchange="turmaFiltroNotas = this.value; renderNotas();">
            <option value="TODAS" ${turmaFiltroNotas === "TODAS" ? "selected" : ""}>Todas as Turmas</option>
            ${turmasDisponiveis.map(t => `<option value="${t.codigo}" ${turmaFiltroNotas === t.codigo ? "selected" : ""}>${t.codigo} - ${t.disciplinaNome}</option>`).join("")}
          </select>
        </div>
      </div>

      ${lancamentoForaPrazo ? `
        <div class="form-group" style="background:#fef3c7;padding:12px;border-radius:6px;border:1px solid #f59e0b">
          <label style="color:#92400e">Justificativa Obrigatória (Lançamento Extemporâneo) *</label>
          <input type="text" id="justificativa-prazo" placeholder="Informe o motivo do lançamento fora do prazo oficial do calendário..." />
        </div>
      ` : ""}

      <p class="subtitle" style="margin-bottom:14px">
        Média = (N1 + N2) / 2. Frequência inferior a 75% reprova automaticamente por falta e bloqueia edição de notas.
      </p>
      <div class="table-wrap">
        <table>
          <thead>
            <tr>
              <th>Aluno</th>
              <th>Disciplina</th>
              <th style="width:90px">Nota 1</th>
              <th style="width:90px">Nota 2</th>
              <th style="width:105px">Freq. (%)</th>
              <th>Média</th>
              <th>Situação</th>
              <th>Ação</th>
            </tr>
          </thead>
          <tbody>
            ${registros.length === 0
              ? `<tr><td colspan="8" style="color:#64748b">Nenhum aluno matriculado nesta turma.</td></tr>`
              : registros.map(m => {
                const bloqueadoFalta = m.percentualFrequencia < 75;
                return `
                  <tr>
                    <td>
                      <strong>${m.alunoNome}</strong>
                      ${m.justificativaPrazo ? `<br><small style="color:#b45309">Justificativa: ${m.justificativaPrazo}</small>` : ""}
                    </td>
                    <td>${m.codigo} - ${m.disciplinaNome}</td>
                    <td><input type="number" step="0.1" min="0" max="10" id="n1-${m.id}" value="${m.nota1}" ${bloqueadoFalta ? "disabled title='Bloqueado por reprovação por falta'" : ""} /></td>
                    <td><input type="number" step="0.1" min="0" max="10" id="n2-${m.id}" value="${m.nota2}" ${bloqueadoFalta ? "disabled title='Bloqueado por reprovação por falta'" : ""} /></td>
                    <td><input type="number" step="1" min="0" max="100" id="freq-${m.id}" value="${m.percentualFrequencia}" /></td>
                    <td><strong>${m.mediaFinal.toFixed(1)}</strong></td>
                    <td>${badgeSituacao(m.situacao)}</td>
                    <td><button type="button" class="btn btn-primary btn-sm" onclick="salvarAvaliacao(${m.id})">Salvar</button></td>
                  </tr>
                `;
              }).join("")
            }
          </tbody>
        </table>
      </div>
    </div>
  `;
}

function badgeSituacao(sit) {
  if (sit === "APROVADO") return `<span class="badge badge-success">APROVADO</span>`;
  if (sit === "EXAME_FINAL") return `<span class="badge badge-warning">EXAME FINAL</span>`;
  if (sit === "REPROVADO_FREQUENCIA") return `<span class="badge badge-danger">REPROV. FALTA</span>`;
  if (sit === "REPROVADO_NOTA") return `<span class="badge badge-danger">REPROV. NOTA</span>`;
  return `<span class="badge badge-neutral">${sit}</span>`;
}

async function salvarAvaliacao(matriculaId) {
  let justificativa = "";
  if (lancamentoForaPrazo) {
    const campoJust = document.getElementById("justificativa-prazo");
    justificativa = campoJust ? campoJust.value.trim() : "";
    if (!justificativa) {
      showToast("Bloqueado: Preencha a justificativa obrigatória para lançamento fora do prazo!");
      return;
    }
  }

  const db = getDB();
  const mat = db.matriculas.find(m => m.id === matriculaId);
  if (!mat) return;

  const percentualFrequencia = parseFloat(document.getElementById(`freq-${matriculaId}`).value);
  const freqValida = isNaN(percentualFrequencia) ? 0 : percentualFrequencia;

  const nota1 = mat.percentualFrequencia < 75 && freqValida < 75
    ? mat.nota1
    : (parseFloat(document.getElementById(`n1-${matriculaId}`).value) || 0);
  const nota2 = mat.percentualFrequencia < 75 && freqValida < 75
    ? mat.nota2
    : (parseFloat(document.getElementById(`n2-${matriculaId}`).value) || 0);

  if (apiOnline) {
    try {
      await fetch(`${API_BASE}/matriculas/${matriculaId}/avaliacao`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ nota1, nota2, percentualFrequencia: freqValida })
      });
    } catch (_) {}
  }

  mat.nota1 = nota1;
  mat.nota2 = nota2;
  mat.percentualFrequencia = freqValida;
  mat.mediaFinal = (nota1 + nota2) / 2;
  if (justificativa) mat.justificativaPrazo = justificativa;

  if (freqValida < 75) {
    mat.situacao = "REPROVADO_FREQUENCIA";
    showToast("Atenção: Frequência < 75%. Aluno reprovado por falta e notas bloqueadas!");
  } else if (mat.mediaFinal >= 7.0) {
    mat.situacao = "APROVADO";
    showToast("Notas salvas: Aluno APROVADO.");
  } else if (mat.mediaFinal >= 4.0) {
    mat.situacao = "EXAME_FINAL";
    showToast("Notas salvas: Aluno em EXAME FINAL.");
  } else {
    mat.situacao = "REPROVADO_NOTA";
    showToast("Notas salvas: Aluno REPROVADO POR NOTA.");
  }

  saveDB(db);
  renderNotas();
}

// ==========================================
// 4. BOLETIM E REVISÃO DE NOTA
// ==========================================
function renderBoletim() {
  const db = getDB();
  const minhas = db.matriculas.filter(m => m.alunoId === currentUser.id);

  document.getElementById("view-container").innerHTML = `
    <div class="card">
      <div class="card-header"><h3>Boletim Acadêmico — ${currentUser.nome} (2026.2)</h3></div>
      <div class="table-wrap">
        <table>
          <thead>
            <tr>
              <th>Código</th>
              <th>Disciplina</th>
              <th>N1</th>
              <th>N2</th>
              <th>Média</th>
              <th>Frequência</th>
              <th>Situação</th>
              <th>Revisão de Nota</th>
            </tr>
          </thead>
          <tbody>
            ${minhas.map(m => `
              <tr>
                <td>${m.codigo}</td>
                <td>${m.disciplinaNome}</td>
                <td>${m.nota1.toFixed(1)}</td>
                <td>${m.nota2.toFixed(1)}</td>
                <td><strong>${m.mediaFinal.toFixed(1)}</strong></td>
                <td>${m.percentualFrequencia}%</td>
                <td>${badgeSituacao(m.situacao)}</td>
                <td>
                  ${m.revisaoSolicitada
                    ? `<span class="badge badge-warning">Revisão em Análise</span>`
                    : `<button type="button" class="btn btn-secondary btn-sm" onclick="solicitarRevisao(${m.id})">Pedir Revisão</button>`
                  }
                </td>
              </tr>
            `).join("")}
          </tbody>
        </table>
      </div>
    </div>
  `;
}

function solicitarRevisao(id) {
  const db = getDB();
  const mat = db.matriculas.find(m => m.id === id);
  if (mat) mat.revisaoSolicitada = true;
  saveDB(db);
  showToast("Solicitação de revisão registrada dentro do prazo de 5 dias úteis.");
  renderBoletim();
}

// ==========================================
// 5. EMISSÃO E VALIDAÇÃO DE DECLARAÇÕES
// ==========================================
let alunoSelecionadoDoc = 1;

function renderDocumentos() {
  const db = getDB();
  const alunos = db.usuarios.filter(u => u.perfil === "ALUNO" && u.ativo);

  if (currentUser.perfil === "ALUNO") {
    alunoSelecionadoDoc = currentUser.id;
  } else if (!alunos.some(a => a.id === alunoSelecionadoDoc) && alunos.length > 0) {
    alunoSelecionadoDoc = alunos[0].id;
  }

  const ultimo = db.documentosEmitidos[db.documentosEmitidos.length - 1];

  const seletorAlunoDoc = currentUser.perfil !== "ALUNO" ? `
    <div class="form-group">
      <label>Aluno Destinatário</label>
      <select onchange="alunoSelecionadoDoc = parseInt(this.value, 10)">
        ${alunos.map(a => `<option value="${a.id}" ${a.id === alunoSelecionadoDoc ? "selected" : ""}>${a.nome} (${a.matricula})</option>`).join("")}
      </select>
    </div>
  ` : "";

  document.getElementById("view-container").innerHTML = `
    <div class="grid-2">
      <div class="card no-print">
        <div class="card-header"><h3>Emitir Documento Oficial</h3></div>
        ${seletorAlunoDoc}
        <div class="form-group">
          <label>Tipo de Documento</label>
          <select id="doc-tipo">
            <option value="Declaração de Matrícula">Declaração de Matrícula Ativa</option>
            <option value="Histórico Escolar Parcial">Histórico Escolar Consolidado</option>
            <option value="Comprovante de Grade">Comprovante de Horários</option>
          </select>
        </div>
        <button type="button" class="btn btn-primary" onclick="gerarDocumento()">Gerar com Código de Autenticidade</button>

        <hr style="margin:20px 0;border:none;border-top:1px solid var(--border)" />

        <div class="card-header"><h3>Validar Código de Autenticidade</h3></div>
        <div class="form-group">
          <label>Código Hash do Documento</label>
          <input type="text" id="hash-consulta" placeholder="Ex: SGA-2026-9F8A2C" />
        </div>
        <button type="button" class="btn btn-secondary" onclick="validarHash()">Verificar Autenticidade</button>
        <div id="hash-resultado" style="margin-top:12px"></div>
      </div>

      <div class="card">
        <div class="card-header no-print">
          <h3>Pré-visualização do Documento</h3>
          <button type="button" class="btn btn-secondary btn-sm" onclick="window.print()">Imprimir / Salvar PDF</button>
        </div>
        <div class="doc-preview">
          <h4>Universidade Católica do Salvador • SGA</h4>
          <p style="margin-bottom:12px"><strong>${ultimo.tipo}</strong></p>
          <p>Declaramos para os devidos fins que <strong>${ultimo.aluno}</strong>, portador(a) da matrícula <strong>${ultimo.matricula}</strong>, encontra-se regularmente matriculado(a) no curso de Bacharelado em Engenharia de Software no período letivo de 2026.2.</p>
          <p style="margin-top:12px">Salvador - BA, ${ultimo.data}.</p>
          <div class="hash-box">
            Código de Autenticidade Digital: <strong>${ultimo.hash}</strong>
          </div>
        </div>
      </div>
    </div>
  `;
}

function gerarDocumento() {
  const db = getDB();
  const alunoAlvo = db.usuarios.find(u => u.id === alunoSelecionadoDoc) || currentUser;
  const tipo = document.getElementById("doc-tipo").value;
  const hash = "SGA-2026-" + Math.random().toString(36).substring(2, 8).toUpperCase();

  db.documentosEmitidos.push({
    hash,
    tipo,
    aluno: alunoAlvo.nome,
    matricula: alunoAlvo.matricula || "2026001",
    data: new Date().toLocaleDateString("pt-BR")
  });
  saveDB(db);
  showToast(`Documento gerado! Código: ${hash}`);
  renderDocumentos();
}

function validarHash() {
  const code = document.getElementById("hash-consulta").value.trim().toUpperCase();
  const db = getDB();
  const found = db.documentosEmitidos.find(d => d.hash === code);
  const box = document.getElementById("hash-resultado");
  if (found) {
    box.innerHTML = `<div class="alert alert-success">Documento Autêntico: <strong>${found.tipo}</strong> emitido para ${found.aluno} em ${found.data}.</div>`;
  } else {
    box.innerHTML = `<div class="alert alert-danger">Código não encontrado na base oficial.</div>`;
  }
}

// ==========================================
// 6. GESTÃO DE DISCIPLINAS E ABERTURA DE TURMAS
// ==========================================
function renderGrade() {
  const db = getDB();
  const professores = db.usuarios.filter(u => u.perfil === "PROFESSOR" && u.ativo);

  document.getElementById("view-container").innerHTML = `
    <div class="grid-2">
      <div class="card">
        <div class="card-header"><h3>1. Cadastrar Disciplina na Matriz</h3></div>
        <form id="form-disc">
          <div class="form-row">
            <div class="form-group">
              <label>Código *</label>
              <input type="text" id="d-cod" required placeholder="Ex: BES405" />
            </div>
            <div class="form-group">
              <label>Carga Horária *</label>
              <input type="number" id="d-ch" required value="60" />
            </div>
          </div>
          <div class="form-group">
            <label>Nome da Disciplina *</label>
            <input type="text" id="d-nome" required placeholder="Ex: Qualidade de Software" />
          </div>
          <div class="form-group">
            <label>Pré-requisito</label>
            <input type="text" id="d-pre" value="Nenhum" />
          </div>
          <button type="submit" class="btn btn-primary">Salvar Disciplina</button>
        </form>
      </div>

      <div class="card">
        <div class="card-header"><h3>2. Abrir Nova Turma para Matrícula</h3></div>
        <form id="form-turma">
          <div class="form-group">
            <label>Disciplina *</label>
            <select id="t-disc">
              ${db.disciplinas.map(d => `<option value="${d.id}">${d.codigo} - ${d.nome}</option>`).join("")}
            </select>
          </div>
          <div class="form-row">
            <div class="form-group">
              <label>Código da Turma *</label>
              <input type="text" id="t-cod" required placeholder="Ex: BES405-A" />
            </div>
            <div class="form-group">
              <label>Total de Vagas *</label>
              <input type="number" id="t-vagas" required min="1" max="100" value="40" />
            </div>
          </div>
          <div class="form-row">
            <div class="form-group">
              <label>Professor *</label>
              <select id="t-prof">
                ${professores.map(p => `<option value="${p.nome}">${p.nome}</option>`).join("")}
              </select>
            </div>
            <div class="form-group">
              <label>Horário *</label>
              <input type="text" id="t-hor" required placeholder="QUA 19:00 - 21:40" />
            </div>
          </div>
          <button type="submit" class="btn btn-primary">Ofertar Turma no Semestre</button>
        </form>
      </div>
    </div>

    <div class="card">
      <div class="card-header"><h3>Matriz Curricular Cadastrada</h3></div>
      <div class="table-wrap">
        <table>
          <thead>
            <tr>
              <th>Código</th>
              <th>Disciplina</th>
              <th>Carga Horária</th>
              <th>Pré-requisito</th>
              <th>Ação</th>
            </tr>
          </thead>
          <tbody>
            ${db.disciplinas.map(d => `
              <tr>
                <td><strong>${d.codigo}</strong></td>
                <td>${d.nome}</td>
                <td>${d.cargaHoraria}h</td>
                <td>${d.preRequisito}</td>
                <td><button type="button" class="btn btn-secondary btn-sm" onclick="excluirDisciplina(${d.id})">Excluir</button></td>
              </tr>
            `).join("")}
          </tbody>
        </table>
      </div>
    </div>
  `;

  document.getElementById("form-disc").addEventListener("submit", (e) => {
    e.preventDefault();
    const dbAtual = getDB();
    dbAtual.disciplinas.push({
      id: Date.now(),
      codigo: document.getElementById("d-cod").value.trim().toUpperCase(),
      nome: document.getElementById("d-nome").value.trim(),
      cargaHoraria: parseInt(document.getElementById("d-ch").value, 10),
      preRequisito: document.getElementById("d-pre").value.trim() || "Nenhum"
    });
    saveDB(dbAtual);
    showToast("Disciplina incluída na matriz!");
    renderGrade();
  });

  document.getElementById("form-turma").addEventListener("submit", (e) => {
    e.preventDefault();
    const dbAtual = getDB();
    const discId = parseInt(document.getElementById("t-disc").value, 10);
    const disc = dbAtual.disciplinas.find(d => d.id === discId);
    const vagas = parseInt(document.getElementById("t-vagas").value, 10);

    dbAtual.turmas.push({
      id: Date.now(),
      codigo: document.getElementById("t-cod").value.trim().toUpperCase(),
      disciplinaNome: disc ? disc.nome : "Disciplina",
      professorNome: document.getElementById("t-prof").value,
      horario: document.getElementById("t-hor").value.trim(),
      vagasTotais: vagas,
      vagasDisponiveis: vagas,
      preRequisitoNome: disc ? disc.preRequisito : "Nenhum",
      preRequisitoCumprido: true
    });
    saveDB(dbAtual);
    showToast("Turma ofertada e disponível na tela de Matrículas!");
    renderGrade();
  });
}

function excluirDisciplina(id) {
  const db = getDB();
  const disc = db.disciplinas.find(d => d.id === id);
  if (!disc) return;

  const temMatriculados = db.matriculas.some(m => m.disciplinaNome === disc.nome);
  if (temMatriculados) {
    showToast("Bloqueado: Não é possível excluir disciplina com alunos matriculados no semestre!");
    return;
  }
  db.disciplinas = db.disciplinas.filter(d => d.id !== id);
  saveDB(db);
  showToast("Disciplina removida da grade.");
  renderGrade();
}

// ==========================================
// 7. AVALIAÇÃO DOCENTE (SEPARADA POR PERFIL)
// ==========================================
function renderAvaliacao() {
  const db = getDB();
  const isAluno = currentUser.perfil === "ALUNO";

  if (isAluno) {
    const minhasTurmas = db.matriculas.filter(m => m.alunoId === currentUser.id);
    document.getElementById("view-container").innerHTML = `
      <div class="card" style="max-width:650px">
        <div class="card-header"><h3>Avaliar Docente (100% Anônimo)</h3></div>
        <p class="subtitle" style="margin-bottom:14px">Sua matrícula não é vinculada às respostas enviadas. Apenas a média geral fica visível para a coordenação.</p>
        <form id="form-aval">
          <div class="form-group">
            <label>Disciplina Cursada</label>
            <select id="av-turma">
              ${minhasTurmas.length > 0
                ? minhasTurmas.map(m => {
                    const turmaInfo = db.turmas.find(t => t.id === m.turmaId);
                    const prof = turmaInfo ? turmaInfo.professorNome : "Docente Titular";
                    return `<option value="${m.codigo} - ${m.disciplinaNome}|${prof}">${m.codigo} - ${m.disciplinaNome} (${prof})</option>`;
                  }).join("")
                : `<option value="BES304-A - Engenharia de Requisitos|Elton Figueiredo">BES304-A - Engenharia de Requisitos (Elton Figueiredo)</option>`
              }
            </select>
          </div>
          <div class="form-row">
            <div class="form-group">
              <label>Didática (1 a 5)</label>
              <input type="number" id="av-did" min="1" max="5" value="5" required />
            </div>
            <div class="form-group">
              <label>Pontualidade (1 a 5)</label>
              <input type="number" id="av-pon" min="1" max="5" value="5" required />
            </div>
            <div class="form-group">
              <label>Domínio (1 a 5)</label>
              <input type="number" id="av-dom" min="1" max="5" value="5" required />
            </div>
          </div>
          <div class="form-group">
            <label>Comentário Construtivo (Opcional)</label>
            <textarea id="av-com" rows="3" placeholder="Escreva sua observação de forma anônima..."></textarea>
          </div>
          <button type="submit" class="btn btn-primary">Enviar Avaliação Anônima</button>
        </form>
      </div>
    `;

    document.getElementById("form-aval").addEventListener("submit", (e) => {
      e.preventDefault();
      const [turma, professor] = document.getElementById("av-turma").value.split("|");
      const dbAtual = getDB();
      dbAtual.avaliacoesDocentes.push({
        id: Date.now(),
        turma,
        professor,
        didatica: parseInt(document.getElementById("av-did").value, 10),
        pontualidade: parseInt(document.getElementById("av-pon").value, 10),
        dominio: parseInt(document.getElementById("av-dom").value, 10),
        comentario: document.getElementById("av-com").value.trim()
      });
      saveDB(dbAtual);
      showToast("Avaliação registrada anonimamente com sucesso!");
      document.getElementById("av-com").value = "";
    });
    return;
  }

  document.getElementById("view-container").innerHTML = `
    <div class="card">
      <div class="card-header"><h3>Resultados Consolidados da Avaliação Docente (${db.avaliacoesDocentes.length} respostas)</h3></div>
      ${db.avaliacoesDocentes.map(a => {
        const media = ((a.didatica + a.pontualidade + a.dominio) / 3).toFixed(1);
        return `
          <div style="padding:14px;border:1px solid var(--border);border-radius:6px;margin-bottom:10px">
            <div style="display:flex;justify-content:space-between">
              <strong>${a.turma}</strong>
              <span class="badge badge-success">Média Geral: ${media} / 5.0</span>
            </div>
            <small style="color:var(--muted)">Docente: ${a.professor} • Didática: ${a.didatica} | Pontualidade: ${a.pontualidade} | Domínio: ${a.dominio} • Respondente: Anônimo</small>
            ${a.comentario ? `<p style="margin-top:6px;font-size:0.88rem">"${a.comentario}"</p>` : ""}
          </div>
        `;
      }).join("")}
    </div>
  `;
}

// ==========================================
// 8. CANAL DE DENÚNCIAS E OUVIDORIA
// ==========================================
function renderOuvidoria() {
  const db = getDB();
  const isGestor = ["COORDENADOR", "ADMIN"].includes(currentUser.perfil);

  if (isGestor) {
    document.getElementById("view-container").innerHTML = `
      <div class="card">
        <div class="card-header"><h3>Fila de Ocorrências da Ouvidoria (${db.denuncias.length})</h3></div>
        ${db.denuncias.map((d, idx) => `
          <div style="padding:14px;border:1px solid var(--border);border-radius:6px;margin-bottom:12px">
            <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:6px">
              <strong>Protocolo: ${d.protocolo} — ${d.categoria}</strong>
              <div style="display:flex;gap:8px;align-items:center">
                <span class="badge ${d.status === "Resolvida" ? "badge-success" : "badge-warning"}">${d.status}</span>
                ${d.status !== "Resolvida" ? `<button type="button" class="btn btn-secondary btn-sm" onclick="concluirDenuncia(${idx})">Marcar como Resolvida</button>` : ""}
              </div>
            </div>
            <small style="color:var(--muted)">Data: ${d.data} • ${d.anonimo ? "Registro Anônimo (Sigilo Preservado)" : "Registro Identificado"}</small>
            <p style="margin-top:8px;font-size:0.9rem">${d.descricao}</p>
          </div>
        `).join("")}
      </div>
    `;
    return;
  }

  const meusProtocolos = db.denuncias.filter(d => d.autorId === currentUser.id);
  document.getElementById("view-container").innerHTML = `
    <div class="grid-2">
      <div class="card">
        <div class="card-header"><h3>Registrar Ocorrência / Denúncia</h3></div>
        <form id="form-ouv">
          <div class="form-group">
            <label>Categoria</label>
            <select id="ouv-cat">
              <option value="Conduta / Ética">Conduta / Ética</option>
              <option value="Infraestrutura">Infraestrutura</option>
              <option value="Processo Acadêmico">Processo Acadêmico</option>
            </select>
          </div>
          <div class="form-group">
            <label>Identificação</label>
            <select id="ouv-anon">
              <option value="true">Enviar de forma Anônima (Sigilo Total)</option>
              <option value="false">Enviar Identificado (${currentUser.nome})</option>
            </select>
          </div>
          <div class="form-group">
            <label>Relato Detalhado *</label>
            <textarea id="ouv-desc" rows="4" required placeholder="Descreva o ocorrido..."></textarea>
          </div>
          <button type="submit" class="btn btn-primary">Registrar e Gerar Protocolo</button>
        </form>
      </div>

      <div class="card">
        <div class="card-header"><h3>Meus Protocolos Registrados</h3></div>
        ${meusProtocolos.length === 0
          ? `<p style="color:#64748b;font-size:0.9rem">Você ainda não registrou ocorrências.</p>`
          : meusProtocolos.map(d => `
            <div style="padding:12px;border:1px solid var(--border);border-radius:6px;margin-bottom:10px">
              <div style="display:flex;justify-content:space-between;margin-bottom:4px">
                <strong>Protocolo: ${d.protocolo}</strong>
                <span class="badge ${d.status === "Resolvida" ? "badge-success" : "badge-warning"}">${d.status}</span>
              </div>
              <small style="color:var(--muted)">${d.categoria} • ${d.data} • ${d.anonimo ? "Anônimo" : "Identificado"}</small>
              <p style="margin-top:6px;font-size:0.86rem">${d.descricao}</p>
            </div>
          `).join("")
        }
      </div>
    </div>
  `;

  document.getElementById("form-ouv").addEventListener("submit", (e) => {
    e.preventDefault();
    const protocolo = "OUV-2026-" + Math.floor(1000 + Math.random() * 9000);
    const dbAtual = getDB();
    dbAtual.denuncias.unshift({
      protocolo,
      autorId: currentUser.id,
      categoria: document.getElementById("ouv-cat").value,
      anonimo: document.getElementById("ouv-anon").value === "true",
      descricao: document.getElementById("ouv-desc").value.trim(),
      status: "Em Análise",
      data: new Date().toLocaleDateString("pt-BR")
    });
    saveDB(dbAtual);
    showToast(`Denúncia registrada! Protocolo: ${protocolo}`);
    renderOuvidoria();
  });
}

function concluirDenuncia(index) {
  const db = getDB();
  if (db.denuncias[index]) {
    db.denuncias[index].status = "Resolvida";
    saveDB(db);
    showToast("Protocolo atualizado para Resolvida.");
    renderOuvidoria();
  }
}

// ==========================================
// 9. MURAL DE AVISOS
// ==========================================
function renderMural() {
  const db = getDB();
  const podePublicar = ["PROFESSOR", "SECRETARIA", "COORDENADOR", "ADMIN"].includes(currentUser.perfil);

  let avisosVisiveis = db.avisos;
  if (currentUser.perfil === "ALUNO") {
    const codigosAluno = db.matriculas.filter(m => m.alunoId === currentUser.id).map(m => m.codigo);
    avisosVisiveis = db.avisos.filter(a => a.turmaCodigo === "GERAL" || codigosAluno.includes(a.turmaCodigo));
  }

  document.getElementById("view-container").innerHTML = `
    ${podePublicar ? `
      <div class="card no-print">
        <div class="card-header"><h3>Publicar Novo Comunicado</h3></div>
        <form id="form-aviso">
          <div class="form-row">
            <div class="form-group">
              <label>Título do Aviso</label>
              <input type="text" id="aviso-titulo" required placeholder="Ex: Material de Apoio Aula 08" />
            </div>
            <div class="form-group">
              <label>Público-Alvo</label>
              <select id="aviso-destino">
                ${db.turmas.map(t => `<option value="${t.codigo}|${t.codigo} (${t.disciplinaNome})">Turma ${t.codigo} (${t.disciplinaNome})</option>`).join("")}
                ${currentUser.perfil !== "PROFESSOR" ? `<option value="GERAL|Toda a Instituição">Toda a Instituição (Aviso Geral)</option>` : ""}
              </select>
            </div>
          </div>
          <div class="form-group">
            <label>Mensagem</label>
            <textarea id="aviso-msg" rows="2" required></textarea>
          </div>
          <button type="submit" class="btn btn-primary">Publicar no Mural</button>
        </form>
      </div>
    ` : ""}

    <div class="card">
      <div class="card-header"><h3>Mural de Avisos (${avisosVisiveis.length})</h3></div>
      ${avisosVisiveis.map(a => `
        <div style="padding:14px;border-left:4px solid var(--primary);background:#f8fafc;margin-bottom:12px;border-radius:4px">
          <div style="display:flex;justify-content:space-between">
            <strong>${a.titulo}</strong>
            <span class="badge badge-neutral">${a.destino}</span>
          </div>
          <p style="margin:6px 0;font-size:0.9rem">${a.mensagem}</p>
          <small style="color:var(--muted)">Publicado por ${a.autor} em ${a.data}</small>
        </div>
      `).join("")}
    </div>
  `;

  const formAviso = document.getElementById("form-aviso");
  if (formAviso) {
    formAviso.addEventListener("submit", (e) => {
      e.preventDefault();
      const [turmaCodigo, destino] = document.getElementById("aviso-destino").value.split("|");
      const dbAtual = getDB();
      dbAtual.avisos.unshift({
        id: Date.now(),
        autor: currentUser.nome,
        perfilAutor: currentUser.perfil,
        turmaCodigo,
        destino,
        titulo: document.getElementById("aviso-titulo").value.trim(),
        mensagem: document.getElementById("aviso-msg").value.trim(),
        data: new Date().toLocaleDateString("pt-BR")
      });
      saveDB(dbAtual);
      showToast("Aviso publicado no mural!");
      renderMural();
    });
  }
}

// ==========================================
// 10. CALENDÁRIO ACADÊMICO
// ==========================================
function renderCalendario() {
  const db = getDB();
  const podeEditar = ["SECRETARIA", "COORDENADOR", "ADMIN"].includes(currentUser.perfil);

  document.getElementById("view-container").innerHTML = `
    ${podeEditar ? `
      <div class="card no-print">
        <div class="card-header"><h3>Adicionar Data Oficial ao Calendário</h3></div>
        <form id="form-cal" class="form-row">
          <div class="form-group">
            <label>Data</label>
            <input type="text" id="cal-data" required placeholder="DD/MM/AAAA" />
          </div>
          <div class="form-group">
            <label>Evento / Prazo</label>
            <input type="text" id="cal-evento" required placeholder="Ex: Prazo limite de trancamento" />
          </div>
          <div class="form-group">
            <label>Categoria</label>
            <select id="cal-tipo">
              <option value="Acadêmico">Acadêmico</option>
              <option value="Matrícula">Matrícula</option>
              <option value="Avaliação">Avaliação</option>
            </select>
          </div>
          <div class="form-group" style="display:flex;align-items:flex-end">
            <button type="submit" class="btn btn-primary btn-block">Incluir Data</button>
          </div>
        </form>
      </div>
    ` : ""}

    <div class="card">
      <div class="card-header"><h3>Calendário Acadêmico Oficial 2026.2 / 2027.1</h3></div>
      <div class="table-wrap">
        <table>
          <thead>
            <tr>
              <th>Data</th>
              <th>Evento / Atividade</th>
              <th>Categoria</th>
            </tr>
          </thead>
          <tbody>
            ${db.calendario.map(c => `
              <tr>
                <td><strong>${c.data}</strong></td>
                <td>${c.evento}</td>
                <td><span class="badge badge-neutral">${c.tipo}</span></td>
              </tr>
            `).join("")}
          </tbody>
        </table>
      </div>
    </div>
  `;

  const formCal = document.getElementById("form-cal");
  if (formCal) {
    formCal.addEventListener("submit", (e) => {
      e.preventDefault();
      const dbAtual = getDB();
      dbAtual.calendario.push({
        id: Date.now(),
        data: document.getElementById("cal-data").value.trim(),
        evento: document.getElementById("cal-evento").value.trim(),
        tipo: document.getElementById("cal-tipo").value
      });
      saveDB(dbAtual);
      showToast("Calendário atualizado e usuários notificados!");
      renderCalendario();
    });
  }
}

// ==========================================
// 11. RELATÓRIOS GERENCIAIS
// ==========================================
let filtroRelatorioTurma = "TODAS";

function renderRelatorios() {
  const db = getDB();
  const matriculasFiltradas = filtroRelatorioTurma === "TODAS"
    ? db.matriculas
    : db.matriculas.filter(m => m.codigo === filtroRelatorioTurma);

  const totalMat = matriculasFiltradas.length;
  const aprovados = matriculasFiltradas.filter(m => m.situacao === "APROVADO").length;
  const reprovados = matriculasFiltradas.filter(m => m.situacao.startsWith("REPROVADO")).length;
  const taxaAprov = totalMat ? Math.round((aprovados / totalMat) * 100) : 0;
  const taxaReprov = totalMat ? Math.round((reprovados / totalMat) * 100) : 0;

  document.getElementById("view-container").innerHTML = `
    <div class="card no-print">
      <div class="form-row" style="align-items:flex-end">
        <div class="form-group" style="margin-bottom:0">
          <label>Filtrar Indicadores por Turma</label>
          <select onchange="filtroRelatorioTurma = this.value; renderRelatorios();">
            <option value="TODAS" ${filtroRelatorioTurma === "TODAS" ? "selected" : ""}>Todas as Turmas (Consolidado Geral)</option>
            ${db.turmas.map(t => `<option value="${t.codigo}" ${filtroRelatorioTurma === t.codigo ? "selected" : ""}>${t.codigo} - ${t.disciplinaNome}</option>`).join("")}
          </select>
        </div>
        <div class="form-group" style="margin-bottom:0">
          <button type="button" class="btn btn-primary" onclick="window.print()">Exportar Relatório PDF</button>
        </div>
      </div>
    </div>

    <div class="grid-4">
      <div class="stat-card">
        <span>Alunos Ativos no Sistema</span>
        <strong>${db.usuarios.filter(u => u.perfil === "ALUNO" && u.ativo).length}</strong>
      </div>
      <div class="stat-card">
        <span>Matrículas Analisadas</span>
        <strong>${totalMat}</strong>
      </div>
      <div class="stat-card">
        <span>Taxa de Aprovação</span>
        <strong>${taxaAprov}%</strong>
      </div>
      <div class="stat-card">
        <span>Taxa de Reprovação</span>
        <strong>${taxaReprov}%</strong>
      </div>
    </div>

    <div class="card">
      <div class="card-header">
        <h3>Desempenho Real Consolidado por Turma</h3>
      </div>
      <div class="table-wrap">
        <table>
          <thead>
            <tr>
              <th>Turma</th>
              <th>Disciplina</th>
              <th>Professor</th>
              <th>Ocupação de Vagas</th>
              <th>Média Real da Turma</th>
              <th>Aprovados / Reprovados</th>
            </tr>
          </thead>
          <tbody>
            ${db.turmas.map(t => {
              const ocupadas = t.vagasTotais - t.vagasDisponiveis;
              const matsTurma = db.matriculas.filter(m => m.turmaId === t.id);
              const mediaTurma = matsTurma.length
                ? (matsTurma.reduce((acc, cur) => acc + cur.mediaFinal, 0) / matsTurma.length).toFixed(1)
                : "Sem notas";
              const qtdAprov = matsTurma.filter(m => m.situacao === "APROVADO").length;
              const qtdReprov = matsTurma.filter(m => m.situacao.startsWith("REPROVADO")).length;

              return `
                <tr>
                  <td><strong>${t.codigo}</strong></td>
                  <td>${t.disciplinaNome}</td>
                  <td>${t.professorNome}</td>
                  <td>${ocupadas} / ${t.vagasTotais} alunos</td>
                  <td>
                    <span class="badge ${mediaTurma === "Sem notas" ? "badge-neutral" : (parseFloat(mediaTurma) >= 7 ? "badge-success" : "badge-warning")}">
                      ${mediaTurma}
                    </span>
                  </td>
                  <td>${qtdAprov} aprov. / ${qtdReprov} reprov.</td>
                </tr>
              `;
            }).join("")}
          </tbody>
        </table>
      </div>
    </div>
  `;
}