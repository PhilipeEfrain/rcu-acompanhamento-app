# Guia de Operações no GitHub Projects (#4 - PhilipeEfrain)

## Identificação do Projeto
- **Owner:** `PhilipeEfrain`
- **Project Number:** `4`
- **URL:** `https://github.com/users/PhilipeEfrain/projects/4/views/1`

## Comandos Úteis do GitHub CLI (`gh`)
1. Adicionar Issue ao Kanban:
   `gh project item-add 4 --owner PhilipeEfrain --url <ISSUE_URL>`
2. Mover Card de Status no Kanban (Ex: "In progress", "In review", "Done"):
   `gh project item-edit 4 --owner PhilipeEfrain --url <ISSUE_URL> --field "Status" --value "In progress"`
3. Listar Itens do Projeto:
   `gh project item-list 4 --owner PhilipeEfrain`
4. Criar Pull Request vinculado:
   `gh pr create --title "feat: ..." --body "Closes #<ISSUE_ID>" --label "in-review"`
5. Aprovar e Realizar Merge:
   `gh pr review <PR_ID> --approve -b "Aprovado pelo QA"`
   `gh pr merge <PR_ID> --squash --delete-branch`
