package UCSal.SGA.repository;

import UCSal.SGA.model.DocumentoAcademico;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Optional;

public interface DocumentoRepository extends JpaRepository<DocumentoAcademico, Long> {
    Optional<DocumentoAcademico> findByCodigoVerificacao(String codigoVerificacao);
}