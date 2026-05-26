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
FROM golang:1.25-alpine AS backend-builder
WORKDIR /app

# Copia as dependências Go vendorizadas para evitar download de módulos durante o deploy
COPY go-backend/go.mod go-backend/go.sum ./go-backend/
COPY go-backend/vendor ./go-backend/vendor
WORKDIR /app/go-backend

# Copia o código fonte do backend
WORKDIR /app
COPY go-backend/ ./go-backend/

# Copia o build do frontend para a pasta onde o Go fará o embutimento (//go:embed)
COPY --from=frontend-builder /app/dist /app/go-backend/dist

# Compila o binário otimizado para Linux usando as dependências vendorizadas
WORKDIR /app/go-backend
RUN CGO_ENABLED=0 GOOS=linux go build -mod=vendor -ldflags="-w -s" -o portal-treinamentos .

# Stage 3: Imagem Final Leve (Produção)
FROM alpine:latest
WORKDIR /app/go-backend

# Instala certificados e data/hora timezone
RUN apk --no-cache add ca-certificates tzdata

# Cria as pastas necessárias na raiz do app para manter a arquitetura (o Go acessa "../data" e "../uploads")
RUN mkdir -p /app/data /app/uploads

# Copia o binário final compilado do Stage 2
COPY --from=backend-builder /app/go-backend/portal-treinamentos .

# Variáveis de Ambiente padrão
ENV PORT=8787

EXPOSE 8787

# Executa o servidor
CMD ["./portal-treinamentos"]
