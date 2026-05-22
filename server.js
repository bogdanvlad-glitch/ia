import express from "express";
import cors from "cors";
import "dotenv/config";
import OpenAI from "openai";

const app = express();
const port = process.env.PORT || 3000;

if (!process.env.OPENAI_API_KEY) {
  console.warn("Attention: OPENAI_API_KEY est manquante. Ajoute-la dans un fichier .env.");
}

const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

app.use(cors());
app.use(express.json());
app.use(express.static("public"));

const systemPrompt = `
Tu es LeadPilot AI, un assistant commercial intelligent.

Mission:
Aider un prospect a clarifier son besoin, qualifier son niveau d'interet et proposer une prochaine etape simple.

Style:
- Francais naturel, clair et professionnel.
- Chaleureux, direct, jamais agressif.
- Reponses courtes et utiles.
- Une seule question a la fois.

Objectifs de qualification:
1. Comprendre le besoin du prospect.
2. Identifier le canal souhaite: site web, WhatsApp, Instagram, email, CRM ou autre.
3. Comprendre l'urgence.
4. Identifier le budget approximatif quand c'est pertinent.
5. Savoir si la personne est decisionnaire.
6. Recuperer les coordonnees seulement quand la conversation est suffisamment qualifiee.
7. Proposer une prochaine action: appel, devis, demo ou message de suivi.

Regles importantes:
- N'invente jamais de prix, de delais ou de garanties.
- Ne promets pas de resultat certain.
- Ne demande pas toutes les informations d'un coup.
- Si une information manque, pose une question simple.
- Si le prospect n'est pas pret, aide-le sans forcer.

Quand tu as assez d'informations, donne ce format:

Resume du lead:
- Nom:
- Entreprise:
- Besoin:
- Canal souhaite:
- Urgence:
- Budget:
- Decisionnaire:
- Niveau de qualification: froid / tiede / chaud
- Prochaine action recommandee:
`;

function buildConversation(message, history) {
  const safeHistory = Array.isArray(history) ? history.slice(-16) : [];

  return [
    {
      role: "developer",
      content: systemPrompt,
    },
    ...safeHistory,
    {
      role: "user",
      content: String(message || ""),
    },
  ];
}

app.get("/health", (req, res) => {
  res.json({ status: "ok", app: "LeadPilot AI" });
});

app.post("/chat", async (req, res) => {
  try {
    const { message, history = [] } = req.body;

    if (!message || typeof message !== "string") {
      return res.status(400).json({ error: "Le champ 'message' est obligatoire." });
    }

    const response = await client.responses.create({
      model: process.env.OPENAI_MODEL || "gpt-4.1-mini",
      input: buildConversation(message, history),
      temperature: 0.4,
    });

    res.json({ reply: response.output_text });
  } catch (error) {
    console.error("Erreur OpenAI:", error);
    res.status(500).json({
      error: "Impossible de generer une reponse pour le moment.",
    });
  }
});

app.listen(port, () => {
  console.log(`LeadPilot AI lance sur http://localhost:${port}`);
});
