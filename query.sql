drop table if exists coders;

create table coders (
    id int, 
    name varchar(10), 
    address varchar(50), 
    score int(10), 
    primary key(id)
);

insert into coders values(1, "kim", "ara", 30);
insert into coders values(2, "lee", "ora", 40);
insert into coders values(3, "park", "yeon", 50);

create table if not exists posts (
    author varchar(255),
    title varchar(255),
    content text, 
    date timestamp, 
    primary key(author)
);
