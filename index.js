import { QualitorConnection } from "./src/connection/index.js";

const initalize = async () => {
  const { handleLogin, browser, liberacaoAcesso } = await QualitorConnection({
    login: "erick.castilho",
    senha: "_T@nid@551312@.32",
  });

  let logged = false;
  try {
    await handleLogin();

    logged = true;
  } catch (e) {
    console.log("Login ou senha incorreto");
    await browser.close();
  }

  if (logged) {
    try {
      await liberacaoAcesso();
    } catch (e) {
      console.log(
        "Erro, pode ser causado por lentidão da plaraforma, basta tentar novamente",
        e
      );
    }
  }
};

initalize();
