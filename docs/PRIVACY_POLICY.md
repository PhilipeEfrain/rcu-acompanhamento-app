# 🛡️ Política de Privacidade — RCU Acompanhamento
*Última atualização: 20 de Agosto de 2026 | Versão 1.0.0*

Bem-vindo ao **RCU Acompanhamento** (doravante denominado "Aplicativo"), idealizado e desenvolvido de forma independente por Philipe Efrain Figueiredo Gonzalez.

A sua privacidade e a segurança dos seus dados de saúde são as premissas fundamentais da concepção deste Aplicativo. Esta Política de Privacidade descreve com absoluta transparência como as suas informações são tratadas, em estrita conformidade com a **Lei Geral de Proteção de Dados Pessoais do Brasil (LGPD — Lei nº 13.709/2018)**, o **General Data Protection Regulation (GDPR)** e as diretrizes de saúde do **Google Play Developer Program (Health Apps Policy)**.

---

## 1. Princípio Fundamental: Arquitetura 100% Offline-First (Local-Only)

O **RCU Acompanhamento** foi construído sob o princípio de **Privacidade por Padrão (Privacy by Default)** e **Minimização Extrema de Dados**:

1. **Armazenamento 100% Local**: Todos os registros inseridos por você — incluindo frequência de evacuações, consistência fecal (Escala de Bristol), presença de sangue/muco, níveis de dor, fadiga, medicações, notas clínicas e relatórios — são gravados exclusivamente no banco de dados local do seu próprio dispositivo móvel (utilizando tecnologia SQLite local com Drizzle ORM).
2. **Ausência de Servidores Centrais de Dados**: O Aplicativo não possui servidores em nuvem, não requer criação de conta, login com e-mail ou senha, e não envia qualquer dado pessoal ou clínico para a internet.
3. **Zero Rastreamento e Zero Telemetria**: Não utilizamos cookies de rastreamento, Google Analytics, Firebase Analytics, Facebook SDK ou qualquer biblioteca de terceiros destinada a monitorar o comportamento do usuário ou criar perfis publicitários.
4. **Sem Anúncios**: O Aplicativo é 100% livre de redes de anúncios (AdMob, Unity Ads, etc.). Não há venda, monetização ou compartilhamento de dados com corretores de dados (data brokers) ou empresas farmacêuticas.

---

## 2. Dados Tratados no Dispositivo

Os dados coletados e armazenados **exclusivamente no armazenamento isolado (sandbox) do seu smartphone** compreendem:

* **Dados de Saúde Sensíveis (Art. 5º, II e Art. 11 da LGPD)**:
  - Frequência diária e horários de evacuações (incluindo diferenciação de falsas saídas por gases/tenesmo e acúmulo matinal).
  - Classificação visual de fezes (Escala de Bristol adaptada: Tipos 1 a 7).
  - Parâmetros clínicos do Escore Parcial de Mayo (sangramento retal e hábito intestinal basal).
  - Registro de sintomas associados (dor abdominal, urgência, cólicas, fadiga, febre).
  - Histórico de tomada de medicamentos (nome do remédio, posologia, horários e adesão terapêutica).
  - Registro opcional de manifestações extraintestinais (artralgia, lesões de pele, manifestações oculares).
* **Preferências Locais do Aplicativo**:
  - Preferência de idioma (Português do Brasil ou Inglês).
  - Estado de ativação do bloqueio biométrico local.
  - Horários e configurações de lembretes diários.

---

## 3. Permissões Solicitadas no Dispositivo

O Aplicativo solicita apenas as permissões de sistema estritamente indispensáveis para o funcionamento das funcionalidades solicitadas ativamente por você:

