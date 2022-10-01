create table trandetails(
    tnumber varchar(10),
    acctnum varchar(10),
    dot date,
    medium_of_transaction varchar(20),
    transaction_type varchar(20),
    transaction_amount INT(20),
    constraint
    trandetails_tnumber_pk primary key(tnumber),
    constraint
    trandetails_acctnum_fk foreign key(acctnum) references account(acctnum)
    
);