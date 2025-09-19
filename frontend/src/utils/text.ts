export const truncateText = (text: string, maxLength: number): string => {
  if (text.length <= maxLength) {
    return text;
  }
  const lastSpaceIndex = text.lastIndexOf(' ', maxLength);
  if (lastSpaceIndex > 0) {
    return (
      text.slice(0, lastSpaceIndex) + '\n' + text.slice(lastSpaceIndex + 1)
    );
  }
  return text.slice(0, maxLength) + '\n' + text.slice(maxLength);
};
