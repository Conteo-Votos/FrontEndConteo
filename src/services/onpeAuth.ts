export const verifyOnpePin = async (pin: string): Promise<boolean> => {
  // Simular latencia de red para la validación asíncrona
  return new Promise((resolve) => {
    setTimeout(() => {
      // El PIN estático temporal como Gatekeeper
      resolve(pin === '123456');
    }, 800);
  });
};
