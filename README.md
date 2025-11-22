# Family TODO App

A simple synchronized todo app for families with React, TypeScript and Firebase

## Features

- ✅ Email/Passwort Authentifizierung
- ✅ Echtzeit-Synchronisation zwischen allen Geräten
- ✅ Aufgaben hinzufügen, abhaken, löschen
- ✅ Anzeige wer die Aufgabe erstellt hat
- ✅ Responsive Design für Android, iOS, macOS
- ✅ Kostenloser Betrieb über GitHub Pages + Firebase

## Setup

### 1. Firebase-Projekt erstellen

1. Gehe zu https://console.firebase.google.com
2. Erstelle ein neues Projekt
3. Aktiviere **Firestore Database** (starte im Test-Modus)
4. Aktiviere **Authentication** > Email/Password
5. Gehe zu Projekteinstellungen > Allgemein
6. Scrolle zu "Deine Apps" und klicke auf Web-Symbol (</>)
7. Kopiere die Firebase-Konfiguration

### 2. Firebase-Config eintragen

Öffne `src/firebase.ts` und ersetze die Platzhalter:

```typescript
const firebaseConfig = {
  apiKey: "AIzaSy...",           // Von Firebase kopieren
  authDomain: "dein-projekt.firebaseapp.com",
  projectId: "dein-projekt",
  storageBucket: "dein-projekt.appspot.com",
  messagingSenderId: "123456789",
  appId: "1:123456789:web:..."
};
```

### 3. Firestore Security Rules

In Firebase Console unter **Firestore Database** > **Rules**:

```
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /todos/{todoId} {
      allow read, write: if request.auth != null;
    }
  }
}
```

### 4. Lokal testen

```bash
npm install
npm run dev
```

Die App läuft auf http://localhost:5173

### 5. Auf GitHub Pages deployen

```bash
# 1. Repository auf GitHub erstellen
# 2. In package.json die homepage URL anpassen:
#    "homepage": "https://deinusername.github.io/family-todo-app"
# 3. In vite.config.ts den base Pfad anpassen:
#    base: '/family-todo-app/'

# 4. Deployen
git init
git add .
git commit -m "Initial commit"
git remote add origin https://github.com/deinusername/family-todo-app.git
git push -u origin main

npm run deploy
```

## Projektstruktur

```
family-todo-app/
├── src/
│   ├── App.tsx          # Hauptkomponente mit Login & To-Do-Logik
│   ├── App.css          # Styling
│   ├── main.tsx         # React Einstiegspunkt
│   ├── firebase.ts      # Firebase Konfiguration
│   └── types.ts         # TypeScript Interfaces
├── index.html
├── package.json
├── vite.config.ts
└── tsconfig.json
```

## Kosten

- **GitHub Pages:** Kostenlos
- **Firebase (Spark Plan):** Kostenlos für kleine Nutzung
  - 20.000 Schreibvorgänge/Tag
  - 50.000 Lesevorgänge/Tag
  - Mehr als ausreichend für Familienprojekte

## Technologie-Stack

- React 18 mit TypeScript
- Firebase Authentication (Email/Passwort)
- Cloud Firestore (NoSQL-Datenbank mit Echtzeit-Sync)
- Vite (Build Tool)
- GitHub Pages (Hosting)
