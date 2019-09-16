Hi,
- This demo microservice has been implemented in Go.
- It is only partially implemented, the working request is /pet/findByStatus query, others would follow a similar pattern.
- main.go : routing and handlers to read requests, call model functions and write the response.
- models/db.go - defines a datastore type for the model functions, and a function to connect to a mysql database.
- models/pets.go - implements the model functions against a sql connection to act on the tables related to pet. 
- main_test.go - unit tests where the handlers in main.go are tested by calling the model functions 
  using a mocked datastore type such that no database connection is required.
- pets_test.go - unit tests for models/pets.go where the sql connection itself is mocked, to test the model functions themselves
  also without requiring a real database connection.
- functional_tests.go - /test presents a webpage where the requests can be called , the idea being that 
  testers can enter various parameters to test the microservice.
  
 
 
  
