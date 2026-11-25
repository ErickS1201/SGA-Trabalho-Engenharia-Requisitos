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
// 2. NAVEGAÇÃO DINÂMICO POR PERFIL
// ==========================================
function montarMenuPorPerfil(perfil) {
    const menu = document.getElementById('menu-navegacao');
    menu.innerHTML = '';

    const itens = [
        { id: 'sec-mural', label: 'Mural e Calendário', perfis: ['ALUNO', 'PROFESSOR', 'SECRETARIA', 'COORDENADOR', 'ADMIN'] },
        { id: 'sec-usuarios', label: 'Gestão de Usuários', perfis: ['SECRETARIA', 'ADMIN'] },
        { id: 'sec-matricula', label: 'Matrícula em Turmas', perfis: ['ALUNO'] },
        { id: 'sec-boletim', label: 'Boletim e Frequência', perfis: ['ALUNO'] },
        { id: 'sec-chamada', label: 'Realizar Chamada', perfis: ['PROFESSOR'] },
        { id: 'sec-notas', label: 'Lançar Notas', perfis: ['PROFESSOR'] },
        { id: 'sec-documentos', label: 'Emitir Documentos', perfis: ['ALUNO', 'SECRETARIA'] },
        { id: 'sec-curriculo', label: 'Grade Curricular', perfis: ['COORDENADOR'] },
        { id: 'sec-alocacao', label: 'Alocar Professores', perfis: ['COORDENADOR', 'ADMIN'] },
        { id: 'sec-avaliacao', label: 'Avaliação Docente', perfis: ['ALUNO'] },
        { id: 'sec-ouvidoria', label: 'Ouvidoria / Denúncias', perfis: ['ALUNO', 'PROFESSOR', 'COORDENADOR'] },
        { id: 'sec-relatorios', label: 'Relatórios Gerenciais', perfis: ['COORDENADOR', 'ADMIN'] }
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

    if (idSecao === 'sec-usuarios') carregarUsuarios();
    if (idSecao === 'sec-matricula') carregarTurmasParaMatricula();
    if (idSecao === 'sec-chamada') carregarTurmasParaSelecaoChamada();
    if (idSecao === 'sec-boletim') carregarBoletimAluno();
    if (idSecao === 'sec-notas') carregarTurmasProfessor();
    if (idSecao === 'sec-documentos') prepararTelaDocumentos();
    if (idSecao === 'sec-curriculo') carregarDisciplinas();
    if (idSecao === 'sec-mural') carregarAvisos();
    if (idSecao === 'sec-alocacao') carregarTelaAlocacao();
    if (idSecao === 'sec-relatorios') carregarRelatoriosGerenciais();
    if (idSecao === 'sec-ouvidoria') {
        document.getElementById('resultado-protocolo').innerHTML = '';
        if (usuarioAtual.perfil === 'COORDENADOR') {
            carregarDenuncias();
        } else {
            document.getElementById('lista-denuncias-coord').innerHTML = '';
        }
    }
}

// ==========================================
// 3. GESTÃO DE USUÁRIOS E ALOCAÇÃO (RF02)
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
        const resTurmas = await fetch(`${API_URL}/turmas`);
        const turmas = await resTurmas.json();

        const resUsers = await fetch(`${API_URL}/usuarios`);
        const usuarios = await resUsers.json();
        const professores = usuarios.filter(u => u.perfil === 'PROFESSOR');

        const selectTurma = document.getElementById('select-aloca-turma');
        selectTurma.innerHTML = turmas.length > 0 
            ? turmas.map(t => `<option value="${t.id}">${t.codigo} - ${t.disciplinaNome} (Atual: ${t.professorNome || 'Nenhum'})</option>`).join('')
            : '<option value="">Nenhuma turma cadastrada</option>';

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
        carregarTelaAlocacao();
    } else {
        const erro = await res.text();
        alert('Erro ao alocar professor: ' + erro);
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

// ==========================================
// 4. CHAMADA DIÁRIA (PROFESSOR)
// ==========================================
async function carregarTurmasParaSelecaoChamada() {
    const res = await fetch(`${API_URL}/turmas`);
    const turmas = await res.json();
    const select = document.getElementById('select-turma-chamada');
    const inputData = document.getElementById('data-chamada');
    if (inputData && !inputData.value) {
        inputData.value = new Date().toISOString().split('T')[0];
    }

    select.innerHTML = turmas.map(t => `<option value="${t.id}">${t.codigo} - ${t.disciplinaNome}</option>`).join('');
    
    if (turmas.length > 0) {
        carregarAlunosParaChamada();
    }
}

async function carregarAlunosParaChamada() {
    const turmaId = document.getElementById('select-turma-chamada').value;
    const res = await fetch(`${API_URL}/matriculas/turma/${turmaId}`);
    const container = document.getElementById('lista-chamada-alunos');
    const boxAcoes = document.getElementById('box-acoes-chamada');
    
    const matriculas = await res.json();
    
    if (matriculas.length === 0) {
        container.innerHTML = '<div class="card-item"><p>Nenhum aluno matriculado nesta turma ainda.</p></div>';
        boxAcoes.classList.add('hidden');
        return;
    }

    boxAcoes.classList.remove('hidden');
    container.innerHTML = `
        <table class="tabela">
            <thead>
                <tr>
                    <th>Aluno</th>
                    <th>Matrícula</th>
                    <th>Histórico de Presença</th>
                    <th>Frequência Atual</th>
                    <th>Chamada de Hoje</th>
                </tr>
            </thead>
            <tbody>
                ${matriculas.map(m => {
                    const freqAtual = m.totalAulasDadas > 0 ? `${m.percentualFrequencia}%` : '100% (Sem aulas)';
                    const corFreq = (m.totalAulasDadas > 0 && m.percentualFrequencia < 75) ? 'color: #c62828; font-weight: bold;' : 'color: #2e7d32; font-weight: bold;';
                    return `
                        <tr>
                            <td><strong>${m.aluno.nome}</strong></td>
                            <td>${m.aluno.matricula}</td>
                            <td>${m.aulasPresenca} / ${m.totalAulasDadas} aulas</td>
                            <td style="${corFreq}">${freqAtual}</td>
                            <td>
                                <label style="cursor: pointer; display: inline-flex; align-items: center; gap: 6px;">
                                    <input type="checkbox" class="check-presenca" value="${m.id}" checked> Presente
                                </label>
                            </td>
                        </tr>
                    `;
                }).join('')}
            </tbody>
        </table>
    `;
}

function marcarTodosChamada(estado) {
    document.querySelectorAll('.check-presenca').forEach(cb => cb.checked = estado);
}

async function enviarChamada() {
    const turmaId = document.getElementById('select-turma-chamada').value;
    const dataAula = document.getElementById('data-chamada').value;
    if (!dataAula) {
        alert('Selecione a data da aula.');
        return;
    }

    const checkboxes = document.querySelectorAll('.check-presenca:checked');
    const presentes = Array.from(checkboxes).map(cb => parseInt(cb.value));

    const res = await fetch(`${API_URL}/chamadas/lancar`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ turmaId, data: dataAula, presentes })
    });

    if (res.ok) {
        alert(`Chamada do dia ${dataAula.split('-').reverse().join('/')} salva! Frequência recalculada automaticamente.`);
        carregarAlunosParaChamada();
    } else {
        alert('Erro ao salvar chamada.');
    }
}

