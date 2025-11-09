# Projeto de Consultas com Proxy e Fallbacks

## Descrição
Este projeto é um painel de consulta de dados, com suporte a diferentes tipos de pesquisa (por CPF, consulta completa e consulta básica). Ele usa um proxy para fazer as requisições e implementar fallbacks para garantir a resiliência.

## Arquivos
1. **index.html**: Interface de consulta com opções de pesquisa.
2. **proxy_api.php**: Lógica de proxy que se conecta a APIs externas para consultas e trata fallbacks de erro.
3. **logs.txt**: Arquivo de logs para registrar as requisições feitas e falhas.

## Como usar
1. Faça o deploy do código em uma plataforma como o **Render**.
2. Certifique-se de que os arquivos `index.html` e `proxy_api.php` estejam disponíveis no seu servidor.
3. No seu navegador, acesse o arquivo `index.html` para usar o painel de consulta.

## Consultas suportadas:
- **`cpf3`**: Consulta por CPF.
- **`full`**: Consulta completa de dados.
- **`basica`**: Consulta básica de dados.

## Logs
Você pode visualizar os logs de requisição e erro acessando a URL `/proxy_api.php?ver_logs=1`.

## Limitações
Caso a API externa fique fora do ar, o sistema tentará retornar uma resposta de fallback.
