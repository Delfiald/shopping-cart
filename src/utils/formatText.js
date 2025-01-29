const formatText = (() => {
 const priceText = (string) => {
  return `$${string}`;
 };

 const capitalizedWords = (string) => {
  return string
   .split(" ")
   .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
   .join(" ");
 };

 return {
  priceText,
  capitalizedWords,
 };
})();

export default formatText;
