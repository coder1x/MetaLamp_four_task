import Panel from './Panel';

function renderPanel(className: string) {
  const panels: Panel[] = [];

  document.querySelectorAll(className).forEach((element) => {
    panels.push(new Panel(element, className));
  });

  return panels;
}

const objectPanel = renderPanel('.js-panel');

objectPanel[0].createRangeSlider({
  type: 'double',
  theme: 'fox',
  min: -120,
  max: 800,
  from: 200,
  to: 500,
  bar: true,
  grid: true,
  gridNumber: 40,
});

objectPanel[1].createRangeSlider({
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

objectPanel[2].createRangeSlider({
  type: 'double',
  min: -120,
  max: 800,
  from: 200,
  to: 500,
  grid: true,
  bar: true,
  gridStep: 30,
});
