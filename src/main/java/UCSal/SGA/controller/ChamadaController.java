package UCSal.SGA.controller;

import UCSal.SGA.model.Matricula;
import UCSal.SGA.repository.MatriculaRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/chamadas")
@CrossOrigin(origins = "*")
public class ChamadaController {

    @Autowired
    private MatriculaRepository matriculaRepository;

    @PostMapping("/lancar")
    public ResponseEntity<?> salvarChamada(@RequestBody Map<String, Object> payload) {
        // Recebe { turmaId: 1, data: "2026-11-17", presentes: [idMatricula1, idMatricula3] }
        Long turmaId = Long.valueOf(payload.get("turmaId").toString());
        List<Integer> presentesIds = (List<Integer>) payload.get("presentes");

        // Busca todas as matrículas da turma
        List<Matricula> matriculas = matriculaRepository.findByTurmaId(turmaId);

        for (Matricula m : matriculas) {
            boolean estaPresente = presentesIds.contains(m.getId().intValue());
            // Aqui podemos incrementar aulas dadas e aulas frequentadas
            // Para simplificar, recalculamos a porcentagem de frequência com base nas presenças computadas
            int totalAulasDadas = m.getTotalAulasDadas() + 1;
            m.setTotalAulasDadas(totalAulasDadas);

            if (estaPresente) {
                m.setAulasPresenca(m.getAulasPresenca() + 1);
            }

            // Atualiza o percentual de frequência
            if (totalAulasDadas > 0) {
                double perc = ((double) m.getAulasPresenca() / totalAulasDadas) * 100.0;
                m.setPercentualFrequencia(Math.round(perc));
            }

            matriculaRepository.save(m);
        }

        return ResponseEntity.ok("Chamada registrada com sucesso para a data de hoje!");
    }
}