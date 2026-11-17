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

    // DTO interno para evitar qualquer erro de classpath ou pacote separado
    public static class LoginRequest {
        private String login;
        private String senha;
        
        public LoginRequest() {}
        
        public String getLogin() { return login; }
        public void setLogin(String login) { this.login = login; }
        public String getSenha() { return senha; }
        public void setSenha(String senha) { this.senha = senha; }
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody LoginRequest request) {
        System.out.println("--- TENTATIVA DE LOGIN ---");
        System.out.println("Login recebido: " + request.getLogin());
        System.out.println("Senha recebida: " + request.getSenha());

        if (request.getLogin() == null || request.getSenha() == null) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Login ou senha não informados.");
        }

        Usuario usuario = usuarioRepository.findByCpfOrMatricula(request.getLogin(), request.getLogin()).orElse(null);

        if (usuario == null) {
            System.out.println("-> Usuário NÃO encontrado no banco.");
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Usuário não encontrado.");
        }

        if (!usuario.getSenha().equals(request.getSenha())) {
            System.out.println("-> Senha incorreta! Senha no banco: " + usuario.getSenha() + " | Senha enviada: " + request.getSenha());
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Senha incorreta.");
        }

        System.out.println("-> Login bem-sucedido para: " + usuario.getNome());
        return ResponseEntity.ok(Map.of(
                "id", usuario.getId(),
                "nome", usuario.getNome(),
                "perfil", usuario.getPerfil(),
                "token", "token-jwt-simulado"
        ));
    }
}