// ==========================================
// 5. MATRÍCULA E BOLETIM (RF03 / RF05 - API REAL)
// ==========================================
async function carregarTurmasParaMatricula() {
    const div = document.getElementById('lista-turmas-disponiveis');
    try {
        const [resTurmas, resMatriculas] = await Promise.all([
            fetch(`${API_URL}/turmas`),
            fetch(`${API_URL}/matriculas/aluno/${usuarioAtual.id}`)
        ]);

        const todasTurmas = await resTurmas.json();
        const minhasMatriculas = await resMatriculas.json();

        const idsJaMatriculados = minhasMatriculas.map(m => m.turma.id);
        const turmasDisponiveis = todasTurmas.filter(t => !idsJaMatriculados.includes(t.id));

        if (turmasDisponiveis.length === 0) {
            div.innerHTML = '<div class="card-item"><p>Você já está matriculado em todas as turmas disponíveis!</p></div>';
            return;
        }

        div.innerHTML = turmasDisponiveis.map(t => `
            <div class="card-item">
                <h3>${t.codigo} - ${t.disciplinaNome}</h3>
                <p><strong>Docente:</strong> ${t.professorNome}</p>
                <p><strong>Horário:</strong> ${t.horario}</p>
                <p><strong>Vagas:</strong> ${t.vagasDisponiveis} / ${t.vagasTotais}</p>
                <button onclick="efetivarMatricula(${t.id})" class="mt-20" ${t.vagasDisponiveis <= 0 ? 'disabled' : ''}>
                    ${t.vagasDisponiveis > 0 ? 'Confirmar Matrícula' : 'Turma Lotada'}
                </button>
            </div>
        `).join('');
    } catch (error) {
        console.error('Erro ao carregar turmas:', error);
    }
}

