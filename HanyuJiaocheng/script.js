let voices = [];

function loadVoices() {
  voices = window.speechSynthesis.getVoices();
}

if (window.speechSynthesis.onvoiceschanged !== undefined) {
  window.speechSynthesis.onvoiceschanged = loadVoices;
}

function speak(text, param) {
  // Спираме разпространението, ако параметърът е event (Урок 13)
  if (param && param.stopPropagation) {
    param.stopPropagation();
  }

  window.speechSynthesis.cancel();
  const utterance = new SpeechSynthesisUtterance(text);
  utterance.lang = 'zh-CN';
  utterance.rate = 0.85;

  const allVoices = window.speechSynthesis.getVoices();
  let cnVoices = allVoices.filter(v => 
    (v.lang === 'zh-CN' || v.lang === 'zh_CN' || v.lang.toLowerCase().includes('zh-hans')) &&
    !v.lang.includes('HK') && !v.lang.includes('TW')
  );

  if (cnVoices.length === 0) cnVoices = allVoices.filter(v => v.lang.includes('zh'));

  let voiceType = 'female'; 

  if (typeof param === 'string') {
    const p = param.toLowerCase();
    // Списък с мъжки роли/типове
    if (
      p.includes('male') || 
      ['关建平', '张东', 'a', 'b', 'narrator', 'male-serious'].includes(p)
    ) {
      voiceType = 'male';
    }
  }

  if (voiceType === 'male') {
    utterance.voice = cnVoices.find(v => v.name.includes('Yunxi') || v.name.includes('Yunze') || v.name.includes('Kangkang')) || cnVoices[0];
    utterance.pitch = 0.9;
  } else {
    utterance.voice = cnVoices.find(v => v.name.includes('Xiaoxiao') || v.name.includes('Huihui')) || cnVoices[0];
    utterance.pitch = 1.05;
  }

  window.speechSynthesis.speak(utterance);
}

document.addEventListener('DOMContentLoaded', () => {
  // Поддръжка на всички вариации на ID-та
  const themeBtn = document.getElementById('themeBtn') || document.getElementById('toggleThemeBtn');
  const zhSlider = document.getElementById('zhSlider') || document.getElementById('zhFontSlider');
  const bgSlider = document.getElementById('bgSlider') || document.getElementById('bgFontSlider');
  const zhValLabel = document.getElementById('zhVal') || document.getElementById('zhFontValue');
  const bgValLabel = document.getElementById('bgVal') || document.getElementById('bgFontValue');

  if (themeBtn) {
    themeBtn.addEventListener('click', () => {
      document.body.classList.toggle('light-theme');
      themeBtn.textContent = document.body.classList.contains('light-theme') ? '☀️' : '🌙';
    });
  }

  const updateFontSize = (slider, prop, label) => {
    if (slider) {
      slider.addEventListener('input', () => {
        document.documentElement.style.setProperty(prop, slider.value + 'px');
        if (label) label.textContent = slider.value + (label.id.includes('Value') ? ' px' : '');
      });
    }
  };

  updateFontSize(zhSlider, '--zh-font-size', zhValLabel);
  updateFontSize(bgSlider, '--bg-font-size', bgValLabel);

  // Глобален слушател за спойлери - работи за всички елементи с този клас
  document.addEventListener('click', (e) => {
    if (e.target.classList.contains('bg-spoiler')) {
      e.target.classList.toggle('revealed');
    }
  });

  loadVoices();
});