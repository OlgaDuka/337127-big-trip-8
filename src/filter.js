export const formFilter = document.querySelector(`.trip-filter`);

const getHtmlFilter = (nameFilter) => {
  return `<input type="radio" id="filter-${nameFilter}" name="filter" value="${nameFilter}" checked>
          <label class="trip-filter__item" for="filter-${nameFilter}">${nameFilter}</label>`;
};

export const renderFilters = (arrFilters) => {
  arrFilters.forEach(function (element) {
    formFilter.insertAdjacentHTML(`beforeend`, getHtmlFilter(element));
  });
};
