# Portal de Painéis de Dados — ADAPEC

Site estático (HTML, CSS e JavaScript puros) para reunir os dashboards do
Power BI da Agência de Defesa Agropecuária do Tocantins em um só endereço,
protegido por uma tela de login simples.

Não usa frameworks, não precisa de instalação e não depende de nenhum
serviço externo: é só colocar os arquivos no GitHub e ativar o GitHub Pages.

---

## 1. Arquivos do projeto

```
adapec-bi/
├─ index.html                 Estrutura das duas telas (login e portal)
├─ css/
│  └─ style.css               Cores, tipografia e layout responsivo
├─ js/
│  ├─ config.js   ← EDITE AQUI    logo, usuários e projetos
│  └─ app.js                  Lógica do login, da sessão e da busca
├─ assets/
│  └─ logo-adapec.jpeg        Logo da ADAPEC
└─ README.md                  Este arquivo
```

No dia a dia você só precisa mexer em **`js/config.js`**.

---

## 2. Publicar no GitHub Pages (passo a passo)

### 2.1. Criar o repositório

1. Entre em <https://github.com> com sua conta.
2. Clique em **New** (ou no `+` no canto superior direito → **New repository**).
3. Em **Repository name**, escreva um nome sem espaços, por exemplo `adapec-bi`.
4. Marque a opção **Public** (o GitHub Pages gratuito exige repositório público).
5. Clique em **Create repository**.

### 2.2. Enviar os arquivos

Pelo navegador, sem instalar nada:

1. Na página do repositório recém-criado, clique em
   **uploading an existing file** (ou **Add file → Upload files**).
2. Arraste para a janela **o conteúdo** da pasta do projeto:
   o arquivo `index.html`, o `README.md` e as pastas `css`, `js` e `assets`.
   > Arraste as pastas inteiras, não apenas os arquivos de dentro delas.
   > Importante: envie o conteúdo da pasta, e **não** a pasta `adapec-bi`
   > inteira — o `index.html` precisa ficar na raiz do repositório.
3. Em **Commit changes**, escreva algo como `primeira versão` e confirme
   clicando em **Commit changes**.

### 2.3. Ativar o GitHub Pages

1. No repositório, abra a aba **Settings** (engrenagem, no topo).
2. No menu da esquerda, clique em **Pages**.
3. Em **Source**, escolha **Deploy from a branch**.
4. Em **Branch**, escolha a branch principal (**main**) e a pasta **/ (root)**.
5. Clique em **Save**.
6. Aguarde de 1 a 3 minutos e recarregue a página: aparecerá o endereço do
   site, no formato

   ```
   https://SEU-USUARIO.github.io/adapec-bi/
   ```

Pronto — esse é o link para compartilhar com a equipe.

### 2.4. Atualizar o site depois

1. No repositório, abra o arquivo que quer mudar (por exemplo `js/config.js`).
2. Clique no ícone de lápis (**Edit this file**).
3. Faça a alteração e clique em **Commit changes**.
4. Em 1 ou 2 minutos o site já está atualizado. Se não mudar na hora,
   recarregue com `Ctrl + F5` para limpar o cache do navegador.

---

## 3. Como editar o conteúdo (`js/config.js`)

### 3.1. Trocar a senha ou adicionar usuários

```js
const USUARIOS = [
  { usuario: "adapec", senha: "troque-esta-senha" },
  { usuario: "ddisv",  senha: "outra-senha" },     // nova pessoa/equipe
];
```

Cada linha é um acesso. Para adicionar, copie uma linha e troque os valores.
Para remover, apague a linha inteira. O nome de usuário não diferencia
maiúsculas de minúsculas; a senha, sim.

> **Troque a senha de exemplo antes de divulgar o site.**

### 3.2. Adicionar ou editar painéis

```js
const PROJETOS = [

  {
    icone: "⚖️",
    nome: "Legislação",
    descricao: "Dashboard sobre Legislação da ADAPEC e da DDISV.",
    link: "https://app.powerbi.com/view?r=..."
  },

  {
    icone: "🐄",
    nome: "Defesa Animal",
    descricao: "Em breve.",
    link: ""
  },

];
```

