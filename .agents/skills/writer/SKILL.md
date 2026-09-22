---
name: writer
description: Diretrizes de UX Writing, redação clínica humanizada e localização especializada para Doenças Inflamatórias Intestinais (RCU / Colitis Ulcerosa).
---

# Skill: UX & Medical Writer (DII / RCU / Colitis Ulcerosa)

Esta skill estabelece os princípios editoriais, terminologia médica e diretrizes de localização para a escrita e tradução de textos no aplicativo RCU Acompanhamento.

## 1. Princípios Editoriais e Tom de Voz (Flo-Style)
- **Acolhedor e Empático:** Pacientes com Retocolite Ulcerativa enfrentam crises físicas e emocionais intensas. O tom nunca deve ser julgador, frio ou alarmista sem necessidade.
- **Claro e Confiável:** Aconselhamentos devem refletir a prática gastroenterológica moderna e diretrizes clínicas consolidadas (ex.: evitar AINEs, monitorar calprotectina, distinguir tenesmo de evacuação efetiva).
- **Direto e Eficiente:** Textos de interface (UI) devem ser concisos (< 15 segundos para preenchimento de registros).

## 2. Glossário Clínico Padronizado (Português -> Espanhol)

| Termo em Português | Termo em Espanhol (es-ES) | Contexto Clínico |
| :--- | :--- | :--- |
| Retocolite Ulcerativa (RCU) | Colitis Ulcerosa (CU) | Diagnóstico clínico principal |
| Doença Inflamatória Intestinal (DII) | Enfermedad Inflamatoria Intestinal (EII) | Categoria nosológica |
| Evacuação / Ida ao Banheiro | Evacuación / Deposición | Episódio no diário |
| Bolo fecal / Fezes formadas | Bolo fecal / Heces formadas | Consistência física |
| Fezes pastosas / diarreia | Heces pastosas / diarrea | Escala Bristol tipos 5-7 |
| Apenas sangue / muco | Solo sangre / moco | Exsudato inflamatório |
| Tenesmo retal | Tenesmo rectal | Falsa urgência inflamatória |
| Acúmulo noturno (Pooling) | Acumulación nocturna (Pooling) | Sangue acumulado ao acordar |
| Estrias / raias de sangue | Tiras / estrías de sangre | Sangue na superfície das fezes |
| Coágulos | Coágulos | Sangramento moderado a severo |
| Remissão clínica | Remisión clínica | Mucosa desinflamada |
| Crise ativa / Alerta | Brote activo / Alerta de brote | Fase de atividade inflamatória |
| AINEs (anti-inflamatórios) | AINEs (antiinflamatorios) | Contraindicados na CU |
| Escala de Bristol | Escala de Bristol | Classificação visual de fezes |
| Escore de Mayo Parcial | Puntuación de Mayo Parcial | Índice clínico de gravidade |

## 3. Regras Estritas de Internacionalização
- **100% de Paridade de Chaves:** Nenhum arquivo de idioma pode ter chaves a mais ou a menos.
- **Interpolações Preservadas:** Placeholders como `{{count}}`, `{{time}}`, `{{date}}`, `{{score}}` devem ser estritamente preservados nos mesmos lugares.
- **Zero Strings Hardcoded:** Todo texto renderizado na tela deve vir de chaves traduzidas via `useTranslation()`.
