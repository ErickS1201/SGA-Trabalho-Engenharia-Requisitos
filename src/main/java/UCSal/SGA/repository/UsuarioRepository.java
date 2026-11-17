package UCSal.SGA.repository;

import UCSal.SGA.model.Usuario;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface UsuarioRepository extends JpaRepository<Usuario, Long> {
    
    // O Spring Data JPA cria a consulta automaticamente pelo nome do método
    Optional<Usuario> findByCpfOrMatricula(String cpf, String matricula);
    List<Usuario> findByPerfil(String perfil);
}