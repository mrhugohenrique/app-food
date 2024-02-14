async function fetchAddressFromCEP(cep: string) {
    try {
        const response = await fetch(`https://viacep.com.br/ws/${cep}/json/`);
        const data = await response.json();
        return {
            city: data.localidade,
            neighborhood: data.bairro,
            address: data.logradouro,
            number: "",
            complement: ""
        };
    } catch (error) {
        return null;
    }
}

export { fetchAddressFromCEP };
