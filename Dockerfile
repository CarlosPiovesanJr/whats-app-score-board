# Etapa 1: build do app
FROM node:18-alpine as build

WORKDIR /app

# Copia apenas os arquivos necessários para instalar dependências primeiro (melhor cache)
COPY package.json package-lock.json ./
RUN npm ci --legacy-peer-deps

# Agora copia o restante do código
COPY . .

# Build do projeto React
RUN npm run build

# Etapa 2: servidor com Caddy
FROM caddy:2.8.4-alpine

# Diretório de trabalho padrão do Caddy
WORKDIR /usr/share/caddy

# Copia o build gerado para o diretório público do Caddy
COPY --from=build /app/dist ./dist

# Copia um Caddyfile personalizado (você pode criar abaixo)
COPY Caddyfile /etc/caddy/Caddyfile

# Expõe a porta padrão do Caddy
EXPOSE 80

CMD ["caddy", "run", "--config", "/etc/caddy/Caddyfile", "--adapter", "caddyfile"]