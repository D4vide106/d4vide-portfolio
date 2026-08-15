# 🌐 Documentazione Completa del Sistema Multilingua (i18n)

Questa documentazione descrive in modo esaustivo l'architettura, il funzionamento interno e tutti i componenti coinvolti nel sistema di internazionalizzazione (i18n) del portfolio **D4VIDE106**.

---

## 📌 1. Panoramica dell'Architettura

Il sistema multilingua è stato progettato per garantire **cambi di lingua istantanei a 0ms lato client senza mai ricaricare la pagina** (nessun refresh del browser, nessuna mutazione dell'URL tipo `/en#hero` o parametri query).

### 🌍 Lingue Supportate (8 Lingue Complete):
1. 🇮🇹 **Italiano** (`it`)
2. 🇬🇧 **Inglese** (`en`) — *Lingua di Fallback Predefinita*
3. 🇪🇸 **Spagnolo** (`es`)
4. 🇫🇷 **Francese** (`fr`)
5. 🇩🇪 **Tedesco** (`de`)
6. 🇯🇵 **Giapponese** (`ja`)
7. 🇷🇺 **Russo** (`ru`)
8. 🇵🇹 **Portoghese** (`pt`)

---

## 📁 2. Struttura dei File

```text
d4vide-portfolio/
├── docs/
│   └── MULTILINGUA.md                   <-- (Questo file di documentazione)
├── src/
│   ├── context/
│   │   ├── LanguageContext.tsx          <-- Provider di stato globale della lingua + Auto-detection + Toast
│   │   └── LanguageToast.module.css     <-- Stili grafici della notifica toast di rilevamento
│   ├── dictionaries/
│   │   ├── index.ts                     <-- Re-export dei dizionari, tipo TypeScript Language e funzione getDictionarySync
│   │   ├── it.json                      <-- Dizionario Italiano
│   │   ├── en.json                      <-- Dizionario Inglese
│   │   ├── es.json                      <-- Dizionario Spagnolo
│   │   ├── fr.json                      <-- Dizionario Francese
│   │   ├── de.json                      <-- Dizionario Tedesco
│   │   ├── ja.json                      <-- Dizionario Giapponese
│   │   ├── ru.json                      <-- Dizionario Russo
│   │   └── pt.json                      <-- Dizionario Portoghese
│   ├── components/
│   │   ├── TopBar.tsx                   <-- Menu in alto con selettore lingue e nomi lingue dinamici
│   │   ├── Hero.tsx                     <-- Sezione Hero con ruoli e tag tradotti
│   │   ├── Projects.tsx                 <-- Progetti, modali, filtri e descrizioni tradotte
│   │   ├── DraggableTerminal.tsx        <-- Terminale interattivo con banner e comandi tradotti
│   │   ├── TotalDownloads.tsx           <-- Titoli e metriche delle piattaforme
│   │   └── Footer.tsx                   <-- Footer e crediti
```

---

## 🛠️ 3. Il Cuore dello Stato: `LanguageContext.tsx`

`LanguageContext.tsx` fornisce l'hook `useLanguage()`, utilizzato da tutti i componenti del sito per accedere alla lingua attiva (`lang`), al dizionario corrente (`dict`) e alla funzione di cambio lingua (`setLang`).

### 🔍 Rilevamento Automatico della Lingua del Browser:
Quando un utente visita il sito per la prima volta:
1. **Controllo `localStorage`**: Se l'utente ha precedentemente selezionato una lingua, viene caricata la preferenza salvata nella chiave `portfolio_lang`.
2. **Auto-detection `navigator.language`**: Se non c'è una preferenza salvata, il sistema legge la lingua del browser dell'utente (es. `fr-FR`, `de-DE`, `ja-JP`, `ru-RU`, `pt-BR`, `it-IT`, `es-ES`, `en-US`).
3. **Notifica Toast**: Mostra un messaggio di benvenuto nell'angolo in basso a destra (es. *"Langue réglée sur le Français (détectée du navigateur)"* o *"Language set to English (detected from browser)"*).
4. **Fallback all'Inglese**: Se la lingua del browser non rientra tra le 8 supportate (es. Cinese, Arabo, Olandese), il sito si imposta automaticamente su **Inglese (`en`)** mostrando la notifica di fallback.

---

## 🎨 4. Sistema di Bandiere Vettoriali In-Memory (SVG Data URLs)

### ⚠️ Il Problema di GitHub Pages con File Locali:
Le immagini locali posizionate in `/flags/it.png` o `/flags/gb.svg` causavano errori HTTP **404 (Not Found)** quando il sito veniva ospitato sotto una sotto-cartella di GitHub Pages (es. `https://d4vide106.github.io/d4vide-portfolio/`), poiché il browser cercava le immagini alla radice del dominio anziché nel sotto-percorso.

### 💡 La Soluzione Definitiva:
Tutte le 8 bandiere sono codificate come **Vector SVG Data URLs** direttamente all'interno del codice TypeScript in `LanguageContext.tsx` e `TopBar.tsx`:

```typescript
const FLAG_URLS: Record<Language, string> = {
  it: `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 3 2">...</svg>`,
  en: `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 60 30">...</svg>`,
  es: `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 3 2">...</svg>`,
  fr: `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 3 2">...</svg>`,
  de: `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 5 3">...</svg>`,
  ja: `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 3 2">...</svg>`,
  ru: `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 3 2">...</svg>`,
  pt: `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 3 2">...</svg>`,
};
```

**Vantaggi**:
- **0 chiamate di rete HTTP**.
- **Caricamento istantaneo in-memory** (nessun sfarfallio o ritardo nell'icona).
- **Compatibilità 100%** con qualsiasi dominio, sottodominio o sotto-cartella di hosting.

---

## 🔄 5. Traduzione Dinamica dei Nomi delle Lingue

Nel menu a tendina della `TopBar`, i nomi delle lingue stesse si traducono nella lingua correntemente attiva per facilitare la comprensione da parte dell'utente:

| Lingua Selezionata | Italiano | Inglese | Spagnolo | Francese | Tedesco | Giapponese | Russo | Portoghese |
|---|---|---|---|---|---|---|---|---|
| **In Italiano (`it`)** | **Italiano** | Inglese | Spagnolo | Francese | Tedesco | Giapponese | Russo | Portoghese |
| **In Inglese (`en`)** | **Italian** | English | Spanish | French | German | Japanese | Russian | Portuguese |
| **In Spagnolo (`es`)** | **Italiano** | Inglés | Español | Francés | Alemán | Japonés | Ruso | Portugués |
| **In Giapponese (`ja`)** | **イタリア語** | 英語 | スペイン語 | フランス語 | ドイツ語 | 日本語 | ロシア語 | ポルトガル語 |

Tutti i nomi sono definiti nella sezione `"languages"` di ciascun file `.json` ed estratti dinamico via `getLangName(item)`.

---

## 📦 6. Componenti del Sito Modificati (Tutto Ciò che Tocca)

### 1. `TopBar.tsx` & `TopBar.module.css`
- Menu di navigazione (`WORKS`, `ABOUT`, `MEDIA`).
- Pulsante della community Discord.
- Selettore dropdown delle lingue con menu vettoriale scrollabile.

### 2. `Hero.tsx`
- Saluto iniziale (*"Ciao, sono"* / *"Hi, I'm"* / *"Bonjour, je suis"*).
- Ruoli e tag di sistema (*"System Designer & Minecraft Mod Creator"*).
- Intestazione dei video YouTube e statistiche.

### 3. `Projects.tsx`
- Filtri delle mod per categoria (`Tutti`, `Modpack`, `Mod`, `Resource Pack`, `Plugin`, `Server`).
- Placeholder della barra di ricerca (`CERCA PROGETTI...`).
- **Titoli e Descrizioni dei 10 Progetti**: Ciascun progetto (`PROJECT BOSS RPG`, `SPIRAL DUNGEON OF BABEL`, `STRUCTURAL BEYOND`, `PROJECT HORROR`, etc.) ha la propria descrizione tradotta accuratamente per tutte e 8 le lingue nel nodo `projectData`.
- Etichette delle schede modali (`DOWNLOAD TOTALI`, `VISUALIZZA PROGETTO`, `PIATTAFORME & DOWNLOAD`).

### 4. `DraggableTerminal.tsx` (Terminale macOS / Windows)
- Banner di benvenuto con kernel e stato di sistema (`Status`, `Kernel`, `Downloads`, `Site Views`).
- Suggerimento per il comando help (`Digita help per i comandi disponibili`).
- Output dei comandi interattivi (`help`, `neofetch`, `projects`, `stats`, `socials`, `whoami`, `clear`).

### 5. `TotalDownloads.tsx` & `Footer.tsx`
- Intestazioni delle piattaforme e grafici di download.
- Diritti riservati e tagline del footer.

---

## 🚀 7. Guida Passo-Passo per Aggiungere una Nuova Lingua

Se in futuro desideri aggiungere una nona lingua (ad esempio il Cinese `zh`):

1. **Crea il file del dizionario**:
   Crea `src/dictionaries/zh.json` copiando la struttura da `en.json` e traducendo tutti i valori.

2. **Aggiorna `src/dictionaries/index.ts`**:
   Importa `zh.json` e aggiungi `"zh"` al tipo `Language` e all'oggetto `dictionaries`.

3. **Registra la lingua e la bandiera**:
   - In `LanguageContext.tsx` e `TopBar.tsx`, aggiungi la chiave `"zh"` a `FLAG_URLS` e l'oggetto corrispondente all'array `LANGUAGES`.
   - Aggiungi la condizione `else if (userLang.startsWith("zh"))` nell'useEffect per l'auto-detection del browser.

4. **Verifica la Build**:
   Esegui nel terminale:
   ```bash
   npm run build
   ```
   Se il comando termina con `code 0`, la nuova lingua è perfettamente integrata in tutto il sito!

---

*Documentazione generata per il progetto Portfolio D4VIDE106.*
