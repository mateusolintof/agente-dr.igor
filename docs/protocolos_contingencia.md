# Protocolos de Contingência - Projeto Dr. Igor

## 1. Falha na Consulta ao MEDX
- **Sintoma:** Erro na chamada da API ou lista de slots vazia sem justificativa.
- **Resposta imediata:**
  - Agente IA informa ao paciente que o sistema de agenda está em atualização e coleta a preferência (data/turno ideal).
  - Workflow armazena a ocorrência em log e cria tarefa "Verificar disponibilidade manual" para a equipe.
- **Ação da equipe:**
  - Conferir diretamente no MEDX e responder ao paciente via Kommo.
  - Atualizar status do lead conforme resultado.

## 2. Indisponibilidade do OpenAI
- **Sintoma:** Node OpenAI retorna erro ou tempo limite excedido.
- **Resposta imediata:**
  - Fluxo n8n aciona mensagem padrão salvaguarda: "Sistema indisponível no momento; vamos retornar em instantes".
  - Registra erro com timestamp e payload para análise.
- **Ação da equipe:**
  - Verificar status da API OpenAI e retestar.
  - Caso demore mais de 30 minutos, equipe humana assume contato manualmente.

## 3. Webhook Kommo fora do ar
- **Sintoma:** Leads novos não chegam ao n8n; fila vazia.
- **Resposta imediata:**
  - Monitoramento acusa ausência de execuções >15 min.
  - Ativar fallback: equipe humana faz varredura manual no Kommo e inicia triagem.
- **Ação da equipe técnica:**
  - Validar credenciais do webhook, logs do Kommo e reiniciar serviço n8n se necessário.

## 4. Paciente sem resposta após handoff humano
- **Sintoma:** Paciente confirma interesse, mas equipe não consegue contato.
- **Resposta imediata:**
  - Após 2 tentativas da equipe, registrar nota no Kommo e mover lead para "Follow-up" com data para recontato.
  - N8N agenda tentativa adicional em 3 dias com mensagem diferenciada.

## 5. Conteúdo fora do protocolo / Assuntos clínicos
- **Sintoma:** Paciente pede orientação médica, receita ou relata emergência.
- **Resposta:**
  - Agente IA responde: "Para sua segurança, é necessário realizar uma consulta com o Dr. Igor antes de qualquer orientação clínica ou prescrição. Assim, o doutor poderá avaliar sua situação e indicar o melhor protocolo ou medicamento, se for o caso."

## 6. Solicitação de Cancelamento ou Opt-out
- **Sintoma:** Paciente pede para parar contatos ou cancelar consulta.
- **Resposta imediata:**
  - Agente confirma cancelamento, agradece e muda status para "Perdido".

## 7. Falha de Sincronização entre Kommo e MEDX
- **Sintoma:** Horário aparece disponível no MEDX, mas já reservado na clínica.
- **Resposta imediata:**
  - Agente informa que o horário acabou de ser preenchido e oferece duas alternativas próximas.
  - Cria tarefa de auditoria para revisar sincronização.
- **Ação da equipe técnica:**
  - Revisar logs, ajustar intervalos de atualização e, se necessário, notificar suporte MEDX.

## Comunicação Interna
- Todas as contingências devem ser reportadas no canal #dr-igor-operacao com: lead, horário, descrição do problema e ação tomada.
- Atualizar planilha de incidentes semanalmente para identificar padrões.
