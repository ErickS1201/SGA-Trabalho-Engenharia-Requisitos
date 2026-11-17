package UCSal.SGA.controller;

import UCSal.SGA.model.Usuario;
import UCSal.SGA.repository.UsuarioRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = "*")
public class AuthController {

    @Autowired
    private UsuarioRepository usuarioRepository;

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody Map<String, String> credentials) {
        String loginStr = credentials.get("login");
        String senha = credentials.get("senha");

        Usuario usuario = usuarioRepository.findByCpfOrMatricula(loginStr, loginStr)
                .orElse(null);

        if (usuario == null || !usuario.isAtivo()) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Usuário não encontrado ou inativo.");
        }

        // Simulação de controle de tentativas (RN02)
        if (usuario.getTentativasLogin() >= 3) {
            return ResponseEntity.status(HttpStatus.locked("Conta temporariamente bloqueada por excesso de tentativas."))
                    .body(Map.of("erro", "Conta bloqueada por 15 minutos."));
        }

        if (!usuario.getSenha().equals(senha)) {
            usuario.setTentativasLogin(usuario.getTentativasLogin() + 1);
            usuarioRepository.save(usuario);
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Credenciais inválidas.");
        }

        // Reset de tentativas em caso de sucesso
        usuario.setTentativasLogin(0);
        usuarioRepository.save(usuario);

        return ResponseEntity.ok(Map.of(
                "id", usuario.getId(),
                "nome", usuario.getNome(),
                "perfil", usuario.getPerfil(),
                "token", "token-jwt-simulado-sga"
        ));
    }
}