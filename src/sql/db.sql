
use heroku_4de5a65c92fe458;

create table administrador(
	idAdministrador integer auto_increment primary key,
	nombreUsuario varchar(50) not null,
	pass varchar(100) not null,
	fecha timestamp
);

create table usuario(
	idUsuario integer auto_increment primary key,
	nombre varchar(50) not null,
	apellido varchar(50) not null,
	nombreUsuario varchar(50) not null,
	pass varchar(50) not null,
	fecha datetime not null,
	estado varchar(100) not null,
);


insert into administrador values ('admin','admon123');

select * from administrador;