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
     SHA-256 em JavaScript puro
     Serve para guardar as senhas embaralhadas no config.js, em
     vez de escritas por extenso. É o algoritmo padrão, escrito à
     mão para o site não depender de nenhuma biblioteca externa.
     Não é preciso entender nem editar este bloco.
     --------------------------------------------------------- */

  // "Tempero" fixo misturado à senha antes de embaralhar: impede
  // consultar o hash em tabelas prontas da internet.
  var SAL = "adapec-paineis-2026";

  function sha256(entrada) {
    var k = [
      0x428a2f98, 0x71374491, 0xb5c0fbcf, 0xe9b5dba5, 0x3956c25b, 0x59f111f1, 0x923f82a4, 0xab1c5ed5,
      0xd807aa98, 0x12835b01, 0x243185be, 0x550c7dc3, 0x72be5d74, 0x80deb1fe, 0x9bdc06a7, 0xc19bf174,
      0xe49b69c1, 0xefbe4786, 0x0fc19dc6, 0x240ca1cc, 0x2de92c6f, 0x4a7484aa, 0x5cb0a9dc, 0x76f988da,
      0x983e5152, 0xa831c66d, 0xb00327c8, 0xbf597fc7, 0xc6e00bf3, 0xd5a79147, 0x06ca6351, 0x14292967,
      0x27b70a85, 0x2e1b2138, 0x4d2c6dfc, 0x53380d13, 0x650a7354, 0x766a0abb, 0x81c2c92e, 0x92722c85,
      0xa2bfe8a1, 0xa81a664b, 0xc24b8b70, 0xc76c51a3, 0xd192e819, 0xd6990624, 0xf40e3585, 0x106aa070,
      0x19a4c116, 0x1e376c08, 0x2748774c, 0x34b0bcb5, 0x391c0cb3, 0x4ed8aa4a, 0x5b9cca4f, 0x682e6ff3,
      0x748f82ee, 0x78a5636f, 0x84c87814, 0x8cc70208, 0x90befffa, 0xa4506ceb, 0xbef9a3f7, 0xc67178f2
    ];
    var h = [0x6a09e667, 0xbb67ae85, 0x3c6ef372, 0xa54ff53a,
             0x510e527f, 0x9b05688c, 0x1f83d9ab, 0x5be0cd19];

    function girar(x, n) { return (x >>> n) | (x << (32 - n)); }

    // Texto para bytes UTF-8 (para acentos darem o mesmo hash em todo lugar).
    var bytes = [];
    var txt = texto(entrada);
    for (var i = 0; i < txt.length; i++) {
      var c = txt.charCodeAt(i);
      if (c < 0x80) {
        bytes.push(c);
      } else if (c < 0x800) {
        bytes.push(0xc0 | (c >> 6), 0x80 | (c & 63));
      } else if (c < 0xd800 || c >= 0xe000) {
        bytes.push(0xe0 | (c >> 12), 0x80 | ((c >> 6) & 63), 0x80 | (c & 63));
      } else {
        i++;
        var cp = 0x10000 + (((c & 0x3ff) << 10) | (txt.charCodeAt(i) & 0x3ff));
        bytes.push(0xf0 | (cp >> 18), 0x80 | ((cp >> 12) & 63),
                   0x80 | ((cp >> 6) & 63), 0x80 | (cp & 63));
      }
    }

    // Preenchimento até fechar blocos de 64 bytes, com o tamanho no fim.
    var bits = bytes.length * 8;
    bytes.push(0x80);
    while (bytes.length % 64 !== 56) { bytes.push(0); }
    bytes.push(0, 0, 0, 0,
               (bits >>> 24) & 255, (bits >>> 16) & 255, (bits >>> 8) & 255, bits & 255);

    var w = new Array(64);
    for (var pos = 0; pos < bytes.length; pos += 64) {
      for (var t = 0; t < 16; t++) {
        w[t] = (bytes[pos + t * 4] << 24) | (bytes[pos + t * 4 + 1] << 16) |
               (bytes[pos + t * 4 + 2] << 8) | bytes[pos + t * 4 + 3];
      }
      for (t = 16; t < 64; t++) {
        var s0 = girar(w[t - 15], 7) ^ girar(w[t - 15], 18) ^ (w[t - 15] >>> 3);
        var s1 = girar(w[t - 2], 17) ^ girar(w[t - 2], 19) ^ (w[t - 2] >>> 10);
        w[t] = (w[t - 16] + s0 + w[t - 7] + s1) | 0;
      }

      var a = h[0], b = h[1], c2 = h[2], d = h[3], e = h[4], f = h[5], g = h[6], hh = h[7];
      for (t = 0; t < 64; t++) {
        var S1 = girar(e, 6) ^ girar(e, 11) ^ girar(e, 25);
        var ch = (e & f) ^ (~e & g);
        var temp1 = (hh + S1 + ch + k[t] + w[t]) | 0;
        var S0 = girar(a, 2) ^ girar(a, 13) ^ girar(a, 22);
        var maj = (a & b) ^ (a & c2) ^ (b & c2);
        var temp2 = (S0 + maj) | 0;
        hh = g; g = f; f = e; e = (d + temp1) | 0;
        d = c2; c2 = b; b = a; a = (temp1 + temp2) | 0;
      }

      h[0] = (h[0] + a) | 0; h[1] = (h[1] + b) | 0; h[2] = (h[2] + c2) | 0; h[3] = (h[3] + d) | 0;
      h[4] = (h[4] + e) | 0; h[5] = (h[5] + f) | 0; h[6] = (h[6] + g) | 0; h[7] = (h[7] + hh) | 0;
    }

    var hex = "";
    for (i = 0; i < 8; i++) {
      hex += ("0000000" + (h[i] >>> 0).toString(16)).slice(-8);
    }
    return hex;
  }

  /* ---------------------------------------------------------
     Autenticação (apenas visual — veja o aviso no README)
     --------------------------------------------------------- */

  // A conta pode trazer "hash" (senha embaralhada, recomendado) ou
  // "senha" (escrita por extenso, mais simples de editar na mão).
  function senhaConfere(conta, usuario, senha) {
    var guardado = texto(conta.hash).trim().toLowerCase();
    if (guardado) {
      return sha256(SAL + ":" + usuario + ":" + texto(senha)) === guardado;
    }
    return texto(conta.senha) !== "" && texto(conta.senha) === texto(senha);
  }

  function autenticar(usuario, senha) {
    var procurado = normalizar(usuario).trim();
    for (var i = 0; i < usuarios.length; i++) {
      var conta = usuarios[i] || {};
      if (normalizar(conta.usuario).trim() === procurado && senhaConfere(conta, procurado, senha)) {
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
