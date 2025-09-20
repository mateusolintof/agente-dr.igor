// Workflow executado diariamente às 10h e 15h
{
  "name": "Daily Follow-up Trigger",
  "type": "cron",
  "parameters": {
    "triggerTimes": {
      "item": [
        {
          "hour": 10,
          "minute": 0
        },
        {
          "hour": 15,
          "minute": 0
        }
      ]
    }
  }
}

// Node 2: Buscar Leads em Nutrição
{
  "name": "Get Nurturing Leads",
  "type": "http",
  "parameters": {
    "method": "GET",
    "url": "https://api.kommo.com/api/v4/leads",
    "queryParameters": {
      "filter[tags]": "NURTURING",
      "filter[updated_at][from]": "{{$today.minus(2).days}}",
      "filter[updated_at][to]": "{{$today.minus(1).days}}"
    }
  }
}

// Node 3: Processar e Enviar Follow-ups
{
  "name": "Send Follow-up Messages",
  "type": "code",
  "parameters": {
    "code": `
      const leads = items[0].json._embedded.leads || [];
      const followUpTemplates = [
        {
          day: 1,
          message: "Boa tarde, senhor(a) {name}. Notei que demonstrou interesse em nossa consulta de nutrologia. O Dr. Aguiar Neri tem disponibilidade esta semana. Lembrando que atendemos de forma particular, sem convênios. Gostaria de garantir seu horário?"
        },
        {
          day: 2,
          message: "Senhor(a) {name}, muitos pacientes relatam que adiar o cuidado com a saúde só aumenta as dificuldades. Temos apenas 2 vagas esta semana. {online_info} Posso reservar uma para o senhor(a)?"
        },
        {
          day: 3,
          message: "Senhor(a) {name}, esta é nossa última tentativa de contato. Caso ainda tenha interesse em resolver {problem}, temos uma vaga especial disponível. Responda até às 18h para garantir."
        },
        {
          day: 7,
          message: "Senhor(a) {name}, fazendo um último contato. Entendemos que o momento pode não ser ideal. Quando estiver pronto(a) para cuidar da sua saúde, estaremos aqui. O Instituto não trabalha com convênios, apenas particular. Deseja que eu agende um novo contato para o futuro?"
        }
      ];
      
      const messagesToSend = [];
      
      for (const lead of leads) {
        const daysSinceLastContact = calculateDaysSince(lead.updated_at);
        const template = followUpTemplates.find(t => t.day === daysSinceLastContact);
        
        if (template) {
          let personalizedMessage = template.message
            .replace('{name}', lead.name)
            .replace('{problem}', lead.custom_fields?.main_problem || 'sua questão de saúde');
          
          // Adicionar informação sobre atendimento online se for de outra cidade
          const onlineInfo = lead.custom_fields?.city && 
            !lead.custom_fields.city.toLowerCase().includes('alto paraíso') 
            ? 'Como o senhor(a) é de outra cidade, oferecemos atendimento online com excelentes resultados.'
            : '';
          
          personalizedMessage = personalizedMessage.replace('{online_info}', onlineInfo);
            
          messagesToSend.push({
            lead_id: lead.id,
            message: personalizedMessage,
            template_day: template.day
          });
        }
      }
      
      return messagesToSend;
    `
  }
}