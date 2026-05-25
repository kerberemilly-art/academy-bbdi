# Stage 1: Build do Frontend (React)
FROM node:20-alpine AS frontend-builder
WORKDIR /app

# Copia e instala as dependências
COPY package*.json ./
RUN npm ci

# Copia o restante do código do frontend e faz o build
COPY . .
RUN npm run build

# Stage 2: Build do Backend (Go)
# Usando 1.23-alpine para maior estabilidade/compatibilidade
FROM golang:1.23-alpine AS backend-builder
WORKDIR /app

# Baixa as dependências do Go separadamente para otimizar o cache do Docker
COPY go-backend/go.mod go-backend/go.sum ./go-backend/
WORKDIR /app/go-backend
RUN go mod download

# Copia o código fonte do backend
WORKDIR /app
COPY go-backend/ ./go-backend/

# Copia o build do frontend para a pasta onde o Go fará o embutimento (//go:embed)
COPY --from=frontend-builder /app/dist /app/go-backend/dist

# Compila o binário otimizado para Linux
WORKDIR /app/go-backend
RUN go mod tidy
RUN CGO_ENABLED=0 GOOS=linux go build -ldflags="-w -s" -o portal-treinamentos .

# Stage 3: Imagem Final Leve (Produção)
FROM alpine:latest
# Define a raiz como /app para que caminhos relativos como ./data e ./uploads funcionem
WORKDIR /app

# Instala certificados e data/hora timezone
RUN apk --no-cache add ca-certificates tzdata

# Cria as pastas necessárias. O Go acessa "../data" se estiver em subpasta, 
# mas se rodarmos da raiz /app, ele acessará "./data". 
# Ajustamos o binário para rodar da raiz.
RUN mkdir -p /app/data /app/uploads

# Copia o binário final compilado do Stage 2
COPY --from=backend-builder /app/go-backend/portal-treinamentos /app/portal-treinamentos

# Garante que o binário seja executável
RUN chmod +x /app/portal-treinamentos

# Variáveis de Ambiente padrão
ENV PORT=8787

EXPOSE 8787

# Executa o servidor a partir da raiz /app
CMD ["./portal-treinamentos"]
