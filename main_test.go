// main_test.go - unit tests of functions in main mocking the model functions  (usage: cmd> go test)
package main

import (
	"log"
	"net/http"
	"net/http/httptest"
	"testing"

	"github.com/dmcenhill/petstore/models"
)

type mockDB struct{}

// ReadPetByStatus - mock implementation
func (db *mockDB) ReadPetByStatus(status []string) ([]*models.Pet, error) {
	pets := make([]*models.Pet, 0)
	pet := &models.Pet{ID: 1, Name: "Poppy", PhotoUrls: []string{"a", "b"}, Tags: []*models.Tag{{ID: 1, Name: "Female"}}, Status: "available"}
	pet.Category.ID = 1
	pet.Category.Name = "Dog"
	pets = append(pets, pet)
	return pets, nil
}

// ReadPetTagsByPetID - mock implemtation
func (db *mockDB) ReadPetTagsByPetID(id int64) ([]*models.Tag, error) {
	// TODO - implement if needed
	return nil, nil
}

func TestPetFindByStatusHandler(t *testing.T) {

	log.Println("Doing test TestPetFindByStatusHandler")
	env := Env{db: &mockDB{}, listenon: ""}

	// Create a http request to pass to PetFindByStatusHandler
	req, err := http.NewRequest("GET", "/pet/findByStatus", nil)
	req.Header.Set("Content-Type", "application/json")
	if err != nil {
		t.Fatal(err)
	}
	// Add the status to the url
	q := req.URL.Query()
	q.Add("status", "available,pending")
	req.URL.RawQuery = q.Encode() // Encode and assign back to the original query.

	// Create ResponseRecorder to record the response.
	rr := httptest.NewRecorder()
	handler := http.HandlerFunc(env.petFindByStatusHandler)

	// Pass req to the handler, record response in rr
	handler.ServeHTTP(rr, req)

	// Check the status code is what we expect.
	if status := rr.Code; status != http.StatusOK {
		t.Errorf("handler returned wrong status code: got %v want %v", status, http.StatusOK)
	}

	// Check the response body is what we expect.
	expected := `[{"ID":1,"Category":{"ID":1,"Name":"Dog"},"Name":"Poppy","PhotoUrls":["a","b"],"Tags":[{"ID":1,"Name":"Female"}],"Status":"available"}]`
	if rr.Body.String() != expected {
		t.Errorf("handler returned unexpected body: got %v want %v", rr.Body.String(), expected)
	}
}
