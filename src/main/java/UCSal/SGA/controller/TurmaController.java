package UCSal.SGA.controller;

import UCSal.SGA.model.Turma;
import UCSal.SGA.model.Usuario;
import UCSal.SGA.repository.TurmaRepository;
import UCSal.SGA.repository.UsuarioRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/turmas")
@CrossOrigin(origins = "*")
public class TurmaController {

    @Autowired
    private TurmaRepository turmaRepository;

    @Autowired
    private UsuarioRepository usuarioRepository;

    @PutMapping("/{turmaId}/professor/{professorId}")
    public ResponseEntity<?> atribuirProfessor(@PathVariable Long turmaId, @PathVariable Long professorId) {
        Turma turma = turmaRepository.findById(turmaId).orElse(null);
        Usuario professor = usuarioRepository.findById(professorId).orElse(null);

        if (turma == null || professor == null) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Turma ou Professor não encontrados.");
        }
        if (!"PROFESSOR".equals(professor.getPerfil())) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("O usuário selecionado não é um professor.");
        }

        turma.setProfessorId(professor.getId());
        turma.setProfessorNome(professor.getNome());
        turmaRepository.save(turma);
        return ResponseEntity.ok(turma);
    }

    @GetMapping("/professores")
    public List<Usuario> listarProfessores() {
        return usuarioRepository.findByPerfil("PROFESSOR");
    }
}