export const formFilter = document.querySelector(`.trip-filter`);

const createFilter = (nameFilter) => {
  return `<input type="radio" id="filter-${nameFilter}" name="filter" value="${nameFilter}" checked>
          <label class="trip-filter__item" for="filter-${nameFilter}">${nameFilter}</label>`;
};

export const renderFilters = (arrFilters) => {
  return arrFilters.map((element) => formFilter.insertAdjacentHTML(`beforeend`, createFilter(element)));
};
