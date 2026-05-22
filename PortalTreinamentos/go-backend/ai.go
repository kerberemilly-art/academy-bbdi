package main

import (
	"bytes"
	"encoding/base64"
	"encoding/json"
	"fmt"
	"io"
	"net/http"
	"os"
	"regexp"
	"strings"
)

// Placeholder for the AI endpoints to ensure the server compiles
// and basic routing works. Full Gemini/Groq translation can be expanded later.

func MentorHandler(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Content-Type", "application/json")

	var body struct {
		Question      string                   `json:"question"`
		LessonContent string                   `json:"lessonContent"`
		History       []map[string]interface{} `json:"history"`
	}
	if err := json.NewDecoder(r.Body).Decode(&body); err != nil {
		http.Error(w, `{"ok":false,"error":"Payload inválido"}`, http.StatusBadRequest)
		return
	}

	question := strings.TrimSpace(body.Question)
	lessonContent := strings.TrimSpace(body.LessonContent)

	if question == "" {
		json.NewEncoder(w).Encode(map[string]interface{}{
			"ok":    false,
			"error": "Informe uma pergunta para o mentor.",
		})
		return
	}

	apiKey := os.Getenv("GROQ_API_KEY")
	if apiKey == "" {
		json.NewEncoder(w).Encode(map[string]interface{}{
			"ok":       true,
			"response": "Olá! Sou o seu mentor de estudos da BBDI. Atualmente a chave de API do Groq não está configurada no servidor, então estou respondendo de forma simulada. Que excelente dúvida você tem! O conteúdo desta aula detalha processos fundamentais e de alto valor prático para o seu departamento. Lembre-se de revisar os pontos principais e realizar o quiz ao final!",
		})
		return
	}

	apiUrl := os.Getenv("GROQ_CHAT_URL")
	if apiUrl == "" {
		apiUrl = "https://api.groq.com/openai/v1/chat/completions"
	}
	model := os.Getenv("GROQ_TRAINING_MODEL")
	if model == "" {
		model = "llama-3.3-70b-versatile"
	}

	systemContent := fmt.Sprintf(`Você é um mentor e assistente de estudos altamente didático para um portal de treinamentos corporativos da BBDI.
O aluno está lendo a seguinte aula:
---
%s
---
Responda de forma extremamente clara, amigável, incentivadora e profissional às dúvidas do aluno sobre esta aula ou tópicos técnicos relacionados. Responda em português de forma concisa e direta, usando formatação Markdown amigável.`, lessonContent)

	if lessonContent == "" {
		systemContent = strings.Replace(systemContent, "%s", "Sem conteúdo disponível no momento.", 1)
	}

	messages := []map[string]interface{}{
		{"role": "system", "content": systemContent},
	}

	for _, msg := range body.History {
		role, _ := msg["role"].(string)
		content, _ := msg["content"].(string)
		if role == "assistant" {
			role = "assistant"
		} else {
			role = "user"
		}
		if content != "" {
			messages = append(messages, map[string]interface{}{"role": role, "content": content})
		}
	}

	messages = append(messages, map[string]interface{}{"role": "user", "content": question})

	reqBody := map[string]interface{}{
		"model":       model,
		"messages":    messages,
		"temperature": 0.7,
		"max_tokens":  800,
	}

	jsonData, _ := json.Marshal(reqBody)
	req, err := http.NewRequest("POST", apiUrl, bytes.NewBuffer(jsonData))
	if err != nil {
		http.Error(w, `{"ok":false,"error":"Erro interno ao preparar requisição"}`, http.StatusInternalServerError)
		return
	}
	req.Header.Set("Authorization", "Bearer "+apiKey)
	req.Header.Set("Content-Type", "application/json")

	client := &http.Client{}
	resp, err := client.Do(req)
	if err != nil {
		json.NewEncoder(w).Encode(map[string]interface{}{
			"ok":    false,
			"error": "Falha na rede ao consultar a IA",
		})
		return
	}
	defer resp.Body.Close()

	if resp.StatusCode != http.StatusOK {
		bodyBytes, _ := io.ReadAll(resp.Body)
		json.NewEncoder(w).Encode(map[string]interface{}{
			"ok":    false,
			"error": fmt.Sprintf("A Groq falhou: status %d - %s", resp.StatusCode, string(bodyBytes)),
		})
		return
	}

	var groqResp struct {
		Choices []struct {
			Message struct {
				Content string `json:"content"`
			} `json:"message"`
		} `json:"choices"`
	}

	if err := json.NewDecoder(resp.Body).Decode(&groqResp); err != nil {
		json.NewEncoder(w).Encode(map[string]interface{}{
			"ok":    false,
			"error": "Erro ao interpretar resposta da IA",
		})
		return
	}

	if len(groqResp.Choices) == 0 {
		json.NewEncoder(w).Encode(map[string]interface{}{
			"ok":    false,
			"error": "A Groq não retornou texto válido",
		})
		return
	}

	json.NewEncoder(w).Encode(map[string]interface{}{
		"ok":       true,
		"response": groqResp.Choices[0].Message.Content,
	})
}

