// 计数器功能
let counter = 0;
const counterValue = document.getElementById('counterValue');
const decrementBtn = document.getElementById('decrementBtn');
const incrementBtn = document.getElementById('incrementBtn');

decrementBtn.addEventListener('click', () => {
  counter--;
  counterValue.textContent = counter;
});

incrementBtn.addEventListener('click', () => {
  counter++;
  counterValue.textContent = counter;
});

// 颜色切换功能
const title = document.getElementById('title');
const changeColorBtn = document.getElementById('changeColorBtn');
const colors = ['#333', '#e74c3c', '#3498db', '#2ecc71', '#f1c40f'];
let currentColorIndex = 0;

changeColorBtn.addEventListener('click', () => {
  currentColorIndex = (currentColorIndex + 1) % colors.length;
  title.style.color = colors[currentColorIndex];
});