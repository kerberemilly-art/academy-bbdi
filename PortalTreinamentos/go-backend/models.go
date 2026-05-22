package main

type AppState struct {
	ID               int    `json:"id"`
	UsersJSON        string `json:"users_json"`
	ResultsJSON      string `json:"results_json"`
	CertificatesJSON string `json:"certificates_json"`
	UpdatedAt        string `json:"updated_at"`
	TrainingsJSON    string `json:"trainings_json"`
}

type Training struct {
	ID                string `json:"id"`
	DepartmentID      string `json:"departmentId"`
	Title             string `json:"title"`
	Description       string `json:"description"`
	CreatedAt         string `json:"createdAt"`
	UpdatedAt         string `json:"updatedAt"`
	Status            string `json:"status"`
	ContentJSON       string `json:"content_json"`
	QuizQuestionsJSON string `json:"quiz_questions_json"`
	ModuleID          string `json:"moduleId"`
	ContentBlocksJSON string `json:"content_blocks_json"`
}

type GenericResponse struct {
	Ok    bool   `json:"ok"`
	Error string `json:"error,omitempty"`
}
