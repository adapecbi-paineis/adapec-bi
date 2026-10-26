/* =============================================================
   ADAPEC — Portal de Painéis de Dados
   Lógica da tela de login, da sessão e da grade de projetos.
   Em geral não é preciso editar este arquivo: o que muda no dia
   a dia (logo, usuários e projetos) está em js/config.js.
   ============================================================= */

(function () {
  "use strict";

  var CHAVE_SESSAO = "adapec:sessao";

  // Valores vindos de js/config.js, com proteção caso o arquivo
  // tenha sido apagado ou esteja com erro de digitação.
  var usuarios = (typeof USUARIOS !== "undefined" && Array.isArray(USUARIOS)) ? USUARIOS : [];
  var projetos = (typeof PROJETOS !== "undefined" && Array.isArray(PROJETOS)) ? PROJETOS : [];
  var caminhoLogo = (typeof LOGO !== "undefined" && LOGO) ? String(LOGO) : "";

  var telaLogin = document.getElementById("tela-login");
  var telaPortal = document.getElementById("tela-portal");
  var formLogin = document.getElementById("form-login");
  var campoUsuario = document.getElementById("usuario");
  var campoSenha = document.getElementById("senha");
  var erroLogin = document.getElementById("erro-login");
  var nomeUsuario = document.getElementById("nome-usuario");
  var btnSair = document.getElementById("btn-sair");
  var campoBusca = document.getElementById("busca");
  var grade = document.getElementById("grade");
  var contador = document.getElementById("contador");
  var vazio = document.getElementById("vazio");
  var tituloPortal = document.getElementById("titulo-portal");

  /* ---------------------------------------------------------
     Utilidades
     --------------------------------------------------------- */

  function texto(valor) {
    return (valor === undefined || valor === null) ? "" : String(valor);
  }

  // Minúsculas e sem acentos, para a busca encontrar "legislacao"
  // quando o projeto se chama "Legislação".
  function normalizar(valor) {
    return texto(valor).toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "");
  }

  function elemento(tag, classe, conteudo) {
    var el = document.createElement(tag);
    if (classe) { el.className = classe; }
    if (conteudo !== undefined) { el.textContent = conteudo; }
    return el;
  }

  /* ---------------------------------------------------------
     Sessão (sessionStorage): mantém o usuário logado enquanto a
     aba estiver aberta. Tudo com try/catch porque o navegador
     pode bloquear o armazenamento (aba anônima, por exemplo).
     --------------------------------------------------------- */

  function gravarSessao(nome) {
    try {
      sessionStorage.setItem(CHAVE_SESSAO, nome);
    } catch (e) {
      // Sem armazenamento o portal continua funcionando;
      // apenas será preciso entrar de novo ao recarregar.
    }
  }

  function lerSessao() {
    try {
      return sessionStorage.getItem(CHAVE_SESSAO);
    } catch (e) {
      return null;
    }
  }

  function apagarSessao() {
    try {
      sessionStorage.removeItem(CHAVE_SESSAO);
    } catch (e) {
      // nada a fazer
    }
  }

  /* ---------------------------------------------------------
     Autenticação (apenas visual — veja o aviso no README)
     --------------------------------------------------------- */

  function autenticar(usuario, senha) {
    var procurado = normalizar(usuario).trim();
    for (var i = 0; i < usuarios.length; i++) {
      var conta = usuarios[i] || {};
      if (normalizar(conta.usuario).trim() === procurado && texto(conta.senha) === texto(senha)) {
        return texto(conta.usuario);
      }
    }
    return null;
  }

  function mostrarErro(mensagem) {
    erroLogin.textContent = mensagem;
    erroLogin.hidden = false;
    campoUsuario.setAttribute("aria-invalid", "true");
    campoSenha.setAttribute("aria-invalid", "true");
  }

  function limparErro() {
    erroLogin.textContent = "";
    erroLogin.hidden = true;
    campoUsuario.removeAttribute("aria-invalid");
    campoSenha.removeAttribute("aria-invalid");
  }

  /* ---------------------------------------------------------
     Troca de telas
     --------------------------------------------------------- */

  function abrirPortal(nome, moverFoco) {
    nomeUsuario.textContent = nome;
    telaLogin.hidden = true;
    telaPortal.hidden = false;
    renderizar(campoBusca.value);
    if (moverFoco) { tituloPortal.focus(); }
  }

  function abrirLogin() {
    telaPortal.hidden = true;
    telaLogin.hidden = false;
    formLogin.reset();
    limparErro();
    campoUsuario.focus();
  }

  /* ---------------------------------------------------------
     Grade de projetos
     --------------------------------------------------------- */

  function filtrar(termo) {
    var busca = normalizar(termo).trim();
    if (!busca) { return projetos.slice(); }
    return projetos.filter(function (projeto) {
      var alvo = normalizar(texto(projeto.nome) + " " + texto(projeto.descricao));
      return alvo.indexOf(busca) !== -1;
    });
  }

  function montarCard(projeto) {
    var temLink = texto(projeto.link).trim() !== "";
    var nome = texto(projeto.nome) || "Sem nome";

    var card = elemento("li", temLink ? "card" : "card card--breve");
    card.appendChild(elemento("span", "card__faixa"));

    var corpo = elemento("div", "card__corpo");

    var icone = elemento("span", "card__icone", texto(projeto.icone) || "📊");
    icone.setAttribute("aria-hidden", "true");
    corpo.appendChild(icone);

    corpo.appendChild(elemento("h2", "card__nome", nome));
    corpo.appendChild(elemento("p", "card__desc", texto(projeto.descricao)));
    card.appendChild(corpo);

    var rodape = elemento("div", "card__rodape");

    if (temLink) {
      var link = elemento("a", "card__link");
      link.setAttribute("href", texto(projeto.link).trim());
      link.setAttribute("target", "_blank");
      link.setAttribute("rel", "noopener");
      link.setAttribute("aria-label", "Abrir dashboard " + nome + " no Power BI (nova aba)");
      link.appendChild(elemento("span", null, "Abrir dashboard"));
      var seta = elemento("span", "card__seta", "→");
      seta.setAttribute("aria-hidden", "true");
      link.appendChild(seta);
      rodape.appendChild(link);
    } else {
      rodape.appendChild(elemento("span", "etiqueta", "Em breve"));
    }

    card.appendChild(rodape);
    return card;
  }

  function plural(quantidade) {
    return quantidade === 1 ? "painel" : "painéis";
  }

  function renderizar(termo) {
    var lista = filtrar(termo);
    var busca = texto(termo).trim();

    grade.innerHTML = "";
    for (var i = 0; i < lista.length; i++) {
      grade.appendChild(montarCard(lista[i]));
    }

    vazio.hidden = lista.length > 0;

    if (busca) {
      contador.textContent = lista.length + " de " + projetos.length + " " + plural(projetos.length);
    } else {
      contador.textContent = projetos.length + " " + plural(projetos.length) + " disponíveis";
    }
  }

  /* ---------------------------------------------------------
     Logo (com texto "ADAPEC" como reserva se o arquivo faltar)
     --------------------------------------------------------- */

  function aplicarLogo() {
    var imagens = document.querySelectorAll("img[data-logo]");
    for (var i = 0; i < imagens.length; i++) {
      (function (img) {
        img.addEventListener("error", function () {
          var reserva = elemento("span", "logo-texto", "ADAPEC");
          if (img.parentNode) { img.parentNode.replaceChild(reserva, img); }
        });
        if (caminhoLogo) {
          img.setAttribute("src", caminhoLogo);
        } else {
          img.dispatchEvent(new Event("error"));
        }
      })(imagens[i]);
    }
  }

  /* ---------------------------------------------------------
     Eventos
     --------------------------------------------------------- */

  formLogin.addEventListener("submit", function (evento) {
    evento.preventDefault();

    var usuario = campoUsuario.value.trim();
    var senha = campoSenha.value;

    if (!usuario || !senha) {
      mostrarErro("Preencha o usuário e a senha para continuar.");
      (usuario ? campoSenha : campoUsuario).focus();
      return;
    }

    var nome = autenticar(usuario, senha);
    if (!nome) {
      mostrarErro("Usuário ou senha incorretos. Confira os dados e tente novamente.");
      campoSenha.value = "";
      campoSenha.focus();
      return;
    }

    limparErro();
    gravarSessao(nome);
    abrirPortal(nome, true);
  });

  campoUsuario.addEventListener("input", limparErro);
  campoSenha.addEventListener("input", limparErro);

  btnSair.addEventListener("click", function () {
    apagarSessao();
    campoBusca.value = "";
    abrirLogin();
  });

  campoBusca.addEventListener("input", function () {
    renderizar(campoBusca.value);
  });

  /* ---------------------------------------------------------
     Início
     --------------------------------------------------------- */

  aplicarLogo();

  var sessao = lerSessao();
  // Só reaproveita a sessão se o usuário ainda existir em config.js.
  var valido = sessao && usuarios.some(function (conta) {
    return normalizar((conta || {}).usuario).trim() === normalizar(sessao).trim();
  });

  if (valido) {
    abrirPortal(sessao, false);
  } else {
    apagarSessao();
    abrirLogin();
  }

})();
