package UCSal.SGA.controller;

import UCSal.SGA.model.DocumentoAcademico;
import UCSal.SGA.repository.DocumentoRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.UUID;

@RestController
@RequestMapping("/api/documentos")
@CrossOrigin(origins = "*")
public class DocumentoController {

    @Autowired
    private DocumentoRepository documentoRepository;

    @PostMapping("/emitir")
    public DocumentoAcademico emitirDocumento(@RequestBody DocumentoAcademico doc) {
        doc.setCodeVerificacao("SGA-VALI-" + UUID.randomUUID().toString().substring(0, 6).toUpperCase());
        return documentoRepository.save(doc);
    }

    @GetMapping("/validar/{codigo}")
    public ResponseEntity<?> validarDocumento(@PathVariable String codigo) {
        return documentoRepository.findByCodigoVerificacao(codigo)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.status(404).body("Documento inválido ou não encontrado."));
    }
}