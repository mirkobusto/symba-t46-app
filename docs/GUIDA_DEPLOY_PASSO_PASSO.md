# Guida passo passo: mettere lo strumento su https://biobasedisadvisor.symbaproject.eu

Scritta per chi non fa il sistemista. Ogni passo dice **cosa fai**, **perché**, **come controlli che è andato bene**. Se un passo non
torna, vai in fondo ("Se qualcosa non va"). La guida tecnica di riferimento è `docs/DEPLOY.md`.

## Il quadro in cinque righe

1. Serve **un computer sempre acceso con un indirizzo pubblico** (un server, di solito in affitto): il Mac Studio non va bene,
   perché è raggiungibile solo dentro Tailscale.
2. Serve che **chi gestisce `symbaproject.eu` crei un nome**: `biobasedisadvisor` che punta all'indirizzo del server.
3. Sul server si installa **Docker** e si scarica questo repository.
4. Si compila un file di quattro righe (`.env`) e si lancia **un solo comando**.
5. Il programma che fa da porta (Caddy) si procura da solo il lucchetto HTTPS.

Tempo: mezz'ora se il server c'è già e il nome DNS è già creato; la parte lenta è aspettare gli altri.

## Cosa ti serve prima di cominciare

| Cosa | Chi lo fa | Note |
|---|---|---|
| Un server Linux con IP pubblico | tu, o l'IT di ENCO/CIRCE/CET | Ubuntu 24.04, 2 CPU, 2 GB di RAM, 20 GB di disco bastano. In affitto costa pochi euro al mese. Meglio in Unione Europea (dati personali, vedi l'informativa) |
| Un record DNS per `biobasedisadvisor.symbaproject.eu` | chi amministra il sito del progetto | Passo 2: c'è un'email già pronta |
| Il tuo indirizzo email come amministratore | tu | Sarà l'**unico** indirizzo che diventa admin |
| Un posto dove tenere i backup | tu | Passo 8 |

Il nome si può scrivere con le maiuscole (`BioBasedISadvisor`) ma nei file va in **minuscolo**: `biobasedisadvisor.symbaproject.eu`. I nomi di dominio
non distinguono maiuscole e minuscole, ma i file di configurazione sì, per sicurezza.

---

## Passo 1: scegliere il server

Qualunque server Linux con un IP pubblico va bene. Chiedi, o scegli, una di queste:

- **Server dell'IT di un partner** (ENCO, CIRCE, CET): spesso gratis e già in regola con la privacy. Chiedi: "Ubuntu 24.04, porte 80 e 443 aperte da Internet, accesso SSH, 2 CPU / 2 GB RAM".
- **Server in affitto** (VPS) di un fornitore europeo, per esempio Hetzner o OVH: crei un server Ubuntu 24.04 dal loro sito e ti danno **l'indirizzo IP** e l'accesso.

Annota **l'indirizzo IP** del server (per esempio `203.0.113.10`): serve al passo 2.

Controllo: dal tuo computer, `ssh utente@IP-DEL-SERVER` ti fa entrare. (Su Windows va bene PowerShell o il Terminale di Windows.)

## Passo 2: chiedere il nome DNS

