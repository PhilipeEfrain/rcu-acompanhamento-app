---
name: i18n-guidelines
description: Diretrizes estritas de Internacionalização (i18n) e tolerância zero a strings hardcoded no projeto.
---

# Diretrizes Estritas de Internacionalização (i18n)

## 1. Regra de Tolerância Zero para Strings Hardcoded
- Todo texto renderizado na tela deve ser chamado pelo hook `useTranslation()`:
  ```tsx
  const { t } = useTranslation();
  <Text>{t('dailyLog:stool.bristol_type_6')}</Text>
  ```

