package UCSal.SGA.model;

import jakarta.persistence.*;
import lombok.Data;
import java.util.Date;

@Entity
@Table(name = "denuncias")
@Data
public class Denuncia {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long idDenuncia;
    private String protocolo;
    private String categoria;
    private String autorNome;
    @Column(columnDefinition = "TEXT")
    private String descricao;
    private boolean anonima;
    private String status = "RECEBIDO"; // RECEBIDO, EM_ANALISE, RESOLVIDO
    @Temporal(TemporalType.TIMESTAMP)
    private Date dataRegistro = new Date();
}