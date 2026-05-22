package main

import (
	"encoding/json"
	"net/http"
	"io"
)

// Placeholder for the AI endpoints to ensure the server compiles
// and basic routing works. Full Gemini/Groq translation can be expanded later.

func MentorHandler(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Content-Type", "application/json")
	// For now, return a placeholder response
	json.NewEncoder(w).Encode(map[string]interface{}{
		"ok": true,
		"mentor": map[string]interface{}{
			"message": "Sou o seu mentor em Go! (A integração completa com Gemini/Groq foi stubada para garantir a compilação do binário).",
		},
	})
}

func PdfExtractHandler(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Content-Type", "application/json")
	
	// Read and discard the body so the browser doesn't throw ERR_CONNECTION_RESET during fetch
	io.Copy(io.Discard, r.Body)
	r.Body.Close()
	
	departmentId := r.URL.Query().Get("departmentId")
	if departmentId == "" {
		http.Error(w, `{"ok":false,"error":"Informe o departamento do PDF."}`, http.StatusBadRequest)
		return
	}

	// For now, return a placeholder extraction to compile the binary
	json.NewEncoder(w).Encode(map[string]interface{}{
		"ok": true,
		"status": "organized",
		"suggestion": map[string]interface{}{
			"title": "Treinamento Gerado via Go",
			"description": "Este é um treinamento placeholder gerado pelo novo backend em Go.",
			"content": "Conteúdo extraído do PDF...",
			"keyPoints": []string{"Ponto 1", "Ponto 2"},
			"quizQuestions": []interface{}{},
		},
	})
}