func PdfExtractHandler(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Content-Type", "application/json")

	departmentId := r.URL.Query().Get("departmentId")
	fileName := r.Header.Get("x-file-name")
	if fileName == "" {
		fileName = "documento.pdf"
	}

	if departmentId == "" {
		io.Copy(io.Discard, r.Body)
		r.Body.Close()
		http.Error(w, `{"ok":false,"error":"Informe o departamento do PDF."}`, http.StatusBadRequest)
		return
	}

	pdfBuffer, err := io.ReadAll(r.Body)
	r.Body.Close()
	if err != nil {
		http.Error(w, `{"ok":false,"error":"Erro ao ler o PDF."}`, http.StatusInternalServerError)
		return
	}

	if len(pdfBuffer) == 0 || len(pdfBuffer) > 15*1024*1024 {
		http.Error(w, `{"ok":false,"error":"O PDF precisa ter até 15 MB."}`, http.StatusBadRequest)
		return
	}

	// 1. Mistral OCR
	mistralKey := os.Getenv("MISTRAL_API_KEY")
	if mistralKey == "" {
		mistralKey = os.Getenv("PDF_EXTRACT_API_KEY")
	}
	if mistralKey == "" {
		json.NewEncoder(w).Encode(map[string]interface{}{
			"ok": true,
			"status": "configuration_missing",
			"suggestion": map[string]interface{}{
				"title": strings.TrimSuffix(fileName, ".pdf"),
				"description": "",
				"content": "",
				"keyPoints": []string{},
				"raw": map[string]interface{}{
					"message": "Configure MISTRAL_API_KEY no .env para ativar a leitura automática.",
				},
			},
		})
		return
	}

	ocrText, err := extractPdfWithMistral(pdfBuffer, mistralKey)
	if err != nil {
		json.NewEncoder(w).Encode(map[string]interface{}{
			"ok": false,
			"status": "failed",
			"error": fmt.Sprintf("A Mistral recusou o PDF: %v", err),
			"suggestion": map[string]interface{}{
				"title": fileName,
			},
		})
		return
	}

	// 2. Groq Organization
	groqKey := os.Getenv("GROQ_API_KEY")
	if groqKey == "" {
		json.NewEncoder(w).Encode(map[string]interface{}{
			"ok": true,
			"status": "skipped",
			"suggestion": map[string]interface{}{
				"title": fileName,
				"content": ocrText,
			},
		})
		return
	}

	organizedData, err := organizeTrainingWithGroq(ocrText, departmentId, fileName, groqKey)
	if err != nil {
		json.NewEncoder(w).Encode(map[string]interface{}{
			"ok": false,
			"status": "failed",
			"error": fmt.Sprintf("A Groq falhou ao estruturar: %v", err),
			"suggestion": map[string]interface{}{
				"title": fileName,
				"content": ocrText,
			},
		})
		return
	}

	json.NewEncoder(w).Encode(map[string]interface{}{
		"ok": true,
		"status": "organized",
		"suggestion": organizedData,
	})
}

