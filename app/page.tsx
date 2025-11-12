import { Body } from "@/components/layout/Body";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Wrapper } from "@/components/layout/Wrapper";
import { Button } from "@/components/ui/button";

export default function Home() {
  return (
    <Wrapper>
      <Header>
        <h1 className="text-xl font-bold">Resumen de la cuenta</h1>
      </Header>
      <Body></Body>
      <Footer>
        <Button size="lg" className="w-full" color="primary">
          Pagar
        </Button>
      </Footer>
    </Wrapper>
  );
}
