
let modelsData = [];
let selectedBrand = null;
let selectedModel = null;
let selectedYear = null;
let selectedSize = null;

const brandSelect = document.getElementById('brandSelect');
const modelSelect = document.getElementById('modelSelect');
const yearSelect = document.getElementById('yearSelect');
const sizeSelect = document.getElementById('sizeSelect');
const resultArea = document.getElementById('resultArea');

fetch('models.json')
  .then(res => res.json())
  .then(data => {
    modelsData = data;
    populateBrandSelect();
  });

function populateBrandSelect() {
  brandSelect.innerHTML = '<option value="">ブランド選択</option>';
  modelsData.forEach(b => {
    const opt = document.createElement('option');
    opt.value = b.brand;
    opt.textContent = b.brand;
    brandSelect.appendChild(opt);
  });
}

brandSelect.addEventListener('change', () => {
  selectedBrand = brandSelect.value;
  selectedModel = null;
  selectedYear = null;
  selectedSize = null;
  populateModelSelect();
});

function populateModelSelect() {
  modelSelect.innerHTML = '<option value="">モデル選択</option>';
  if (!selectedBrand) return;
  const brandObj = modelsData.find(b => b.brand === selectedBrand);
  brandObj.models.forEach(m => {
    const opt = document.createElement('option');
    opt.value = m.name;
    opt.textContent = m.name;
    modelSelect.appendChild(opt);
  });
}

modelSelect.addEventListener('change', () => {
  selectedModel = modelSelect.value;
  selectedYear = null;
  selectedSize = null;
  populateYearSelect();
});

function populateYearSelect() {
  yearSelect.innerHTML = '<option value="">年式選択</option>';
  if (!selectedBrand || !selectedModel) return;
  const brandObj = modelsData.find(b => b.brand === selectedBrand);
  const modelObj = brandObj.models.find(m => m.name === selectedModel);
  modelObj.versions.forEach(v => {
    const opt = document.createElement('option');
    opt.value = v.year;
    opt.textContent = v.year;
    yearSelect.appendChild(opt);
  });
}

yearSelect.addEventListener('change', () => {
  selectedYear = yearSelect.value;
  selectedSize = null;
  populateSizeSelect();
});

function populateSizeSelect() {
  sizeSelect.innerHTML = '<option value="">サイズ選択</option>';
  if (!selectedBrand || !selectedModel || !selectedYear) return;
  const brandObj = modelsData.find(b => b.brand === selectedBrand);
  const modelObj = brandObj.models.find(m => m.name === selectedModel);
  const versionObj = modelObj.versions.find(v => v.year === selectedYear);
  versionObj.sizes.forEach(s => {
    const opt = document.createElement('option');
    opt.value = s.length_cm || s.length_mm;
    opt.textContent = `${s.length_cm || s.length_mm}cm`;
    sizeSelect.appendChild(opt);
  });
}

sizeSelect.addEventListener('change', () => {
  selectedSize = sizeSelect.value;
  showResult();
});

function showResult() {
  if (!selectedBrand || !selectedModel || !selectedYear || !selectedSize) return;
  const brandObj = modelsData.find(b => b.brand === selectedBrand);
  const modelObj = brandObj.models.find(m => m.name === selectedModel);
  const versionObj = modelObj.versions.find(v => v.year === selectedYear);
  const sizeObj = versionObj.sizes.find(s => (s.length_cm || s.length_mm).toString() === selectedSize);
  resultArea.innerHTML = `<pre>${JSON.stringify(sizeObj, null, 2)}</pre>`;
}
