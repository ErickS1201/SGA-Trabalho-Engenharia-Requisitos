package UCSal.SGA.controller;

import UCSal.SGA.model.Disciplina;
import UCSal.SGA.repository.DisciplinaRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/disciplinas")
@CrossOrigin(origins = "*")
public class DisciplinaController {

    @Autowired
    private DisciplinaRepository disciplinaRepository;

    @GetMapping
    public List<Disciplina> listarDisciplinas() {
        return disciplinaRepository.findAll();
    }

    @PostMapping
    public Disciplina cadastrarDisciplina(@RequestBody Disciplina disciplina) {
        return disciplinaRepository.save(disciplina);
    }
}