package UCSal.SGA.model;

import jakarta.persistence.*;
import lombok.Data;

@Entity
@Table(name = "usuarios")
@Data
public class Usuario {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    private String nome;
    
    @Column(unique = true)
    private String cpf;
    
    @Column(unique = true)
    private String matricula;
    
    private String email;
    private String senha;
    private String perfil; // ALUNO, PROFESSOR, COORDENADOR, SECRETARIA, ADMIN
    private boolean ativo = true;
    
    private int tentativasLogin = 0;
}