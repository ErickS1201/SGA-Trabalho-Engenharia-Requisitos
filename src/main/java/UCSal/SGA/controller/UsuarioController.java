package UCSal.SGA.controller;

import UCSal.SGA.model.Usuario;
import UCSal.SGA.repository.UsuarioRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/usuarios")
@CrossOrigin(origins = "*")
public class UsuarioController {

    @Autowired
    private UsuarioRepository usuarioRepository;

    @GetMapping
    public List<Usuario> listarUsuarios() {
        return usuarioRepository.findAll();
    }

    @PostMapping
    public ResponseEntity<?> cadastrarUsuario(@RequestBody Usuario novoUsuario) {
        if (usuarioRepository.existsByCpf(novoUsuario.getCpf()) || 
            usuarioRepository.existsByMatricula(novoUsuario.getMatricula())) {
            return ResponseEntity.status(HttpStatus.CONFLICT).body("CPF ou Matrícula já cadastrados.");
        }
        Usuario salvo = usuarioRepository.save(novoUsuario);
        return ResponseEntity.status(HttpStatus.CREATED).body(salvo);
    }

    @PatchMapping("/{id}/status")
    public ResponseEntity<?> alternarStatus(@PathVariable Long id) {
        return usuarioRepository.findById(id).map(usuario -> {
            usuario.setAtivo(!usuario.isAtivo());
            usuarioRepository.save(usuario);
            return ResponseEntity.ok(usuario);
        }).orElse(ResponseEntity.notFound().build());
    }
}