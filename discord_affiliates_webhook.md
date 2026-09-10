# 💎 Discord Webhook Message - Affiliazioni & Offerte Esclusive (Components v2)

Questo documento contiene i payload JSON aggiornati con i componenti grafici avanzati di **Discord Components V2** (`type: 17` Container, `type: 9` Section con **loghi quadrati ufficiali a destra**, `type: 14` Separatori/divisori orizzontali e `type: 1` Action Rows con bottoni link dedicati per ciascun prodotto).

---

## 🎨 File Principale: [`discord_affiliates_payload.json`](./discord_affiliates_payload.json)

È la versione richiesta con single container elegante, canali e ticket integrati:
* **Un unico Container elegante (`type: 17`)** con accento dorato (`16752394`).
* **Header & Ruolo Esclusivo:** 
  * Avatar di Davide a destra (`accessory` di `type: 11`).
  * Spiegazione del **Ruolo Supporter & Permessi Speciali** per chi acquista tramite i link partner.
  * Tag diretto al canale ticket: `<#849652564994687048>`.
  * **Pulsanti d'azione rapida:**
    1. 🎫 **Apri Ticket per Riscattare il Ruolo** → `https://discord.com/channels/849652563803504700/849652564994687048`
    2. 🌐 **Server Discord Ufficiale** → `https://discord.gg/f8kP4WsVSW`
* **Ogni Partner è una Sezione dedicata (`type: 9`)**:
  * Testo descrittivo, titolo e codice sconto a sinistra.
  * **Logo Ufficiale Quadrato** a destra (`accessory` di `type: 11`), identico allo stile Discord nativo.
  * **Pulsante d'azione dedicato** subito sotto la sezione (`type: 1` Action Row).
  * **Linea divisoria orizzontale (`type: 14` Separator con `divider: true`)** tra ciascun partner.
* **Footer:** Ringraziamento con reminder per aprire un ticket con la ricevuta.
* **Ottimizzazione API:** 39 componenti totali (limite Discord: 40) per evitare qualsiasi errore `Invalid Form Body`.

---

## 🚀 Come inviarlo con Discohook

1. Apri **[discohook.org](https://discohook.org)**
2. Inserisci l'URL del tuo **Webhook Discord**
3. Clicca su **"JSON Data"** (in fondo alla pagina o in alto a destra)
4. Incolla il testo di **[`discord_affiliates_payload.json`](./discord_affiliates_payload.json)**
5. Clicca su **Apply** e poi su **Send**!

---

## 🔗 Link Integrati
* **Canale Ticket:** `https://discord.com/channels/849652563803504700/849652564994687048` (Tag canale: `<#849652564994687048>`)
* **Server Discord Invite:** `https://discord.gg/f8kP4WsVSW`
* **BisectHosting:** `https://www.bisecthosting.com/Projects?r=LINKTREE` (Codice: `Projects`)
* **Instant Gaming:** `https://www.instant-gaming.com/it/?igr=D4vide106`
* **Amazon IT:** `https://www.amazon.it/?tag=projectsdav-21`
* **Amazon US/Global:** `https://www.amazon.com/?tag=projectsdaven-20`
* **G2A:** `https://www.g2a.com/n/d4vide106?gtag=48998ec5f1`
* **Fiverr:** `https://www.fiverr.com/d4vide106`
