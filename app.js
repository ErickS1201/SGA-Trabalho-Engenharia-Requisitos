const API_URL = 'http://localhost:8080/api';
let usuarioAtual = null;

// ==========================================
// 1. AUTENTICAÇÃO E CONTROLE DE ACESSO (RF01)
// ==========================================
async function fazerLogin(event) {
    event.preventDefault();
    const loginVal = document.getElementById('login-input').value.trim();
    const senhaVal = document.getElementById('senha-input').value.trim();

    try {
        const res = await fetch(`${API_URL}/auth/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ login: loginVal, senha: senhaVal })
        });

        if (res.ok) {
            usuarioAtual = await res.json();
            localStorage.setItem('sga_user', JSON.stringify(usuarioAtual));
            iniciarSistema();
        } else {
            const msg = await res.text();
            alert('Acesso negado: ' + msg);
        }
    } catch (e) {
        console.error(e);
        alert('Erro ao conectar no servidor.');
    }
}

function iniciarSistema() {
    document.getElementById('tela-login').classList.add('hidden');
    document.getElementById('sistema-principal').classList.remove('hidden');
    document.getElementById('nome-usuario-logado').innerText = usuarioAtual.nome;
    document.getElementById('badge-perfil').innerText = usuarioAtual.perfil;

    montarMenuPorPerfil(usuarioAtual.perfil);
}

function logout() {
    localStorage.removeItem('sga_user');
    location.reload();
}

// ==========================================
// 2. NAVEGAÇÃO DINÂMICA POR PERFIL
// ==========================================
function montarMenuPorPerfil(perfil) {
    const menu = document.getElementById('menu-navegacao');
    menu.innerHTML = '';

    const itens = [
        { id: 'sec-mural', label: 'Mural e Calendário', perfis: ['ALUNO', 'PROFESSOR', 'SECRETARIA', 'COORDENADOR', 'ADMIN'] },
        { id: 'sec-usuarios', label: 'Gestão de Usuários', perfis: ['SECRETARIA', 'ADMIN'] },
        { id: 'sec-matricula', label: 'Matrícula em Turmas', perfis: ['ALUNO'] },
        { id: 'sec-boletim', label: 'Boletim e Frequência', perfis: ['ALUNO'] },
        { id: 'sec-notas', label: 'Lançar Notas/Frequência', perfis: ['PROFESSOR'] },
        { id: 'sec-documentos', label: 'Emitir Documentos', perfis: ['ALUNO', 'SECRETARIA'] },
        { id: 'sec-curriculo', label: 'Grade Curricular', perfis: ['COORDENADOR'] },
        { id: 'sec-avaliacao', label: 'Avaliação Docente', perfis: ['ALUNO'] },
        { id: 'sec-ouvidoria', label: 'Ouvidoria / Denúncias', perfis: ['ALUNO', 'PROFESSOR', 'COORDENADOR'] },
        { id: 'sec-relatorios', label: 'Relatórios Gerenciais', perfis: ['COORDENADOR', 'ADMIN'] },
        { id: 'sec-chamada', label: 'Realizar Chamada', perfis: ['PROFESSOR'] },
        { id: 'sec-alocacao', label: 'Alocar Professores', perfis: ['COORDENADOR', 'ADMIN'] }
    ];

    let primeiraTela = null;

    itens.forEach(item => {
        if (item.perfis.includes(perfil)) {
            if (!primeiraTela) primeiraTela = item.id;
            const li = document.createElement('li');
            li.innerText = item.label;
            li.onclick = () => abrirTela(item.id);
            menu.appendChild(li);
        }
    });

    if (['PROFESSOR', 'SECRETARIA', 'COORDENADOR'].includes(perfil)) {
        document.getElementById('form-novo-aviso-box').classList.remove('hidden');
    }

    if (primeiraTela) abrirTela(primeiraTela);
}

function abrirTela(idSecao) {
    document.querySelectorAll('.tela-modulo').forEach(sec => sec.classList.add('hidden'));
    document.getElementById(idSecao).classList.remove('hidden');

    // Gatilhos de carregamento de dados reais da API
    if (idSecao === 'sec-usuarios') carregarUsuarios();
    if (idSecao === 'sec-matricula') carregarTurmasParaMatricula();
    if (idSecao === 'sec-chamada') carregarTurmasParaSelecaoChamada();
    if (idSecao === 'sec-boletim') carregarBoletimAluno();
    if (idSecao === 'sec-notas') carregarTurmasProfessor();
    if (idSecao === 'sec-curriculo') carregarDisciplinas();
    if (idSecao === 'sec-mural') carregarAvisos();
    if (idSecao === 'sec-alocacao') carregarTelaAlocacao();
    if (idSecao === 'sec-ouvidoria' && usuarioAtual.perfil === 'COORDENADOR') carregarDenuncias();
}

// ==========================================
// 3. GESTÃO DE USUÁRIOS (RF02 - API REAL)
// ==========================================
async function carregarUsuarios() {
    const res = await fetch(`${API_URL}/usuarios`);
    const lista = await res.json();
    const tbody = document.getElementById('tabela-usuarios');
    tbody.innerHTML = lista.map(u => `
        <tr>
            <td>${u.nome}</td>
            <td>${u.cpf}</td>
            <td>${u.matricula}</td>
            <td><strong>${u.perfil}</strong></td>
            <td>${u.ativo ? 'Ativo' : 'Inativo'}</td>
            <td><button onclick="alternarStatusUsuario(${u.id})">Ativar/Inativar</button></td>
        </tr>
    `).join('');
}
async function carregarTelaAlocacao() {
    try {
        // Busca turmas cadastradas
        const resTurmas = await fetch(`${API_URL}/turmas`);
        const turmas = await resTurmas.json();

        // Busca usuários com perfil de professor
        const resUsers = await fetch(`${API_URL}/usuarios`);
        const usuarios = await resUsers.json();
        const professores = usuarios.filter(u => u.perfil === 'PROFESSOR');

        // Preenche o select de turmas
        const selectTurma = document.getElementById('select-aloca-turma');
        selectTurma.innerHTML = turmas.length > 0 
            ? turmas.map(t => `<option value="${t.id}">${t.codigo} - ${t.disciplinaNome} (Atual: ${t.professorNome || 'Nenhum'})</option>`).join('')
            : '<option value="">Nenhuma turma cadastrada</option>';

        // Preenche o select de professores
        const selectProf = document.getElementById('select-aloca-prof');
        selectProf.innerHTML = professores.length > 0
            ? professores.map(p => `<option value="${p.id}">${p.nome} (${p.email})</option>`).join('')
            : '<option value="">Nenhum professor cadastrado no sistema</option>';

    } catch (e) {
        console.error("Erro ao carregar dados para alocação:", e);
    }
}

async function salvarAlocacaoProfessor(event) {
    event.preventDefault();
    const turmaId = document.getElementById('select-aloca-turma').value;
    const profId = document.getElementById('select-aloca-prof').value;

    if (!turmaId || !profId) {
        alert('Selecione uma turma e um professor.');
        return;
    }

    const res = await fetch(`${API_URL}/turmas/${turmaId}/professor/${profId}`, {
        method: 'PUT'
    });

    if (res.ok) {
        alert('Professor alocado com sucesso na turma!');
        carregarTelaAlocacao(); // Recarrega os dados atualizados
    } else {
        const erro = await res.text();
        alert('Erro ao alocar professor: ' + erro);
    }
}
async function salvarAlocacaoProfessor(event) {
    event.preventDefault();
    const turmaId = document.getElementById('select-aloca-turma').value;
    const profId = document.getElementById('select-aloca-prof').value;

    const res = await fetch(`${API_URL}/turmas/${turmaId}/professor/${profId}`, {
        method: 'PUT'
    });

    if (res.ok) {
        alert('Professor alocado com sucesso na turma!');
    } else {
        alert('Erro ao alocar professor.');
    }
}
async function cadastrarUsuario(event) {
    event.preventDefault();
    const payload = {
        nome: document.getElementById('cad-nome').value,
        cpf: document.getElementById('cad-cpf').value,
        matricula: document.getElementById('cad-matricula').value,
        email: document.getElementById('cad-email').value,
        senha: document.getElementById('cad-senha').value,
        perfil: document.getElementById('cad-perfil').value
    };

    const res = await fetch(`${API_URL}/usuarios`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
    });

    if (res.status === 201) {
        alert('Usuário cadastrado com sucesso!');
        document.getElementById('form-cadastro-usuario').reset();
        carregarUsuarios();
    } else {
        alert('Erro: ' + await res.text());
    }
}

async function alternarStatusUsuario(id) {
    await fetch(`${API_URL}/usuarios/${id}/status`, { method: 'PATCH' });
    carregarUsuarios();
}
async function carregarAlunosParaChamada() {
    const turmaId = document.getElementById('select-turma-chamada').value;
    const res = await fetch(`${API_URL}/matriculas/turma/${turmaId}`);
    const alunos = document.getElementById('lista-chamada-alunos');
    
    const matriculas = await res.json();
    
    alunos.innerHTML = matriculas.map(m => `
        <div class="card-item" style="display: flex; justify-content: space-between; align-items: center;">
            <span>${m.aluno.nome} (Matrícula: ${m.aluno.matricula})</span>
            <label>
                <input type="checkbox" class="check-presenca" value="${m.id}" checked> Presente
            </label>
        </div>
    `).join('');
}

async function enviarChamada() {
    const turmaId = document.getElementById('select-turma-chamada').value;
    const checkboxes = document.querySelectorAll('.check-presenca:checked');
    const presentes = Array.from(checkboxes).map(cb => parseInt(cb.value));

    const res = await fetch(`${API_URL}/chamadas/lancar`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ turmaId, presentes })
    });

    if (res.ok) {
        alert('Chamada salva e frequência dos alunos atualizada com sucesso!');
    } else {
        alert('Erro ao salvar chamada.');
    }
}
// ==========================================
// 4. MATRÍCULA E BOLETIM (RF03 / RF05 - API REAL)
// ==========================================
async function carregarTurmasParaMatricula() {
    const res = await fetch(`${API_URL}/turmas`);
    const turmas = await res.json();
    const div = document.getElementById('lista-turmas-disponiveis');

    div.innerHTML = turmas.map(t => `
        <div class="card-item">
            <h3>${t.codigo} - ${t.disciplinaNome}</h3>
            <p><strong>Docente:</strong> ${t.professorNome}</p>
            <p><strong>Horário:</strong> ${t.horario}</p>
            <p><strong>Vagas:</strong> ${t.vagasDisponiveis} / ${t.vagasTotais}</p>
            <button onclick="efetivarMatricula(${t.id})" class="mt-20">Confirmar Matrícula</button>
        </div>
    `).join('');
}
// async function efetivarMatricula(turmaId) {
//     const res = await fetch(`${API_URL}/matriculas`, {
//         method: 'POST',
//         headers: { 'Content-Type': 'application/json' },
//         body: JSON.stringify({ alunoId: usuarioAtual.id, turmaId: turmaId })
//     });

//     if (res.ok) {
//         alert('Matrícula realizada com sucesso!');
//         carregarTurmasParaMatricula();
//     } else {
//         const erroMsg = await res.text();
//         alert('Erro na matrícula: ' + erroMsg);
//     }
// }
async function carregarTurmasParaSelecaoChamada() {
    const res = await fetch(`${API_URL}/turmas`);
    const turmas = await res.json();
    const select = document.getElementById('select-turma-chamada');
    
    select.innerHTML = turmas.map(t => `<option value="${t.id}">${t.codigo} - ${t.disciplinaNome}</option>`).join('');
    
    if (turmas.length > 0) {
        carregarAlunosParaChamada();
    }
}
async function efetivarMatricula(turmaId) {
    const res = await fetch(`${API_URL}/matriculas`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ alunoId: usuarioAtual.id, turmaId: turmaId })
    });

    if (res.ok) {
        alert('Matrícula realizada! Vaga descontada com sucesso.');
        carregarTurmasParaMatricula();
    } else {
        alert('Não foi possível matricular: ' + await res.text());
    }
}

async function carregarBoletimAluno() {
    const res = await fetch(`${API_URL}/matriculas/aluno/${usuarioAtual.id}`);
    const matriculas = await res.json();
    const tbody = document.getElementById('tabela-boletim');

    tbody.innerHTML = matriculas.map(m => `
        <tr>
            <td>${m.turma.codigo}</td>
            <td>${m.turma.disciplinaNome}</td>
            <td>${m.nota1 ?? '-'}</td>
            <td>${m.nota2 ?? '-'}</td>
            <td><strong>${m.mediaFinal ?? '-'}</strong></td>
            <td>${m.percentualFrequencia ? m.percentualFrequencia + '%' : '-'}</td>
            <td><strong>${m.situacao}</strong></td>
        </tr>
    `).join('');
}

// ==========================================
// 5. LANÇAMENTO DE NOTAS (RF04 - API REAL)
// ==========================================
async function carregarTurmasProfessor() {
    const res = await fetch(`${API_URL}/turmas`);
    const turmas = await res.json();
    const select = document.getElementById('select-turma-prof');
    select.innerHTML = turmas.map(t => `<option value="${t.id}">${t.codigo} - ${t.disciplinaNome}</option>`).join('');
    if (turmas.length > 0) carregarAlunosTurma();
}

async function carregarAlunosTurma() {
    const turmaId = document.getElementById('select-turma-prof').value;
    const res = await fetch(`${API_URL}/matriculas/turma/${turmaId}`);
    const alunos = await res.json();
    const tbody = document.getElementById('tabela-lancamento-notas');

    tbody.innerHTML = alunos.map(m => `
        <tr>
            <td>${m.aluno.nome}</td>
            <td>${m.aluno.matricula}</td>
            <td><input type="number" step="0.1" id="n1-${m.id}" value="${m.nota1 || ''}" style="width:70px"></td>
            <td><input type="number" step="0.1" id="n2-${m.id}" value="${m.nota2 || ''}" style="width:70px"></td>
            <td><input type="number" step="1" id="fq-${m.id}" value="${m.percentualFrequencia || ''}" style="width:70px"></td>
            <td>Média: <strong>${m.mediaFinal ?? '-'}</strong> (${m.situacao})</td>
            <td><button onclick="salvarNota(${m.id})">Salvar</button></td>
        </tr>
    `).join('');
}

async function salvarNota(matriculaId) {
    const nota1 = parseFloat(document.getElementById(`n1-${matriculaId}`).value);
    const nota2 = parseFloat(document.getElementById(`n2-${matriculaId}`).value);
    const percentualFrequencia = parseFloat(document.getElementById(`fq-${matriculaId}`).value);

    const res = await fetch(`${API_URL}/matriculas/${matriculaId}/avaliacao`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ nota1, nota2, percentualFrequencia })
    });

    if (res.ok) {
        const atualizada = await res.json();
        alert(`Lançado! Média: ${atualizada.mediaFinal} | Situação: ${atualizada.situacao}`);
        carregarAlunosTurma();
    } else {
        alert('Erro ao salvar notas.');
    }
}

// ==========================================
// 6. MÓDULOS COMPLEMENTARES (RF06 a RF11)
// ==========================================
async function emitirDocumento(tipo) {
    const res = await fetch(`${API_URL}/documentos/emitir`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ tipo, alunoNome: usuarioAtual.nome })
    });
    const doc = await res.json();
    const box = document.getElementById('area-documento-gerado');
    box.classList.remove('hidden');
    box.innerHTML = `
        <h3>Documento Oficial - UCSAL</h3>
        <p>Certificamos que <strong>${doc.alunoNome}</strong> possui vínculo ativo nesta instituição.</p>
        <p><strong>Tipo:</strong> ${doc.tipo}</p>
        <p><strong>Código de Autenticidade (RN09):</strong> <code>${doc.codigoVerificacao}</code></p>
        <button onclick="window.print()" class="mt-20">Imprimir / Salvar PDF</button>
    `;
}

async function carregarDisciplinas() {
    const res = await fetch(`${API_URL}/disciplinas`);
    const lista = await res.json();
    document.getElementById('lista-disciplinas').innerHTML = lista.map(d => 
        `<li><strong>${d.nome}</strong> (${d.cargaHoraria}h) - ${d.ementa}</li>`
    ).join('');
}

async function cadastrarDisciplina(event) {
    event.preventDefault();
    await fetch(`${API_URL}/disciplinas`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            nome: document.getElementById('disc-nome').value,
            cargaHoraria: parseInt(document.getElementById('disc-ch').value),
            ementa: document.getElementById('disc-ementa').value
        })
    });
    carregarDisciplinas();
}

function enviarAvaliacaoDocente(event) {
    event.preventDefault();
    alert('Avaliação anônima registrada com sucesso (RN08)!');
}

async function registrarDenuncia(event) {
    event.preventDefault();
    const res = await fetch(`${API_URL}/denuncias`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            descricao: document.getElementById('denuncia-texto').value,
            anonima: document.getElementById('denuncia-anonima').checked
        })
    });
    const d = await res.json();
    alert(`Denúncia registrada sob o protocolo: ${d.protocolo}`);
    document.getElementById('denuncia-texto').value = '';
}

async function carregarDenuncias() {
    const res = await fetch(`${API_URL}/denuncias`);
    const lista = await res.json();
    document.getElementById('lista-denuncias-coord').innerHTML = '<h3>Manifestações Recebidas</h3>' + lista.map(d =>
        `<div class="card-item mt-20"><strong>Protocolo: ${d.protocolo}</strong> (${d.status})<p>${d.descricao}</p></div>`
    ).join('');
}

async function carregarAvisos() {
    const res = await fetch(`${API_URL}/avisos`);
    const lista = await res.json();
    document.getElementById('lista-avisos').innerHTML = lista.map(a =>
        `<div class="card-item"><h4>${a.titulo}</h4><p>${a.conteudo}</p></div>`
    ).join('');
}

async function publicarAviso(event) {
    event.preventDefault();
    await fetch(`${API_URL}/avisos`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            titulo: document.getElementById('aviso-titulo').value,
            conteudo: document.getElementById('aviso-conteudo').value
        })
    });
    carregarAvisos();
}