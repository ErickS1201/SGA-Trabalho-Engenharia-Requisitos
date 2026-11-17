package UCSal.SGA.repository;

import UCSal.SGA.model.Usuario;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Optional;

public interface UsuarioRepository extends JpaRepository<Usuario, Long> {
    Optional<Usuario> findByCpfOrMatricula(String cpf, String matricula);
    boolean existsByCpf(String cpf);
    boolean existsByMatricula(String matricula);
}