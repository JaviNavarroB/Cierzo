

DROP DATABASE IF EXISTS cierzo;
CREATE DATABASE cierzo
  CHARACTER SET utf8mb4
  COLLATE utf8mb4_unicode_ci;

USE cierzo;

DROP TABLE IF EXISTS rol;
CREATE TABLE rol (
  id        INT          NOT NULL AUTO_INCREMENT,
  nombre    VARCHAR(50)  NOT NULL UNIQUE,

  CONSTRAINT pk_rol PRIMARY KEY (id)
) ENGINE = InnoDB;


DROP TABLE IF EXISTS usuarios;
CREATE TABLE usuarios (
  id           INT           NOT NULL AUTO_INCREMENT,
  id_rol       INT           NOT NULL,
  nombre       VARCHAR(50)   NOT NULL,
  apellidos    VARCHAR(50),
  genero       ENUM('Hombre','Mujer','Otro') NOT NULL,
  correo       VARCHAR(100)  NOT NULL UNIQUE,
  telefono     VARCHAR(20),
  contrasenya  VARCHAR(255)  NOT NULL,
  foto         LONGTEXT,

  CONSTRAINT pk_usuarios          PRIMARY KEY (id),
  CONSTRAINT fk_usuarios_rol      FOREIGN KEY (id_rol)
                                  REFERENCES rol(id)
                                  ON UPDATE CASCADE
                                  ON DELETE RESTRICT
) ENGINE = InnoDB;

DROP TABLE IF EXISTS deporte;
CREATE TABLE deporte (
  id                       INT            NOT NULL AUTO_INCREMENT,
  nombre                   VARCHAR(100)   NOT NULL,
  cuota_mensual            DECIMAL(6,2)   DEFAULT 0.00,
  cuota_anual_federacion   DECIMAL(6,2)   DEFAULT 0.00,
  foto                     LONGTEXT,
  longitud                 DECIMAL(10,7),
  latitud                  DECIMAL(10,7),

  CONSTRAINT pk_deporte PRIMARY KEY (id)
) ENGINE = InnoDB;

DROP TABLE IF EXISTS equipos;
CREATE TABLE equipos (
  id                     INT            NOT NULL AUTO_INCREMENT,
  id_deporte             INT            NOT NULL,
  nombre_deporte_abv     VARCHAR(10),
  nombre                 VARCHAR(100)   NOT NULL,
  descripcion            TEXT,
  dias_entrenamiento     JSON,
  horario                JSON,
  pabellon_nombre        VARCHAR(100),
  pabellon_direccion     TEXT,
  pabellon_descripcion   TEXT,
  mensaje_bienvenida     TEXT,
  cta_titulo             VARCHAR(100),
  cta_texto              TEXT,
  creado_en              TIMESTAMP      DEFAULT CURRENT_TIMESTAMP,
  latitud                DECIMAL(10,7),
  longitud               DECIMAL(10,7),

  CONSTRAINT pk_equipos            PRIMARY KEY (id),
  CONSTRAINT fk_equipos_deporte    FOREIGN KEY (id_deporte)
                                   REFERENCES deporte(id)
                                   ON UPDATE CASCADE
                                   ON DELETE CASCADE
) ENGINE = InnoDB;


DROP TABLE IF EXISTS eventos;
CREATE TABLE eventos (
  id                       INT            NOT NULL AUTO_INCREMENT,
  titulo                   VARCHAR(255)   NOT NULL,
  descripcion              TEXT,
  fecha                    DATE,
  hora_inicio              TIME,
  hora_fin                 TIME,
  lugar_nombre             VARCHAR(255),
  direccion                TEXT,
  latitud                  DECIMAL(10,7),
  longitud                 DECIMAL(10,7),
  fecha_limite_inscripcion DATE,
  cupo_total               INT,
  cupo_disponible          INT,
  programa                 JSON,
  testimonios              JSON,
  faqs                     JSON,
  creado_en                TIMESTAMP      DEFAULT CURRENT_TIMESTAMP,
  roles_admitidos          VARCHAR(255),
  foto                     LONGTEXT,

  CONSTRAINT pk_eventos PRIMARY KEY (id)
) ENGINE = InnoDB;


DROP TABLE IF EXISTS inscripcion_evento;
CREATE TABLE inscripcion_evento (
  id                  INT  NOT NULL AUTO_INCREMENT,
  id_usuario          INT  NOT NULL,
  id_evento           INT  NOT NULL,
  fecha_inscripcion   DATE DEFAULT (CURRENT_DATE),
  estado_inscripcion  ENUM('Inscrito','Abandono','Finalizada') DEFAULT 'Inscrito',

  CONSTRAINT pk_insc_evento          PRIMARY KEY (id),
  CONSTRAINT uk_insc_evento_unique   UNIQUE (id_usuario, id_evento),
  CONSTRAINT fk_insc_evento_user     FOREIGN KEY (id_usuario)
                                     REFERENCES usuarios(id)
                                     ON UPDATE CASCADE
                                     ON DELETE CASCADE,
  CONSTRAINT fk_insc_evento_evento   FOREIGN KEY (id_evento)
                                     REFERENCES eventos(id)
                                     ON UPDATE CASCADE
                                     ON DELETE CASCADE
) ENGINE = InnoDB;

DROP TABLE IF EXISTS inscripcion_equipo;
CREATE TABLE inscripcion_equipo (
  id                  INT  NOT NULL AUTO_INCREMENT,
  id_usuario          INT  NOT NULL,
  id_equipo           INT  NOT NULL,
  fecha_inicio        DATE NOT NULL DEFAULT (CURRENT_DATE),
  fecha_fin           DATE,
  estado_inscripcion  ENUM('Inscrito','Abandono','Finalizada') DEFAULT 'Inscrito',

  CONSTRAINT pk_insc_equipo           PRIMARY KEY (id),
  CONSTRAINT uk_insc_equipo_unique    UNIQUE (id_usuario, id_equipo),
  CONSTRAINT fk_insc_equipo_user      FOREIGN KEY (id_usuario)
                                      REFERENCES usuarios(id)
                                      ON UPDATE CASCADE
                                      ON DELETE CASCADE,
  CONSTRAINT fk_insc_equipo_equipo    FOREIGN KEY (id_equipo)
                                      REFERENCES equipos(id)
                                      ON UPDATE CASCADE
                                      ON DELETE CASCADE
) ENGINE = InnoDB;



INSERT INTO rol   (nombre) VALUES
  ('invitado'), ('socio'), ('jugador'), ('entrenador'), ('administrador');

