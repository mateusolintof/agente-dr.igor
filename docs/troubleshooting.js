const contingencyPlan = {
  "scenarios": [
    {
      "issue": "IA não responde",
      "detection": "No response in 30 seconds",
      "automatic_action": "fallback_to_template_message",
      "manual_action": "immediate_human_takeover",
      "message": "Senhor(a), estamos com uma instabilidade momentânea. Um atendente humano assumirá em instantes."
    },
    {
      "issue": "Lead insiste em convênio",
      "detection": "3+ mentions of insurance/convenio",
      "automatic_action": "send_clear_private_only_message",
      "message": "Senhor(a) {nome}, reforçamos que o Instituto Aguiar Neri trabalha EXCLUSIVAMENTE com atendimento particular, sem convênios. Isso garante qualidade premium e dedicação total ao seu caso.",
      "final_action": "mark_as_not_qualified_if_insists"
    },
    {
      "issue": "Dúvida sobre atendimento online",
      "detection": "questions about online quality",
      "automatic_action": "send_online_success_cases",
      "message": "Senhor(a) {nome}, nosso atendimento online tem a mesma qualidade do presencial. Temos dezenas de casos de sucesso de pacientes que fazem acompanhamento 100% online com resultados extraordinários. A única diferença é que online fazemos cálculo de IMC ao invés da bioimpedância."
    },
    {
      "issue": "Paciente menciona urgência médica",
      "keywords": ["emergência", "dor forte", "hospital", "urgente médico"],
      "immediate_action": "transfer_to_human",
      "message": "Senhor(a), vou transferi-lo(a) imediatamente para nosso médico de plantão.",
      "priority": "MAXIMUM"
    },
    {
      "issue": "Múltiplas objeções não resolvidas",
      "detection": "3+ objections in conversation",
      "automatic_action": "escalate_to_senior_agent",
      "tag": "NEEDS_SPECIAL_ATTENTION"
    }
  ],
  "fallback_procedures": {
    "qualification_doubt": {
      "action": "when_in_doubt_mark_as_nurturing",
      "reason": "Better to nurture than lose potential patient"
    },
    "system_error": {
      "action": "transfer_all_to_human",
      "message": "Prezado paciente, para melhor atendê-lo, vou transferi-lo para nossa equipe especializada."
    }
  }
};