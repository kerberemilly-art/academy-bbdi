package main

import (
	"encoding/json"
	"log"
)

type FullState struct {
	Users        json.RawMessage `json:"users"`
	Results      json.RawMessage `json:"results"`
	Certificates json.RawMessage `json:"certificates"`
	Trainings    json.RawMessage `json:"trainings"`
}

func GetState() FullState {
	row := db.QueryRow("SELECT users_json, results_json, certificates_json, trainings_json FROM app_state WHERE id = 1")
	var usersJson, resultsJson, certsJson, trainingsJson string
	err := row.Scan(&usersJson, &resultsJson, &certsJson, &trainingsJson)
	
	if err != nil {
		usersJson, resultsJson, certsJson, trainingsJson = "[]", "[]", "[]", "[]"
	}

	return FullState{
		Users:        json.RawMessage(usersJson),
		Results:      json.RawMessage(resultsJson),
		Certificates: json.RawMessage(certsJson),
		Trainings:    json.RawMessage(trainingsJson),
	}
}

func SaveState(state FullState) FullState {
	query := `
		INSERT INTO app_state (id, users_json, results_json, certificates_json, trainings_json, updated_at)
		VALUES (1, ?, ?, ?, ?, datetime('now'))
		ON CONFLICT(id) DO UPDATE SET
			users_json = excluded.users_json,
			results_json = excluded.results_json,
			certificates_json = excluded.certificates_json,
			trainings_json = excluded.trainings_json,
			updated_at = excluded.updated_at
	`
	
	usersStr := string(state.Users)
	if usersStr == "" { usersStr = "[]" }
	resultsStr := string(state.Results)
	if resultsStr == "" { resultsStr = "[]" }
	certsStr := string(state.Certificates)
	if certsStr == "" { certsStr = "[]" }
	trainingsStr := string(state.Trainings)
	if trainingsStr == "" { trainingsStr = "[]" }

	_, err := db.Exec(query, usersStr, resultsStr, certsStr, trainingsStr)
	if err != nil {
		log.Printf("Error saving state: %v\n", err)
	}

	return GetState()
}
