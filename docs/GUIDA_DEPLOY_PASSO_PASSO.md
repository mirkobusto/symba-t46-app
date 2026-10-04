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

Tempo: mezz'ora se il server c'è già e il nome DNS è già creato; la parte lenta è aspettare gli altri. **Il DNS serve solo dal passo 6 in poi**: mentre aspetti la risposta puoi fare i passi 3, 4 e 5.

## Cosa ti serve prima di cominciare

| Cosa | Chi lo fa | Note |
|---|---|---|
| Un server Linux con IP pubblico | tu, o l'IT di ENCO/CIRCE/CET | Ubuntu 24.04, 2 CPU, **4 GB di RAM**, 20 GB di disco. In affitto costa pochi euro al mese (indicativamente 4-8 €). Meglio in Unione Europea (dati personali, vedi l'informativa) |
| Un record DNS per `biobasedisadvisor.symbaproject.eu` | chi amministra il sito del progetto | Passo 2: c'è un'email già pronta |
| Il tuo indirizzo email come amministratore | tu | Sarà l'**unico** indirizzo che diventa admin |
| Un posto dove tenere i backup | tu | Passo 8 |

Il nome si può scrivere con le maiuscole (`BioBasedISadvisor`) ma nei file va in **minuscolo**: `biobasedisadvisor.symbaproject.eu`. I nomi di dominio
non distinguono maiuscole e minuscole, ma i file di configurazione sì, per sicurezza.

---

## Passo 1: scegliere il server

Qualunque server Linux con un IP pubblico va bene. Chiedi, o scegli, una di queste:

- **Server dell'IT di un partner** (ENCO, CIRCE, CET): spesso gratis e già in regola con la privacy. Chiedi: "Ubuntu 24.04, porte 80 e 443 aperte da Internet, accesso SSH, 2 CPU / 4 GB RAM".
- **Server in affitto** (VPS) di un fornitore europeo, per esempio Hetzner o OVH: crei un server Ubuntu 24.04 dal loro sito e ti danno **l'indirizzo IP** e l'accesso.

Annota **l'indirizzo IP** del server (per esempio `203.0.113.10`): serve al passo 2.

Controllo: dal tuo computer, `ssh utente@IP-DEL-SERVER` ti fa entrare. (Su Windows va bene PowerShell o il Terminale di Windows.)
L'utente iniziale dipende dal fornitore: tipicamente `root` (Hetzner) o `ubuntu` (OVH); lo dice la mail di benvenuto. Se il fornitore chiede una
**chiave SSH** al momento di creare il server: in PowerShell lancia `ssh-keygen -t ed25519` (Invio a tutte le domande) e incolla nel pannello del
fornitore il contenuto del file `C:\Users\TUONOME\.ssh\id_ed25519.pub`.

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
> (Solo il record A, per ora: niente AAAA.)
> Se esiste un record **CAA** su symbaproject.eu, deve permettere `letsencrypt.org`, altrimenti il certificato HTTPS non si può emettere.
> Grazie! Mi scrivete quando è fatto?

Controllo (dal tuo computer, dopo che ti rispondono, a volte servono minuti, a volte qualche ora):

```
nslookup biobasedisadvisor.symbaproject.eu 1.1.1.1
```

