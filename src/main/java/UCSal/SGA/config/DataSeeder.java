package UCSal.SGA.config;

import UCSal.SGA.model.*;
import UCSal.SGA.repository.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

import java.util.Date;

@Component
public class DataSeeder implements CommandLineRunner {

    @Autowired
    private UsuarioRepository usuarioRepository;

    @Autowired
    private TurmaRepository turmaRepository;

    @Autowired
    private DisciplinaRepository disciplinaRepository;

    @Autowired
    private AvisoRepository avisoRepository;

    @Override
    public void run(String... args) throws Exception {
        if (usuarioRepository.count() == 0) {
            // 1. Criar Usuários de Teste (Todos os Perfis)
            Usuario admin = new Usuario();
            admin.setNome("Administrador TI");
            admin.setCpf("00000000001");
            admin.setMatricula("ADM001");
            admin.setEmail("admin@ucsal.edu.br");
            admin.setSenha("123");
            admin.setPerfil("ADMIN");
            usuarioRepository.save(admin);

            Usuario secretaria = new Usuario();
            secretaria.setNome("Secretaria Acadêmica");
            secretaria.setCpf("00000000002");
            secretaria.setMatricula("SEC001");
            secretaria.setEmail("secretaria@ucsal.edu.br");
            secretaria.setSenha("123");
            secretaria.setPerfil("SECRETARIA");
            usuarioRepository.save(secretaria);

            Usuario coordenador = new Usuario();
            coordenador.setNome("Elton Figueiredo (Coordenação)");
            coordenador.setCpf("00000000003");
            coordenador.setMatricula("COORD001");
            coordenador.setEmail("elton@ucsal.edu.br");
            coordenador.setSenha("123");
            coordenador.setPerfil("COORDENADOR");
            usuarioRepository.save(coordenador);

            Usuario professor = new Usuario();
            professor.setNome("Prof. Carlos Silva");
            professor.setCpf("11122233344");
            professor.setMatricula("PROF001");
            professor.setEmail("carlos@ucsal.edu.br");
            professor.setSenha("123");
            professor.setPerfil("PROFESSOR");
            usuarioRepository.save(professor);

            Usuario aluno = new Usuario();
            aluno.setNome("Cailan Abade");
            aluno.setCpf("12345678900");
            aluno.setMatricula("2026001");
            aluno.setEmail("cailan@ucsal.edu.br");
            aluno.setSenha("123");
            aluno.setPerfil("ALUNO");
            usuarioRepository.save(aluno);

            // 2. Criar Disciplina e Turma de Exemplo
            Disciplina disc = new Disciplina();
            disc.setNome("Engenharia de Requisitos");
            disc.setCargaHoraria(60);
            disc.setEmenta("Introdução à engenharia de requisitos, ERS, UML.");
            disciplinaRepository.save(disc);

            Turma turma = new Turma();
            turma.setCodigo("BES304");
            turma.setDisciplinaNome("Engenharia de Requisitos");
            turma.setProfessorNome("Elton Figueiredo");
            turma.setHorario("SEG 19:00 - 21:40");
            turma.setVagasTotais(40);
            turma.setVagasDisponiveis(39);
            turma.setPreRequisitoNome("Introdução à Engenharia de Software");
            turmaRepository.save(turma);

            // 3. Criar Aviso Institucional Inicial
            Aviso aviso = new Aviso();
            aviso.setTitulo("Bem-vindo ao SGA 2026");
            aviso.setConteudo("O sistema de gestão acadêmica já está online para testes do MVP.");
            aviso.setDataPublicacao(new Date());
            avisoRepository.save(aviso);

            System.out.println(">> BANCO POPULADO COM SUCESSO COM DADOS MOCADOS!");
        }
    }
}