# LeadPilot AI

LeadPilot AI est un assistant IA commercial qui aide a qualifier des prospects avec OpenAI.

Il peut :

- comprendre le besoin d'un prospect ;
- poser des questions de qualification ;
- identifier l'urgence, le budget et le decisionnaire ;
- proposer une prochaine action ;
- produire un resume clair du lead.

## Prerequis

- Node.js 18 ou plus
- Un compte OpenAI
- Une cle API OpenAI

## Installation

Clone le depot :

```bash
git clone https://github.com/bogdanvlad-glitch/ia.git
cd ia
```

Installe les dependances :

```bash
npm install
```

Cree ton fichier d'environnement :

```bash
cp .env.example .env
```

Puis modifie `.env` :

```bash
OPENAI_API_KEY=ta_cle_api_openai
OPENAI_MODEL=gpt-4.1-mini
PORT=3000
```

## Lancer le projet

```bash
npm start
```

Ouvre ensuite :

```text
http://localhost:3000
```

## Structure

```text
.
├── public
│   ├── index.html
│   ├── script.js
│   └── style.css
├── .env.example
├── .gitignore
├── package.json
├── README.md
└── server.js
```

## Modifier le comportement de l'IA

Le prompt principal se trouve dans `server.js`, dans la variable `systemPrompt`.

Tu peux modifier :

- le nom de l'IA ;
- le ton ;
- les questions posees ;
- les criteres de qualification ;
- le format du resume final.

## Securite

Ne mets jamais ta vraie cle OpenAI dans GitHub.

Le fichier `.env` est ignore par Git grace a `.gitignore`.

## Idee d'evolution

Prochaines ameliorations possibles :

- connexion a Google Calendar ;
- envoi automatique d'un email de suivi ;
- sauvegarde des leads dans une base de donnees ;
- integration WhatsApp ;
- tableau de bord pour voir tous les prospects ;
- base de connaissances avec tes documents.