async function efetivarMatricula(turmaId) {
    const res = await fetch(`${API_URL}/matriculas`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ alunoId: usuarioAtual.id, turmaId: turmaId })
    });

    if (res.ok) {
        alert('Matrícula realizada com sucesso!');
        carregarTurmasParaMatricula();
    } else {
        alert('Não foi possível realizar a matrícula: ' + await res.text());
    }
}

function formatarBadgeSituacao(situacao) {
    const mapa = {
        'APROVADO': { texto: 'APROVADO', bg: '#e8f5e9', cor: '#2e7d32' },
        'EXAME_FINAL': { texto: 'AVALIAÇÃO FINAL', bg: '#fff8e1', cor: '#f57f17' },
        'REPROVADO_FREQUENCIA': { texto: 'REPROVADO POR FALTA', bg: '#ffebee', cor: '#c62828' },
        'REPROVADO_NOTA': { texto: 'REPROVADO POR NOTA', bg: '#ffebee', cor: '#c62828' },
        'CURSANDO': { texto: 'CURSANDO', bg: '#e3f2fd', cor: '#1565c0' }
    };
    const info = mapa[situacao] || { texto: situacao, bg: '#eceff1', cor: '#37474f' };
    return `<span style="background: ${info.bg}; color: ${info.cor}; padding: 4px 10px; border-radius: 12px; font-weight: bold; font-size: 0.82rem;">${info.texto}</span>`;
}

async function carregarBoletimAluno() {
    const res = await fetch(`${API_URL}/matriculas/aluno/${usuarioAtual.id}`);
    const matriculas = await res.json();
    const tbody = document.getElementById('tabela-boletim');

    if (matriculas.length === 0) {
        tbody.innerHTML = '<tr><td colspan="8">Você ainda não está matriculado em nenhuma disciplina.</td></tr>';
        return;
    }

    tbody.innerHTML = matriculas.map(m => {
        const freqTexto = m.totalAulasDadas > 0
            ? `${m.percentualFrequencia}%`
            : (m.percentualFrequencia != null ? `${m.percentualFrequencia}%` : '100%');
        const presencasTexto = m.totalAulasDadas > 0
            ? `${m.aulasPresenca}/${m.totalAulasDadas}`
            : '0/0';

        return `
            <tr>
                <td>${m.turma.codigo}</td>
                <td><strong>${m.turma.disciplinaNome}</strong></td>
                <td>${m.nota1 != null ? m.nota1.toFixed(1) : '-'}</td>
                <td>${m.nota2 != null ? m.nota2.toFixed(1) : '-'}</td>
                <td><strong>${m.mediaFinal != null ? m.mediaFinal.toFixed(1) : '-'}</strong></td>
                <td>${presencasTexto}</td>
                <td>${freqTexto}</td>
                <td>${formatarBadgeSituacao(m.situacao)}</td>
            </tr>
        `;
    }).join('');
}

// ==========================================
// 6. LANÇAMENTO DE NOTAS (RF04 - API REAL)
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

    if (alunos.length === 0) {
        tbody.innerHTML = '<tr><td colspan="7">Nenhum aluno matriculado nesta turma.</td></tr>';
        return;
    }

    tbody.innerHTML = alunos.map(m => {
        const freqCalculada = m.totalAulasDadas > 0
            ? `${m.percentualFrequencia}% (${m.aulasPresenca}/${m.totalAulasDadas})`
            : '100% (Sem chamadas)';

        return `
            <tr>
                <td>${m.aluno.nome}</td>
                <td>${m.aluno.matricula}</td>
                <td><input type="number" step="0.1" min="0" max="10" id="n1-${m.id}" value="${m.nota1 ?? ''}" style="width:70px"></td>
                <td><input type="number" step="0.1" min="0" max="10" id="n2-${m.id}" value="${m.nota2 ?? ''}" style="width:70px"></td>
                <td><strong>${freqCalculada}</strong></td>
                <td>Média: <strong>${m.mediaFinal != null ? m.mediaFinal.toFixed(1) : '-'}</strong><br>${formatarBadgeSituacao(m.situacao)}</td>
                <td><button onclick="salvarNota(${m.id})">Salvar</button></td>
            </tr>
        `;
    }).join('');
}