| Permissão Android | Finalidade Específica | Transmissão Externa? |
| :--- | :--- | :--- |
| `USE_BIOMETRIC` / `USE_FINGERPRINT` | Permitir o desbloqueio rápido do aplicativo usando a biometria nativa do seu aparelho (Face Unlock ou Impressão Digital). A autenticação é processada pelo próprio sistema operacional; o app **nunca** tem acesso aos seus dados biométricos brutos. | **Não** (100% Local) |
| `SCHEDULE_EXACT_ALARM` / Notificações | Disparar lembretes locais agendados para registro de sintomas e tomada de medicamentos. | **Não** (100% Local) |
| Acesso a Arquivos / Compartilhamento (`expo-sharing` / `expo-print`) | Permitir a você exportar seus dados em formato aberto (JSON) ou gerar e compartilhar o relatório médico em PDF com seu gastroenterologista. | O arquivo só é gerado no seu aparelho e compartilhado via menu nativo de compartilhamento que **você** comanda. |

---

## 4. Segurança e Controle do Usuário (LGPD Arts. 18 e 19)

Você possui controle total e incondicional sobre todas as informações inseridas no Aplicativo:

* **Direito à Portabilidade dos Dados**: Você pode a qualquer momento exportar um arquivo estruturado no padrão JSON contendo a totalidade do seu histórico registrado no app (`Ajustes > Exportar Dados (JSON)`).
* **Direito à Eliminação Total (Wipe Local)**: Você pode apagar permanentemente e de forma irreversível todos os dados armazenados no banco local com um único clique (`Ajustes > Apagar Todos os Dados`).
* **Proteção Visual em Segundo Plano (Privacy Shield)**: Ao alternar de aplicativo ou minimizar o app, uma cortina de proteção oculta os dados de saúde na tela de multitarefa do Android para evitar olhares indesejados.

---

## 5. Doações Voluntárias e Canais de Apoio

O Aplicativo é gratuito. Caso o usuário decida fazer uma contribuição voluntária para apoiar o desenvolvedor e os custos de manutenção (via chave PIX ou Buy Me a Coffee), essa transação é realizada inteiramente fora do Aplicativo, dentro do app bancário do próprio usuário ou plataforma web externa. O Aplicativo não processa pagamentos nem armazena cartões de crédito ou dados bancários.

---

## 6. Declaração do Google Play Health Apps Policy (Data Safety)

Para fins da declaração obrigatória de **Segurança dos Dados (Data Safety Section)** no Google Play Console:
* **Coleta de Dados**: O desenvolvedor **NÃO coleta** dados dos usuários. Todos os dados permanecem confinados no dispositivo do usuário.
* **Compartilhamento de Dados**: Nenhum dado é compartilhado com terceiros ou transferido para servidores externos.
* **Práticas de Segurança**: Os dados locais podem ser protegidos por biometria e excluídos integralmente pelo próprio usuário.

---

## 7. Contato e Encarregado pelo Tratamento de Dados (DPO)

Para quaisquer dúvidas, esclarecimentos jurídicos ou solicitações sobre esta Política de Privacidade, entre em contato diretamente com o autor e responsável:

* **Responsável / Desenvolvedor**: Philipe Efrain Figueiredo Gonzalez
* **E-mail**: [figueiredogonzalez@live.com](mailto:figueiredogonzalez@live.com)
* **Repositório Oficial**: [https://github.com/PhilipeEfrain/rcu-acompanhamento-app](https://github.com/PhilipeEfrain/rcu-acompanhamento-app)

---

# 🌐 Privacy Policy — UC Tracker / RCU Acompanhamento (English)

*Last Updated: August 20, 2026 | Version 1.0.0*

**RCU Acompanhamento / UC Tracker** is designed with privacy and local data sovereignty as its core architecture.

### Key Highlights:
1. **100% Offline-First**: All your medical records, bowel movement entries, Bristol stool scale ratings, Partial Mayo scores, medications, and clinical notes are saved strictly in your device's local SQLite database.
2. **No Data Collection or Transmission**: We do not own any backend servers for user data. We do not transmit, analyze, or sell your health data to any third party.
3. **No Trackers or Ads**: The app does not include analytics SDKs, advertising frameworks, or behavior tracking libraries.
4. **Biometric Security & Local Export**: You can protect your app with local biometric lock, export all data in open JSON format, or permanently wipe your local database at any time.
5. **Contact**: Philipe Efrain Figueiredo Gonzalez (`figueiredogonzalez@live.com`).
