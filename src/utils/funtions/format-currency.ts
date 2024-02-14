export function formatCurrency(value: number){
    return value.toLocaleString("pt-BR", {
        style: "currency",
        currency: "BRL",
      });
}


export function formatphone(value: string){
  const regex = /^([0-9]{2})([0-9]{4,5})([0-9]{4})$/;
  var str = value.replace(/[^0-9]/g, "").slice(0, 11);
  const result = str.replace(regex, "($1)$2-$3");
  return result;
}


export function formatCEP(value: string | undefined) {
  if (value === undefined || value === null) {
    return '';
  }

  const regex = /^(\d{5})-?(\d{3})$/;
  var str = value.replace(/[^0-9]/g, "").slice(0, 8);
  const result = str.replace(regex, "$1-$2");
  return result;
}

