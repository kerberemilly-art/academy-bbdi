package main

import (
	"database/sql"
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
	Level         string          `json:"level"`
	Content       json.RawMessage `json:"content"`
	QuizQuestions json.RawMessage `json:"quizQuestions"`
	ContentBlocks json.RawMessage `json:"contentBlocks"`
}

func GetTrainings() []TrainingPayload {
	rows, err := db.Query("SELECT id, department_id, title, description, created_at, updated_at, status, module_id, level, content, quiz_questions_json, content_blocks_json FROM trainings ORDER BY created_at ASC")
	if err != nil {
		log.Printf("Error getting trainings: %v\n", err)
		return []TrainingPayload{}
	}
	defer rows.Close()

	trainings := []TrainingPayload{}
	for rows.Next() {
		var t TrainingPayload
		var id, deptId, title, desc, createdAt, updatedAt, status, moduleId, level sql.NullString
		var content, quiz, blocks sql.NullString
		err := rows.Scan(&id, &deptId, &title, &desc, &createdAt, &updatedAt, &status, &moduleId, &level, &content, &quiz, &blocks)
		if err != nil {
			log.Printf("Scan error: %v", err)
			continue
		}
		
		t.ID = id.String
		t.DepartmentID = deptId.String
		t.Title = title.String
		t.Description = desc.String
		t.CreatedAt = createdAt.String
		t.UpdatedAt = updatedAt.String
		t.Status = status.String
		t.ModuleID = moduleId.String
		t.Level = level.String

		if t.CreatedAt == "" {
			t.CreatedAt = "2024-01-01T00:00:00Z"
		}
		if t.UpdatedAt == "" {
			t.UpdatedAt = t.CreatedAt
		}
		if t.Level == "" {
			t.Level = "basico"
		}

		contentStr := content.String
		if contentStr == "" { contentStr = `""` }
		quizStr := quiz.String
		if quizStr == "" { quizStr = "[]" }
		blocksStr := blocks.String
		if blocksStr == "" { blocksStr = "[]" }

		t.Content = json.RawMessage(contentStr)
		t.QuizQuestions = json.RawMessage(quizStr)
		t.ContentBlocks = json.RawMessage(blocksStr)
		trainings = append(trainings, t)
	}

	return trainings
}

func SaveTraining(t TrainingPayload) error {
	query := `
		INSERT INTO trainings (id, department_id, title, description, created_at, updated_at, status, module_id, level, content, quiz_questions_json, content_blocks_json)
		VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
		ON CONFLICT(id) DO UPDATE SET
			department_id = excluded.department_id,
			title = excluded.title,
			description = excluded.description,
			updated_at = excluded.updated_at,
			status = excluded.status,
			module_id = excluded.module_id,
			level = excluded.level,
			content = excluded.content,
			quiz_questions_json = excluded.quiz_questions_json,
			content_blocks_json = excluded.content_blocks_json
	`
	
	if t.Level == "" {
		t.Level = "basico"
	}
	if t.CreatedAt == "" {
		t.CreatedAt = "2024-01-01T00:00:00Z"
	}
	if t.UpdatedAt == "" {
		t.UpdatedAt = t.CreatedAt
	}

	contentStr := string(t.Content)
	if contentStr == "" { contentStr = `""` }
	quizStr := string(t.QuizQuestions)
	if quizStr == "" { quizStr = "[]" }
	blocksStr := string(t.ContentBlocks)
	if blocksStr == "" { blocksStr = "[]" }

	_, err := db.Exec(query,
		t.ID, t.DepartmentID, t.Title, t.Description, t.CreatedAt, t.UpdatedAt, t.Status, t.ModuleID, t.Level,
		contentStr, quizStr, blocksStr,
	)
	if err != nil {
		log.Printf("Error saving training: %v\n", err)
		return err
	}
	return nil
}

func DeleteTraining(id string) error {
	_, err := db.Exec("DELETE FROM trainings WHERE id = ?", id)
	return err
}
