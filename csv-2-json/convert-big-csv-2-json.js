const fs = require("fs");
const csv = require("csv-parser");

const inputFile = "./dataextractions_202411051002.csv";
const outputFile = "./output.json";

fs.writeFileSync(outputFile, "[\n"); // Inicia o arquivo JSON

fs.createReadStream(inputFile)
  .pipe(csv({ separator: ";" }))
  .on("data", (row) => {
    try {
      const sourceData = JSON.parse(row.source_data);
      if (sourceData && Array.isArray(sourceData.data)) {
        const filteredData = sourceData.data.map((item) => ({
          accountId: item.accountId,
          cardId: item.cardId,
          operation: item.operation,
          merchant: item.merchant,
          brandMerchant: item.brandMerchant,
          mcc: item.mcc,
          purchaseAmount: item.purchaseAmount,
          purchaseDate: item.purchaseDate,
        }));

        const jsonData = filteredData
          .map((item) => JSON.stringify(item))
          .join(",\n");
        fs.appendFileSync(outputFile, `${jsonData},\n`);
      }
    } catch (error) {
      console.error(`Erro ao processar linha: ${row.id} - ${error.message}`);
    }
  })
  .on("end", () => {
    // Remove a última vírgula e fecha o array JSON
    fs.appendFileSync(outputFile, "{}]\n"); // Usando um objeto vazio para substituir a última vírgula
    console.log(`Arquivo salvo com sucesso em: ${outputFile}`);
  });