Deve mostrare **il tuo IP** (l'`1.1.1.1` finale evita la memoria del tuo computer, che potrebbe ricordare un "non esiste" vecchio). Finché non lo mostra, **non lanciare il
passo 6**: il lucchetto HTTPS non si può ottenere. Se per errore l'hai già lanciato, quando il DNS è a posto basta
`docker compose -f docker-compose.prod.yml -f docker-compose.public.yml restart caddy`.

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

Deve scrivere "Hello from Docker!". Il programma installa anche Docker Compose (serve la versione 2.24 o più nuova: `docker compose version` te la mostra). Poi apri le porte che servono (se il server ha il firewall `ufw`):

```
sudo ufw allow 22
sudo ufw allow 80
sudo ufw allow 443
sudo ufw enable
```

`ufw enable` chiede conferma: rispondi `y`. Le porte 80 e 443 sono quelle del sito. La 80 serve anche per ottenere il certificato.
Dopo un riavvio del server tutto riparte da solo.

## Passo 4: scaricare il codice

```
git clone https://github.com/mirkobusto/symba-t46-app.git
cd symba-t46-app
```

(Il repository è pubblico: non servono credenziali.)

## Passo 5: compilare il file `.env`

```
cp .env.example .env
nano .env
```

Nel file ci sono già tutte le voci con la spiegazione. **Devi impostare queste tre** (le altre lasciale come sono). Nel file `SYMBA_DOMAIN` e
`SYMBA_ADMIN_EMAIL` iniziano con `#` (che le rende commenti, cioè ignorate): **togli il `#`** e scrivi il valore subito dopo il `=`, senza spazi.
Alla fine devono essere così:

```
SYMBA_DOMAIN=biobasedisadvisor.symbaproject.eu
SYMBA_ADMIN_EMAIL=il-tuo-indirizzo@esempio.eu
SYMBA_JWT_SECRET=il-risultato-di-openssl
```

- **`SYMBA_JWT_SECRET`**: una password lunga che firma gli accessi. Generala sul server con `openssl rand -hex 32`, copia il risultato nel file. Se la perdi o la cambi, tutti vengono scollegati; non è un
  problema grave ma non va mai messa in un posto pubblico.
- **`SYMBA_ADMIN_EMAIL`**: senza questa voce il **primo che si registra** diventa amministratore: su Internet potrebbe essere uno sconosciuto. Con questa voce solo il tuo indirizzo lo diventa.

L'applicazione in sé resta chiusa a chiave (la raggiunge solo Caddy, il programma-porta): lo garantisce `docker-compose.public.yml`, non devi impostare nulla.

Salva con `Ctrl+O`, Invio, esci con `Ctrl+X`. Il file `.env` **non va mai caricato su GitHub** (è già escluso). Modificalo sempre **sul server** con `nano`: se lo
scrivi su Windows e lo carichi, le righe a capo di Windows rompono il nome del dominio (rimedio: `sed -i 's/\r$//' .env`).

## Passo 6: avviare

```
docker compose -f docker-compose.prod.yml -f docker-compose.public.yml up -d --build
```

La prima volta scarica e costruisce tutto: **5-10 minuti**. Se manca una delle voci del passo 5, il comando si ferma subito e dice quale. Se si ferma con `Killed` (o codice 137) il server ha finito la memoria: vedi "Se qualcosa non va".

Controllo:

```
docker compose -f docker-compose.prod.yml -f docker-compose.public.yml ps
```

Devono comparire due servizi, `symba-t46` (stato *healthy*) e `symba-caddy` (stato *running*).

## Passo 7: verificare dal tuo computer

Apri nel browser **https://biobasedisadvisor.symbaproject.eu**. Se compare la pagina con il lucchetto, è fatto. Controlli in più (dal tuo computer):

```
curl.exe https://biobasedisadvisor.symbaproject.eu/health
curl.exe -s -o NUL -w "%{http_code} %{content_type}\n" https://biobasedisadvisor.symbaproject.eu/brand/logo.png
curl.exe -s -o NUL -w "%{http_code} %{content_type}\n" https://biobasedisadvisor.symbaproject.eu/privacy
```

La prima deve stampare `{"status":"ok","version":"0.0.1"}`; la seconda `200 image/png`; la terza `200 text/html; charset=utf-8`. (In Windows PowerShell scrivi
`curl.exe`: `curl` da solo è un'altra cosa. Da Linux o Mac scrivi `curl` e `/dev/null` al posto di `NUL`. Non usare `curl -I`: l'applicazione risponde 405 a quel tipo di richiesta anche quando funziona.)

Poi **subito**:

1. **Registrati con `SYMBA_ADMIN_EMAIL`** (pulsante "Accedi" / "Sign in" in alto a destra, poi la scheda "Crea account"). Così l'account amministratore è tuo prima di tutti.
2. Fai una valutazione di prova (Questionario → Run) e apri "Data Collection File": devono funzionare senza errori.
3. Apri l'informativa `/privacy`: è una **bozza** con dei `[SEGNAPOSTO]`: vedi il passo 9.

Decisione da prendere: **la registrazione resta aperta?** Per ora sì: chiunque può creare un account. Se vuoi un uso solo su invito, metti nel `.env`
`SYMBA_REGISTRATION_OPEN=false` e rilancia `docker compose -f docker-compose.prod.yml -f docker-compose.public.yml up -d` (senza `--build`, basta cambiare il `.env`): da quel momento nessun altro può creare un account;
chi è già registrato continua ad accedere (per aggiungere persone dovrai riaprirla temporaneamente).

## Passo 8: backup e aggiornamenti

I dati sono in un solo file (database SQLite). **Backup** (da fare a mano o ogni notte con `cron`):

```
docker exec symba-t46 python -c "import sqlite3; s=sqlite3.connect('/app/backend/data/app.db'); d=sqlite3.connect('/tmp/backup.db'); s.backup(d)"
docker cp symba-t46:/tmp/backup.db ./backup-$(date +%F).db
```

Copia il file in un posto che non sia il server (il tuo computer, un cloud del partner).

**Attenzione, una sola cosa da non fare mai: `docker compose ... down -v`.** Il `-v` cancella i dati (tutti i casi salvati) **e** il certificato HTTPS; `down` senza `-v` è innocuo.

**Aggiornare** quando c'è una versione nuova:

```
cd symba-t46-app
git pull
docker compose -f docker-compose.prod.yml -f docker-compose.public.yml up -d --build
```

I dati restano. **Dopo un aggiornamento del motore** i casi già salvati mostrano ancora i risultati vecchi finché non li rielabori:

```
docker exec symba-t46 python scripts/rerun_saved_cases.py          # prima guarda cosa cambierebbe
docker exec symba-t46 python scripts/rerun_saved_cases.py --apply  # poi applica
```

## Passo 9: l'informativa privacy

La pagina `/privacy` è una **bozza**: dice cosa fa davvero l'applicazione (account, casi salvati, log, memoria del browser), ma lascia dei `[SEGNAPOSTO]` per
quello che solo tu sai: chi è il titolare del trattamento (il partner che gestisce il server), la base giuridica, dove sta il server, quanto tempo si
conservano i backup, a chi scrivere per esercitare i diritti, quale autorità di controllo. Compilali con il DPO del partner e fai fare una revisione
legale prima di pubblicizzare l'indirizzo. I testi sono nei file `frontend/src/i18n/locales/en.ts` e `it.ts`, sezione `privacy`: modificali **nel repository, dal tuo computer** (un commit e una pull request, che poi si unisce a `main`), non direttamente sul server (rompe il successivo `git pull`); poi sul server fai l'aggiornamento del passo 8.

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
| Il browser dice "connessione non sicura" per qualche minuto | Caddy sta ancora ottenendo il certificato | Aspetta 1-2 minuti; guarda `docker logs symba-caddy` |
| Nei log di Caddy compare "challenge failed" / "no such host" | Il DNS non punta ancora al server, oppure le porte 80/443 sono chiuse | Ripeti il controllo del passo 2 e le regole del passo 3; se il fornitore ha un firewall suo (pannello web), aprile anche lì |
| Errore 502 / "Bad Gateway" | L'applicazione non è partita | `docker logs symba-t46` mostra l'errore |
| Il comando del passo 6 dice "set SYMBA_... in .env" | Manca una voce obbligatoria, o la riga inizia ancora con `#` | Compila la voce indicata nel passo 5 (senza `#`) |
| Il comando del passo 6 si ferma con `Killed` / codice 137 | Il server ha poca memoria | `sudo fallocate -l 2G /swapfile && sudo chmod 600 /swapfile && sudo mkswap /swapfile && sudo swapon /swapfile`, poi rilancia il comando del passo 6 |
| Caddy dice "too many certificates already issued" | Il certificato è stato chiesto troppe volte (di solito perché il volume `caddy-data` è stato cancellato con `down -v`) | Aspetta fino a 7 giorni; non c'è altro rimedio |
| Caddy dice "too many failed authorizations" | 5 tentativi falliti ravvicinati (DNS o porte ancora sbagliati) | Risolvi la causa (passo 2 e passo 3), aspetta 1 ora e fai `restart caddy` |
| Pagina bianca o dati che non si caricano | Vecchio sito in cache | Ricarica con `Ctrl+Shift+R` |
| Ho dimenticato la password | Non esiste il recupero via email | Registra un nuovo account con un altro indirizzo; per l'amministratore, scrivimi: si risolve con un intervento sul database |
| Non si registra nessuno ("Registration is closed") | `SYMBA_REGISTRATION_OPEN=false` | Rimetti `true` nel `.env` e rilancia il passo 6 |

Se ti blocchi, copia **il testo esatto dell'errore** e l'ultimo pezzo di `docker logs symba-t46` e `docker logs symba-caddy`, e chiedi (a me o all'IT del partner).

## Checklist finale

- [ ] `nslookup biobasedisadvisor.symbaproject.eu 1.1.1.1` mostra l'IP del server
- [ ] `https://biobasedisadvisor.symbaproject.eu` si apre con il lucchetto
- [ ] Registrato con `SYMBA_ADMIN_EMAIL` (e sei admin)
- [ ] Una valutazione di prova e il Data Collection File funzionano
- [ ] `http://IP-DEL-SERVER:8088` **non** risponde se provi da un computer diverso dal server (l'app non è esposta senza HTTPS)
- [ ] Backup fatto e copiato fuori dal server
- [ ] Informativa `/privacy` completata e rivista
- [ ] Qualcuno ha guardato il sito da telefono e da un altro browser (logo, menu, stampa)
