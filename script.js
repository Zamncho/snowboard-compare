// script.js のサンプル
let data = [];
let selectedBrand = null;
let selectedModel = null;
let compareList = [];

async function loadData() {
  const res = await fetch('models.json');
  data = await res.json();
  renderBrands();
}

function renderBrands() {
  const ul = document.getElementById('brandList');
  ul.innerHTML = '';
  data.forEach(brand => {
    const li = document.createElement('li');
    li.textContent = brand.brand;
    li.onclick = () => {
      selectedBrand = brand;
      selectedModel = null;
      renderBrands();
      renderModels();
      renderSizes();
    };
    if (selectedBrand && selectedBrand.brand === brand.brand) {
      li.classList.add('selected');
    }
    ul.appendChild(li);
  });
}

function renderModels() {
  const ul = document.getElementById('modelList');
  ul.innerHTML = '';
  if (!selectedBrand) return;
  selectedBrand.models.forEach(model => {
    const li = document.createElement('li');
    li.textContent = model.name;
    li.onclick = () => {
      selectedModel = model;
      renderModels();
      renderSizes();
    };
    if (selectedModel && selectedModel.name === model.name) {
      li.classList.add('selected');
    }
    ul.appendChild(li);
  });
}

function renderSizes() {
  const ul = document.getElementById('sizeList');
  ul.innerHTML = '';
  if (!selectedModel) return;
  selectedModel.sizes.forEach((size, idx) => {
    const li = document.createElement('li');
    li.textContent = `${size.length_mm} mm`;
    const checkbox = document.createElement('input');
    checkbox.type = 'checkbox';
    checkbox.style.marginRight = '8px';
    checkbox.onchange = (e) => {
      if (e.target.checked) {
        addToCompare(selectedBrand.brand, selectedModel.name, size);
      } else {
        removeFromCompare(selectedBrand.brand, selectedModel.name, size);
      }
    };
    li.prepend(checkbox);
    ul.appendChild(li);
  });
}

function addToCompare(brand, model, size) {
  // 重複チェック
  if (compareList.some(item => item.brand === brand && item.model === model && item.size.length_mm === size.length_mm)) return;
  compareList.push({ brand, model, size });
  renderCompare();
}

function removeFromCompare(brand, model, size) {
  compareList = compareList.filter(item => !(item.brand === brand && item.model === model && item.size.length_mm === size.length_mm));
  renderCompare();
}

function renderCompare() {
  const area = document.getElementById('compareArea');
  if (compareList.length === 0) {
    area.textContent = 'サイズを選択してください';
    return;
  }
  // 比較テーブル作成
  let html = '<table><thead><tr><th>項目</th>';
  compareList.forEach(item => {
    html += `<th>${item.brand} - ${item.model} - ${item.size.length_mm}mm</th>`;
  });
  html += '</tr></thead><tbody>';

  const keys = ['length_mm','running_length_mm','effective_edge_mm','nose_width_mm','waist_width_mm','tail_width_mm'];
  const labels = {
    length_mm: '長さ (mm)',
    running_length_mm: 'ランニング長 (mm)',
    effective_edge_mm: '有効エッジ (mm)',
    nose_width_mm: 'ノーズ幅 (mm)',
    waist_width_mm: 'ウエスト幅 (mm)',
    tail_width_mm: 'テール幅 (mm)'
  };

  keys.forEach(key => {
    html += `<tr><td>${labels[key]}</td>`;
    compareList.forEach(item => {
      html += `<td>${item.size[key]}</td>`;
    });
    html += '</tr>';
  });

  html += '</tbody></table>';
  area.innerHTML = html;
}

window.onload = loadData;
