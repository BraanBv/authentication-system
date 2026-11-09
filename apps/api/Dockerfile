
# Etapa 1: Construcción
FROM node:22-alpine AS builder

ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"

RUN corepack enable && corepack prepare pnpm@12.18.0 --activate

WORKDIR /app

# Copiar archivos de configuración del workspace
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./

# Copiar package.json de la API
COPY apps/api/package.json ./apps/api/package.json

# Instalar TODAS las dependencias, incluyendo devDependencies
RUN --mount=type=cache,id=pnpm,target=/pnpm/store \
    pnpm install --frozen-lockfile --prod=false

# Copiar el código fuente
COPY . .

# Verificar que TypeScript esté instalado
RUN pnpm --filter api exec tsc --version

# Compilar API
RUN pnpm --filter api run build

# Preparar dependencias de producción
RUN pnpm --filter api --prod deploy /prod/api


# Etapa 2: Producción
FROM node:22-alpine AS runner

WORKDIR /app

ENV CI=true

COPY --from=builder /prod/api .

EXPOSE 3000

CMD ["pnpm", "start"]
