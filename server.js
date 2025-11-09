import express from "express";
import cors from "cors";
import axios from "axios";
import path from "path";
import { fileURLToPath } from "url";

const app = express();
const PORT = process.env.PORT || 3000;

// Resolver __dirname no formato ESModule
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.use(cors());
app.use(express.static(path.join(__dirname, "public")));

// Simples lista de User-Agents para evitar bloqueio Cloudflare
const USER_AGENTS = [
  "Mozilla/5.0 (Windows NT 10.0; Win64; x64)",
  "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7)",
  "Mozilla/5.0 (Linux; Android 10; SM-G975F)"
];

// Função principal do proxy
app.get("/api/proxy", async (req, res) => {
  const { tipo, valor } = req.query;

  if (!tipo || !valor) {
    return res.status(400).json({ erro: "⚠️ Parâmetros 'tipo' e 'valor' são obrigatórios." });
  }

  const apiMap = {
    full: `https://apis-brasil.shop/apis/apiserafull2025.php?cpf=${valor}`,
    basica: `https://apis-brasil.shop/apis/apiserabasic2025.php?cpf=${valor}`,
    nome: `https://apis-brasil.shop/apis/apiserasanome2025.php?nome=${valor}`
  };

  const targetUrl = apiMap[tipo];
  if (!targetUrl) return res.status(400).json({ erro: "⚠️ Tipo de consulta inválido." });

  try {
    const response = await axios.get(targetUrl, {
      headers: {
        "User-Agent": USER_AGENTS[Math.floor(Math.random() * USER_AGENTS.length)],
        "Accept": "application/json",
        "Referer": "https://google.com"
      },
      timeout: 15000
    });

    const data = response.data;
    if (!data || JSON.stringify(data).length < 10) {
      return res.status(530).json({ erro: "⚠️ Nenhum dado útil retornado pela API." });
    }

    res.json(data);

  } catch (err) {
    console.error(`[Erro Proxy] ${tipo} | ${valor} ->`, err.message);
    res.status(500).json({
      erro: `⚠️ Falha ao obter resposta da API (${err.response?.status || 500}).`,
      retorno_raw: err.response?.data || err.message
    });
  }
});

// Rota padrão (painel)
app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

app.listen(PORT, () => console.log(`🌌 Servidor Dark Aurora rodando na porta ${PORT}`));
