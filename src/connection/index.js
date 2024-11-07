import * as fs from "fs";
import * as puppeteer from "puppeteer";
import moment from "moment";

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export const QualitorConnection = async ({ login, senha }) => {
  const url = "https://sotran.qualitorsoftware.com//loginUsuario.php";

  let buttonLogin;
  let inputLogin;
  let inputPassword;

  const browser = await puppeteer.launch({
    headless: "new",
  });
  const page = await browser.newPage();

  const register = async (url) => {
    await page.goto(url);
    console.log("--- Página carregada --- ");
    console.log("--- Settando login e senha --- ");

    const triggerBlur = async (selector) => {
      await page.evaluate((selector) => {
        const element = document.querySelector(selector);
        if (element) {
          const event = new Event("blur", { bubbles: true });
          element.dispatchEvent(event);
        }
      }, selector);
    };

    buttonLogin = await page.waitForSelector("#btnLogin");

    inputLogin = "#cdusuario";
    await page.waitForSelector(inputLogin);
    await page.type(inputLogin, login);

    await triggerBlur(inputLogin);

    inputPassword = "#cdsenha";
    await page.waitForSelector(inputPassword);
    await page.type(inputPassword, senha);

    console.log("--- Dados inseridos com sucesso --- ");
  };

  const handleLogin = async () => {
    console.log("Processando request login...");
    await buttonLogin.click();

    await page.waitForNavigation();
    console.log("--- Processo concluido --- ");
  };

  const liberacaoAcesso = async () => {
    console.log("Aguardando carregamento da pagina...");
    await sleep(5000);

    await page.waitForSelector("#btnActionService209");
    const [popup] = await Promise.all([
      new Promise((resolve) => browser.on("targetcreated", resolve)),
      page.evaluate(() => {
        const divElement = document.getElementById("btnActionService209");
        divElement.click();
      }),
    ]);

    console.log("Aguardando popup blank ser carregada...");
    await sleep(5000);
    console.log(
      "----------------------------------------------------------------"
    );
    console.log("Nova página aberta:", popup.url());
    console.log(
      "----------------------------------------------------------------"
    );

    const newPage = await browser.newPage();
    await newPage.goto(popup.url());

    newPage.on("console", (msg) => {
      console.log(`console popup: ${msg.text()}`);
    });

    const checkboxSelector = "#squad2_2";
    await newPage.waitForSelector(checkboxSelector);
    await newPage.evaluate(() => {
      const checkbox = document.getElementById("squad2_2");
      if (checkbox) {
        checkbox.click();

        console.log("Wallstreet checked");
      }

      const checkboxBanco = document.getElementById("banco1_4");
      if (checkboxBanco) {
        checkboxBanco.click();

        console.log("Postgres - TmovPay checked");
      }

      const checkboxBancoMysql = document.getElementById("banco1_2");
      if (checkboxBancoMysql) {
        checkboxBancoMysql.click();

        console.log("MSSQL - Tmov checked");
      }

      const checkboxPortainer = document.getElementById("banco2_0");
      if (checkboxPortainer) {
        checkboxPortainer.click();

        console.log("Ambiente Tmov API's (portainer) checked");
      }

      const checkboxPostgres = document.getElementById("banco2_4");
      if (checkboxPostgres) {
        checkboxPostgres.click();

        console.log(
          "Postgres - Frotista/Remuneração/Shipper/GR/TAG/CIOT checked"
        );
      }
    });

    await newPage.waitForSelector("#dtinicio");
    await newPage.type("#dtinicio", moment().format("DD/MM/YYYY"));
    await newPage.type("#dtfim", moment().format("DD/MM/YYYY"));
    await newPage.type("#login", login);
    await newPage.type("#motivo", "Acompanhar tmovpay");

    await newPage.evaluate(() => {
      document.getElementById("12").value = "09:05";
      document.getElementById("24").value = "18:00";
    });

    console.log("Aguardando formulario");
    await sleep(5000);
    await newPage.evaluate(() => {
      const buttons = document.querySelectorAll("button");
      buttons.forEach((node) => {
        if (String(node.innerHTML).includes("Processar")) {
          node.click();
        }
      });
    });

    console.log("Processo concluido");
    console.log("Aguardando para salvar page");
    await sleep(10000);

    const pageHTML = await newPage.content();
    fs.writeFileSync("./index.html", pageHTML);

    await browser.close();
    console.log("browser closed, powered by Tanida.");
  };

  await register(url);

  return {
    page,
    browser,
    buttonLogin,
    handleLogin,
    liberacaoAcesso,
  };
};
