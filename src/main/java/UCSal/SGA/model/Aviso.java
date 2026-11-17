package UCSal.SGA.model;

import jakarta.persistence.*;

import java.util.Date;

@Entity
@Table(name = "avisos")

public class Aviso {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long idAviso;
    private String titulo;
    @Column(columnDefinition = "TEXT")
    private String conteudo;
    @Temporal(TemporalType.TIMESTAMP)
    private Date dataPublicacao = new Date();
    private String turmaAlvo; // Opcional, se direcionado
	public Long getIdAviso() {
		return idAviso;
	}
	public void setIdAviso(Long idAviso) {
		this.idAviso = idAviso;
	}
	public String getTitulo() {
		return titulo;
	}
	public void setTitulo(String titulo) {
		this.titulo = titulo;
	}
	public String getConteudo() {
		return conteudo;
	}
	public void setConteudo(String conteudo) {
		this.conteudo = conteudo;
	}
	public Date getDataPublicacao() {
		return dataPublicacao;
	}
	public void setDataPublicacao(Date dataPublicacao) {
		this.dataPublicacao = dataPublicacao;
	}
	public String getTurmaAlvo() {
		return turmaAlvo;
	}
	public void setTurmaAlvo(String turmaAlvo) {
		this.turmaAlvo = turmaAlvo;
	}
    
    
}