- **icone** — um emoji qualquer (`⚖️`, `📊`, `🐄`, `🌱`, `🧪`, `🗺️`).
- **nome** — título que aparece no card.
- **descricao** — frase curta; também é usada pela busca.
- **link** — endereço do Power BI. **Deixando vazio (`""`)**, o card aparece
  esmaecido, com a etiqueta **"Em breve"** e sem abrir nada.

Para criar um painel novo, copie um bloco inteiro — da chave `{` até a
vírgula depois de `}` — cole logo abaixo e troque os valores. A ordem dos
blocos é a ordem dos cards na tela. O portal funciona bem com 1 a 10 cards.

> Cuidado ao editar: mantenha as aspas, as vírgulas e as chaves no lugar.
> Se um card sumir da tela, provavelmente falta uma vírgula ou uma aspa.

### 3.3. Trocar a logo

Substitua o arquivo `assets/logo-adapec.jpeg` por outro com o mesmo nome,
ou ajuste o caminho na primeira linha do `config.js`:

```js
const LOGO = "assets/logo-adapec.jpeg";
```

Se o arquivo não for encontrado, o site mostra o texto **ADAPEC** no lugar
da imagem — nada quebra.

### 3.4. Trocar as cores

As cores ficam no começo do `css/style.css`, em `:root`. Mudando ali, o site
inteiro muda junto:

```css
--azul: #0B64B4;        /* cor principal: botões, banner, painel do login */
--azul-escuro: #084A87; /* degradês e títulos */
--lima: #8CC63F;        /* acentos (palavra "dados", barrinha do banner) */
```

---

## 4. Como pegar o link do Power BI

No Power BI Service, abra o relatório e vá em
**Arquivo → Inserir relatório → Publicar na web (público)**.
Copie o endereço que começa com `https://app.powerbi.com/view?r=...` e cole
no campo `link` do `config.js`.

---

## 5. Avisos importantes

### 5.1. O login é apenas visual

A verificação de usuário e senha acontece no navegador, e as senhas ficam
escritas em `js/config.js` — **qualquer pessoa que abra o código-fonte da
página (ou o repositório no GitHub) consegue lê-las.**

Isso serve para organizar o acesso e evitar que o portal seja usado por
engano, mas **não é segurança de verdade**. Não trate essa tela como
proteção de dado sigiloso.

### 5.2. Os links "Publicar na web" são públicos

Links do tipo *Publicar na web* do Power BI abrem **para qualquer pessoa que
os tenha**, sem pedir login, e também ficam visíveis no código do GitHub
(mesmo que o repositório seja privado, o site publicado é público).

Portanto: **publique na web apenas relatórios que podem ser vistos por
qualquer pessoa.** Dados pessoais, sigilosos ou restritos não devem ir para
relatórios publicados dessa forma.

### 5.3. Os dashboards se atualizam sozinhos

O portal apenas guarda o link: quem atualiza os dados é o próprio Power BI.
Enquanto o relatório for **republicado no mesmo lugar** (mesma área de
trabalho, substituindo o relatório existente), o link continua valendo e o
painel mostra sempre a versão mais recente.

O link só muda se o relatório for **excluído e criado de novo** — nesse caso,
gere o link de novo em *Publicar na web* e atualize o `config.js`.

---

## 6. Testar no seu computador antes de publicar

Basta dar dois cliques no `index.html` para abrir no navegador.

Se preferir um servidor local (mais parecido com o GitHub Pages), abra o
terminal na pasta do projeto e rode um destes comandos:

```bash
python -m http.server 8000
```

```bash
npx serve .
```

Depois acesse <http://localhost:8000>.

---

## 7. O que dá para evoluir depois

- **Login de verdade com Firebase Authentication** — contas individuais com
  e-mail e senha, recuperação de senha e senhas guardadas no servidor (nunca
  no código). Dá para liberar o acesso só para e-mails `@adapec.to.gov.br`.
- **Registro de acessos** — com o Firebase Firestore, guardar quem entrou,
  quando e qual painel abriu, para acompanhar o uso dos dashboards.
- **Links protegidos** — trocar *Publicar na web* por relatórios incorporados
  com autenticação (Power BI Embedded ou acesso via conta corporativa),
  deixando de expor os endereços.
- **Separação por setor** — mostrar para cada usuário apenas os painéis da
  sua diretoria.