async function salvarNota(matriculaId) {
    const nota1 = parseFloat(document.getElementById(`n1-${matriculaId}`).value);
    const nota2 = parseFloat(document.getElementById(`n2-${matriculaId}`).value);

    if (isNaN(nota1) || isNaN(nota2) || nota1 < 0 || nota1 > 10 || nota2 < 0 || nota2 > 10) {
        alert('Informe notas válidas entre 0 e 10.');
        return;
    }

    const res = await fetch(`${API_URL}/matriculas/${matriculaId}/avaliacao`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ nota1, nota2 })
    });

    if (res.ok) {
        const atualizada = await res.json();
        alert(`Notas salvas! Média: ${atualizada.mediaFinal} | Situação: ${atualizada.situacao}`);
        carregarAlunosTurma();
    } else {
        alert('Erro ao salvar notas.');
    }
}

// ==========================================
// 7. DOCUMENTOS, GRADE, AVALIAÇÃO, OUVIDORIA E RELATÓRIOS
// ==========================================
async function prepararTelaDocumentos() {
    const boxSeletor = document.getElementById('box-seletor-aluno-doc');
    const selectAluno = document.getElementById('select-aluno-documento');
    document.getElementById('area-documento-gerado').classList.add('hidden');

    if (usuarioAtual.perfil === 'SECRETARIA') {
        boxSeletor.classList.remove('hidden');
        const res = await fetch(`${API_URL}/usuarios`);
        const usuarios = await res.json();
        const alunos = usuarios.filter(u => u.perfil === 'ALUNO');

        selectAluno.innerHTML = alunos.map(a =>
            `<option value="${a.nome}">${a.nome} (Matrícula: ${a.matricula})</option>`
        ).join('');
    } else {
        boxSeletor.classList.add('hidden');
    }
}

async function emitirDocumento(tipo) {
    let nomeParaDocumento = usuarioAtual.nome;

    if (usuarioAtual.perfil === 'SECRETARIA') {
        const selectAluno = document.getElementById('select-aluno-documento');
        if (!selectAluno.value) {
            alert('Selecione um aluno antes de emitir o documento.');
            return;
        }
        nomeParaDocumento = selectAluno.value;
    }

    const res = await fetch(`${API_URL}/documentos/emitir`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ tipo, alunoNome: nomeParaDocumento })
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
    document.getElementById('lista-disciplinas').innerHTML = lista.map(d => `
        <div class="card-item" style="display: flex; flex-direction: column; justify-content: space-between;">
            <div>
                <div style="display: flex; justify-content: space-between; align-items: start; gap: 8px;">
                    <h4>${d.nome}</h4>
                    <span style="background: #e3f2fd; color: #1565c0; padding: 3px 8px; border-radius: 10px; font-size: 0.8rem; font-weight: bold; white-space: nowrap;">
                        ${d.cargaHoraria}h
                    </span>
                </div>
                <p style="margin-top: 8px; color: #444;">${d.ementa}</p>
            </div>
            <button onclick="excluirDisciplina(${d.idDisciplina})" style="margin-top: 12px; background-color: #c62828; color: white; border: none; padding: 6px 12px; border-radius: 4px; cursor: pointer; align-self: flex-start;">
                Remover Disciplina
            </button>
        </div>
    `).join('');
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
    document.getElementById('disc-nome').value = '';
    document.getElementById('disc-ch').value = '';
    document.getElementById('disc-ementa').value = '';
    carregarDisciplinas();
}

async function excluirDisciplina(id) {
    if (!confirm('Remover esta disciplina da grade curricular?')) return;
    await fetch(`${API_URL}/disciplinas/${id}`, { method: 'DELETE' });
    carregarDisciplinas();
}

function enviarAvaliacaoDocente(event) {
    event.preventDefault();
    alert('Avaliação anônima registrada com sucesso (RN08)!');
    event.target.reset();
}

