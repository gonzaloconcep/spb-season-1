"use client";

import { Body } from "@/components/layout/Body";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Wrapper } from "@/components/layout/Wrapper";
import { Button } from "@/components/ui/button";
import { useOrder } from "@/lib/hooks/useOrder";
import { OrderItems } from "@/components/Order/Items";

export default function Home() {
  const { order } = useOrder();
  return (
    <Wrapper>
      <Header>
        <h1 className="text-xl font-semibold text-black">La cuenta</h1>
      </Header>
      <Body className="">
        <OrderItems items={order.items} />
      </Body>
      <Footer>
        <Button
          size="lg"
          className="w-full bg-green-600 hover:bg-green-700 text-white h-12"
        >
          Pagar
        </Button>
      </Footer>
    </Wrapper>
  );
}
