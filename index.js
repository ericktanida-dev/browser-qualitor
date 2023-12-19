import { QualitorConnection } from "./src/connection/index.js";

const initalize = async () => {
  const { handleLogin, liberacaoAcesso } = await QualitorConnection({
    login: "seu login qualitor",
    senha: "sua senha qualitor",
  });

  let logged = false;
  try {
    await handleLogin();

    logged = true;
  } catch (e) {
    console.log("Login ou senha incorreto");
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
