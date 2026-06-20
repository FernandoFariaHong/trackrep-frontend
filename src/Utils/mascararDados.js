export const mascararEmail = (email) => {
  if (!email || !email.includes("@")) return "";

  const [nome, dominio] = email.split("@");

  if (nome.length <= 2) {
    return `${nome[0]}***@${dominio}`;
  }

  const primeiro = nome.substring(0, 2);
  const ultimo = nome.substring(nome.length - 1);

  return `${primeiro}***${ultimo}@${dominio}`;
};