async function registrarDenuncia(event) {
    event.preventDefault();
    const anonima = document.getElementById('denuncia-anonima').checked;
    const res = await fetch(`${API_URL}/denuncias`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            categoria: document.getElementById('denuncia-categoria').value,
            descricao: document.getElementById('denuncia-texto').value,
            anonima: anonima,
            autorNome: anonima ? 'Anônimo' : `${usuarioAtual.nome} (${usuarioAtual.perfil})`
        })
    });
    const d = await res.json();
    document.getElementById('input-busca-protocolo').value = d.protocolo;
    alert(`Manifestação registrada! Guarde seu protocolo para acompanhamento: ${d.protocolo}`);
    document.getElementById('denuncia-texto').value = '';
    if (usuarioAtual.perfil === 'COORDENADOR') carregarDenuncias();
}

async function consultarProtocolo() {
    const prot = document.getElementById('input-busca-protocolo').value.trim();
    const box = document.getElementById('resultado-protocolo');
    if (!prot) return;

    const res = await fetch(`${API_URL}/denuncias/protocolo/${encodeURIComponent(prot)}`);
    if (res.ok) {
        const d = await res.json();
        box.innerHTML = `
            <div style="background: #f5f7fa; padding: 12px; border-radius: 6px; border-left: 4px solid #1976d2;">
                <p><strong>Protocolo:</strong> ${d.protocolo}</p>
                <p><strong>Categoria:</strong> ${d.categoria || 'Geral'}</p>
                <p><strong>Status Atual:</strong> <strong>${d.status}</strong></p>
                <p style="margin-top: 6px; font-size: 0.9rem;">${d.descricao}</p>
            </div>
        `;
    } else {
        box.innerHTML = `<p style="color: #c62828;">Protocolo não encontrado. Verifique o código digitado.</p>`;
    }
}

async function carregarDenuncias() {
    const res = await fetch(`${API_URL}/denuncias`);
    const lista = await res.json();
    const container = document.getElementById('lista-denuncias-coord');

    if (lista.length === 0) {
        container.innerHTML = '<div class="card-item"><h3>Caixa de Entrada da Ouvidoria</h3><p class="mt-20">Nenhuma manifestação registrada até o momento.</p></div>';
        return;
    }

    container.innerHTML = `
        <div class="card-item">
            <h3>Gestão de Manifestações Recebidas (${lista.length})</h3>
            <table class="tabela mt-20">
                <thead>
                    <tr>
                        <th>Protocolo</th>
                        <th>Categoria</th>
                        <th>Remetente</th>
                        <th>Relato</th>
                        <th>Status</th>
                        <th>Atualizar</th>
                    </tr>
                </thead>
                <tbody>
                    ${lista.map(d => `
                        <tr>
                            <td><strong>${d.protocolo}</strong></td>
                            <td>${d.categoria || 'Geral'}</td>
                            <td>${d.anonima ? '<em>Anônimo</em>' : (d.autorNome || 'Identificado')}</td>
                            <td>${d.descricao}</td>
                            <td><strong>${d.status}</strong></td>
                            <td>
                                <select onchange="alterarStatusDenuncia(${d.idDenuncia}, this.value)" style="padding: 5px;">
                                    <option value="RECEBIDO" ${d.status === 'RECEBIDO' ? 'selected' : ''}>RECEBIDO</option>
                                    <option value="EM_ANALISE" ${d.status === 'EM_ANALISE' ? 'selected' : ''}>EM_ANALISE</option>
                                    <option value="RESOLVIDO" ${d.status === 'RESOLVIDO' ? 'selected' : ''}>RESOLVIDO</option>
                                </select>
                            </td>
                        </tr>
                    `).join('')}
                </tbody>
            </table>
        </div>
    `;
}

async function alterarStatusDenuncia(id, novoStatus) {
    await fetch(`${API_URL}/denuncias/${id}/status`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: novoStatus })
    });
    carregarDenuncias();
}

async function carregarAvisos() {
    const res = await fetch(`${API_URL}/avisos`);
    const lista = await res.json();
    const podeExcluir = ['PROFESSOR', 'SECRETARIA', 'COORDENADOR', 'ADMIN'].includes(usuarioAtual.perfil);

    document.getElementById('lista-avisos').innerHTML = lista.map(a => `
        <div class="card-item" style="display: flex; flex-direction: column; justify-content: space-between;">
            <div>
                <h4>${a.titulo}</h4>
                <small style="display: block; color: #555; margin-bottom: 8px;">
                    Publicado por: <strong>${a.autor || 'Institucional'}</strong>
                </small>
                <p>${a.conteudo}</p>
            </div>
            ${podeExcluir ? `
                <button onclick="excluirAviso(${a.idAviso})" style="margin-top: 12px; background-color: #c62828; color: white; border: none; padding: 6px 12px; border-radius: 4px; cursor: pointer; align-self: flex-start;">
                    Excluir
                </button>
            ` : ''}
        </div>
    `).join('');
}

