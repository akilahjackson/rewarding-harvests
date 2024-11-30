export const getWinToastMessage = (hrvestTokens: number, isBigWin: boolean) => {
  const messages = isBigWin ? [
    "🌟 Cosmic Abundance! Your harvest is bountiful!",
    "✨ The stars align for a prosperous harvest!",
    "🌾 A legendary harvest bestowed upon you!"
  ] : [
    "🌱 Seeds of prosperity bloom!",
    "🍀 A rewarding harvest arrives!",
    "🌿 Nature's bounty smiles upon you!"
  ];
  
  return {
    title: isBigWin ? "🎊 SPECTACULAR HARVEST! 🎊" : "🌾 Bountiful Win! 🌾",
    description: `${messages[Math.floor(Math.random() * messages.length)]} ${hrvestTokens.toFixed(0)} HRVST`,
    duration: isBigWin ? 5000 : 2000,
  };
};

export const getLoseToastMessage = () => {
  const messages = [
    "🎲 Fortune favors the persistent!",
    "🍀 Your luck is brewing!",
    "🌱 Every attempt plants seeds of future wins!",
    "✨ The stars are still aligning!"
  ];

  return {
    title: "Keep Growing! 🌱",
    description: messages[Math.floor(Math.random() * messages.length)],
    duration: 1000,
  };
};