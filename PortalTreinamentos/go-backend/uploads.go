package main

import (
	"crypto/rand"
	"encoding/hex"
	"encoding/json"
	"fmt"
	"io"
	"net/http"
	"os"
	"path/filepath"
	"strings"
)

func createID(prefix string) string {
	b := make([]byte, 4)
	rand.Read(b)
	return fmt.Sprintf("%s_%s", prefix, hex.EncodeToString(b))
}

func sanitizeImageFileName(name string) string {
	if name == "" {
		return ""
	}
	// simplified sanitization
	return strings.ReplaceAll(name, "/", "")
}

func getImageExtension(contentType, originalName string) string {
	if strings.Contains(contentType, "png") || strings.HasSuffix(originalName, ".png") {
		return "png"
	}
	if strings.Contains(contentType, "webp") || strings.HasSuffix(originalName, ".webp") {
		return "webp"
	}
	if strings.Contains(contentType, "gif") || strings.HasSuffix(originalName, ".gif") {
		return "gif"
	}
	return "jpg"
}

func UploadAsset(w http.ResponseWriter, r *http.Request) {
	contentType := r.Header.Get("Content-Type")
	originalName := sanitizeImageFileName(r.Header.Get("X-File-Name"))

	if !strings.HasPrefix(contentType, "image/") {
		http.Error(w, `{"ok":false,"error":"Envie uma imagem válida."}`, http.StatusBadRequest)
		return
	}

	body, err := io.ReadAll(io.LimitReader(r.Body, 5*1024*1024)) // 5MB limit
	if err != nil || len(body) == 0 {
		http.Error(w, `{"ok":false,"error":"A imagem precisa ter até 5 MB."}`, http.StatusBadRequest)
		return
	}

	extension := getImageExtension(contentType, originalName)
	
	baseName := "imagem-treinamento"
	if originalName != "" {
		parts := strings.Split(originalName, ".")
		if len(parts) > 0 {
			baseName = parts[0]
		}
	}

	storedFileName := fmt.Sprintf("%s-%s.%s", createID("asset"), baseName, extension)
	filePath := filepath.Join("..", "uploads", storedFileName)

	if err := os.WriteFile(filePath, body, 0644); err != nil {
		http.Error(w, `{"ok":false,"error":"Erro ao salvar a imagem."}`, http.StatusInternalServerError)
		return
	}

	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(http.StatusCreated)
	
	json.NewEncoder(w).Encode(map[string]interface{}{
		"ok": true,
		"asset": map[string]string{
			"fileName": storedFileName,
			"url":      "/uploads/" + storedFileName,
		},
	})
}