async function publicarAviso(event) {
    event.preventDefault();
    await fetch(`${API_URL}/avisos`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            titulo: document.getElementById('aviso-titulo').value,
            conteudo: document.getElementById('aviso-conteudo').value,
            autor: `${usuarioAtual.nome} (${usuarioAtual.perfil})`
        })
    });
    document.getElementById('aviso-titulo').value = '';
    document.getElementById('aviso-conteudo').value = '';
    carregarAvisos();
}

async function excluirAviso(idAviso) {
    if (!confirm('Deseja realmente excluir este aviso?')) return;
    const res = await fetch(`${API_URL}/avisos/${idAviso}`, { method: 'DELETE' });
    if (res.ok) carregarAvisos();
}

async function carregarRelatoriosGerenciais() {
    const [resUsuarios, resTurmas, resMatriculas] = await Promise.all([
        fetch(`${API_URL}/usuarios`),
        fetch(`${API_URL}/turmas`),
        fetch(`${API_URL}/matriculas`)
    ]);

    const usuarios = await resUsuarios.json();
    const turmas = await resTurmas.json();
    const matriculas = await resMatriculas.json();

    const totalAlunos = usuarios.filter(u => u.perfil === 'ALUNO').length;
    const avaliadas = matriculas.filter(m => m.mediaFinal != null);
    const aprovados = avaliadas.filter(m => m.situacao === 'APROVADO').length;
    const taxaAprovacao = avaliadas.length > 0 ? ((aprovados / avaliadas.length) * 100).toFixed(1) + '%' : 'N/A (sem notas)';

    const comFreq = matriculas.filter(m => m.percentualFrequencia != null);
    const freqMedia = comFreq.length > 0
        ? (comFreq.reduce((acc, m) => acc + m.percentualFrequencia, 0) / comFreq.length).toFixed(1) + '%'
        : '100%';

    const riscoFalta = matriculas.filter(m => m.totalAulasDadas > 0 && m.percentualFrequencia < 75).length;

    document.getElementById('grid-kpis-relatorios').innerHTML = `
        <div class="kpi-card"><h3>Alunos Ativos</h3><p class="kpi-valor">${totalAlunos}</p></div>
        <div class="kpi-card"><h3>Matrículas Efetivadas</h3><p class="kpi-valor">${matriculas.length}</p></div>
        <div class="kpi-card"><h3>Taxa de Aprovação</h3><p class="kpi-valor">${taxaAprovacao}</p></div>
        <div class="kpi-card"><h3>Frequência Média</h3><p class="kpi-valor">${freqMedia}</p></div>
        <div class="kpi-card"><h3>Risco por Falta (&lt;75%)</h3><p class="kpi-valor" style="color: ${riscoFalta > 0 ? '#c62828' : '#2e7d32'};">${riscoFalta}</p></div>
    `;

    document.getElementById('tabela-relatorio-turmas').innerHTML = turmas.map(t => {
        const matsTurma = matriculas.filter(m => m.turma && m.turma.id === t.id);
        const fMedia = matsTurma.length > 0
            ? (matsTurma.reduce((acc, m) => acc + (m.percentualFrequencia ?? 100), 0) / matsTurma.length).toFixed(1) + '%'
            : '-';
        const comNota = matsTurma.filter(m => m.mediaFinal != null);
        const nMedia = comNota.length > 0
            ? (comNota.reduce((acc, m) => acc + m.mediaFinal, 0) / comNota.length).toFixed(1)
            : '-';

        return `
            <tr>
                <td><strong>${t.codigo}</strong></td>
                <td>${t.disciplinaNome}</td>
                <td>${t.professorNome}</td>
                <td>${matsTurma.length}</td>
                <td>${t.vagasDisponiveis} / ${t.vagasTotais}</td>
                <td>${fMedia}</td>
                <td>${nMedia}</td>
            </tr>
        `;
    }).join('');
}