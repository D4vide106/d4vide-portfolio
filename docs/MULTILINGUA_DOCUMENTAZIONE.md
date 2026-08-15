# Documentazione Tecnica Completa: Sistema Multilingua del Sito Web (D4VIDE Portfolio & Wiki)

## 📌 Indice Generale
1. [Panoramica dell'Architettura](#1-panoramica-dellarchitettura)
2. [Struttura dei File e Dipendenze](#2-struttura-dei-file-e-dipendenze)
3. [Supporto per le 8 Lingue Ufficiali](#3-supporto-per-le-8-lingue-ufficiali)
4. [Dizionari JSON (`src/dictionaries/`)](#4-dizionari-json-srcdictionaries)
5. [Contesto Globale React (`LanguageContext.tsx`)](#5-contesto-globale-react-languagecontexttsx)
6. [Algoritmo di Rilevamento Automatico della Lingua del Browser](#6-algoritmo-di-rilevamento-automatico-della-lingua-del-browser)
7. [Integrazione TopBar e Selettore a Tendina](#7-integrazione-topbar-e-selettore-a-tendina)
8. [Nomi Delle Lingue Dinamici e Tradotti](#8-nomi-delle-lingue-dinamici-e-tradotti)
9. [Persistenza e Notifiche Toast](#9-persistenza-e-notifiche-toast)
10. [Integrazione con la Sezione WIKI](#10-integrazione-con-la-sezione-wiki)
11. [Guida per lo Sviluppatore: Come Aggiungere Nuove Lingue o Chiavi](#11-guida-per-lo-sviluppatore-come-aggiungere-nuove-lingue-o-chiavi)

---

## 1. Panoramica dell'Architettura

Il sistema multilingua del sito web è progettato per offrire un'esperienza **zero-refresh** (senza ricaricare la pagina), estremamente veloce e completamente localizzata in **8 lingue diverse**.

Tutta la logica di stato risiede in un **React Context Client Provider** (`LanguageContext.tsx`) che avvolge l'intera applicazione Next.js. Questo garantisce che qualsiasi componente nel sito possa accedere alla lingua corrente e al dizionario corrispondente tramite il custom hook `useLanguage()`.

---

## 2. Struttura dei File e Dipendenze

```
src/
├── context/
│   └── LanguageContext.tsx      # Provider React per lo stato della lingua, rilevamento browser e salvataggio
├── dictionaries/
│   ├── index.ts                 # Export centralizzato dei dizionari e tipo TypeScript `Language`
│   ├── it.json                  # Dizionario Italiano (it)
│   ├── en.json                  # Dizionario Inglese (en)
│   ├── es.json                  # Dizionario Spagnolo (es)
│   ├── fr.json                  # Dizionario Francese (fr)
│   ├── de.json                  # Dizionario Tedesco (de)
│   ├── ja.json                  # Dizionario Giapponese (ja)
│   ├── ru.json                  # Dizionario Russo (ru)
│   └── pt.json                  # Dizionario Portoghese (pt)
├── components/
│   ├── TopBar.tsx               # Menu di navigazione con selettore lingue e bandiere SVG
│   ├── TopBar.module.css        # Stili CSS con menu scrollabile e bandiere vettoriali
│   ├── WikiSection.tsx          # Sezione Wiki con supporto per dizionari e selettore progetti
│   └── DraggableTerminal.tsx    # Terminale interattivo localizzato
docs/
└── MULTILINGUA_DOCUMENTAZIONE.md # Questa documentazione completa
```

---

## 3. Supporto per le 8 Lingue Ufficiali

Il sito supporta ufficialmente le seguenti 8 lingue:

| Codice ISO | Nome Nativo | Nome Italiano | Icona Bandiera |
|---|---|---|---|
| `it` | Italiano | Italiano | 🇮🇹 Vector SVG |
| `en` | English | Inglese | 🇬🇧 Vector SVG |
| `es` | Español | Spagnolo | 🇪🇸 Vector SVG |
| `fr` | Français | Francese | 🇫🇷 Vector SVG |
| `de` | Deutsch | Tedesco | 🇩🇪 Vector SVG |
| `ja` | 日本語 | Giapponese | 🇯🇵 Vector SVG |
| `ru` | Русский | Russo | 🇷🇺 Vector SVG |
| `pt` | Português | Portoghese | 🇵🇹 Vector SVG |

---

## 4. Dizionari JSON (`src/dictionaries/`)

Ogni lingua dispone di un file JSON dedicato con struttura speculare. Ecco un esempio della struttura chiavi contenuta in ogni file:

```json
{
  "nav": {
    "home": "Home",
    "projects": "PROGETTI",
    "wiki": "WIKI",
    "about": "CHI SONO",
    "media": "MEDIA",
    "community": "Community"
  },
  "languages": {
    "it": "Italiano",
    "en": "Inglese",
    "es": "Spagnolo",
    "fr": "Francese",
    "de": "Tedesco",
    "ja": "Giapponese",
    "ru": "Russo",
    "pt": "Portoghese"
  },
  "hero": {
    "greeting": "Ciao, sono",
    "role": "Content Creator & Minecraft Developer",
    "subText": "Creo modpack epici, plugin e contenuti Minecraft..."
  },
  "projects": {
    "title": "I MIEI PROGETTI E CREAZIONI",
    "searchPlaceholder": "Cerca progetti..."
  },
  "toast": {
    "langChanged": "Lingua impostata su Italiano"
  }
}
```

---

## 5. Contesto Globale React (`LanguageContext.tsx`)

Il file `src/context/LanguageContext.tsx` definisce il Provider e le seguenti API per i componenti:

```typescript
export interface LanguageContextType {
  lang: Language;                             // Codice lingua attivo (es. "it", "en")
  setLang: (lang: Language) => void;           // Funzione per cambiare lingua
  dict: typeof dictionaries.it;               // Oggetto dizionario completo della lingua attiva
  flagUrl: string;                            // URL dell'immagine SVG vettoriale della bandiera
}
```

### Utilizzo nei componenti:
```tsx
import { useLanguage } from "@/context/LanguageContext";

export default function MioComponente() {
  const { lang, setLang, dict, flagUrl } = useLanguage();

  return (
    <div>
      <h1>{dict.hero.greeting} D4VIDE106</h1>
      <button onClick={() => setLang("en")}>Switch to English</button>
    </div>
  );
}
```

---

## 6. Algoritmo di Rilevamento Automatico della Lingua del Browser

Quando un utente visita il sito per la prima volta (senza una preferenza precedentemente salvata in `localStorage`):

1. `LanguageContext` legge la proprietà `navigator.language` o `navigator.languages`.
2. Estrae il codice lingua a 2 lettere (es. `fr-FR` -> `fr`, `ja-JP` -> `ja`).
3. Se il codice estratto rientra tra le 8 lingue supportate (`it`, `en`, `es`, `fr`, `de`, `ja`, `ru`, `pt`), il sito si imposta **automaticamente** su quella lingua.
4. Se la lingua del browser non è tra le 8 supportate, viene utilizzato l'inglese (`en`) o l'italiano (`it`) come fallback di default.

---

## 7. Integrazione TopBar e Selettore a Tendina

Nel componente `TopBar.tsx`:
- Viene visualizzato il bottone della lingua attiva con la bandiera SVG vettoriale ad alta definizione (`24x16px`) e il nome della lingua.
- Cliccando sul bottone si apre il menu a tendina scrollabile con la lista di tutte e 8 le lingue.
- Ogni elemento della lista mostra la relativa bandiera SVG vettoriale e il nome della lingua localizzato.
- La preferenza utente viene salvata istantaneamente nel `localStorage` con la chiave `"portfolio_lang"`.

---

## 8. Nomi Delle Lingue Dinamici e Tradotti

Quando l'utente seleziona una lingua diversa, **anche i nomi delle altre lingue nel menu a tendina cambiano** per riflettere la lingua corrente dell'interfaccia.

Ad esempio:
- Se l'interfaccia è in **Italiano**: il menu mostra *Inglese*, *Spagnolo*, *Francese*, *Tedesco*, *Giapponese*, *Russo*, *Portoghese*.
- Se l'interfaccia è in **Inglese**: il menu mostra *English*, *Italian*, *Spanish*, *French*, *German*, *Japanese*, *Russian*, *Portuguese*.
- Se l'interfaccia è in **Giapponese**: il menu mostra *イタリア語*, *英語*, *スペイン語*, *フランス語*, *ドイツ語*, *日本語*, *ロシア語*, *ポルトガル語*.

---

## 9. Persistenza e Notifiche Toast

- **Salvataggio**: La scelta della lingua viene memorizzata in `localStorage.setItem("portfolio_lang", code)`.
- **Notifica Toast**: Ogni volta che la lingua viene cambiata o rilevata automaticamente, viene mostrata una notifica toast elegante e discreta in basso a destra con il messaggio nella nuova lingua.

---

## 10. Integrazione con la Sezione WIKI

La sezione WIKI (`/wiki`) e il relativo **Editor Markdown** sono integrati con il sistema multilingua:
- Le chiavi di navigazione `WIKI` nel menu principale si aggiornano automaticamente in base alla lingua selezionata.
- I titoli e le descrizioni dei progetti nel selettore a tendina della WIKI utilizzano le traduzioni del dizionario.

---

## 11. Guida per lo Sviluppatore: Come Aggiungere Nuove Lingue o Chiavi

### Aggiungere una nuova chiave di testo:
1. Apri tutti gli 8 file JSON in `src/dictionaries/` (`it.json`, `en.json`, `es.json`, `fr.json`, `de.json`, `ja.json`, `ru.json`, `pt.json`).
2. Aggiungi la nuova chiave nella sezione appropriata.
3. Utilizza `dict.sezione.nuovaChiave` all'interno dei componenti React.

### Aggiungere una nuova lingua (es. Cinese `zh`):
1. Crea il file `src/dictionaries/zh.json` inserendo tutte le traduzioni.
2. In `src/dictionaries/index.ts`:
   - Importa `zh.json`.
   - Aggiungi `"zh"` al tipo `Language`.
3. In `LanguageContext.tsx` e `TopBar.tsx`:
   - Aggiungi l'URL dell'icona SVG della bandiera e la configurazione della lingua.
