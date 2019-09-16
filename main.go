// main - entry point for the petstore
package main

import (
	"encoding/json"
	"errors"
	"fmt"
	"io/ioutil"
	"log"
	"net/http"
	"strings"

	"github.com/dmcenhill/petstore/models"
)

// Env : Environment variables
type Env struct {
	db       models.Datastore
	listenon string
}

func main() {
	// TODO: read these hardcoded params from a config file
	db, err := models.NewDB("root:pwd@tcp(localhost)/petstore")
	if err != nil {
		log.Panic(err)
	}

	env := &Env{db, ":8082"}

	http.HandleFunc("/pet/findByStatus", env.petFindByStatusHandler)
	http.HandleFunc("/pet", env.petHandler)

	addTestRoutes()
	http.HandleFunc("/test", env.testHandler)
	// TODO - use http.ListenAndServeTLS to serve https to secure the connection.
	http.ListenAndServe(env.listenon, nil)
}

// petFindByStatusHandler get all the pets that have the specified status list
func (env *Env) petFindByStatusHandler(w http.ResponseWriter, r *http.Request) {
	if r.Method != "GET" {
		http.Error(w, http.StatusText(405), 405)
		return
	}

	// Get the status from the URL
	status, ok := r.URL.Query()["status"]

	if !ok || len(status[0]) < 1 {
		log.Println("Invalid status - missing")
		http.Error(w, "Invalid status - missing", 400)
		return
	}

	// Convert comma separated list to an array of strings
	statusArr := strings.Split(status[0], ",")
	log.Println(statusArr)

	// Retrieve pets from the database
	pets, err := env.db.ReadPetByStatus(statusArr)
	if err != nil {
		http.Error(w, http.StatusText(500), 500)
		return
	}

	// Convert response to JSON
	b, err := json.Marshal(pets)
	if err != nil {
		log.Println(err)
		http.Error(w, http.StatusText(500), 500)
		return
	}
	fmt.Fprintf(w, string(b))
	w.Header().Set("Content-Type", "application/json")
	log.Println("Response ", string(b))
}

// JsonToArrayMap converts json array of objects into an array of maps. TODO - move to Utils package.
func jsonToArrayMap(b []byte) ([]map[string]string, error) {
	outMap := make([]map[string]string, 0, 10)

	var f interface{}
	err := json.Unmarshal(b, &f)
	if err != nil {
		return nil, err
	}

	log.Println(f)

	fMap1 := f.([]interface{})
	for ix, mp := range fMap1 {
		outMap = append(outMap, make(map[string]string))
		fMap := mp.(map[string]interface{})
		for k, v := range fMap {
			switch vv := v.(type) {
			case string:
				log.Println(k, "is string", vv)
				outMap[ix][k] = vv
			case float64, int64, int32:
				log.Println(k, "is numeric", vv)
				outMap[ix][k] = v.(string) // convert to string
			default:
				log.Println(k, "jsonToArrayMap: unhandled type")
				return nil, errors.New("jsonToArrayMap: unhandled type")
			}
		}

	}
	return outMap, nil
}

// petHandler - creates a new Pet record
func (env *Env) petHandler(w http.ResponseWriter, r *http.Request) {

	log.Printf("petHandler \n")

	if r.Method != "POST" {
		http.Error(w, http.StatusText(405), 405)
		return
	}
	if r.Body == nil {
		http.Error(w, "No request body", 400)
		return
	}

	// read json http response
	rspData, err := ioutil.ReadAll(r.Body)
	if err != nil {
		http.Error(w, err.Error(), 400)
		return
	}

	// Generic marshal into a an array of map holding the Pet data.
	fMap2, err2 := jsonToArrayMap([]byte(rspData))
	if err2 == nil {
		log.Println(fMap2)
	}

	// TODO - create the Pets
}
