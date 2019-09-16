// pets.go - model for pets
package models

import (
	"log"
	"strings"
)

// Tag - data structure for the tags
type Tag struct {
	ID   int64
	Name string
}

// Pet - data structure of the Pet model.
type Pet struct {
	ID       int64
	Category struct {
		ID   int64
		Name string
	}
	Name      string
	PhotoUrls []string
	Tags      []*Tag
	Status    string
}

// ReadPetByStatus - return array of Pets that match one of the status in the status parameter.
func (db *DB) ReadPetByStatus(status []string) ([]*Pet, error) {

	stm := "select pt.id, pt.name, st.description, ct.id, ct.name " +
		"from pet pt " +
		"join petstatus st on pt.fk_status = st.id " +
		"join category ct on pt.fk_category_id = ct.id " +
		"where st.description in (?" + strings.Repeat(",?", len(status)-1) + ")"

	args := make([]interface{}, len(status))
	for i, s := range status {
		args[i] = s
	}

	rows, err := db.Query(stm, args...)
	if err != nil {
		log.Printf("readPetByStatus Query %s gave error %s", stm, err.Error())
		return nil, err
	}
	defer rows.Close()

	pets := make([]*Pet, 0)
	for rows.Next() {
		pet := new(Pet)
		err := rows.Scan(&pet.ID, &pet.Name, &pet.Status, &pet.Category.ID, &pet.Category.Name)
		if err != nil {
			log.Printf("readPetByStatus scan error %s", err.Error())
			return nil, err
		}

		var err1 error
		pet.Tags, err1 = db.ReadPetTagsByPetID(pet.ID)
		if err1 != nil {
			log.Printf("readPetByStatus ReadPetTagsByPetID returned error %s", err1.Error())
		}
		pets = append(pets, pet)
	}
	if err = rows.Err(); err != nil {
		log.Printf("readPetByStatus rows error %s", err.Error())
		return nil, err
	}
	return pets, nil
}

// ReadPetTagsByPetID - Read the tags for a pet identified by id
func (db *DB) ReadPetTagsByPetID(id int64) ([]*Tag, error) {

	stm := "select tg.id,tg.name from PetTags pt join Tag tg on pt.fk_tag_id = tg.id where pt.fk_pet_id = ?"
	rows, err := db.Query(stm, id)
	if err != nil {
		log.Printf("readPetTags Query %s gave error %s", stm, err.Error())
		return nil, err
	}
	defer rows.Close()

	tags := make([]*Tag, 0)
	for rows.Next() {
		tag := new(Tag)
		err := rows.Scan(&tag.ID, &tag.Name)
		if err != nil {
			log.Printf("readPetTags scan error %s", err.Error())
			return nil, err
		}
		tags = append(tags, tag)
	}
	if err = rows.Err(); err != nil {
		log.Printf("readPetTags rows error %s", err.Error())
		return nil, err
	}
	return tags, nil

}
