package main

import (
	"database/sql"
	"fmt"
	"log"
	"os"
	"path/filepath"

	_ "modernc.org/sqlite"
)

var db *sql.DB

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
			content_json TEXT NOT NULL DEFAULT '[]'
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
		"ALTER TABLE trainings ADD COLUMN module_id TEXT NOT NULL DEFAULT ''",
		"ALTER TABLE trainings ADD COLUMN content_blocks_json TEXT NOT NULL DEFAULT '[]'",
	}

	for _, query := range alterQueries {
		db.Exec(query)
	}

	fmt.Println("Database initialized successfully.")
}
