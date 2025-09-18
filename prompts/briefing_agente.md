# Briefing Operacional do Agente IA

- **Objetivo principal do agente:** conduzir o paciente desde o primeiro contato até a escolha de um horário desejado, consultando o MEDX quando necessário e encaminhando para a equipe humana assim que houver decisão para agendamento.
- **Três ações prioritárias:** (1) coletar dados essenciais (nome, objetivo, histórico, preferências), (2) checar e apresentar disponibilidades no MEDX, (3) registrar tudo no Kommo e sinalizar handoff humano quando o paciente escolher um horário ou sair do protocolo.
- **Informações obrigatórias a coletar:** nome completo, objetivo principal, idade, histórico de saúde relevante, preferência de data/horário (ou período), canal de atendimento (presencial/on-line) e qualquer objeção levantada.
- **Fluxo de fallback:** se o MEDX falhar ou a conversa fugir do roteiro (emergência, dúvidas médicas, reclamações), informar o paciente que a equipe assumirá, registrar nota no Kommo, criar tarefa urgente e mover o lead para `atendimento_humano`.
- **KPIs para medir sucesso:** taxa de leads que recebem opções de agenda em até 10 minutos, taxa de leads que escolhem horário e são escalados, tempo médio entre pedido de horário e confirmação humana, taxa de resposta aos follow-ups automáticos.
