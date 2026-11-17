package UCSal.SGA.model;

import jakarta.persistence.*;
import lombok.Data;

@Entity
@Table(name = "disciplinas")
@Data
public class Disciplina {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long idDisciplina;
    private String nome;
    private int cargaHoraria;
    @Column(columnDefinition = "TEXT")
    private String ementa;
}