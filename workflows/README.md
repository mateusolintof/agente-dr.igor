# Workflows n8n - Projeto Dr. Igor

Este diretório contém os arquivos JSON dos workflows utilizados no n8n para automatizar a triagem, consulta ao MEDX e follow-up dos leads do Dr. Igor.

## Arquivos Principais

1. **`fluxo_qualificacao.json`**
   - **Descrição:** Triagem e agendamento automatizado.
   - **Gatilho:** Webhook acionado pelo Kommo sempre que chega nova mensagem ou lead.
   - **Etapas:**
     - Processamento da mensagem e identificação de intenção.
     - Consulta ao MEDX quando o paciente solicita horário.
     - Geração de resposta via OpenAI (prompt `system_prompt_triagem.md`).
     - Atualização de status/campos no Kommo e criação de tarefas para handoff humano.
   - **Variáveis/credenciais necessárias:**
     - `KOMMO_API` (credencial Kommo).
     - `MEDX_BASE_URL`, `MEDX_CREDENTIAL_ID`, `MEDX_PROFESSIONAL_ID`.
     - `PROMPT_TRIAGEM_SYSTEM` (conteúdo do system prompt de triagem).
     - IDs dos status e campos customizados (`TRIAGEM_STATUS_ID`, `CONSULTANDO_STATUS_ID`, `OPCOES_ENVIADAS_STATUS_ID`, `ATENDIMENTO_HUMANO_STATUS_ID`, `PREFERRED_SLOT_FIELD_ID`, `SUGGESTED_SLOTS_FIELD_ID`, `DETECTED_INTENT_FIELD_ID`).

2. **`fluxo_followup.json`**
   - **Descrição:** Follow-up diário para leads que receberam opções e ainda não responderam.
   - **Gatilho:** Cron diário às 9h (fuso `America/Sao_Paulo`).
   - **Etapas:**
     - Busca de leads nos status `opcoes_enviadas`, `aguardando_confirmacao` e `follow_up`.
     - Filtragem por tentativas e horas sem resposta (24h/48h/7d).
     - Geração de mensagem personalizada (função JS + prompt `system_prompt_followup.md`).
     - Registro da tentativa, atualização de contadores e pausa após 3 contatos.
   - **Variáveis/credenciais necessárias:** mesmas credenciais Kommo, OpenAI e campos `FOLLOWUP_ATTEMPTS_FIELD_ID`, `LAST_FOLLOWUP_FIELD_ID`, `PAUSE_UNTIL_FIELD_ID`.

## Configuração Inicial
1. Importar cada JSON no n8n (`Import → from file`).
2. Definir as credenciais e variáveis no painel de credenciais/Environment Variables do n8n.
3. Testar o webhook de triagem com payload do Kommo (Postman/cURL).
4. Rodar execução manual do follow-up para validar filtros e mensagens.

## Boas Práticas
- Versionar os workflows exportando uma cópia antes de alterações significativas.
- Usar `test` tags/branch do n8n para validações antes do go-live.
- Monitorar execuções em `Executions` e configurar alertas (Telegram/E-mail) para falhas críticas (erros MEDX, OpenAI, Kommo).
- Documentar mudanças relevantes neste README ou em changelog separado.

## Relação com Outros Artefatos
- Prompts usados: `prompts/system_prompt_triagem.md`, `prompts/system_prompt_followup.md`.
- Campos/IDs definidos em `kommo-config/pipeline_config.json` e `kommo-config/README.md`.
- Regras de negócio detalhadas em `docs/mapeamento_condicionais.md` e `docs/protocolos_contingencia.md`.
