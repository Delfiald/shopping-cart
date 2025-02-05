const setItem = (key, value) => {
 try {
  const serializedValue = JSON.stringify(value);
  localStorage.setItem(key, serializedValue);
 } catch (error) {
  console.error("Failed to set item in localStorage", error);
 }
};

const getItem = (key) => {
 try {
  const serializedValue = localStorage.getItem(key);
  return serializedValue ? JSON.parse(serializedValue) : null;
 } catch (error) {
  console.error("Failed to get Item: ", error);
  return null;
 }
};

const removeItem = (key) => {
 try {
  localStorage.removeItem(key);
 } catch (error) {
  console.error("Failed to remove item: ", error);
 }
};
export { setItem, getItem, removeItem };
