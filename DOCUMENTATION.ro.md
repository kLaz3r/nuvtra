# Documentație NUVTRA

## Cuprins

1. [Prezentare Generală](#prezentare-generală)
2. [Funcționalități](#funcționalități)
3. [Arhitectură Tehnică](#arhitectură-tehnică)
4. [Configurare Dezvoltare](#configurare-dezvoltare)
5. [Gestionare Bază de Date](#gestionare-bază-de-date)
6. [Documentație API](#documentație-api)
7. [Structura Proiectului](#structura-proiectului)
8. [Flux de Dezvoltare](#flux-de-dezvoltare)
9. [Implementare](#implementare)
10. [Depanare](#depanare)

## Prezentare Generală

NUVTRA este o platformă modernă de social media construită cu tehnologii de ultimă generație. Oferă o experiență fluidă utilizatorilor pentru a se conecta, a împărtăși conținut și a interacționa cu alții în timp real.

## Funcționalități

### Gestionare Utilizatori

- **Autentificare**

  - Înregistrare și autentificare securizată prin Clerk
  - Opțiuni de autentificare prin rețele sociale
  - Funcționalitate de resetare parolă
  - Verificare email

- **Gestionare Profil**
  - Profiluri personalizabile
  - Încărcare poze de profil
  - Bio și informații personale
  - Setări cont
  - Controale de confidențialitate

### Funcționalități Sociale

- **Postări**

  - Creare postări text și media
  - Formatare text avansată
  - Încărcare imagini și video
  - Setări de confidențialitate pentru postări
  - Editare și ștergere postări

- **Interacțiuni**

  - Aprecieri și retrageri aprecieri
  - Comentarii la postări
  - Răspunsuri la comentarii
  - Distribuire postări
  - Urmărire/Dezabonare utilizatori

- **Notificări**
  - Notificări în timp real
  - Notificări aprecieri
  - Notificări comentarii
  - Alerte noi urmăritori
  - Preferințe notificări personalizate

### Căutare și Descoperire

- **Funcționalitate Căutare**

  - Căutare utilizatori
  - Căutare postări
  - Filtre avansate
  - Istoric căutări

- **Feed**
  - Feed personalizat
  - Postări populare
  - Feed urmăritori
  - Pagină explorare

## Arhitectură Tehnică

### Frontend

- **Framework**: Next.js 15
- **Limbaj**: TypeScript
- **Componente UI**:
  - Tailwind CSS
  - shadcn/ui
  - Componente personalizate
- **Gestionare Stare**: React Context + Server Components
- **Actualizări Timp Real**: Server-Sent Events

### Backend

- **Rute API**: Next.js API Routes
- **Bază de Date**: PostgreSQL
- **ORM**: Drizzle
- **Autentificare**: Clerk
- **Stocare Fișiere**: UploadThing
- **Caching**: React Query

## Configurare Dezvoltare

### Cerințe Preliminare

1. Node.js 18 sau mai nou
2. Manager de pachete pnpm
3. Bază de date PostgreSQL
4. Git

### Configurare Mediu

1. Clonare repository:

```bash
git clone https://github.com/klaz3r/nuvtra.git
cd nuvtra
```

2. Creare fișier mediu:

```bash
cp .env.example .env
```

3. Configurare variabile mediu:

```env
# Bază de Date
POSTGRES_URL=postgresql://postgres:password@localhost:5432/nuvtra

# Autentificare
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=cheia_clerk
CLERK_SECRET_KEY=cheia_secretă_clerk

# Încărcare Fișiere
UPLOADTHING_SECRET=cheia_secretă_uploadthing
UPLOADTHING_APP_ID=id_aplicație_uploadthing

# Mediu
NODE_ENV=development
```

### Instalare

1. Instalare dependențe:

```bash
pnpm install
```

2. Pornire bază de date:

```bash
./start-database.sh
```

3. Inițializare bază de date:

```bash
pnpm db:generate
pnpm db:push
```

4. Pornire server dezvoltare:

```bash
pnpm dev
```

## Gestionare Bază de Date

### Prezentare Schema

#### Tabel Utilizatori

```sql
CREATE TABLE nuvtra_user (
  id TEXT PRIMARY KEY,
  username TEXT UNIQUE,
  email TEXT UNIQUE,
  bio TEXT,
  avatar_url TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

#### Tabel Postări

```sql
CREATE TABLE nuvtra_post (
  id TEXT PRIMARY KEY,
  user_id TEXT REFERENCES nuvtra_user(id),
  content TEXT,
  media_url TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### Comenzi Bază de Date

- Generare migrări:

```bash
pnpm db:generate
```

- Aplicare modificări schema:

```bash
pnpm db:push
```

- Deschidere Drizzle Studio:

```bash
pnpm db:studio
```

## Documentație API

### Endpoint-uri Autentificare

#### Creare Utilizator

```http
POST /api/users/create
Content-Type: application/json

{
  "username": "string",
  "email": "string",
  "password": "string"
}
```

#### Actualizare Utilizator

```http
POST /api/users/update
Content-Type: application/json

{
  "bio": "string",
  "avatar_url": "string"
}
```

### Endpoint-uri Postări

#### Creare Postare

```http
POST /api/posts/create
Content-Type: application/json

{
  "content": "string",
  "media_url": "string"
}
```

#### Obținere Postări

```http
GET /api/posts/get?page=1&limit=10
```

### Endpoint-uri Comentarii

#### Creare Comentariu

```http
POST /api/comments/create
Content-Type: application/json

{
  "post_id": "string",
  "content": "string"
}
```

## Structura Proiectului

```
nuvtra/
├── src/
│   ├── app/                 # Pagini Next.js app router
│   ├── components/          # Componente React
│   ├── server/
│   │   └── db/             # Configurare bază de date
│   ├── styles/             # Stiluri globale
│   └── lib/                # Funcții utilitare
├── drizzle/                # Fișiere migrare bază de date
├── public/                 # Resurse statice
└── tests/                  # Fișiere test
```

## Flux de Dezvoltare

### Scripturi Disponibile

- **Dezvoltare**

  ```bash
  pnpm dev          # Pornire server dezvoltare
  pnpm check        # Verificare tipuri
  pnpm lint         # Rulare ESLint
  ```

- **Bază de Date**

  ```bash
  pnpm db:generate  # Generare migrări
  pnpm db:push      # Aplicare modificări schema
  pnpm db:studio    # Deschidere Drizzle Studio
  ```

- **Build & Implementare**
  ```bash
  pnpm build        # Build pentru producție
  pnpm start        # Pornire server producție
  ```

## Implementare

### Build Producție

1. Build aplicație:

```bash
pnpm build
```

2. Pornire server producție:

```bash
pnpm start
```

### Variabile Mediu

Asigurați-vă că toate variabilele de mediu necesare sunt setate în mediul de producție:

```env
POSTGRES_URL=url_bază_date_producție
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=cheia_clerk_producție
CLERK_SECRET_KEY=cheia_secretă_clerk_producție
UPLOADTHING_SECRET=cheia_secretă_uploadthing_producție
UPLOADTHING_APP_ID=id_aplicație_uploadthing_producție
NODE_ENV=production
```
