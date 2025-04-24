# Utiliser l'image de base Node.js
FROM node:latest

# Définir le répertoire de travail
WORKDIR /app

# Copier uniquement les fichiers package.json et package-lock.json
COPY package.json ./

# Installer les dépendances
RUN npm install

# Exposer le port sur lequel l'application écoute
EXPOSE 10004

# Commande pour démarrer l'application
CMD ["npm", "run", "dev"]
