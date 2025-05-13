# Documentação Funcional - App de Sorteio de Times Pelo Churrasco F.C.

## 1. Visão Geral

O aplicativo "Pelo Churrasco F.C. - Sorteio de Times" foi desenvolvido para facilitar a organização de partidas de futebol, permitindo a seleção de jogadores, o sorteio equilibrado de times e a gestão administrativa das partidas e jogadores.

## 2. Funcionalidades Principais

### 2.1. Tela Inicial e Seleção de Jogadores

-   **Lista de Jogadores:**
    -   Exibe uma lista de jogadores base pré-cadastrados com seus respectivos nomes e notas (de 1 a 5).
    -   Exibe uma lista separada de 6 jogadores "Avulsos", também com nomes e notas (inicialmente nota 3, mas editável no modo admin).
    -   As listas são ordenadas por nota (decrescente) e depois por nome.
-   **Seleção para Sorteio:**
    -   O usuário pode selecionar de 10 a 20 jogadores (entre base e avulsos) para participar do sorteio.
    -   A seleção é feita clicando em qualquer lugar da área do jogador (nome, nota ou checkbox).
    -   Um contador exibe o número de jogadores selecionados.
    -   Se o número máximo de jogadores (20) for atingido, os jogadores não selecionados ficam visualmente desabilitados.
-   **Botão "Sortear Times":**
    -   Fica habilitado apenas quando o número de jogadores selecionados está entre 10 e 20 (inclusive) e o cooldown (para usuários normais) não está ativo.
    -   Ao clicar, realiza o sorteio e navega para a tela de Times Sorteados.

### 2.2. Sorteio de Times

-   **Algoritmo de Equilíbrio:**
    -   O sistema sorteia até 4 times (Verde, Vermelho, Cinza, Amarelo).
    -   O objetivo principal é equilibrar a média de notas entre os times formados.
    -   **Regra de Composição 1:** Se o número de jogadores selecionados não for múltiplo de 5 (tamanho ideal do time), o sistema forma quantos times de 5 jogadores forem possíveis, e o último time é composto pelos jogadores restantes (ex: com 14 jogadores, teremos dois times de 5 e um time de 4).
    -   **Regra de Composição 2 (Crítica):** O algoritmo impede que dois jogadores com nota 1 caiam no mesmo time. Da mesma forma, impede que dois jogadores com nota 5 caiam no mesmo time. Esta regra tem alta prioridade para garantir o equilíbrio e evitar times muito fracos ou muito fortes em extremos.
    -   O sistema realiza múltiplas tentativas e otimizações para encontrar a combinação de times com a menor diferença possível entre a maior e a menor média.

### 2.3. Tela de Times Sorteados

-   **Visualização:**
    -   Exibe os times formados, cada um com sua cor característica, nome do time (Ex: "Time Verde"), a média de nota do time e a lista de jogadores com seus nomes e notas individuais.
    -   Os jogadores dentro de cada time são listados ordenados por nota (decrescente).
-   **Botão "Sortear Novos Times":** Permite realizar um novo sorteio com os mesmos jogadores selecionados anteriormente (sujeito a cooldown para usuários normais).

### 2.4. Cooldown para Sorteio

-   Para usuários não administradores, há um cooldown de 30 minutos entre a realização de sorteios.
-   Um contador regressivo é exibido na tela, indicando o tempo restante para o próximo sorteio.
-   O timestamp do último sorteio é armazenado no `localStorage` do navegador para persistir o cooldown entre sessões.

### 2.5. Modo Administrador

-   **Acesso:**
    -   Um botão "Acesso Restrito" (ou "Admin Ativado") fica visível no cabeçalho.
    -   Ao clicar, um campo para inserir o código de administrador é exibido.
    -   O código de administrador é: `raphaeljogador`.
    -   Ao inserir o código correto, o modo administrador é ativado.
    -   **Importante:** O modo administrador **sempre inicia desativado** ao carregar a página. O estado de admin não persiste no `localStorage` para garantir a segurança.
