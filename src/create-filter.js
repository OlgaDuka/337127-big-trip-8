export const createFilter = (nameFilter) => {
  return `<input type="radio" id="filter-${nameFilter}" name="filter" value="${nameFilter}" checked>
          <label class="trip-filter__item" for="filter-${nameFilter}">${nameFilter}</label>`;
};
