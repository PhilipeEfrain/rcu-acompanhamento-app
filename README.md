# 🌸 RCU Acompanhamento

<p align="center">
  <img src="https://img.shields.io/badge/Expo-SDK%2054-000020?style=for-the-badge&logo=expo&logoColor=white" />
  <img src="https://img.shields.io/badge/React%20Native-0.81-61DAFB?style=for-the-badge&logo=react&logoColor=black" />
  <img src="https://img.shields.io/badge/TypeScript-5.9-3178C6?style=for-the-badge&logo=typescript&logoColor=white" />
  <img src="https://img.shields.io/badge/SQLite-Local--First-003B57?style=for-the-badge&logo=sqlite&logoColor=white" />
  <img src="https://img.shields.io/badge/License-MIT-green?style=for-the-badge" />
</p>

<p align="center">
  <b>Acompanhamento diário humanizado, rigor clínico e suporte integral para pessoas com Retocolite Ulcerativa (RCU) e Doenças Inflamatórias Intestinais (DII).</b><br>
  <i>Humanized daily symptom tracking, clinical rigor, and comprehensive support for people living with Ulcerative Colitis (UC) and IBD.</i>
</p>

<p align="center">
  <a href="#-sobre-o-projeto">Sobre</a> •
  <a href="#-funcionalidades-completas">Funcionalidades</a> •
  <a href="#-design-system-flo-ui">Design System</a> •
  <a href="#-segurança--privacidade-lgpdhipaa">Segurança</a> •
  <a href="#-stack-tecnológica">Tecnologias</a> •
  <a href="#-instalação-e-execução">Como Rodar</a> •
  <a href="#-arquitetura-multi-agente">Engenharia</a> •
  <a href="#-apoio-comunitário">Apoie o Projeto</a>
</p>

---

## 💜 Sobre o Projeto

O **RCU Acompanhamento** foi criado para transformar a jornada de acompanhamento da Retocolite Ulcerativa em um momento diário rápido, acolhedor e seguro. O aplicativo combina a fluidez estética e o acolhimento visual do *Flo Health* com o rigor de protocolos clínicos internacionais (**Escore Parcial de Mayo**, **Escala de Bristol**, **Critérios de Truelove & Witts** e sinais de alarme para Colite Aguda Grave / ASUC).

O projeto é **100% gratuito, de código aberto, livre de anúncios invasivos e opera no modelo *Local-First*** (seus dados médicos nunca saem do seu próprio celular).

---

## ✨ Funcionalidades Completas

### ⏱️ 1. Registro Clínico Ágil & Zero Redundância (< 15 segundos)
- **⚡ Repetir Registro Anterior (1-Tap Clone < 2s):** Em crises com até 15 evacuações ao dia, um botão de ação rápida permite clonar os dados do último episódio mantendo o horário atual intacto, com modal de gravação direta ou ajuste contínuo.
- **🌅 Inferência Automática de Período:** O período (Manhã, Tarde ou Noite) é deduzido automaticamente a partir do horário registrado, eliminando cliques repetitivos.
- **💩 Diferenciação Inteligente de Saídas:** Registra fezes formadas/líquidas e saída inflamatória exclusiva (*apenas sangue/muco sem bolo fecal*), com ocultação automática dos campos de Bristol e presença de sangue para evitar redundâncias.
- **📊 Escala de Bristol & Grau de Sangramento:** Classificação visual de tipos 1 a 7 e seletor intuitivo de intensidade de sangramento e dor abdominal (0 a 10).
- **🔬 Biomarcadores Estendidos (Acordeão):** Nível de estresse, presença de coágulos, urgência evacuatória e muco.

### 🚨 2. Sinais de Alarme Sistêmicos & Protocolo de Emergência Médica
- **Rastreamento de Sinais Vitais de Crise:** Monitoramento de febre ($\ge 37,8^\circ\text{C}$), tontura/fraqueza, fadiga extrema e taquicardia.
- **Triagem em Tempo Real:** Disparo imediato de **Alerta Vermelho de Emergência** em casos de dor aguda extrema ($\ge 9$) ou sangramento severo combinado a sinais sistêmicos, com orientações claras para procura de pronto-atendimento hospitalar.

### 📅 3. Calendário Visual, Linha do Tempo & Indicador de Ciclo Biológico
- **Indicador Contextual no Header:** O topo do app altera dinamicamente seu ícone e paleta de cores acompanhando o ciclo biológico do paciente (🌅 *Sunrise* de manhã, ☀️ *Sun* de tarde e 🌙 *Moon* à noite).
- **Calendário Mensal Color-Coded:** Indicadores de estado clínico diário em 4 níveis (*Remissão*, *Alerta Leve*, *Crise Ativa* e *Emergência Médica*).
- **Timeline de Episódios:** Lista cronológica dos registros do dia com horário, tags de período, badges de pooling matinal e resumo diário consolidado.