-   **Privilégios do Administrador:**
    -   **Sem Cooldown:** O cooldown para sorteios é desabilitado.
    -   **Edição de Nomes e Notas dos Jogadores:**
        -   Na tela de seleção de jogadores, o administrador pode clicar no nome ou na nota de qualquer jogador (base ou avulso) para torná-los editáveis.
        -   As alterações são salvas ao perder o foco do campo de edição (onBlur).
        -   As notas devem ser um número entre 1 e 5.
        -   As alterações em nomes e notas são persistidas no `localStorage` e refletidas em sorteios futuros e na edição de times.
    -   **Botão "Voltar para Seleção":**
        -   Na tela de "Times Sorteados", um botão "Voltar para Seleção" é exibido para o administrador, permitindo retornar à tela de seleção de jogadores sem perder o estado de admin.
    -   **Edição Manual de Times Sorteados:**
        -   Na tela de "Times Sorteados", cada time possui um botão "Editar Time".
        -   Ao clicar, um modal de edição é aberto, permitindo:
            -   **Visualizar Jogadores no Time:** Lista os jogadores atualmente no time que está sendo editado, com a opção de "Remover" cada um.
            -   **Adicionar Jogador:** Mostra uma lista de jogadores disponíveis para adicionar ao time. Esta lista inclui:
                -   Jogadores que foram originalmente selecionados para o sorteio mas não estão em nenhum time (status "Sem Time").
                -   Jogadores que estão em outros times (mostrando em qual time estão).
                -   Jogadores que não foram selecionados para o sorteio inicial (status "Não Selecionado" ou "Ausente").
                -   Jogadores Avulsos.
            -   **Transferência Automática:** Se um jogador que já está em outro time for adicionado, ele é automaticamente removido do time de origem e adicionado ao time atual.
            -   **Limite de Jogadores:** A edição respeita o limite de 5 jogadores por time ao adicionar.
            -   **Recálculo de Média:** A média do time editado é recalculada e exibida no modal.
            -   Ao "Concluir Edição", as alterações são salvas e refletidas na tela de times sorteados.

## 3. Interface do Usuário

-   **Layout Responsivo:** O aplicativo é desenhado para ser funcional em desktops e dispositivos móveis.
-   **Design:** Utiliza Tailwind CSS para um visual moderno e limpo, com cores temáticas para cada time e feedback visual para interações.
-   **Cabeçalho:** Exibe o logo e nome do time, e o botão de acesso ao modo administrador.
-   **Rodapé:** Contém informações de direitos autorais e desenvolvedor.

## 4. Persistência de Dados

-   **`localStorage` do Navegador:**
    -   `ultimoSorteioTimestampPeloChurrasco`: Armazena o timestamp do último sorteio para gerenciar o cooldown.
    -   `listaCompletaJogadoresPeloChurrasco`: Armazena a lista de todos os jogadores, incluindo nomes e notas que possam ter sido editados pelo administrador. Isso garante que as edições persistam entre as sessões do navegador.
    -   O estado de `isAdmin` **não** é salvo no `localStorage` para garantir que o modo admin sempre inicie desativado.

## 5. Fluxos de Uso Principais

### 5.1. Usuário Comum

1.  Acessa o aplicativo.
2.  Seleciona entre 10 e 20 jogadores.
3.  Clica em "Sortear Times".
4.  Visualiza os times sorteados.
5.  Se desejar novo sorteio, aguarda o cooldown de 30 minutos ou realiza um novo sorteio se o tempo já passou.

### 5.2. Administrador

1.  Acessa o aplicativo.
2.  Clica em "Acesso Restrito" e insere o código `raphaeljogador`.
3.  (Opcional) Edita nomes ou notas dos jogadores na tela de seleção.
4.  Seleciona entre 10 e 20 jogadores.
5.  Clica em "Sortear Times" (sem cooldown).
6.  Visualiza os times sorteados.
7.  (Opcional) Clica em "Editar Time" para ajustar manualmente a composição dos times.
    -   Remove ou adiciona jogadores conforme necessário.
    -   Conclui a edição.
8.  (Opcional) Clica em "Voltar para Seleção" para retornar à tela de seleção de jogadores e, por exemplo, alterar os jogadores selecionados para um novo sorteio.
9.  (Opcional) Clica em "Sortear Novos Times" para um novo sorteio com os mesmos jogadores selecionados ou com uma nova seleção se retornou à tela anterior.

