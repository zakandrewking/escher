const scalePresets = {
  GaBuGeRd: [
    { type: 'min', color: '#c8c8c8', size: 12, duration: 4 },
    { type: 'value', value: 0.01, color: '#9696ff', size: 16, duration: 3 },
    { type: 'value', value: 20, color: '#209123', size: 20, duration: 2 },
    { type: 'max', color: '#ff0000', size: 25, duration: 1 }
  ],
  GaBuRd: [
    { type: 'min', color: '#c8c8c8', size: 12, duration: 3 },
    { type: 'median', color: '#9696ff', size: 20, duration: 2 },
    { type: 'max', color: '#ff0000', size: 25, duration: 1 }
  ],
  RdYlBu: [
    { type: 'min', color: '#d7191c', size: 12, duration: 3 },
    { type: 'median', color: '#ffffbf', size: 20, duration: 2 },
    { type: 'max', color: '#2c7bb6', size: 25, duration: 1 }
  ],
  GeGaRd: [
    { type: 'min', color: '#209123', size: 25, duration: 1 },
    { type: 'value', value: 0, color: '#c8c8c8', size: 12, duration: 3 },
    { type: 'max', color: '#ff0000', size: 25, duration: 1 }
  ],
  WhYlRd: [
    { type: 'min', color: '#fffaf0', size: 20, duration: 4 },
    { type: 'median', color: '#f1c470', size: 30, duration: 3 },
    { type: 'max', color: '#800000', size: 40, duration: 2 }
  ]
}

export default scalePresets
