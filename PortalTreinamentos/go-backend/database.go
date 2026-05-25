package main

import (
	"database/sql"
	"encoding/json"
	"fmt"
	"log"
	"os"
	"path/filepath"

	_ "modernc.org/sqlite"
)

var db *sql.DB

type SeedPayload struct {
	Trainings []TrainingPayload `json:"trainings"`
}

func InitDB() {
	var err error
	
	// Create data directory
	dataDir := filepath.Join("..", "data")
	if err := os.MkdirAll(dataDir, 0755); err != nil {
		log.Fatalf("Error creating data dir: %v", err)
	}

	dbPath := filepath.Join(dataDir, "portal-treinamentos.sqlite")
	db, err = sql.Open("sqlite", dbPath)
	if err != nil {
		log.Fatalf("Error opening database: %v", err)
	}

	// Create tables
	queries := []string{
		`CREATE TABLE IF NOT EXISTS app_state (
			id INTEGER PRIMARY KEY CHECK (id = 1),
			users_json TEXT NOT NULL DEFAULT '[]',
			results_json TEXT NOT NULL DEFAULT '[]',
			certificates_json TEXT NOT NULL DEFAULT '[]',
			updated_at TEXT NOT NULL DEFAULT (datetime('now'))
		);`,
		`CREATE TABLE IF NOT EXISTS trainings (
			id TEXT PRIMARY KEY,
			department_id TEXT NOT NULL,
			title TEXT NOT NULL,
			description TEXT NOT NULL,
			created_at TEXT NOT NULL,
			updated_at TEXT NOT NULL,
			status TEXT NOT NULL DEFAULT 'draft',
			content TEXT NOT NULL DEFAULT ''
		);`,
	}

	for _, query := range queries {
		if _, err := db.Exec(query); err != nil {
			log.Fatalf("Error creating table: %v", err)
		}
	}

	// Alter tables (ignore errors if columns exist)
	alterQueries := []string{
		"ALTER TABLE app_state ADD COLUMN trainings_json TEXT NOT NULL DEFAULT '[]'",
		"ALTER TABLE trainings ADD COLUMN quiz_questions_json TEXT NOT NULL DEFAULT '[]'",
		"ALTER TABLE trainings ADD COLUMN content_blocks_json TEXT NOT NULL DEFAULT '[]'",
		"ALTER TABLE trainings ADD COLUMN module_id TEXT NOT NULL DEFAULT ''",
		"ALTER TABLE trainings ADD COLUMN level TEXT NOT NULL DEFAULT 'basico'",
	}

	for _, query := range alterQueries {
		db.Exec(query)
	}

	fmt.Println("Database initialized successfully.")
}

func SeedTrainingsIfEmpty() {
	var trainingCount int
	if err := db.QueryRow("SELECT COUNT(*) FROM trainings").Scan(&trainingCount); err != nil {
		log.Printf("Error counting trainings for seed: %v\n", err)
		return
	}

	if trainingCount > 0 {
		return
	}

	seedPath := "seed_trainings.json"
	raw, err := os.ReadFile(seedPath)
	if err != nil {
		if !os.IsNotExist(err) {
			log.Printf("Error reading seed file: %v\n", err)
		}
		return
	}

	var payload SeedPayload
	if err := json.Unmarshal(raw, &payload); err != nil {
		log.Printf("Error parsing seed trainings: %v\n", err)
		return
	}

	seeded := 0
	for _, training := range payload.Trainings {
		if training.DepartmentID == "" || training.Title == "" {
			continue
		}

		if training.Level == "" {
			training.Level = "basico"
		}
		if training.Status == "" {
			training.Status = "published"
		}
		if training.CreatedAt == "" {
			training.CreatedAt = "2026-05-22T18:00:54.886981"
		}
		if training.UpdatedAt == "" {
			training.UpdatedAt = training.CreatedAt
		}

		if err := SaveTraining(training); err != nil {
			log.Printf("Error seeding training %q: %v\n", training.Title, err)
			continue
		}
		seeded++
	}

	if seeded > 0 {
		log.Printf("Seeded %d training(s) from %s\n", seeded, seedPath)
	}
}
