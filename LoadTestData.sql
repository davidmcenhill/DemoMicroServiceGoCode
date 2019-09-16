use petstore;

insert into category (name) values ("Dogs"),("Cats"),("Budgies");
insert into pet (fk_category_id,name,fk_status) values (1,"Chicko",1);
insert into pet (fk_category_id,name,fk_status) values (2,"Jips",1);
insert into pet (fk_category_id,name,fk_status) values (3,"Joey",1);
insert into tag (name) values ("Brown"),("Skelpie"),("Female");
insert into PetTags (fk_pet_id,fk_tag_id) values (1,1),(1,2),(1,3);

