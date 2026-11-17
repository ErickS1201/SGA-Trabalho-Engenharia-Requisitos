package UCSal.SGA.model;

import jakarta.persistence.*;
import lombok.Data;

@Entity
@Table(name = "turmas")
@Data
public class Turma {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    private String codigo;          
    private String disciplinaNome;  
    private String professorNome;   
    private String horario;         
    private int vagasTotais;
    private int vagasDisponiveis;
    private String preRequisitoNome;
}