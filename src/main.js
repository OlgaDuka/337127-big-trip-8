import Model from './model/model';
import Controller from './controller';

const model = new Model();
const app = new Controller(model);

app.renderFilters(model.filters);
app.renderEvents(model.events);
app.moneyStat.render();
app.transportStat.render();
app.timeSpendStat.render();
