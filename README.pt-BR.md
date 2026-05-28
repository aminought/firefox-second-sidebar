[English](README.md) | **Português (Brasil)**

Um script Firefox userChrome.js que traz uma segunda barra lateral com painéis web como no Vivaldi/Edge/Floorp, só que melhor.

<img width="2200" height="2131" alt="promo-rounded" src="https://github.com/user-attachments/assets/020ee8cf-1f3d-4184-98fe-889be89d6145" />

## Motivação

Eu experimentei vários navegadores, como Vivaldi, Edge, Floorp e Zen, e todos têm algo em comum sem o qual não consigo imaginar usar um navegador — a barra lateral. Infelizmente, o Firefox, que mais se alinha às minhas necessidades, tem uma barra lateral bastante insatisfatória. Então, decidi criar outra eu mesmo, com blackjack e acompanhantes!

## Demo

https://github.com/user-attachments/assets/cd79d644-ca2c-4a30-ae8e-c265f41768b6

## Recursos

### Barra lateral

- Ações: `Mostrar` • `Ocultar`
- Personalizar via [Personalizar barra de ferramentas...](https://support.mozilla.org/pt-BR/kb/customize-firefox-controls-buttons-and-toolbars)
- Configurações:
  - Geral: `Posição (Esquerda / Direita)` • `Largura`
  - Visibilidade: `Ocultar barra lateral automaticamente` • `Comportamento de ocultação automática (Em linha / Sobreposição)` • `Ocultar painel web quando a barra lateral estiver oculta` • `Atalho para ocultar/mostrar a barra lateral`
  - Painel web: `Deslocamento padrão do painel flutuante` • `Posição do novo painel (Antes do botão de mais / Depois do botão de mais)` • `Mostrar dica de geometria`
  - Botão do painel web: `Indicador de contêiner (Desativado / Esquerda / Direita / Superior / Inferior / Ao redor)` • `Dica de ferramenta (Desativado / Título / URL / Título e URL)` • `Mostrar URL completa na dica`
  - Barra de ferramentas do painel web: `Ocultar automaticamente o botão avançar` • `Ocultar automaticamente o botão voltar`
  - Animações: `Animar barra lateral` • `Animar barra de ferramentas do painel web`

### Painéis web

- Ações: `Criar` • `Excluir` • `Editar` • `Alterar posição e tamanho` • `Redefinir posição e tamanho` • `Descarregar` • `Silenciar` • `Ativar som` • `Fixar` • `Desafixar` • `Alterar zoom` • `Voltar` • `Avançar` • `Recarregar` • `Início`
- Suporte a extensões
- Suporte a notificações popup (permissões de microfone/câmera/localização, etc.)
- Configurações:
  - Geral: `URL` • `Contêiner multi-conta` • `Temporário` • `Visualização móvel` • `Zoom`
  - Título: `Dinâmico` • `Definir título estático`
  - Favicon: `Dinâmico` • `Definir favicon estático`
  - Posição e tamanho: `Modo (Flutuante / Fixado)` • `Sempre no topo` • `Âncora de posição` • `Deslocamento horizontal` • `Deslocamento vertical` • `Largura` • `Altura`
  - Carregamento: `Carregar na memória ao iniciar` • `Restaurar a última página aberta` • `Descarregar da memória ao fechar` • `Recarregamento periódico`
  - Atalho de teclado: `Atalho para ocultar/mostrar o painel web`
  - Seletor CSS: `Ativar` • `Definir seletor CSS`
  - Ocultar elementos: `Ocultar barra de ferramentas` • `Ocultar ícone de som` • `Ocultar emblema de notificação`

### Widgets

- `Segunda barra lateral` para mostrar / ocultar a barra lateral

## Instalação

### Instalação com um clique (Windows, recomendado)

Abrir o PowerShell como **administrador** e executar:

```powershell
irm https://raw.githubusercontent.com/aminought/firefox-second-sidebar/master/install.ps1 | iex
```

O script fará automaticamente:

1. Baixar fx-autoconfig e Second Sidebar do GitHub
2. Detectar o diretório de instalação do Firefox e a pasta de perfil
3. Instalar os arquivos de programa e perfil do fx-autoconfig
4. Instalar o script Second Sidebar
5. Verificar a instalação

> **Privilégios de administrador**: O `config.js` do fx-autoconfig precisa ser copiado para `C:\Program Files\Mozilla Firefox\`, o que requer privilégios de administrador.

**Desinstalação:**

```powershell
irm https://raw.githubusercontent.com/aminought/firefox-second-sidebar/master/uninstall.ps1 | iex
```

### Instalação manual

1. Instalar [fx-autoconfig](https://github.com/MrOtherGuy/fx-autoconfig).
2. Copiar o conteúdo do diretório `src/` (`second_sidebar/` e `second_sidebar.uc.mjs`) para `chrome/JS/`.
3. Habilitar `toolkit.legacyUserProfileCustomizations.stylesheets` e `dom.allow_scripts_to_close_windows` no `about:config`.
4. [Limpar](https://github.com/MrOtherGuy/fx-autoconfig?tab=readme-ov-file#deleting-startup-cache) o cache de inicialização.
5. Divirta-se!

## Localização

O script suporta vários idiomas e exibe automaticamente a interface no idioma do Firefox.

### Adicionar um novo idioma

1. Copiar `en-US.mjs` para um novo arquivo (ex: `it.mjs`)
2. Substituir os valores em inglês por traduções (não alterar as chaves)
3. Importar e registrar o novo idioma em `index.mjs`
4. Enviar um PR
