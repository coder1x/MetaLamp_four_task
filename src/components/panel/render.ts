import Panel from './Panel';

function renderPanel(className: string) {
  const panels: Panel[] = [];

  document.querySelectorAll(className).forEach((elem) => {
    panels.push(new Panel(elem, className));
  });

  return panels;
}

const objPanel = renderPanel('.js-panel');

objPanel[0].createRangeSlider({
  type: 'double',
  theme: 'fox',
  min: -120,
  max: 800,
  from: 200,
  to: 500,
  bar: true,
  grid: true,
  gridNum: 40,
});

objPanel[1].createRangeSlider({
  type: 'double',
  orientation: 'vertical',
  theme: 'dark',
  min: -120,
  max: 800,
  from: 200,
  to: 500,
  bar: true,
  grid: true,
  gridStep: 33,
});

objPanel[2].createRangeSlider({
  type: 'double',
  min: -120,
  max: 800,
  from: 200,
  to: 500,
  grid: true,
  bar: true,
  gridStep: 30,
});
