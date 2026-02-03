# ------------------------------------------------------------
# Stage 1: Git clone
# ------------------------------------------------------------
FROM sonarsource/sonar-scanner-cli AS code

ARG BUILD_ID
# We use ARG so the token is never saved in the image layers
ARG PAT_TOKEN 
LABEL stage=builder
LABEL build_id=$BUILD_ID

USER root

RUN mkdir -p /repo && chmod 755 /repo
WORKDIR /repo

# Updated to your CURRENT repository
# We use the variable ${PAT_TOKEN} which you pass during build time
RUN git clone -b main https://${PAT_TOKEN}@github.com/abhishekn4352/welcome-page.git repo_folder

# ------------------------------------------------------------
# Stage 2: Build React app
# ------------------------------------------------------------
FROM node:20-alpine AS builder

WORKDIR /app

# Updated paths to match the cloned 'repo_folder'
COPY --from=code /repo/repo_folder/package*.json ./

RUN npm ci

COPY --from=code /repo/repo_folder/ ./

RUN npm run build

# ------------------------------------------------------------
# Stage 3: Serve with Nginx
# ------------------------------------------------------------
FROM nginx:1.27-alpine AS runtime

# Lovable/Vite usually builds to 'dist', but some projects use 'build'
# Double check if your project uses 'dist' or 'build'
COPY --from=builder /app/dist /usr/share/nginx/html

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]