Scrivi a chi gestisce il sito `www.symbaproject.eu` (la persona o l'azienda che ha il pannello DNS di `symbaproject.eu`). Puoi copiare questo:

> Oggetto: nuovo sottodominio per lo strumento di monitoraggio T4.6
>
> Ciao, per lo strumento di monitoraggio e reporting del task T4.6 serve il sottodominio **biobasedisadvisor.symbaproject.eu**.
> Potete creare nel DNS di symbaproject.eu questo record?
>
> - Tipo: **A**
> - Nome: **biobasedisadvisor**
> - Valore: **IL-TUO-IP**
> - TTL: 300
>
> (Se il server ha anche un indirizzo IPv6, aggiungete un record AAAA analogo.)
> Se esiste un record **CAA** su symbaproject.eu, deve permettere `letsencrypt.org`, altrimenti il certificato HTTPS non si può emettere.
> Grazie! Mi scrivete quando è fatto?

Controllo (dal tuo computer, dopo che ti rispondono, a volte servono minuti, a volte qualche ora):

```
nslookup biobasedisadvisor.symbaproject.eu
```

Deve mostrare **il tuo IP**. Finché non lo mostra, non andare oltre: il lucchetto HTTPS non si può ottenere.

## Passo 3: preparare il server

Collegati (`ssh utente@IP`) e lancia, una riga alla volta:

```
curl -fsSL https://get.docker.com | sudo sh
sudo usermod -aG docker $USER
```

Poi **esci e rientra** con ssh (serve per far valere il gruppo). Controllo:

```
docker run --rm hello-world
```

Deve scrivere "Hello from Docker!". Poi apri le porte che servono (se il server ha il firewall `ufw`):

```
sudo ufw allow 22
sudo ufw allow 80
sudo ufw allow 443
sudo ufw enable
```

Le porte 80 e 443 sono quelle del sito. La 80 serve anche per ottenere il certificato.

## Passo 4: scaricare il codice

```
git clone https://github.com/mirkobusto/symba-t46-app.git
cd symba-t46-app
```

Se il repository è privato, ti chiede le credenziali di GitHub (usa un *token personale*, non la password).

## Passo 5: compilare il file `.env`

```
cp .env.example .env
nano .env
```

Nel file ci sono già tutte le voci con la spiegazione. **Devi impostare queste quattro** (le altre lasciale come sono):

```
SYMBA_DOMAIN=biobasedisadvisor.symbaproject.eu
SYMBA_ADMIN_EMAIL=il-tuo-indirizzo@esempio.eu
SYMBA_JWT_SECRET=...        <- vedi sotto
SYMBA_BIND=127.0.0.1
```

- **`SYMBA_JWT_SECRET`**: una password lunga che firma gli accessi. Generala sul server con `openssl rand -hex 32`, copia il risultato nel file. Se la perdi o la cambi, tutti vengono scollegati; non è un
  problema grave ma non va mai messa in un posto pubblico.
- **`SYMBA_ADMIN_EMAIL`**: senza questa voce il **primo che si registra** diventa amministratore: su Internet potrebbe essere uno sconosciuto. Con questa voce solo il tuo indirizzo lo diventa.
- **`SYMBA_BIND=127.0.0.1`**: tiene l'applicazione chiusa a chiave; la raggiunge solo Caddy (il programma-porta). Senza, l'app sarebbe raggiungibile anche in HTTP semplice sulla porta 8088.

Salva con `Ctrl+O`, Invio, esci con `Ctrl+X`. Il file `.env` **non va mai caricato su GitHub** (è già escluso).

## Passo 6: avviare

```
docker compose -f docker-compose.prod.yml -f docker-compose.public.yml up -d --build
```

La prima volta scarica e costruisce tutto: **5-10 minuti**. Se manca una delle voci del passo 5, il comando si ferma subito e dice quale.

Controllo:

```
docker compose -f docker-compose.prod.yml -f docker-compose.public.yml ps
```

Devono comparire due servizi, `symba-t46` (stato *healthy*) e `symba-caddy` (stato *running*).

## Passo 7: verificare dal tuo computer

Apri nel browser **https://biobasedisadvisor.symbaproject.eu**. Se compare la pagina con il lucchetto, è fatto. Controlli in più (dal tuo computer):

```
curl -I https://biobasedisadvisor.symbaproject.eu/health        # deve dire 200
curl -I https://biobasedisadvisor.symbaproject.eu/brand/logo.png # 200, image/png
curl -I https://biobasedisadvisor.symbaproject.eu/privacy        # 200
```

Poi **subito**:

1. **Registrati con `SYMBA_ADMIN_EMAIL`** (pulsante "Sign in" in alto a destra, poi registrazione). Così l'account amministratore è tuo prima di tutti.
2. Fai una valutazione di prova (Questionario → Run) e apri "Data Collection File": devono funzionare senza errori.
3. Apri l'informativa `/privacy`: è una **bozza** con dei `[SEGNAPOSTO]`: vedi il passo 9.

Decisione da prendere: **la registrazione resta aperta?** Per ora sì: chiunque può creare un account. Se vuoi un uso solo su invito, metti nel `.env`
`SYMBA_REGISTRATION_OPEN=false` e rilancia il comando del passo 6; da quel momento solo l'amministratore esiste e nessun altro può registrarsi
(per aggiungere persone dovrai riaprirla temporaneamente).

## Passo 8: backup e aggiornamenti

I dati sono in un solo file (database SQLite). **Backup** (da fare a mano o ogni notte con `cron`):

```
docker compose -f docker-compose.prod.yml exec symba python -c "import sqlite3; s=sqlite3.connect('/app/backend/data/app.db'); d=sqlite3.connect('/tmp/backup.db'); s.backup(d)"
docker cp symba-t46:/tmp/backup.db ./backup-$(date +%F).db
```

Copia il file in un posto che non sia il server (il tuo computer, un cloud del partner).

**Aggiornare** quando c'è una versione nuova:

```
cd symba-t46-app
git pull
docker compose -f docker-compose.prod.yml -f docker-compose.public.yml up -d --build
```

I dati restano. **Dopo un aggiornamento del motore** i casi già salvati mostrano ancora i risultati vecchi finché non li rielabori:

```
docker compose -f docker-compose.prod.yml exec symba python scripts/rerun_saved_cases.py          # prima guarda cosa cambierebbe
docker compose -f docker-compose.prod.yml exec symba python scripts/rerun_saved_cases.py --apply  # poi applica
```

## Passo 9: l'informativa privacy

La pagina `/privacy` è una **bozza**: dice cosa fa davvero l'applicazione (account, casi salvati, log, memoria del browser), ma lascia dei `[SEGNAPOSTO]` per
quello che solo tu sai: chi è il titolare del trattamento (il partner che gestisce il server), la base giuridica, dove sta il server, quanto tempo si
conservano i backup, a chi scrivere per esercitare i diritti, quale autorità di controllo. Compilali con il DPO del partner e fai fare una revisione
legale prima di pubblicizzare l'indirizzo. I testi sono nei file `frontend/src/i18n/locales/en.ts` e `it.ts`, sezione `privacy`.

Da sapere (c'è scritto anche nell'informativa):

- i link di condivisione `/r/...` sono **non elencati, non privati**: chi ha il link legge il report;
- chi salva un caso **senza accedere** lo lascia leggibile e modificabile da chiunque raggiunga lo strumento. Per ora va bene per dati dimostrativi; non inserire dati personali di terzi.

---

## Provare prima senza dominio (facoltativo)

Sul tuo computer o sul server, senza Caddy né DNS:

```
cp .env.example .env
docker compose -f docker-compose.prod.yml up -d --build
```

Si apre su `http://localhost:8088`. È lo stesso programma, senza HTTPS. Con Tailscale (come ora sul Mac Studio) si apre da qualunque tuo dispositivo collegato.

## Se qualcosa non va

| Sintomo | Probabile causa | Cosa fai |
|---|---|---|
| `nslookup` non mostra il tuo IP | Il record DNS non c'è ancora o non si è propagato | Aspetta o richiama chi gestisce il DNS; controlla di aver dato l'IP giusto |
| Il browser dice "connessione non sicura" per qualche minuto | Caddy sta ancora ottenendo il certificato | Aspetta 1-2 minuti; guarda `docker compose -f docker-compose.prod.yml -f docker-compose.public.yml logs caddy` |
| Nei log di Caddy compare "challenge failed" / "no such host" | Il DNS non punta ancora al server, oppure le porte 80/443 sono chiuse | Ripeti il controllo del passo 2 e le regole del passo 3; se il fornitore ha un firewall suo (pannello web), aprile anche lì |
| Errore 502 / "Bad Gateway" | L'applicazione non è partita | `docker compose -f docker-compose.prod.yml logs symba` mostra l'errore |
| Il comando del passo 6 dice "set SYMBA_... in .env" | Manca una voce obbligatoria | Compila la voce indicata nel passo 5 |
| Caddy dice "too many certificates" | Troppi tentativi falliti ravvicinati (Let's Encrypt ha dei limiti) | Aspetta un'ora e rilancia; risolvi prima la causa del fallimento |
| Pagina bianca o dati che non si caricano | Vecchio sito in cache | Ricarica con `Ctrl+Shift+R` |
| Ho dimenticato la password | Non esiste il recupero via email | Registra un nuovo account con un altro indirizzo; per l'amministratore, scrivimi: si risolve con un intervento sul database |
| Non si registra nessuno ("Registration is closed") | `SYMBA_REGISTRATION_OPEN=false` | Rimetti `true` nel `.env` e rilancia il passo 6 |

Se ti blocchi, copia **il testo esatto dell'errore** e l'ultimo pezzo di `docker compose ... logs`, e chiedi (a me o all'IT del partner).

## Checklist finale

- [ ] `nslookup biobasedisadvisor.symbaproject.eu` mostra l'IP del server
- [ ] `https://biobasedisadvisor.symbaproject.eu` si apre con il lucchetto
- [ ] Registrato con `SYMBA_ADMIN_EMAIL` (e sei admin)
- [ ] Una valutazione di prova e il Data Collection File funzionano
- [ ] `http://IP-DEL-SERVER:8088` **non** risponde da fuori (l'app non è esposta senza HTTPS)
- [ ] Backup fatto e copiato fuori dal server
- [ ] Informativa `/privacy` completata e rivista
- [ ] Qualcuno ha guardato il sito da telefono e da un altro browser (logo, menu, stampa)
