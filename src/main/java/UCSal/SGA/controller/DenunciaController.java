package UCSal.SGA.controller;

import UCSal.SGA.model.Denuncia;
import UCSal.SGA.repository.DenunciaRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/denuncias")
@CrossOrigin(origins = "*")
public class DenunciaController {

    @Autowired
    private DenunciaRepository denunciaRepository;

    @GetMapping
    public List<Denuncia> listarDenuncias() {
        return denunciaRepository.findAll();
    }

    @GetMapping("/protocolo/{protocolo}")
    public ResponseEntity<?> buscarPorProtocolo(@PathVariable String protocolo) {
        return denunciaRepository.findAll().stream()
                .filter(d -> d.getProtocolo() != null && d.getProtocolo().equalsIgnoreCase(protocolo.trim()))
                .findFirst()
                .<ResponseEntity<?>>map(ResponseEntity::ok)
                .orElse(ResponseEntity.status(404).body("Protocolo não encontrado."));
    }

    @PostMapping
    public Denuncia criarDenuncia(@RequestBody Denuncia denuncia) {
        denuncia.setProtocolo("PROT-" + UUID.randomUUID().toString().substring(0, 8).toUpperCase());
        denuncia.setStatus("RECEBIDO");
        if (denuncia.isAnonima()) {
            denuncia.setAutorNome("Anônimo");
        }
        return denunciaRepository.save(denuncia);
    }

    @PatchMapping("/{id}/status")
    public ResponseEntity<Denuncia> atualizarStatus(@PathVariable Long id, @RequestBody Denuncia dados) {
        return denunciaRepository.findById(id).map(denuncia -> {
            denuncia.setStatus(dados.getStatus());
            denunciaRepository.save(denuncia);
            return ResponseEntity.ok(denuncia);
        }).orElse(ResponseEntity.notFound().build());
    }
}