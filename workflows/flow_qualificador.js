// Node 1: Webhook Kommo
{
  "name": "Kommo Webhook",
  "type": "webhook",
  "parameters": {
    "httpMethod": "POST",
    "path": "kommo-lead",
    "responseMode": "responseNode",
    "authentication": "headerAuth"
  }
}

// Node 2: Processar e Qualificar Lead
{
  "name": "Qualify Lead",
  "type": "code",
  "parameters": {
    "language": "javascript",
    "code": `
      const leadData = items[0].json;
      
      // Extrair dados do Kommo
      const lead = {
        id: leadData.lead_id,
        name: leadData.contact?.name || 'Não informado',
        phone: leadData.contact?.phone || '',
        email: leadData.contact?.email || '',
        city: leadData.custom_fields?.city || '',
        stage: leadData.status_id,
        messages: leadData.messages || [],
        customFields: leadData.custom_fields || {},
        qualificationStatus: 'pending',
        qualificationCriteria: {
          hasCompleteInfo: false,
          hasSpecificProblem: false,
          hasUrgency: false,
          hasPreviousAttempts: false,
          askedAboutSchedule: false,
          acceptsPrivatePay: false,
          showsGenuineInterest: false
        }
      };
      
      // Verificar critérios de qualificação
      const lastMessages = lead.messages.slice(-5).map(m => m.text.toLowerCase()).join(' ');
      
      // Critério 1: Informações completas
      if (lead.name && lead.name !== 'Não informado' && (lead.phone || lead.email)) {
        lead.qualificationCriteria.hasCompleteInfo = true;
      }
      
      // Critério 2: Problema específico
      const healthProblems = ['emagrecer', 'peso', 'cansaço', 'energia', 'metabolismo', 'hormônio'];
      if (healthProblems.some(problem => lastMessages.includes(problem))) {
        lead.qualificationCriteria.hasSpecificProblem = true;
      }
      
      // Critério 3: Urgência
      const urgencyWords = ['urgente', 'rápido', 'logo', 'preciso', 'não aguento'];
      if (urgencyWords.some(word => lastMessages.includes(word))) {
        lead.qualificationCriteria.hasUrgency = true;
      }
      
      // Critério 4: Tentativas anteriores
      const previousAttempts = ['já tentei', 'não funcionou', 'fiz tratamento', 'sem sucesso'];
      if (previousAttempts.some(phrase => lastMessages.includes(phrase))) {
        lead.qualificationCriteria.hasPreviousAttempts = true;
      }
      
      // Critério 5: Perguntou sobre agenda
      const scheduleWords = ['agendar', 'marcar', 'consulta', 'horário', 'disponibilidade', 'vaga'];
      if (scheduleWords.some(word => lastMessages.includes(word))) {
        lead.qualificationCriteria.askedAboutSchedule = true;
      }
      
      // Critério 6: Aceita particular (não insistiu em convênio)
      const insuranceObjection = ['convênio', 'plano de saúde', 'unimed', 'amil', 'bradesco saúde'];
      const privateAcceptance = ['entendo', 'ok', 'tudo bem', 'pode ser particular'];
      if (!insuranceObjection.some(word => lastMessages.includes(word)) || 
          privateAcceptance.some(phrase => lastMessages.includes(phrase))) {
        lead.qualificationCriteria.acceptsPrivatePay = true;
      }
      
      // Critério 7: Interesse genuíno
      const interestWords = ['quero', 'interessado', 'gostaria', 'como funciona', 'me explica'];
      if (interestWords.some(word => lastMessages.includes(word))) {
        lead.qualificationCriteria.showsGenuineInterest = true;
      }
      
      // Contar critérios atendidos
      const criteriaCount = Object.values(lead.qualificationCriteria).filter(v => v === true).length;
      
      // Determinar status de qualificação
      if (criteriaCount >= 4 && lead.qualificationCriteria.hasCompleteInfo) {
        lead.qualificationStatus = 'qualified';
        lead.action = 'transfer_to_human';
        lead.priority = 'high';
      } else if (criteriaCount >= 2) {
        lead.qualificationStatus = 'nurturing';
        lead.action = 'continue_nurturing';
        lead.priority = 'medium';
      } else {
        lead.qualificationStatus = 'not_qualified';
        lead.action = 'schedule_followup';
        lead.priority = 'low';
      }
      
      // Adicionar informação sobre modalidade de atendimento
      if (lead.city && !lead.city.toLowerCase().includes('alto paraíso')) {
        lead.attendanceMode = 'online';
        lead.additionalInfo = 'Paciente de outra cidade - oferecer atendimento online';
      } else {
        lead.attendanceMode = 'presential_or_online';
      }
      
      return lead;
    `
  }
}

// Node 3: Router baseado em Qualificação
{
  "name": "Qualification Router",
  "type": "switch",
  "parameters": {
    "dataType": "string",
    "value1": "={{$node['Qualify Lead'].json.qualificationStatus}}",
    "rules": [
      {
        "operation": "equals",
        "value2": "qualified",
        "output": 1
      },
      {
        "operation": "equals",
        "value2": "nurturing",
        "output": 2
      },
      {
        "operation": "equals",
        "value2": "not_qualified",
        "output": 3
      }
    ]
  }
}

// Node 4A: Lead Qualificado - Transferir para Humano
{
  "name": "Transfer Qualified Lead",
  "type": "http",
  "parameters": {
    "method": "POST",
    "url": "https://api.kommo.com/api/v4/leads/{{$node['Qualify Lead'].json.id}}/tags",
    "authentication": "oauth2",
    "headers": {
      "Content-Type": "application/json"
    },
    "body": {
      "tags": ["QUALIFICADO", "TRANSFERIR_HUMANO", "PRIORIDADE_ALTA"],
      "responsible_user_id": "{{AGENT_ID}}",
      "status_id": "{{QUALIFIED_STATUS_ID}}"
    }
  }
}

// Node 5: Enviar Notificação para Equipe
{
  "name": "Notify Sales Team",
  "type": "slack",
  "parameters": {
    "channel": "#vendas-urgente",
    "message": "🔥 *LEAD QUALIFICADO IDENTIFICADO*\n\nNome: {{$node['Qualify Lead'].json.name}}\nCidade: {{$node['Qualify Lead'].json.city}}\nModalidade: {{$node['Qualify Lead'].json.attendanceMode}}\nTelefone: {{$node['Qualify Lead'].json.phone}}\n\n*Critérios atendidos:*\n{{$node['Qualify Lead'].json.qualificationCriteria}}\n\nAção: Contato imediato requerido!"
  }
}