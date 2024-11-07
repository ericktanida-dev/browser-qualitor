const fs = require("fs");
const { Parser } = require("json2csv");

const inputFile = "./output.json"; // Substitua pelo caminho do arquivo JSON gerado anteriormente
const outputFile = "./dados-compra-cartao.csv"; // Substitua pelo caminho do arquivo CSV de saída

// Definindo os campos que queremos no CSV
const fields = [
  "accountId",
  "cardId",
  "operation",
  "merchant",
  "brandMerchant",
  "mcc",
  "purchaseAmount",
  "purchaseDate",
];

const opts = { fields, delimiter: ";" };

// Ler o JSON
fs.readFile(inputFile, "utf8", (err, data) => {
  if (err) {
    console.error(`Erro ao ler o arquivo JSON: ${err.message}`);
    return;
  }

  try {
    // Remover o último objeto vazio que foi adicionado ao final do JSON
    const jsonData = JSON.parse(data).filter(
      (item) => Object.keys(item).length > 0
    );

    // Converter JSON para CSV
    const parser = new Parser(opts);
    const csv = parser.parse(jsonData);

    // Escrever CSV em um arquivo
    fs.writeFile(outputFile, csv, (err) => {
      if (err) {
        console.error(`Erro ao salvar o arquivo CSV: ${err.message}`);
      } else {
        console.log(`Arquivo CSV salvo com sucesso em: ${outputFile}`);
      }
    });
  } catch (error) {
    console.error(`Erro ao processar o JSON: ${error.message}`);
  }
});
