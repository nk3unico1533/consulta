<?php

// Função para gerar logs e visualizar no terminal
function logQuery($msg) {
    $logFile = 'logs.txt';
    file_put_contents($logFile, date("Y-m-d H:i:s") . " - " . $msg . PHP_EOL, FILE_APPEND);
}

// Função para fazer a requisição ao servidor de destino
function consultaAPI($tipo, $valor) {
    $url = "https://exemplo-api.com?tipo=$tipo&valor=$valor";  // Insira a URL da sua API real aqui

    // Iniciar o cURL
    $ch = curl_init($url);
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
    curl_setopt($ch, CURLOPT_TIMEOUT, 30);
    curl_setopt($ch, CURLOPT_FOLLOWLOCATION, true);

    // Executar a requisição
    $response = curl_exec($ch);
    $httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);

    // Verifica se houve erro
    if ($httpCode !== 200) {
        logQuery("Erro ao consultar a API. HTTP Code: $httpCode. Tipo: $tipo, Valor: $valor");
        return ["erro" => "⚠️ Erro ao conectar-se à API.", "http_code" => $httpCode];
    }

    curl_close($ch);
    return json_decode($response, true);
}

// Lógica de fallback em caso de erro ou falta de dados
function consultaComFallback($tipo, $valor) {
    $dados = consultaAPI($tipo, $valor);
    
    // Se não obteve dados, tenta de novo com fallback
    if (empty($dados) || isset($dados['erro'])) {
        logQuery("Tentativa falha com $tipo - $valor. Tentando fallback...");
        return ["erro" => "⚠️ Falha ao obter resposta da API.", "http_code" => 530, "retorno_raw" => "error code: 1033"];
    }

    return $dados;
}

// Função principal para processar a consulta
if ($_SERVER['REQUEST_METHOD'] == 'GET') {
    $tipo = $_GET['tipo'] ?? '';
    $valor = $_GET['valor'] ?? '';

    if ($tipo && $valor) {
        $resultado = consultaComFallback($tipo, $valor);
        echo json_encode($resultado);
    } else {
        echo json_encode(["erro" => "⚠️ Parâmetros inválidos."]);
    }
} else if (isset($_GET['ver_logs'])) {
    // Exibe os logs quando solicitado
    echo nl2br(file_get_contents('logs.txt'));
} else {
    echo json_encode(["erro" => "⚠️ Método inválido."]);
}
?>
