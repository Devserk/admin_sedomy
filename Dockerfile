# Utiliser l'image de base Node.js Alpine
FROM node:alpine

# Installer les dépendances nécessaires pour la compilation (si nécessaire)
RUN apk add --no-cache make gcc g++ python3

# Définir le répertoire de travail
WORKDIR /app

# Copier uniquement les fichiers package.json et package-lock.json
COPY package.json  ./

# Installer les dépendances
RUN npm install

# Installer Vite globalement
RUN npm install -g vite

# Exposer le port sur lequel l'application écoute
EXPOSE 10004

# Commande pour démarrer l'application
CMD ["vite", "dev"]
