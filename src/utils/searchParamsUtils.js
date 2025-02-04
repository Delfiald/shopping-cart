export const createHandlePageChange = (setSearchParams) => (page) => {
 setSearchParams((prevParams) => {
  const params = new URLSearchParams(prevParams);
  params.set("page", page);
  return params;
 });
};

export const createHandleItemsPerPageChange =
 (setSearchParams) => (itemsPerPage) => {
  setSearchParams((prevParams) => {
   const params = new URLSearchParams(prevParams);
   params.set("page", 1);
   params.set("itemsPerPage", itemsPerPage);

   return params;
  });
 };

export const createHandleSortChange = (setSearchParams) => (sort) => {
 setSearchParams((prevParams) => {
  const params = new URLSearchParams(prevParams);
  params.set("sort", sort);
  return params;
 });
};

export const createHandleFilterChange = (setSearchParams) => (newCategory) => {
 setSearchParams((prevParams) => {
  const params = new URLSearchParams(prevParams);
  params.set("category", newCategory);
  params.set("page", 1);
  return params;
 });
};
