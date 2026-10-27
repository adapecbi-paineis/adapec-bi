/* =============================================================
   CONFIGURAÇÃO DO PORTAL — ADAPEC
   -------------------------------------------------------------
   Este é o ÚNICO arquivo que você precisa editar no dia a dia.
   Depois de salvar, envie o arquivo para o GitHub: o site é
   atualizado sozinho em poucos minutos.

   O que dá para mudar aqui:

   1) LOGO      → caminho do arquivo da logo (dentro da pasta assets).
   2) USUARIOS  → quem pode entrar no portal (usuário e senha).
   3) PROJETOS  → os cards que aparecem na tela de painéis.

   ATENÇÃO: o login aqui é apenas visual. A senha fica visível para
   quem abrir o código-fonte da página. Não use senhas importantes
   e não coloque dados sigilosos nos dashboards publicados na web.
   ============================================================= */


/* -------------------------------------------------------------
   1) LOGO
   Troque o arquivo em assets/ mantendo o mesmo nome, ou ajuste o
   caminho abaixo. Se o arquivo não existir, o site mostra o texto
   "ADAPEC" no lugar da imagem.
   ------------------------------------------------------------- */
const LOGO = "assets/logo-adapec.jpeg";


/* -------------------------------------------------------------
   2) USUARIOS
   Cada linha é uma pessoa (ou equipe) que pode entrar.

   As senhas abaixo estão embaralhadas (hash): ninguém consegue
   lê-las neste arquivo. O código embaralhado não dá para digitar
   à mão — para criar um acesso novo ou trocar uma senha, peça o
   código pronto a quem cuida do site.

   Formato com hash (o usado aqui):
     { usuario: "nome-de-login", hash: "codigo-embaralhado" },

   Formato simples, se precisar resolver sozinho na hora:
     { usuario: "nome-de-login", senha: "senha-por-extenso" },
     Funciona igual, mas a senha fica legível para quem procurar.

   Para remover um acesso, apague a linha inteira.
   ------------------------------------------------------------- */
const USUARIOS = [
  { usuario: "adapec",      hash: "021ff628cad003a47a586b875c5af4d655add28646c1e00dde74abad57f7992f" },
  { usuario: "lidianalira", hash: "369aed2bee73b87ca9993baa84487743e19b63201798155883922d8ffa9fe282" },
];


/* -------------------------------------------------------------
   3) PROJETOS
   Cada bloco { ... } é um card na tela de painéis.

   icone     → um emoji (ex.: "⚖️", "📊", "🐄", "🌱", "🧪")
   nome      → título do card
   descricao → frase curta explicando o painel
   link      → endereço do Power BI ("Publicar na web").
               Deixe vazio ("") para o card aparecer esmaecido,
               com a etiqueta "Em breve" e sem abrir nada.

   Para adicionar um painel, copie um bloco inteiro (da chave "{"
   até a vírgula depois de "}") e cole logo abaixo, trocando os
   valores. A ordem dos blocos é a ordem dos cards na tela.
   ------------------------------------------------------------- */
const PROJETOS = [

  {
    icone: "⚖️",
    nome: "Legislação",
    descricao: "Dashboard sobre Legislação da ADAPEC e da Diretoria de Defesa, Inspeção e Sanidade Vegetal (DDISV).",
    link: "https://app.powerbi.com/view?r=eyJrIjoiOTk4NWUxY2EtNDhhMS00ZjI2LWE1ZDctOWZmMjY3ZjhiMWU5IiwidCI6IjE3YjljN2I3LWRiMzAtNDk1ZS1iMzk3LTE4ZTM3YTMzODM0NSJ9"
  },

  {
    icone: "🚧",
    nome: "Barreiras Fixas",
    descricao: "Dashboard das fiscalizações da área vegetal em Barreiras Fixas da ADAPEC.",
    link: "https://app.powerbi.com/view?r=eyJrIjoiNmE2MTNhMGUtZmJjZi00ZTE4LTllMGUtOTEyYzU5MWE2NTBjIiwidCI6IjE3YjljN2I3LWRiMzAtNDk1ZS1iMzk3LTE4ZTM3YTMzODM0NSJ9"
  },

  {
    icone: "📊",
    nome: "Novo painel",
    descricao: "Em breve.",
    link: ""
  },

];
