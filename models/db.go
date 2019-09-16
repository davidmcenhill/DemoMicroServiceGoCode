package models

import (
	"database/sql"
	_ "github.com/go-sql-driver/mysql"
)

// Datastore - the database model function declarations
type Datastore interface {
	ReadPetByStatus(status []string) ([]*Pet, error)
	ReadPetTagsByPetID(id int64) ([]*Tag, error)
}

// DB - database structure
type DB struct {
	*sql.DB
}

// NewDB make a new database connection
func NewDB(dataSourceName string) (*DB, error) {
	db, err := sql.Open("mysql", dataSourceName)
	if err != nil {
		return nil, err
	}
	if err = db.Ping(); err != nil {
		return nil, err
	}
	return &DB{db}, nil
}
