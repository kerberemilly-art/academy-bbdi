package main

import (
	"encoding/json"
	"log"
)

type TrainingPayload struct {
	ID            string          `json:"id"`
	DepartmentID  string          `json:"departmentId"`
	Title         string          `json:"title"`
	Description   string          `json:"description"`
	CreatedAt     string          `json:"createdAt"`
	UpdatedAt     string          `json:"updatedAt"`
	Status        string          `json:"status"`
	ModuleID      string          `json:"moduleId"`
	Content       json.RawMessage `json:"content"`
	QuizQuestions json.RawMessage `json:"quizQuestions"`
	ContentBlocks json.RawMessage `json:"contentBlocks"`
}

func GetTrainings() []TrainingPayload {
	rows, err := db.Query("SELECT id, department_id, title, description, created_at, updated_at, status, module_id, content, quiz_questions_json, content_blocks_json FROM trainings ORDER BY created_at ASC")
	if err != nil {
		log.Printf("Error getting trainings: %v\n", err)
		return []TrainingPayload{}
	}
	defer rows.Close()

	trainings := []TrainingPayload{}
	for rows.Next() {
		var t TrainingPayload
		var content, quiz, blocks string
		err := rows.Scan(&t.ID, &t.DepartmentID, &t.Title, &t.Description, &t.CreatedAt, &t.UpdatedAt, &t.Status, &t.ModuleID, &content, &quiz, &blocks)
		if err != nil {
			continue
		}
		
		t.Content = json.RawMessage(content)
		t.QuizQuestions = json.RawMessage(quiz)
		t.ContentBlocks = json.RawMessage(blocks)
		trainings = append(trainings, t)
	}

	return trainings
}

func SaveTraining(t TrainingPayload) error {
	query := `
		INSERT INTO trainings (id, department_id, title, description, created_at, updated_at, status, module_id, content, quiz_questions_json, content_blocks_json)
		VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
		ON CONFLICT(id) DO UPDATE SET
			department_id = excluded.department_id,
			title = excluded.title,
			description = excluded.description,
			updated_at = excluded.updated_at,
			status = excluded.status,
			module_id = excluded.module_id,
			content = excluded.content,
			quiz_questions_json = excluded.quiz_questions_json,
			content_blocks_json = excluded.content_blocks_json
	`
	contentStr := string(t.Content)
	if contentStr == "" { contentStr = "[]" }
	quizStr := string(t.QuizQuestions)
	if quizStr == "" { quizStr = "[]" }
	blocksStr := string(t.ContentBlocks)
	if blocksStr == "" { blocksStr = "[]" }

	_, err := db.Exec(query, t.ID, t.DepartmentID, t.Title, t.Description, t.CreatedAt, t.UpdatedAt, t.Status, t.ModuleID, contentStr, quizStr, blocksStr)
	return err
}

func DeleteTraining(id string) error {
	_, err := db.Exec("DELETE FROM trainings WHERE id = ?", id)
	return err
}
