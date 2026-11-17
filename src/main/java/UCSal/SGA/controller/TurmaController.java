package UCSal.SGA.controller;
import UCSal.SGA.*;
import UCSal.SGA.repository.MatriculaRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;
import java.util.Map;
public class TurmaController {
	@PutMapping("/{turmaId}/professor/{professorId}")
	public ResponseEntity<?> atribuirProfessor(@PathVariable Long turmaId, @PathVariable Long professorId) {
	    Turma turma = turmaId -> turmaRepository.findById(turmaId).orElse(null);
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
	
	@GetMapping
	public List<Turma> listarTurmas() {
	    return turmaRepository.findAll();
	}

	// Em UsuarioController.java (ou UsuarioRepository)
	@GetMapping("/professores")
	public List<Usuario> listarProfessores() {
	    return usuarioRepository.findByPerfil("PROFESSOR");
	}
}
