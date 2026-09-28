CREATE DATABASE IF NOT EXISTS bdd_boda CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE bdd_boda;

CREATE TABLE IF NOT EXISTS tbl_invitado (
  id_invitado        INT UNSIGNED NOT NULL AUTO_INCREMENT,
  nombres            VARCHAR(100) NOT NULL,
  apellidos          VARCHAR(100) NOT NULL,
  fecha_confirmacion TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (id_invitado)
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS tbl_acompa (
  id_acompanante     INT UNSIGNED NOT NULL AUTO_INCREMENT,
  id_invitado        INT UNSIGNED NOT NULL,
  nombre_acompanante VARCHAR(100) NOT NULL,
  PRIMARY KEY (id_acompanante),
  CONSTRAINT fk_acompa_invitado FOREIGN KEY (id_invitado)
    REFERENCES tbl_invitado (id_invitado) ON DELETE CASCADE
) ENGINE=InnoDB;

-- Resumen para ver quién confirmó y cuántas personas asisten en total:
--   SELECT * FROM v_confirmaciones;
CREATE OR REPLACE VIEW v_confirmaciones AS
SELECT i.id_invitado,
       CONCAT(i.nombres, ' ', i.apellidos) AS invitado,
       COUNT(a.id_acompanante)             AS acompanantes,
       1 + COUNT(a.id_acompanante)         AS total_personas,
       GROUP_CONCAT(a.nombre_acompanante SEPARATOR ', ') AS nombres_acompanantes,
       i.fecha_confirmacion
FROM tbl_invitado i
LEFT JOIN tbl_acompa a ON a.id_invitado = i.id_invitado
GROUP BY i.id_invitado;
