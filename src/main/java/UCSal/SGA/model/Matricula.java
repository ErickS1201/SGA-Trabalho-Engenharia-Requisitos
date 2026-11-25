package UCSal.SGA.model;

import jakarta.persistence.*;
import lombok.Data;

@Entity
@Table(name = "matriculas")
@Data
public class Matricula {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "aluno_id")
    private Usuario aluno;

    @ManyToOne
    @JoinColumn(name = "turma_id")
    private Turma turma;

    private Double nota1;
    private Double nota2;
    private Double mediaFinal;
    private Double percentualFrequencia;
    private int totalAulasDadas;
    private int aulasPresenca;
    private String situacao = "CURSANDO";
}

enum Situacao{
	CURSANDO, APROVADO, EXAME_FINAL, REPROVADO_NOTA, REPROVADO_FREQUENCIA;
}