async function consultar() {
  const tipo = document.getElementById("tipo").value;
  const valor = document.getElementById("valor").value.trim();
  const resultado = document.getElementById("resultado");

  if (!valor) {
    resultado.innerText = "⚠️ Digite um valor válido!";
    return;
  }

  resultado.innerText = "🔄 Consultando API...";

  try {
    const resp = await fetch(`/api/proxy?tipo=${tipo}&valor=${encodeURIComponent(valor)}`);
    const data = await resp.json();

    if (data.erro) {
      resultado.innerText = `❌ ${data.erro}\n\n📂 Retorno raw:\n${JSON.stringify(data.retorno_raw, null, 2)}`;
    } else {
      resultado.innerText = `✅ Resultado:\n\n${JSON.stringify(data, null, 2)}`;
    }
  } catch (err) {
    resultado.innerText = `❌ Erro na consulta:\n${err.message}`;
  }
}
