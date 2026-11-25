package UCSal.SGA.controller;

import UCSal.SGA.model.Matricula;
import UCSal.SGA.model.Turma;
import UCSal.SGA.model.Usuario;
import UCSal.SGA.repository.MatriculaRepository;
import UCSal.SGA.repository.TurmaRepository;
import UCSal.SGA.repository.UsuarioRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api")
@CrossOrigin(origins = "*")
public class MatriculaController {

    @Autowired
    private TurmaRepository turmaRepository;

    @Autowired
    private MatriculaRepository matriculaRepository;

    @Autowired
    private UsuarioRepository usuarioRepository;

    // 1. Listar Turmas ofertadas (Contrato API)
    @GetMapping("/turmas")
    public List<Turma> listarTurmas() {
        return turmaRepository.findAll();
    }

    // 2. Listar matrículas de um aluno
    @GetMapping("/matriculas/aluno/{alunoId}")
    public List<Matricula> listarMatriculasPorAluno(@PathVariable Long alunoId) {
        return matriculaRepository.findByAlunoId(alunoId);
    }

    // 3. Efetivar Matrícula (RF03 / RN03) - Valida vagas e desconta
    @PostMapping("/matriculas")
    public ResponseEntity<?> matricular(@RequestBody Map<String, Long> payload) {
        Long alunoId = payload.get("alunoId");
        Long turmaId = payload.get("turmaId");

        Usuario aluno = usuarioRepository.findById(alunoId).orElse(null);
        Turma turma = turmaRepository.findById(turmaId).orElse(null);

        if (aluno == null || turma == null) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Aluno ou Turma não encontrados.");
        }

        if (turma.getVagasDisponiveis() <= 0) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Não há vagas disponíveis nesta turma.");
        }

        // Criar matrícula
        Matricula matricula = new Matricula();
        matricula.setAluno(aluno);
        matricula.setTurma(turma);
        matricula.setSituacao("CURSANDO");

        // Decrementar vaga
        turma.setVagasDisponiveis(turma.getVagasDisponiveis() - 1);
        turmaRepository.save(turma);

        matriculaRepository.save(matricula);
        return ResponseEntity.status(HttpStatus.CREATED).body(matricula);
    }

    // 4. Listar alunos de uma turma para lançamento de notas
    @GetMapping("/matriculas/turma/{turmaId}")
    public List<Matricula> listarAlunosPorTurma(@PathVariable Long turmaId) {
        return matriculaRepository.findByTurmaId(turmaId);
    }

    // 5. Lançamento de Notas e Frequência com Regras de Negócio (RF04 / RN05 / RN06)
    @PutMapping("/matriculas/{matriculaId}/avaliacao")
    public ResponseEntity<?> lancarAvaliacao(@PathVariable Long matriculaId, @RequestBody Map<String, Double> avaliacao) {
        Matricula matricula = matriculaRepository.findById(matriculaId).orElse(null);

        if (matricula == null) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Matrícula não encontrada.");
        }

        Double nota1 = avaliacao.get("nota1");
        Double nota2 = avaliacao.get("nota2");
        Double freq = avaliacao.get("percentualFrequencia");

        matricula.setNota1(nota1);
        matricula.setNota2(nota2);
        matricula.setPercentualFrequencia(freq);

        // Cálculo da média aritmética simples proposta: (N1 + N2) / 2
        double mediaFinal = (nota1 + nota2) / 2.0;
        matricula.setMediaFinal(mediaFinal);

        // Aplicação das regras de negócio acadêmicas (RN05 e RN06)[cite: 35, 36]
        if (freq < 75.0) {
            matricula.setSituacao("REPROVADO_FREQUENCIA"); // Frequência inferior a 75% bloqueia aprovação direta[cite: 35, 36]
        } else if (mediaFinal >= 7.0) {
            matricula.setSituacao("APROVADO");
        } else if (mediaFinal >= 4.0) {
            matricula.setSituacao("EXAME_FINAL");
        } else {
            matricula.setSituacao("REPROVADO_NOTA");
        }

        matriculaRepository.save(matricula);
        return ResponseEntity.ok(matricula);
    }
}