func extractPdfWithMistral(pdfBuffer []byte, apiKey string) (string, error) {
	apiUrl := os.Getenv("MISTRAL_OCR_URL")
	if apiUrl == "" {
		apiUrl = "https://api.mistral.ai/v1/ocr"
	}
	model := os.Getenv("MISTRAL_OCR_MODEL")
	if model == "" {
		model = "mistral-ocr-latest"
	}

	base64Pdf := base64.StdEncoding.EncodeToString(pdfBuffer)
	
	reqBody := map[string]interface{}{
		"model": model,
		"document": map[string]interface{}{
			"type": "document_url",
			"document_url": "data:application/pdf;base64," + base64Pdf,
		},
		"include_image_base64": false,
		"table_format": "markdown",
	}
	
	jsonData, err := json.Marshal(reqBody)
	if err != nil {
		return "", err
	}

	req, err := http.NewRequest("POST", apiUrl, bytes.NewBuffer(jsonData))
	if err != nil {
		return "", err
	}
	req.Header.Set("Authorization", "Bearer "+apiKey)
	req.Header.Set("Content-Type", "application/json")

	client := &http.Client{}
	resp, err := client.Do(req)
	if err != nil {
		return "", err
	}
	defer resp.Body.Close()

	if resp.StatusCode != http.StatusOK {
		bodyBytes, _ := io.ReadAll(resp.Body)
		return "", fmt.Errorf("status %d: %s", resp.StatusCode, string(bodyBytes))
	}

	var mistralResp struct {
		Pages []struct {
			Markdown string `json:"markdown"`
		} `json:"pages"`
		Text string `json:"text"`
		Content string `json:"content"`
	}

	if err := json.NewDecoder(resp.Body).Decode(&mistralResp); err != nil {
		return "", err
	}

	var textBuilder strings.Builder
	for _, page := range mistralResp.Pages {
		if page.Markdown != "" {
			textBuilder.WriteString(page.Markdown)
			textBuilder.WriteString("\n\n")
		}
	}

	text := textBuilder.String()
	if text == "" {
		text = mistralResp.Text
	}
	if text == "" {
		text = mistralResp.Content
	}

	return text, nil
}

