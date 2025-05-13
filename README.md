# Pelo Churrasco F.C. - App de Sorteio de Times

Este é um aplicativo Next.js para gerenciar e sortear times de futebol para o Pelo Churrasco F.C., com funcionalidades de modo administrador para edições manuais.

## Funcionalidades Principais

-   **Seleção de Jogadores:** Permite selecionar de 10 a 20 jogadores de uma lista pré-definida e de uma lista de jogadores "Avulsos".
-   **Sorteio de Times:** Sorteia até 4 times (Verde, Vermelho, Cinza, Amarelo) com base nos jogadores selecionados, buscando equilibrar as médias de notas dos times.
    -   Se o número de jogadores não for múltiplo de 5, o último time é formado com os jogadores restantes.
    -   Impede que dois jogadores com nota 1 ou dois jogadores com nota 5 caiam no mesmo time.
-   **Visualização dos Times:** Exibe os times sorteados com seus jogadores, notas individuais e a média de nota do time.
-   **Cooldown para Sorteio:** Usuários normais têm um cooldown de 30 minutos entre sorteios.
-   **Modo Administrador:**
    -   Acesso via código (`raphaeljogador`).
    -   Remove o cooldown para sorteios.
    -   Permite editar os nomes e notas de todos os jogadores (base e avulsos).
    -   Permite editar os times manualmente após o sorteio (adicionar/remover jogadores entre os times ou da lista de não selecionados/avulsos).
    -   Botão para voltar da tela de times sorteados para a tela de seleção de jogadores.
    -   O modo administrador **sempre inicia desativado** ao carregar a página.

## Configuração e Instalação

1.  **Pré-requisitos:**
    *   Node.js (versão 18.x ou superior recomendada)
    *   pnpm (ou npm/yarn)

2.  **Clonar/Descompactar o Projeto:**
    *   Descompacte o arquivo `pelo_churrasco_fc_app_src.zip` em um diretório de sua escolha.

3.  **Instalar Dependências:**
    *   Navegue até o diretório raiz do projeto (onde está o arquivo `package.json`).
    *   Execute o comando para instalar as dependências:
        ```bash
        pnpm install
        ```
        Ou, se preferir npm ou yarn:
        ```bash
        npm install
        # ou
        yarn install
        ```

## Executando em Ambiente de Desenvolvimento

1.  Após instalar as dependências, execute o seguinte comando no diretório raiz do projeto:
    ```bash
    pnpm run dev
    ```
    Ou, com npm/yarn:
    ```bash
    npm run dev
    # ou
    yarn dev
    ```
2.  O aplicativo estará disponível em `http://localhost:3000` (ou outra porta, se a 3000 estiver ocupada).

## Fazendo o Build para Produção

1.  Para criar uma versão otimizada para produção, execute:
    ```bash
    pnpm run build
    ```
    Ou, com npm/yarn:
    ```bash
    npm run build
    # ou
    yarn build
    ```
2.  Após o build, você pode iniciar o servidor de produção com:
    ```bash
    pnpm run start
    ```
    Ou, com npm/yarn:
    ```bash
    npm run start
    # ou
    yarn start
    ```

## Código de Administrador

O código para ativar as funcionalidades de administrador é: `raphaeljogador`

## Estrutura do Projeto

-   `src/app/page.tsx`: Componente principal da página, contém toda a lógica e interface do aplicativo.
-   `public/logo.png`: Logo do time.
-   `tailwind.config.ts`: Configurações do Tailwind CSS.
-   `next.config.mjs`: Configurações do Next.js.

## Observações

-   O estado do modo administrador (ativado/desativado) não persiste entre recarregamentos da página; ele sempre iniciará desativado.
-   O cooldown do sorteio e a lista de jogadores (com nomes/notas editados) são persistidos no `localStorage` do navegador.

