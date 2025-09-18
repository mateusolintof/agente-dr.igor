# Guia do arquivo `pipeline_config.json`

Este arquivo descreve como o pipeline "Funil Dr. Igor" deve ser criado no Kommo para suportar o fluxo de triagem com consulta ao MEDX e a transferência rápida para a equipe humana.

## Estrutura
- **pipeline_name / description:** Identificação do funil utilizado exclusivamente para leads do Dr. Igor.
- **statuses:** Lista ordenada das etapas do funil, cada uma com `id`, `nome`, cor e descrição do momento do atendimento.
- **custom_fields:** Campos adicionais que precisam ser criados no Kommo para armazenar informações relevantes (ex.: objetivo clínico, preferência de horário, tentativas de follow-up).
- **automation_rules:** Regras nativas do Kommo que disparam follow-ups ou movimentam leads com base em tempo de inatividade ou tags específicas.

## Estágios Principais (Pipeline de Triagem)
1. `novo_lead` – entrada do lead na base.
2. `triagem` – agente coletando dados iniciais.
3. `consultando_disponibilidade` – IA está consultando o MEDX.
4. `opcoes_enviadas` – opções de horário enviadas ao paciente.
5. `aguardando_confirmacao` – aguardando resposta; gatilho de follow-up após 24h/48h.
6. `atendimento_humano` – status temporário para sinalizar handoff iminente.
7. `agendado` – consulta confirmada.
8. `paciente` – consulta realizada / acompanhamento.
9. `nao_interessado` – opt-out.
10. `follow_up` – leads em repouso para tentativas futuras.

## Pipeline da Equipe Humana
- Recomendado criar um segundo pipeline dedicado à equipe comercial/vendas (ex.: "Pipeline Vendedora").
- Utilize a automação nativa do Kommo "Mover para outro pipeline" baseada em tag ou campo.
- Sugestão: quando a IA decidir que o lead deve ser assumido pelo humano, ela adiciona a tag `handoff_humano`. Configure a automação para:
  - Gatilho: tag `handoff_humano` adicionada OR status `atendimento_humano` + tag `handoff_humano`.
  - Ação: mover lead para pipeline da vendedora, estágio "Em Atendimento" ou equivalente.
  - Opcional: remover a tag após a transferência para evitar ciclos.

## Campos Customizados
- `MAIN_OBJECTIVE` – objetivo do paciente.
- `PREFERRED_SLOT` – como o paciente descreveu a data/horário desejado.
- `LAST_FOLLOWUP` – data do último follow-up automático.
- `FOLLOWUP_ATTEMPTS` – contador de tentativas para controle de gatilhos.
- `DETECTED_INTENT` – intenção interpretada pelo agente IA.
- `LAST_SUGGESTED_SLOTS` – texto com as opções enviadas na última interação.
- `PHONE_VALIDATED` – confirma se o telefone já foi verificado.
- `PATIENT_PROFILE` – perfil comportamental para personalizar abordagem.

## Automações
1. **Follow-up 24h após opções** – envia webhook para o n8n quando o lead fica 24h em `opcoes_enviadas` sem resposta.
2. **Mover para follow-up** – após 48h em `aguardando_confirmacao`, muda status para `follow_up`, mantendo o lead em repouso.
3. **Transferência para pipeline da vendedora** – automação baseada em tag (ex.: `handoff_humano`) ou campo específico. Configure em "Automations → Lead moved" para mover o lead automaticamente e notificar a atendente.

## Como usar
1. Criar o pipeline de triagem e, em seguida, o pipeline da equipe humana.
2. Criar os campos customizados respeitando `code` e tipo informados (necessário para os workflows do n8n).
3. Configurar as automações de follow-up e de transferência entre pipelines.
4. Atualizar variáveis de ambiente no n8n (`TRIAGEM_STATUS_ID`, `OPCOES_ENVIADAS_STATUS_ID`, `HANDOFF_TAG`, etc.) com os IDs e tags reais retornados pelo Kommo.
5. Testar o fluxo completo: lead → triagem → handoff (tag aplicada) → pipeline vendedora.
