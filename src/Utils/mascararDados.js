export const mascararEmail = (email) => {
  if (!email || !email.includes("@")) return "";

  const [nome, dominio] = email.split("@");

  if (nome.length <= 2) {
    return `${nome[0]}***@${dominio}`;
  }

  return `${nome.substring(0, 2)}***@${dominio}`;
};