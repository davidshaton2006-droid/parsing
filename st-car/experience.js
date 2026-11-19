/* ST CAR — symptom navigator, progressive enhancement only. */
(function(){
'use strict';
var symptomData={
 check:{title:'Компьютерная диагностика',description:'Горящий индикатор может иметь разные причины. Начните с проверки кодов ошибок и состояния связанных систем.',service:'Компьютерная диагностика',target:'diagnostics',icon:'#i-scan',position:'01 / 06'},
 suspension:{title:'Проверка подвески и рулевого',description:'Стуки возникают по разным причинам: от износа деталей подвески до проблем с рулевым управлением. Для определения причины нужен осмотр.',service:'Подвеска и рулевое управление',target:'suspension',icon:'#i-shock',position:'02 / 06'},
 alignment:{title:'Развал-схождение',description:'Если машину уводит с прямой, специалист может начать с проверки шин, ходовой части и углов установки колёс.',service:'Развал-схождение',target:'alignment',icon:'#i-wheel',position:'03 / 06'},
 electric:{title:'Диагностика автоэлектрики',description:'Сложности с запуском, светом или электропитанием требуют проверки аккумулятора, проводки и других узлов.',service:'Автоэлектрика',target:'electric',icon:'#i-bolt',position:'04 / 06'},
 brakes:{title:'Проверка тормозной системы',description:'Шум при торможении, вибрации и увеличение тормозного пути — повод обратиться на проверку. При серьёзных симптомах не продолжайте движение.',service:'Тормозная система',target:'brakes',icon:'#i-tool',position:'05 / 06'},
 maintenance:{title:'Плановое техническое обслуживание',description:'Регулярная замена расходных материалов и проверка узлов зависят от модели автомобиля и регламента производителя.',service:'Техническое обслуживание',target:'maintenance',icon:'#i-oil',position:'06 / 06'}
};
var buttons=Array.from(document.querySelectorAll('[data-symptom]'));
var title=document.getElementById('symptom-result-title');
var description=document.getElementById('symptom-result-description');
var position=document.getElementById('symptom-position');
var pictogram=document.querySelector('#symptom-big-icon use');
var request=document.getElementById('symptom-request');
var serviceLink=document.getElementById('symptom-service-link');
if(!buttons.length||!title||!description||!position||!pictogram||!request||!serviceLink)return;
buttons.forEach(function(button){button.addEventListener('click',function(){
 var data=symptomData[button.dataset.symptom];if(!data)return;
 buttons.forEach(function(item){item.setAttribute('aria-pressed',String(item===button))});
 title.textContent=data.title;
 description.textContent=data.description;
 position.textContent=data.position;
 pictogram.setAttribute('href',data.icon);
 request.setAttribute('data-open-request',data.service);
 serviceLink.setAttribute('href','#'+data.target);
})});
serviceLink.addEventListener('click',function(){
 document.querySelectorAll('.filter').forEach(function(item){item.setAttribute('aria-pressed',String(item.dataset.filter==='all'))});
 document.querySelectorAll('.service-card').forEach(function(card){card.hidden=false});
});
})();
