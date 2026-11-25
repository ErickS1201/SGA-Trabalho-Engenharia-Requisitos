package UCSal.SGA.model;

import jakarta.persistence.*;
import lombok.Data;
import java.util.Date;

@Entity
@Table(name = "documentos")
@Data
public class DocumentoAcademico {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long idDocumento;
    private String tipo; // DECLARACAO_MATRICULA, HISTORICO
    private String alunoNome;
    @Temporal(TemporalType.TIMESTAMP)
    private Date dataEmissao = new Date();
    @Column(unique = true)
    private String codigoVerificacao;
	public void setCodeVerificacao(String codverificacao) {
		this.codigoVerificacao = codverificacao;
	}
}