### 📄 4. Exportação de Relatório Clínico em PDF para Gastroenterologista
- **Geração 100% Offline & Sanitizada:** Criação de laudo médico formatado e profissional diretamente no dispositivo via `expo-print` e `expo-sharing`, com sanitização estrita contra injeção de código.
- **Conteúdo do Laudo:**
  - Média diária de evacuações e incidência de sangramento.
  - Gráfico visual de evolução diária e distribuição da Escala de Bristol.
  - Histórico de medicamentos contínuos e notas clínicas detalhadas.

### 💊 5. Gestão de Medicamentos Contínuos & Rastreador Diário
- **Cadastro Personalizado:** Mesalazina (comprimidos, enemas, supositórios), imunossupressores, corticoides, biológicos e suplementos.
- **Multi-Doses Diárias:** Configuração de posologia por turnos e horários flexíveis.
- **Rastreador na Tela Principal:** Marcação de doses tomadas com 1 toque e cálculo automático de adesão medicamentosa.

### 🏛️ 6. Guia de Cuidados, Direitos e Acesso ao SUS (CEAF / Alto Custo)
- **🏛️ Remédios pelo SUS:** Checklist completo para obtenção de medicamentos de alto custo na Farmácia de Alto Custo (LME, relatório com CID-10 K51, receita em 2 vias, colonoscopia com biópsia).
- **💊 Manipulação Autorizada:** Guia de economia de até 60-70% em enemas e supositórios de mesalazina sob prescrição médica.
- **💧 Cuidados em Crise:** Reidratação isotônica domiciliar, cuidados perianais sem papel higiênico seco, dieta de baixo resíduo e alerta estrito contra anti-inflamatórios (AINEs).
- **🩺 Consulta Médica:** Checklist com perguntas essenciais para levar ao gastroenterologista (otimização de dose, calprotectina fecal, imunizações).
- **⚖️ Seus Direitos:** Lei do Acesso Rápido ao Banheiro (DII), Carteirinha de Identificação DII (ABCD), atendimento prioritário e direitos previdenciários.

### 💜 7. Acolhimento Psicoemocional & Suporte Multidisciplinar
- **Mensagens Humanizadas:** Feedback contextual pós-registro sem julgamentos ou positividade tóxica.
- **Apoio Multidisciplinar:** Orientações sobre a conexão cérebro-intestino, manejo de ansiedade e apoio de gastroenterologia e psicologia.

---

## 🔒 Segurança & Privacidade (LGPD / HIPAA)

- **Armazenamento 100% Local (Local-First):** Seus registros médicos são salvos exclusivamente no banco de dados SQLite interno do seu aparelho.
- **Proteção Biométrica:** Exigência de Face ID / Touch ID / Impressão Digital ao abrir ou retomar o app.
- **Privacy Shield (Anti-Spy):** Ocultação automática de telas sensíveis ao alternar entre aplicativos ou colocar o app em segundo plano.
- **Portabilidade & Exclusão Total:** Exportação de todos os registros em JSON aberto e função de exclusão irreversível de dados (*Wipe Data*).
- **Sanitização de Dados:** Sanitização completa de HTML em laudos exportados.
- **Zero Telemetria:** Sem Google Analytics, sem SDKs de publicidade e sem venda de dados de saúde.

---

## 🎨 Design System (Flo UI)

- **Tipografia & Cores:** Tons pastéis acolhedores (`#7B61FF`, `#FAF5FF`, `#EDE9FE`, `#F8F9FE`), evitando tons agressivos em momentos de crise.
- **Ergonomia Móvel:** Área de toque mínima de `44px` em todos os botões e abas.
- **Blindagem de Layout:** Componentes com `flexShrink: 0` e `numberOfLines={1}` para perfeita legibilidade em qualquer densidade de tela Android e iOS.
- **Micro-interações:** Feedback tátil e transições suaves em acordeões, sliders, modais e seletores.

---

## 🛠️ Stack Tecnológica

