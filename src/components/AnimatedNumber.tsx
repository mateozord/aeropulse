import { useAnimatedNumber } from "../utils/useAnimatedNumber";

export function AnimatedNumber({ value }: { value: number }) {
  return <>{useAnimatedNumber(value)}</>;
}
