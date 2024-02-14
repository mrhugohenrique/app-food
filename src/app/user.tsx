import { useState } from "react";
import { View, Text, ScrollView, Alert } from "react-native";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { Feather } from "@expo/vector-icons";

import { Header } from "@/components/header";
import { Button } from "@/components/button";
import { Input } from "@/components/input";

import { useRouter } from "expo-router";
import { useCartStore } from "@/stores/cart-stores";
import { useUserStore } from "@/stores/user-stores";
import { formatCEP, formatphone } from "@/utils/funtions/format-currency";
import { fetchAddressFromCEP } from "@/utils/services/cepService";
import { LinkButton } from "@/components/link-button";

export default function User() {
  const cartStore = useCartStore();
  const userStore = useUserStore();
  const user = userStore.user;
  const router = useRouter();
  const focusField = determineFocusField();

  const [name, setName] = useState(user.name);
  const [email, setEmail] = useState(user.email);
  const [phone, setPhone] = useState(user.phone);
  const [CEP, setCEP] = useState(user.CEP);
  const [city, setCity] = useState(user.city);
  const [neighborhood, setNeighborhood] = useState(user.neighborhood);
  const [address, setAddress] = useState(user.address);
  const [number, setNumber] = useState(user.number);
  const [complement, setComplement] = useState(user.complement);

  async function handleCEPChange(cep: string) {
    setCEP(cep);
    if (cep.length === 8) {
      try {
        const data = await fetchAddressFromCEP(cep);
        if (data) {
          setCity(data.city);
          setNeighborhood(data.neighborhood);
          setAddress(data.address);
        } else {
          setCity("");
          setNeighborhood("");
          setAddress("");
          Alert.alert(
            "CEP não encontrado",
            "Por favor, verifique o CEP informado."
          );
        }
      } catch (error) {
        Alert.alert(
          "Erro",
          "Ocorreu um erro ao buscar os dados do CEP. Por favor, tente novamente mais tarde."
        );
      }
    } else {
      setCity("");
      setNeighborhood("");
      setAddress("");
    }
  }

  function determineFocusField() {
    if (user && user.name && !user.name.trim()) return user.name;
    if (user && user.email && !user.email.trim()) return user.email;
    if (user && user.phone && !user.phone.trim()) return user.phone;
    if (user && user.CEP && !user.CEP.trim()) return user.CEP;
    if (user && user.city && !user.city.trim()) return user.city;
    if (user && user.neighborhood && !user.neighborhood.trim())
      return user.neighborhood;
    if (user && user.address && !user.address.trim()) return user.address;
    if (user && user.number && !user.number.trim()) return user.number;

    return "";
  }

  function checkFields(fields: { name: string; value: string }[]) {
    for (const field of fields) {
      if (field.value?.trim?.().length === 0) {
        return field.name;
      }
    }
    return null;
  }

  function handleSaveProfile() {
    const fields = [
      { name: "Nome", value: name },
      { name: "Email", value: email },
      { name: "Telefone", value: phone },
      { name: "CEP", value: CEP },
      { name: "Cidade", value: city },
      { name: "Bairro", value: neighborhood },
      { name: "Endereço", value: address },
      { name: "Número", value: number },
    ];

    const emptyField = checkFields(fields);

    if (emptyField) {
      return Alert.alert(
        "Atenção",
        `Preencha o campo ${emptyField} para salvar seu perfil`
      );
    }

    userStore.save({
      name,
      email,
      phone,
      CEP,
      city,
      neighborhood,
      address,
      number,
      complement,
    });

    Alert.alert("Atenção", "Seu perfil foi salvo com sucesso", [
      {
        text:
          cartStore.products.length > 0
            ? "Ir para carrinho"
            : "Ir para o cardápio",
        onPress: () => {
          cartStore.products.length > 0
            ? router.push("/cart")
            : router.push("/");
        },
      },
    ]);
  }

  return (
    <View className="flex-1 pt-8">
      <Header title="Perfil" cartQuantityItems={cartStore.products.length} />
      <KeyboardAwareScrollView>
        <ScrollView className="my-4">
          <View className=" mt-10 px-5 gap-4">
            <Input
              placeholder="Nome"
              onChangeText={setName}
              value={name}
              autoFocus={focusField === name}
              blurOnSubmit
              returnKeyType="next"
              maxLength={80}
            />
            <Input
              placeholder="E-mail"
              onChangeText={setEmail}
              value={email}
              autoFocus={focusField === email}
              keyboardType="email-address"
              blurOnSubmit
              returnKeyType="next"
              maxLength={80}
            />
            <Input
              placeholder="Telefone"
              onChangeText={setPhone}
              value={formatphone(phone)}
              keyboardType="phone-pad"
              blurOnSubmit
              returnKeyType="next"
              maxLength={14}
            />
            <View className="flex flex-row">
              <Input
                placeholder="CEP"
                onChangeText={handleCEPChange}
                value={formatCEP(CEP)}
                autoFocus={focusField === CEP}
                keyboardType="phone-pad"
                blurOnSubmit
                returnKeyType="next"
                className="flex-1 mr-2"
                maxLength={9}
              />
              <Input
                placeholder="Cidade"
                onChangeText={setCity}
                value={city}
                autoFocus={focusField === city}
                blurOnSubmit
                returnKeyType="next"
                className="flex-1 ml-2"
                maxLength={80}
              />
            </View>
            <Input
              placeholder="Bairro"
              onChangeText={setNeighborhood}
              value={neighborhood}
              autoFocus={focusField === neighborhood}
              blurOnSubmit
              returnKeyType="next"
              className="flex-1 ml-2"
              maxLength={80}
            />
            <View className="flex flex-row">
              <Input
                placeholder="Endereço"
                onChangeText={setAddress}
                value={address}
                autoFocus={focusField === address}
                blurOnSubmit
                returnKeyType="next"
                className="w-3/4 mr-2"
                maxLength={200}
              />
              <Input
                placeholder="Nº"
                onChangeText={setNumber}
                value={number}
                autoFocus={focusField === number}
                keyboardType="phone-pad"
                blurOnSubmit
                returnKeyType="next"
                className="flex-1"
                maxLength={15}
              />
            </View>
            <Input
              placeholder="Apto, conjunto, unidade, etc."
              textAlignVertical="top"
              onChangeText={setComplement}
              value={complement}
              onSubmitEditing={handleSaveProfile}
              blurOnSubmit
              returnKeyType="done"
              maxLength={80}
            />
          </View>
        </ScrollView>
      </KeyboardAwareScrollView>

      <View className="p-5 gap-5">
        <Button onPress={handleSaveProfile}>
          <Button.Icon>
            <Feather name="save" size={20} />
          </Button.Icon>
          <Button.Text>Salvar</Button.Text>
        </Button>

        <LinkButton
          title={
            cartStore.products.length > 0
              ? "Ir para carrinho"
              : "Ir para o cardápio"
          }
          href={cartStore.products.length > 0 ? "/cart" : "/"}
        />
      </View>
    </View>
  );
}
