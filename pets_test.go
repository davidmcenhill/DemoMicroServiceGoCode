// pets_test.go - Unit tests of the database model/pets functions mocking the sql driver
package main

import (
	"log"
	"testing"

	"github.com/DATA-DOG/go-sqlmock"
	"github.com/dmcenhill/petstore/models"
)

// TestReadPetTagsByPetID - positive unit test for ReadPetTagsByPetID
func TestReadPetTagsByPetID(t *testing.T) {

	log.Println("Doing test TestReadPetTagsByPetID")
	db, mock, err := sqlmock.New()
	if err != nil {
		log.Panic(err)
	}

	env := &Env{db: &models.DB{db}, listenon: ""}

	// Setup the test criteria
	columns := []string{"id", "name"}
	mock.ExpectQuery("select tg.id,tg.name from PetTags pt join Tag tg on pt.fk_tag_id = tg.id where pt.fk_pet_id = ?").WithArgs(2).WillReturnRows(sqlmock.NewRows(columns).FromCSVString("1,MyName"))

	// Run the function being tested
	tags, err1 := env.db.ReadPetTagsByPetID(2)
	log.Println(tags)

	if err1 != nil {
		t.Errorf("Got unxpected error %s", err)
	}

	if tags[0].ID != 1 || tags[0].Name != "MyName" {
		t.Errorf("Returned tag incorrect, expected %d:%s actual %d:%s", 1, "MyName", tags[0].ID, tags[0].Name)
	}

}
