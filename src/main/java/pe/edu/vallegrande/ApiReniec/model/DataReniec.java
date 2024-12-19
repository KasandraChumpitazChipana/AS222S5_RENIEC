package pe.edu.vallegrande.ApiReniec.model;

import lombok.Data;
import lombok.Getter;
import lombok.Setter;
import org.springframework.data.annotation.Id;
import org.springframework.data.relational.core.mapping.Column;
import org.springframework.data.relational.core.mapping.Table;

    
@Data
@Getter
@Setter
@Table("Reniec")
public class DataReniec {
    @Id
    @Column("Id")
    private Long Id;

    @Column("dni")
    private String dni;

    @Column("nombres")
    private String nombres;

    @Column("apellido_Paterno")
    private String apellidoPaterno;

    @Column("apellido_Materno")
    private String apellidoMaterno;

    @Column("code_Verificacion")
    private String codVerifica;

    @Column("status")
    private String status;
}