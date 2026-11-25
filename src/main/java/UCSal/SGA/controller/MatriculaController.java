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

    @GetMapping("/turmas")
    public List<Turma> listarTurmas() {
        return turmaRepository.findAll();
    }

    @GetMapping("/matriculas")
    public List<Matricula> listarTodasMatriculas() {
        return matriculaRepository.findAll();
    }

    @GetMapping("/matriculas/aluno/{alunoId}")
    public List<Matricula> listarMatriculasPorAluno(@PathVariable Long alunoId) {
        return matriculaRepository.findByAlunoId(alunoId);
    }

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

        Matricula matricula = new Matricula();
        matricula.setAluno(aluno);
        matricula.setTurma(turma);
        matricula.setSituacao("CURSANDO");
        matricula.setPercentualFrequencia(100.0);

        turma.setVagasDisponiveis(turma.getVagasDisponiveis() - 1);
        turmaRepository.save(turma);

        matriculaRepository.save(matricula);
        return ResponseEntity.status(HttpStatus.CREATED).body(matricula);
    }

    @GetMapping("/matriculas/turma/{turmaId}")
    public List<Matricula> listarAlunosPorTurma(@PathVariable Long turmaId) {
        return matriculaRepository.findByTurmaId(turmaId);
    }

    @PutMapping("/matriculas/{matriculaId}/avaliacao")
    public ResponseEntity<?> lancarAvaliacao(@PathVariable Long matriculaId, @RequestBody Map<String, Double> avaliacao) {
        Matricula matricula = matriculaRepository.findById(matriculaId).orElse(null);

        if (matricula == null) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Matrícula não encontrada.");
        }

        Double nota1 = avaliacao.get("nota1");
        Double nota2 = avaliacao.get("nota2");

        // Usa a frequência calculada automaticamente pelas chamadas (ou 100% se ainda não houve chamada)
        Double freq = matricula.getPercentualFrequencia() != null ? matricula.getPercentualFrequencia() : 100.0;
        matricula.setPercentualFrequencia(freq);

        matricula.setNota1(nota1);
        matricula.setNota2(nota2);

        double mediaFinal = Math.round(((nota1 + nota2) / 2.0) * 10.0) / 10.0;
        matricula.setMediaFinal(mediaFinal);

        if (freq < 75.0) {
            matricula.setSituacao("REPROVADO_FREQUENCIA");
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