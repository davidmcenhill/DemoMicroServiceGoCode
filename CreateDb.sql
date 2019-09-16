drop database petstore;
create database petstore;
use petstore;

create table Category (
	id BIGINT AUTO_INCREMENT PRIMARY KEY,
	name varchar(255)
);

create table Tag (
	id BIGINT AUTO_INCREMENT PRIMARY KEY,
	name varchar(255)
);

CREATE TABLE PetStatus (
	id TINYINT AUTO_INCREMENT PRIMARY KEY,
	description varchar(32)
);

CREATE TABLE Pet (
	id BIGINT AUTO_INCREMENT PRIMARY KEY,
	fk_category_id BIGINT,
	name varchar(255),	
	fk_status TINYINT,
	FOREIGN KEY (fk_category_id) REFERENCES Category(id),
	FOREIGN KEY (fk_status) REFERENCES PetStatus(id)
);

CREATE TABLE PetTags (
	fk_pet_id BIGINT,
	fk_tag_id BIGINT,
	FOREIGN KEY (fk_pet_id) REFERENCES Pet(id),
	FOREIGN KEY (fk_tag_id) REFERENCES Tag(id),
	PRIMARY KEY (fk_pet_id,fk_tag_id)
);

CREATE TABLE PetPhotoUrls (
	id BIGINT AUTO_INCREMENT PRIMARY KEY,
	fk_pet_id BIGINT,
	photo_url varchar(255),
	FOREIGN KEY (fk_pet_id) REFERENCES Pet(id)
);

INSERT INTO PetStatus (description) VALUES ("available"), ("pending"), ("sold");
