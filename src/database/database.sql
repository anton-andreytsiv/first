create TABLE users(
    id serial primary key,
    email varchar(255),
    password varchar(255),
    name varchar(255),
    roleId Integer,
    foreign key (roleId) references role(id)
);

create TABLE role(
    id serial primary key,
    name varchar(255)
);