# Simball

> README-ul este disponibil și în engleză aici: [README.md](README.md)

Simball este un dicționar digital pentru simbolurile din literatura română. Scopul acestui proiect este de a crea un instrument care să ajute cercetătorii și studenții literaturii române să înțeleagă simbolurile folosite în poezii, romane etc.

## Setup

### Mediu

```bash
cp .env.example .env
```

Edită `.env` dacă este necesar, dar valorile implicite ar trebui să fie suficiente dacă folosiți fișierul `docker-compose.yml` furnizat.

### Bază de date

Baza de date este o bază de date PostgreSQL. Este folosită pentru a stoca simbolurile și definițiile lor. Folosim ORM-ul Drizzle pentru a interacționa cu baza de date.

Pentru a porni baza de date, rulați următorul comanda:

```bash
bun run db:start
```

Pentru a pune schema bazei de date în baza de date, rulați următoarea comandă:

```bash
bun run db:push
```

### Pornire

Pentru a porni aplicația, rulați următoarea comandă:

```bash
bun run dev
```