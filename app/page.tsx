import { Body } from "@/components/layout/Body";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Wrapper } from "@/components/layout/Wrapper";

export default function Home() {
  return (
    <Wrapper>
      <Header>
        <p>Header</p>
      </Header>
      <Body>
        <div className="flex flex-col items-center justify-center text-center min-h-full">
          <h1 className="text-2xl font-bold">Sevilla Product Build</h1>
          <p className="text-lg">#Season 1</p>
        </div>

        <div className="flex flex-col items-center justify-center text-center min-h-full">
          <h1 className="text-2xl font-bold">Sevilla Product Build</h1>
          <p className="text-lg">#Season 2</p>
        </div>
      </Body>
      <Footer>
        <p>Footer</p>
      </Footer>
    </Wrapper>
  );
}
