create database expense;
use expense;

create table expense_list(
	id integer auto_increment primary key,
	amount integer,
    description varchar(100)
);


drop table expense_list;
select * from expense_list;