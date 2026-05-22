package main

import (
	"encoding/json"
	"fmt"
	"log"
	"net/http"
	"os"
	"path/filepath"
	"strings"
	"embed"
	"io"
	"io/fs"

	"github.com/go-chi/chi/v5"
	"github.com/go-chi/chi/v5/middleware"
	"github.com/go-chi/cors"
)

//go:embed dist/*
var content embed.FS

func main() {
	InitDB()

	r := chi.NewRouter()
	r.Use(middleware.Logger)
	r.Use(middleware.Recoverer)

	r.Use(cors.Handler(cors.Options{
		AllowedOrigins: []string{"*"},
		AllowedMethods: []string{"GET", "POST", "PUT", "DELETE", "OPTIONS"},
		AllowedHeaders: []string{"Accept", "Authorization", "Content-Type", "X-CSRF-Token", "x-file-name"},
	}))

	r.Get("/api/health", func(w http.ResponseWriter, r *http.Request) {
		json.NewEncoder(w).Encode(map[string]interface{}{"ok": true, "port": 8787})
	})

	r.Get("/api/state", func(w http.ResponseWriter, r *http.Request) {
		w.Header().Set("Content-Type", "application/json")
		json.NewEncoder(w).Encode(GetState())
	})

	r.Put("/api/state", func(w http.ResponseWriter, r *http.Request) {
		var state FullState
		if err := json.NewDecoder(r.Body).Decode(&state); err != nil {
			http.Error(w, `{"ok":false,"error":"JSON inválido."}`, http.StatusBadRequest)
			return
		}
		w.Header().Set("Content-Type", "application/json")
		json.NewEncoder(w).Encode(map[string]interface{}{"ok": true, "state": SaveState(state)})
	})

	r.Get("/api/trainings", func(w http.ResponseWriter, r *http.Request) {
		w.Header().Set("Content-Type", "application/json")
		json.NewEncoder(w).Encode(map[string]interface{}{"trainings": GetTrainings()})
	})

	r.Post("/api/trainings", func(w http.ResponseWriter, r *http.Request) {
		var t TrainingPayload
		if err := json.NewDecoder(r.Body).Decode(&t); err != nil {
			http.Error(w, `{"ok":false,"error":"JSON inválido."}`, http.StatusBadRequest)
			return
		}
		SaveTraining(t)
		w.Header().Set("Content-Type", "application/json")
		json.NewEncoder(w).Encode(map[string]interface{}{"ok": true, "training": t, "trainings": GetTrainings()})
	})

	r.Put("/api/trainings/{id}", func(w http.ResponseWriter, r *http.Request) {
		id := chi.URLParam(r, "id")
		var t TrainingPayload
		if err := json.NewDecoder(r.Body).Decode(&t); err != nil {
			http.Error(w, `{"ok":false,"error":"JSON inválido."}`, http.StatusBadRequest)
			return
		}
		t.ID = id
		SaveTraining(t)
		w.Header().Set("Content-Type", "application/json")
		json.NewEncoder(w).Encode(map[string]interface{}{"ok": true, "training": t, "trainings": GetTrainings()})
	})

	r.Delete("/api/trainings/{id}", func(w http.ResponseWriter, r *http.Request) {
		id := chi.URLParam(r, "id")
		DeleteTraining(id)
		w.Header().Set("Content-Type", "application/json")
		json.NewEncoder(w).Encode(map[string]interface{}{"ok": true, "trainings": GetTrainings()})
	})
	
	r.Post("/api/assets/upload", UploadAsset)
	r.Post("/api/mentor", MentorHandler)
	r.Post("/api/pdf/extract", PdfExtractHandler)

	workDir, _ := os.Getwd()
	uploadsDir := filepath.Join(filepath.Dir(workDir), "uploads")
	if err := os.MkdirAll(uploadsDir, 0755); err != nil {
		log.Printf("Error creating uploads dir: %v", err)
	}

	r.Get("/uploads/*", func(w http.ResponseWriter, r *http.Request) {
		rctx := chi.RouteContext(r.Context())
		pathPrefix := strings.TrimSuffix(rctx.RoutePattern(), "/*")
		fs := http.StripPrefix(pathPrefix, http.FileServer(http.Dir(uploadsDir)))
		fs.ServeHTTP(w, r)
	})

	// Serve the embedded React frontend
	subFS, err := fs.Sub(content, "dist")
	if err != nil {
		log.Fatal(err)
	}
	
	r.Get("/*", func(w http.ResponseWriter, r *http.Request) {
		// Serve file if it exists, otherwise serve index.html for SPA routing
		filePath := r.URL.Path
		if filePath == "/" {
			filePath = "index.html"
		} else {
			filePath = strings.TrimPrefix(filePath, "/")
		}

		if _, err := fs.Stat(subFS, filePath); os.IsNotExist(err) {
			filePath = "index.html"
		}

		file, err := subFS.Open(filePath)
		if err != nil {
			http.Error(w, "Not found", http.StatusNotFound)
			return
		}
		defer file.Close()

		fileInfo, _ := file.Stat()
		http.ServeContent(w, r, filePath, fileInfo.ModTime(), file.(io.ReadSeeker))
	})

	port := os.Getenv("PORT")
	if port == "" {
		port = "8787"
	}

	fmt.Printf("Go Backend listening on port %s...\n", port)
	log.Fatal(http.ListenAndServe(":"+port, r))
}
