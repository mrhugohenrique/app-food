import { useState } from "react";
import { Text, View, ScrollView, Alert, Linking } from "react-native";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { ProductCartProps, useCartStore } from "@/stores/cart-stores";
import { formatCurrency } from "@/utils/funtions/format-currency";

import { Header } from "@/components/header";
import { Input } from "@/components/input";
import { Product } from "@/components/product";
import { Button } from "@/components/button";
import { Feather } from "@expo/vector-icons";
import { LinkButton } from "@/components/link-button";
import { useNavigation } from "expo-router";



export default function Cart() {
  const [address, setAddress] = useState("");
  const cartStore = useCartStore();
  const navigation = useNavigation();

  const total = formatCurrency(
    cartStore.products.reduce(
      (total, product) => total + product.price * product.quantity,
      0
    )
  );

  function handleProductRemove(product: ProductCartProps) {
    Alert.alert("Remover", `Deseja remover ${product.title} do carrinho ?`, [
      {
        text: "Cancelar",
      },
      {
        text: "Remover",
        onPress: () => cartStore.remove(product.id),
      },
    ]);
  }

  function handleOrder() {
    if (address.trim().length === 0) {
      return Alert.alert("Pedido", "Informe os dados de entrega.");
    }

    const products = cartStore.products
      .map((product) => `\n ${product.quantity} ${product.title}`)
      .join("");

    const mensage = `
      NOVO PEDIDO
    \n Entregar em: ${address}

    ${products}

    \n Valor total: ${total}
    `

    cartStore.clear();
    Alert.alert("Pedido", "Seu pedido foi realizado com sucesso!");
    navigation.goBack();
  }

  return (
    <View className="flex-1 pt-8">
      <Header title="Seu carrinho"></Header>
      <KeyboardAwareScrollView>
        <ScrollView>
          <View className="p-5 flex-1">
            {cartStore.products.length > 0 ? (
              <View className="border-b border-slate-700">
                {cartStore.products.map((product) => (
                  <Product
                    key={product.id}
                    data={product}
                    onPress={() => handleProductRemove(product)}
                  />
                ))}
                <Input
                  placeholder="Informe o endereço de entrega com rua, bairro, CEP, número e complemento..."
                  onChangeText={setAddress}
                  blurOnSubmit={true}
                  onSubmitEditing={handleOrder}
                  returnKeyType="next"
                />
              </View>
            ) : (
              <Text className="font-body text-slate-400 text-center my-8">
                Carrinho sem produtos.
              </Text>
            )}
          </View>
        </ScrollView>
      </KeyboardAwareScrollView>

      <View className="p-5 gap-5">
        {cartStore.products.length > 0 && (
          <View className="flex-row gap-2 items-center mt-5 mb-4">
            <Text className="text-white text-xl font-subtitle">Total:</Text>
            <Text className="text-lime-400 text-2xl font-heading">{total}</Text>
          </View>
        )}

        {cartStore.products.length > 0 && (
          <Button onPress={handleOrder}>
            <Button.Text>Enviar pedido</Button.Text>
            <Button.Icon>
              <Feather name="arrow-right-circle" size={20} />
            </Button.Icon>
          </Button>
        )}

        <LinkButton title="Voltar ao cardápio" href="/" />
      </View>
    </View>
  );
}