func organizeTrainingWithGroq(ocrText, departmentId, fileName, apiKey string) (map[string]interface{}, error) {
	apiUrl := os.Getenv("GROQ_CHAT_URL")
	if apiUrl == "" {
		apiUrl = "https://api.groq.com/openai/v1/chat/completions"
	}
	model := os.Getenv("GROQ_TRAINING_MODEL")
	if model == "" {
		model = "llama-3.3-70b-versatile"
	}

	systemPrompt := `Você é um especialista em design instrucional e treinamento corporativo de alto impacto.
Seu objetivo é organizar conteúdos internos técnicos em materiais de estudo extremamente didáticos, visualmente atraentes e profissionais (em português do Brasil).
Responda estritamente com um objeto JSON válido seguindo o esquema solicitado.
Diretrizes de formatação estética e conteúdo:
1. Título: Crie um título profissional, claro e motivador.
2. Descrição: Resumo curto (até 300 caracteres) em markdown simples, usando termos em negrito para destacar os objetivos de aprendizado.
3. Conteúdo das Seções (sections): Divida em 3 a 5 seções lógicas. Para cada seção, forneça um título claro ("title") e um array de itens ("items") com explicações ricas em Markdown. Use emojis temáticos, termos em negrito para novos conceitos, e destaque pontos cruciais ou alertas importantes usando blocos de citação (ex: "> 💡 **Dica:** ..." ou "> ⚠️ **Importante:** ...") para tornar a leitura dinâmica e agradável.
4. Pontos-chave (keyPoints): Forneça de 3 a 5 insights práticos ou regras cruciais de fácil memorização, usando negrito e emojis relevantes.
5. Quiz de Revisão (quizQuestions): Inclua obrigatoriamente exatamente 10 perguntas de quiz robustas, inteligentes e bem variadas com base em todo o conteúdo técnico e informações extraídas do PDF original. Nenhuma pergunta deve ser idêntica ou repetida e cada uma deve focar em um aspecto técnico, compatibilidade ou detalhe diferente apresentado no texto. Cada pergunta deve conter "question", "options" (exatamente 4 alternativas bem formuladas), "answerIndex" (0 a 3) e uma explicação didática e clara em "explanation" justificando a resposta correta.
Atenção técnica: Seja 100% fiel às informações extraídas do documento original (voltagens, pinagens, compatibilidades). Nunca invente dados falsos ou códigos técnicos que não estejam no PDF.`

	expectedSchema := map[string]interface{}{
		"title": "string",
		"description": "string com ate 300 caracteres, em markdown com termos em negrito",
		"sections": []map[string]interface{}{
			{"title": "string", "items": []string{"string contendo rico conteudo em markdown (negritos, emojis, blocos de citacao >)"}},
		},
		"keyPoints": []string{"string com negrito e emojis"},
		"quizQuestions": []map[string]interface{}{
			{
				"question": "Primeira pergunta técnica baseada no PDF original",
				"options": []string{"Alternativa 1", "Alternativa 2", "Alternativa 3", "Alternativa 4"},
				"answerIndex": 0,
				"explanation": "Explicação detalhada e amigável da resposta 1",
			},
		},
	}

	userContentBytes, _ := json.Marshal(map[string]interface{}{
		"departmentId": departmentId,
		"fileName": fileName,
		"expectedSchema": expectedSchema,
		// Limitar o texto enviado para não estourar o limite de tokens da Groq (aprox. 30k caracteres = ~8k tokens)
		"ocrText": compactTrainingText(ocrText),
	})

	reqBody := map[string]interface{}{
		"model": model,
		"temperature": 0.2,
		"max_completion_tokens": 4000,
		"response_format": map[string]interface{}{"type": "json_object"},
		"messages": []map[string]interface{}{
			{
				"role": "system",
				"content": systemPrompt,
			},
			{
				"role": "user",
				"content": string(userContentBytes),
			},
		},
	}

	jsonData, _ := json.Marshal(reqBody)

	req, err := http.NewRequest("POST", apiUrl, bytes.NewBuffer(jsonData))
	if err != nil {
		return nil, err
	}
	req.Header.Set("Authorization", "Bearer "+apiKey)
	req.Header.Set("Content-Type", "application/json")

	client := &http.Client{}
	resp, err := client.Do(req)
	if err != nil {
		return nil, err
	}
	defer resp.Body.Close()

	if resp.StatusCode != http.StatusOK {
		bodyBytes, _ := io.ReadAll(resp.Body)
		return nil, fmt.Errorf("status %d: %s", resp.StatusCode, string(bodyBytes))
	}

	var groqResp struct {
		Choices []struct {
			Message struct {
				Content string `json:"content"`
			} `json:"message"`
		} `json:"choices"`
	}

	if err := json.NewDecoder(resp.Body).Decode(&groqResp); err != nil {
		return nil, err
	}

	if len(groqResp.Choices) == 0 {
		return nil, fmt.Errorf("A Groq retornou 0 choices")
	}

	content := groqResp.Choices[0].Message.Content
	
	// Limpar possíveis markdown tags ao redor do json se houver
	content = strings.TrimSpace(content)
	if strings.HasPrefix(content, "```json") {
		content = strings.TrimPrefix(content, "```json")
		content = strings.TrimSuffix(content, "```")
	} else if strings.HasPrefix(content, "```") {
		content = strings.TrimPrefix(content, "```")
		content = strings.TrimSuffix(content, "```")
	}
	
	var finalJSON map[string]interface{}
	if err := json.Unmarshal([]byte(content), &finalJSON); err != nil {
		return nil, fmt.Errorf("Erro ao parsear JSON da Groq: %v. Raw: %s", err, content)
	}

	// Remontar a property "content" baseada nas sections se existir
	if sections, ok := finalJSON["sections"].([]interface{}); ok && len(sections) > 0 {
		var contentBuilder strings.Builder
		for _, s := range sections {
			section, ok := s.(map[string]interface{})
			if !ok { continue }
			title, _ := section["title"].(string)
			items, _ := section["items"].([]interface{})
			
			contentBuilder.WriteString("## " + title + "\n\n")
			for _, i := range items {
				itemStr, _ := i.(string)
				contentBuilder.WriteString(itemStr + "\n\n")
			}
		}
		finalJSON["content"] = contentBuilder.String()
	} else {
		finalJSON["content"] = ocrText
	}

	return finalJSON, nil
}

var consecutiveWhitespace = regexp.MustCompile(`\s+`)
func compactTrainingText(text string) string {
	if len(text) > 40000 {
		text = text[:40000] // limite de segurança para a Groq não dar erro de context length
	}
	return consecutiveWhitespace.ReplaceAllString(text, " ")
}