| Camada | Tecnologia | Propósito |
| :--- | :--- | :--- |
| **Framework** | [React Native](https://reactnative.dev/) (v0.81) + [Expo](https://expo.dev/) (SDK 54) | Desenvolvimento mobile multiplataforma (Android & iOS) |
| **Linguagem** | [TypeScript](https://www.typescriptlang.org/) (v5.9) | Tipagem estática rigorosa e segurança de código |
| **Armazenamento** | [expo-sqlite](https://docs.expo.dev/versions/latest/sdk/sqlite/) + [Drizzle ORM](https://orm.drizzle.team/) | Banco relacional local com suporte a migrações e índices |
| **Estado Global** | [Zustand](https://github.com/pmndrs/zustand) | Gerenciamento de estado leve, desacoplado e performático |
| **Internacionalização** | [i18next](https://www.i18next.com/) + [react-i18next](https://react.i18next.com/) | 100% de paridade tipada em Português (`pt-BR`) e Inglês (`en-US`) |
| **Segurança** | [expo-local-authentication](https://docs.expo.dev/versions/latest/sdk/local-authentication/) + [expo-secure-store](https://docs.expo.dev/versions/latest/sdk/secure-store/) | Autenticação biométrica nativa e armazenamento seguro de chaves |
| **Relatórios & PDF** | [expo-print](https://docs.expo.dev/versions/latest/sdk/print/) + [expo-sharing](https://docs.expo.dev/versions/latest/sdk/sharing/) | Geração e compartilhamento nativo de laudos médicos |
| **Ícones** | [lucide-react-native](https://lucide.dev/) | Iconografia moderna e consistente |

---

## 🚀 Instalação e Execução

### Pré-requisitos
- [Node.js](https://nodejs.org/) (versão 18 ou superior)
- [npm](https://www.npmjs.com/) ou [yarn](https://yarnpkg.com/)
- Aplicativo **Expo Go** instalado no seu dispositivo físico ([Android](https://play.google.com/store/apps/details?id=host.exp.exponent) / [iOS](https://apps.apple.com/app/expo-go/id982105205)) ou Emulador configurado.

### Passo a Passo

1. **Clone o repositório:**
   ```bash
   git clone https://github.com/PhilipeEfrain/rcu-acompanhamento-app.git
   cd rcu-acompanhamento-app
   ```

2. **Instale as dependências:**
   ```bash
   npm install
   ```

3. **Inicie o servidor de desenvolvimento Expo:**
   ```bash
   npm start
   ```

4. **Execute no dispositivo:**
   - **Dispositivo Físico:** Abra o aplicativo *Expo Go* e escaneie o QR Code exibido no terminal.
   - **Android Emulator:** Pressione `a` no terminal.
   - **iOS Simulator (macOS):** Pressione `i` no terminal.

### 🧪 Executar Bateria de Testes & Validação de QA

```bash
# Validação de compilação estática TypeScript
npx tsc --noEmit

# Bateria de testes clínicos, paridade i18n e segurança
npx tsx src/__tests__/qa_validation.js
```

---

## 🤖 Arquitetura Multi-Agente & Engenharia

O **RCU Acompanhamento** é desenvolvido e mantido por um time multidisciplinar de agentes operando sob a especificação do **Antigravity IDE**:

- 👔 **`@agent-pm` (Product Manager):** Visão estratégica, priorização de valor e jornadas clínicas.
- 📋 **`@agent-po` (Product Owner):** Critérios de aceite BDD, detalhamento de estórias e regras de negócio.
- 🎨 **`@agent-flo-ui` (Design Specialist):** Interface humanizada, paletas acolhedoras e design system.
- 🩺 **`@agent-health-domain` (Clinical Specialist):** Protocolos clínicos (Mayo, Bristol, ASUC e DII).
- 💻 **`@agent-dev` (Lead Mobile Developer):** Implementação em React Native/Expo, componentização e performance.
- 💾 **`@agent-storage-engine` (Storage Architect):** Modelagem de dados relacional SQLite, migrações e índices.
- 🧪 **`@agent-qa` (Health Safety QA):** Validação de regras clínicas, testes de paridade i18n e cobertura.
- 🛡️ **`@agent-sec` (Security & Privacy):** Conformidade LGPD/HIPAA, biometria e blindagem de dados sensíveis.

---

## ☕ Apoio Comunitário & Tip Jar

O **RCU Acompanhamento** é um projeto independente e sem fins lucrativos. Caso este aplicativo tenha te ajudado ou feito a diferença na vida de alguém que você ama, você pode contribuir voluntariamente para cobrir os custos de manutenção e taxas de desenvolvedor:

- 🪙 **PIX (Brasil):** `figueiredogonzalez@live.com` (*Chave de E-mail — Favorecido: Philipe Efrain Figueiredo Gonzalez*)
- ☕ **Apoio Internacional / Cartão:** [Buy Me a Coffee (buymeacoffee.com/philipe.gonzalez)](https://buymeacoffee.com/philipe.gonzalez)
- 🌟 **Código Aberto:** Deixe uma estrela no [GitHub](https://github.com/PhilipeEfrain/rcu-acompanhamento-app)!

---

## 📄 Licença

Este projeto está licenciado sob a licença **MIT** — consulte o arquivo [LICENSE](LICENSE) para obter mais detalhes.

<p align="center">
  Desenvolvido com 💜 e dedicação para toda a comunidade de pessoas com Doenças Inflamatórias Intestinais.
</p>
