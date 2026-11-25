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
            admin.setNome("Luan");
            admin.setCpf("111111111111");
            admin.setMatricula("ADM001");
            admin.setEmail("admin@ucsal.edu.br");
            admin.setSenha("senha123");
            admin.setPerfil("ADMIN");
            usuarioRepository.save(admin);

            Usuario secretaria = new Usuario();
            secretaria.setNome("Joslene");
            secretaria.setCpf("22222222222");
            secretaria.setMatricula("SEC001");
            secretaria.setEmail("secretaria@ucsal.edu.br");
            secretaria.setSenha("senha123");
            secretaria.setPerfil("SECRETARIA");
            usuarioRepository.save(secretaria);

            Usuario coordenador = new Usuario();
            coordenador.setNome("Osvaldo");
            coordenador.setCpf("33333333333");
            coordenador.setMatricula("COORD001");
            coordenador.setEmail("elton@ucsal.edu.br");
            coordenador.setSenha("senha123");
            coordenador.setPerfil("COORDENADOR");
            usuarioRepository.save(coordenador);

            Usuario professor = new Usuario();
            professor.setNome("Prof. Carlos Silva");
            professor.setCpf("11122233344");
            professor.setMatricula("PROF001");
            professor.setEmail("carlos@ucsal.edu.br");
            professor.setSenha("senha123");
            professor.setPerfil("PROFESSOR");
         // 1. Segundo administrador
            Usuario admin2 = new Usuario();
            admin2.setNome("Mariana Costa");
            admin2.setCpf("44444444444");
            admin2.setMatricula("ADM002");
            admin2.setEmail("mariana@ucsal.edu.br");
            admin2.setSenha("senha123");
            admin2.setPerfil("ADMIN");
            usuarioRepository.save(admin2);

            // 2. Segunda secretária
            Usuario secretaria2 = new Usuario();
            secretaria2.setNome("Patricia Almeida");
            secretaria2.setCpf("55555555555");
            secretaria2.setMatricula("SEC002");
            secretaria2.setEmail("patricia@ucsal.edu.br");
            secretaria2.setSenha("senha123");
            secretaria2.setPerfil("SECRETARIA");
            usuarioRepository.save(secretaria2);

            // 3. Segundo coordenador
            Usuario coordenador2 = new Usuario();
            coordenador2.setNome("Roberto Santos");
            coordenador2.setCpf("66666666666");
            coordenador2.setMatricula("COORD002");
            coordenador2.setEmail("roberto@ucsal.edu.br");
            coordenador2.setSenha("senha123");
            coordenador2.setPerfil("COORDENADOR");
            usuarioRepository.save(coordenador2);

            // 4. Segundo professor
            Usuario professor3 = new Usuario();
            professor3.setNome("Fernanda Oliveira");
            professor3.setCpf("77777777777");
            professor3.setMatricula("PROF003");
            professor3.setEmail("fernanda@ucsal.edu.br");
            professor3.setSenha("senha123");
            professor3.setPerfil("PROFESSOR");
            usuarioRepository.save(professor3);

            // 5. Segundo aluno
            Usuario aluno2 = new Usuario();
            aluno2.setNome("Gabriel Souza");
            aluno2.setCpf("88888888888");
            aluno2.setMatricula("2026002");
            aluno2.setEmail("gabriel@ucsal.edu.br");
            aluno2.setSenha("senha123");
            aluno2.setPerfil("ALUNO");
            usuarioRepository.save(aluno2);
            
            usuarioRepository.save(professor);
            Usuario professor2 = new Usuario();
            professor2.setNome("Angela");
            professor2.setCpf("22233344456");
            professor2.setMatricula("PROF002");
            professor2.setEmail("angela@ucsal.edu.br");
            professor2.setSenha("senha123");
            professor2.setPerfil("PROFESSOR");
            
            Usuario aluno = new Usuario();
            aluno.setNome("Cailan Abade");
            aluno.setCpf("12345678900");
            aluno.setMatricula("2026001");
            aluno.setEmail("cailan@ucsal.edu.br");
            aluno.setSenha("senha123");
            aluno.setPerfil("ALUNO");
            usuarioRepository.save(aluno);

         // Disciplina 2
            Disciplina disc2 = new Disciplina();
            disc2.setNome("Programação Orientada a Objetos");
            disc2.setCargaHoraria(60);
            disc2.setEmenta("Conceitos de orientação a objetos, classes, objetos, herança, polimorfismo e encapsulamento.");
            disciplinaRepository.save(disc2);

            // Disciplina 3
            Disciplina disc3 = new Disciplina();
            disc3.setNome("Banco de Dados");
            disc3.setCargaHoraria(60);
            disc3.setEmenta("Modelagem de dados, SQL, bancos relacionais, consultas e manipulação de dados.");
            disciplinaRepository.save(disc3);

            // Disciplina 4
            Disciplina disc4 = new Disciplina();
            disc4.setNome("Desenvolvimento Web");
            disc4.setCargaHoraria(80);
            disc4.setEmenta("Fundamentos de desenvolvimento web, HTML, CSS, JavaScript e integração com aplicações backend.");
            disciplinaRepository.save(disc4);

            // Disciplina 5
            Disciplina disc5 = new Disciplina();
            disc5.setNome("Estrutura de Dados");
            disc5.setCargaHoraria(60);
            disc5.setEmenta("Estudo de listas, filas, pilhas, árvores, algoritmos de busca e ordenação.");
            disciplinaRepository.save(disc5);
            
            // Disciplina 6
            Disciplina disc6 = new Disciplina();
            disc6.setNome("Redes de Computadores");
            disc6.setCargaHoraria(60);
            disc6.setEmenta("Fundamentos de redes, protocolos de comunicação, arquitetura TCP/IP e segurança de redes.");
            disciplinaRepository.save(disc6);
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
         // Turma 2
            Turma turma2 = new Turma();
            turma2.setCodigo("BES305");
            turma2.setDisciplinaNome("Programação Orientada a Objetos");
            turma2.setProfessorNome("Prof. Carlos Silva");
            turma2.setHorario("TER 19:00 - 21:40");
            turma2.setVagasTotais(40);
            turma2.setVagasDisponiveis(35);
            turma2.setPreRequisitoNome("Lógica de Programação");
            turmaRepository.save(turma2);

            // Turma 3
            Turma turma3 = new Turma();
            turma3.setCodigo("BES306");
            turma3.setDisciplinaNome("Banco de Dados");
            turma3.setProfessorNome("Fernanda Oliveira");
            turma3.setHorario("QUA 19:00 - 21:40");
            turma3.setVagasTotais(40);
            turma3.setVagasDisponiveis(38);
            turma3.setPreRequisitoNome("Lógica de Programação");
            turmaRepository.save(turma3);

            // Turma 4
            Turma turma4 = new Turma();
            turma4.setCodigo("BES307");
            turma4.setDisciplinaNome("Desenvolvimento Web");
            turma4.setProfessorNome("Prof. Carlos Silva");
            turma4.setHorario("QUI 19:00 - 21:40");
            turma4.setVagasTotais(35);
            turma4.setVagasDisponiveis(30);
            turma4.setPreRequisitoNome("Programação Orientada a Objetos");
            turmaRepository.save(turma4);

            // Turma 5
            Turma turma5 = new Turma();
            turma5.setCodigo("BES308");
            turma5.setDisciplinaNome("Estrutura de Dados");
            turma5.setProfessorNome("Angela");
            turma5.setHorario("SEX 19:00 - 21:40");
            turma5.setVagasTotais(40);
            turma5.setVagasDisponiveis(37);
            turma5.setPreRequisitoNome("Programação Orientada a Objetos");
            turmaRepository.save(turma5);

            // Turma 6
            Turma turma6 = new Turma();
            turma6.setCodigo("BES309");
            turma6.setDisciplinaNome("Redes de Computadores");
            turma6.setProfessorNome("Elton Figueiredo");
            turma6.setHorario("SAB 08:00 - 11:20");
            turma6.setVagasTotais(35);
            turma6.setVagasDisponiveis(32);
            turma6.setPreRequisitoNome("Arquitetura de Computadores");
            turmaRepository.save(turma6);
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