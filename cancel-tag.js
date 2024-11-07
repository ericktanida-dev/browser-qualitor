const token =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJrZXkiOiJVMkZzZEdWa1gxOTdFcUZ0VW5pV212a1BGc2YvWm5TRVc0NUg4Rm1PSG1QRGRvTXJTalhhTGtxcFJLYzhHLy81cVlWK3ZPSklNMjV2YUZhbjRIVEJpcUgyL1NKRkF0MlVPWEw0UmpSNUhEemRnbHJlM1hqSklBPT0iLCJ1c2VybmFtZSI6InRtb3YtcGF5IiwiaWF0IjoxNzMwNzIxNzQyLCJleHAiOjE3MzA4MDgxNDJ9.bKDaEJ2jkGZC1rpawbZpKyHZbniEhc-7IGN7cf2j_xY";

const tags = [
  "1965100000128867",
  "1965100000060086",
  "1965100000325448",
  "1965100000060128",
  "1965100000128917",
  "1965100000370857",
  "1965100000060227",
  "1965100000112341",
];

// Função para realizar o patch
async function cancelTag(tagId) {
  const url = `https://api-tag.tmov.com.br/v2/tags/${tagId}/cancel`;

  try {
    const response = await fetch(url, {
      method: "PATCH",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        nomeUsuario: "Erick Tanida",
        cpfUsuario: "05714726995",
      }),
    });

    if (response.ok) {
      console.log(`Tag ${tagId} cancelada com sucesso`, response?.status);
    } else {
      console.error(
        `Erro ao cancelar tag ${tagId}:`,
        response.status,
        response.statusText
      );
    }
  } catch (error) {
    console.error(`Erro na requisição para tag ${tagId}:`, error);
  }
}

// Loop sobre o array de IDs para cancelar
tags.forEach(cancelTag);
