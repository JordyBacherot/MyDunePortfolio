import { useUniverse } from "../contexts/UniverseContext";
import HeroCyberpunk from "./hero/HeroCyberpunk";
import HeroPoster from "./hero/HeroPoster";

// Le Hero dépend de l'univers : affiche animée (Dune) ou ville nocturne (Cyberpunk)
const Hero = () => {
    const { universe } = useUniverse();
    return universe === "dune" ? <HeroPoster /> : <HeroCyberpunk />;
};

export default Hero;
