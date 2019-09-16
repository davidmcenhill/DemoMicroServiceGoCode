package main

import (
	"fmt"
	"html/template"
	"net/http"
)

var templates = template.Must(template.ParseFiles("templates/header.html", "templates/footer.html", "templates/test.html"))

// Data to pass the to the view - HTML template
type templateVars struct {
	URL          string // Server root
	Messages     string // For showing info messages on the page
	ErrorMessage string // For showing error messages on the page
}

func addTestRoutes() {
	http.Handle("/css/", http.StripPrefix("/css", http.FileServer(http.Dir("css"))))
	http.Handle("/images/", http.StripPrefix("/images", http.FileServer(http.Dir("images"))))
	http.Handle("/js/", http.StripPrefix("/js", http.FileServer(http.Dir("js"))))
}

func (env *Env) testHandler(w http.ResponseWriter, r *http.Request) {

	fmt.Printf("testHandler \n")

	tv := &templateVars{}

	renderTemplate(w, "test", tv)
}

func renderTemplate(w http.ResponseWriter, tmpl string, tv *templateVars) {
	err := templates.ExecuteTemplate(w, tmpl+".html", tv)
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
	}
}
