// Factual catalogue based on chizhavto.ru/services/ navigation 2026-11-19.
// Do not add services not listed by the business. Source links lead to actual official materials.
export const ORIGIN='https://chizhavto.ru';
export const PHOTO={
 hero:'https://chizhavto.ru/upload/resize_cache/iblock/e4a/900_900_0/mtdza80sjtcz8bzte902fpm0eaamaysa.jpg',
 porscheDashboard:'https://chizhavto.ru/upload/resize_cache/iblock/d6b/900_900_0/hyhlufhldsdarm8y5218irwvepsao1bt.jpg',
 bmwInterior:'https://chizhavto.ru/upload/resize_cache/iblock/a7a/900_900_0/h3fbbwd1m2bdybxsc6sfm9xf1pcm2362.jpg',
 audi:'https://chizhavto.ru/upload/resize_cache/iblock/d22/900_900_0/x1nvlhy47jwy2ahrwv3oflocta0qxdjt.jpg',
 stars:'https://chizhavto.ru/upload/iblock/612/xhj7hx320c0tkfxr9m2gfoj03zakau2l.jpg',
 ambient:'https://chizhavto.ru/upload/iblock/2cd/s2l0itdojfz9fc3j77uw2t2wmn1zldvl.jpg',
 toyota:'https://chizhavto.ru/upload/resize_cache/iblock/188/900_900_0/b8am2gczpa8mtdm0tfxllm56gwvzj7th.jpg',
 gw:'https://chizhavto.ru/upload/resize_cache/iblock/a6d/900_900_0/uwvvumdj83kma8y6lp2w6tk1f3gtpspc.jpg',
 cabin:'https://chizhavto.ru/upload/resize_cache/iblock/591/900_900_0/c0rkh6em3z1fcpjh106obx1hum1nljdd.jpg',
 volkswagen:'https://chizhavto.ru/upload/resize_cache/iblock/6ef/900_900_0/d11il0617azqg7l3tt4358pz9pgl80ei.jpg',
 bmw:'https://chizhavto.ru/upload/resize_cache/iblock/f4f/900_900_0/n040fq35zw7y3ibn2a3eex265uth1g3t.jpg',
 headlight:'https://chizhavto.ru/upload/resize_cache/iblock/aaf/900_900_0/sphlycd0bzw57mez3328dprly7i0vpsd.jpg',
 headlight2:'https://chizhavto.ru/upload/resize_cache/iblock/e0f/900_900_0/bpyeq3o147d9r0xws5ueotcslzt0f635.jpg',
 tuning:'https://chizhavto.ru/upload/resize_cache/iblock/01d/900_900_0/3fshwxrz56qes3duiz71uxb3638j3080.jpg',
 porsche:'https://chizhavto.ru/upload/resize_cache/iblock/7f1/900_900_0/vfirxoo36k44st0k6x5h1oj9mujkxh7t.jpg',
 mazda:'https://chizhavto.ru/upload/resize_cache/iblock/60c/900_900_0/79mfyjo89zv4o39rq3wtn2i9c58f0pms.jpg',
 logo:'https://chizhavto.ru/include/logotype.png'
};
export const groups=[
 {id:'detail',name:'Защита кузова',small:'Плёнки и детейлинг',photo:PHOTO.bmw,slug:'okleyka',price:'от 15 000 ₽',items:[['Оклейка цветной полиуретановой плёнкой','okleyka-tsvetnoy-poliuretanovoy-plenkoy'],['Оклейка виниловой плёнкой (изменение цвета)','okleyka-vinilovoy-plenkoy-izmenenie-tsveta'],['Оклейка антигравийной гибридной плёнкой','okleyka-antigraviynoy-gibridnoy-plenkoy'],['Оклейка защитной полиуретановой плёнкой','okleyka-zashchitnoy-poliuretanovoy-plenkoy'],['Полировка кузова','polirovka-kuzova']]},
 {id:'tint',name:'Тонировка',small:'Стёкла и защита',photo:PHOTO.volkswagen,slug:'tonirovka',price:'от 4 000 ₽',items:[['Оклейка стёкол тонировочной плёнкой','okleyka-stekl-tonirovannoy-plenkoy'],['Оклейка стёкол атермальной плёнкой','okleyka-stekl-atermalnoy-plenkoy'],['Оклейка стёкол защитной плёнкой','okleyka-stekl-zashchitnoy-plenkoy']]},
 {id:'security',name:'Автосигнализации',small:'Охрана и автозапуск',photo:PHOTO.audi,slug:'avtosignalizatsii',price:'от 9 150 ₽',items:[]},
 {id:'moto',name:'Мотосигнализации',small:'Защита мототехники',photo:PHOTO.gw,slug:'motosignalizatsii',price:'от 6 300 ₽',items:[]},
 {id:'light',name:'Автосвет',small:'Оптика и интерьерный свет',photo:PHOTO.headlight,slug:'avtosvet',price:'от 1 000 ₽',items:[['Звёздное небо','zvezdnoe-nebo'],['Атмосферная подсветка салона','atmosfernaya-podsvetka-salona'],['Регулировка света фар','regulirovka-sveta-far'],['Устранение запотевания и чистка фар','ustranenie-zapotevaniya-far-chistka-far'],['Полировка и бронирование фар','polirovka-i-bronirovanie-far'],['Замена стёкол фар','zamena-stekol-far'],['Установка Bi-LED линз','ustanovka-bi-led-linz']]},
 {id:'sound',name:'Автозвук',small:'Акустика и усилители',photo:PHOTO.cabin,slug:'avtozvuk',price:'от 4 000 ₽',items:[['Улучшение штатной аудиосистемы','uluchshenie-zvuchaniya-shtatnoy-audiosistemy'],['Установка автозвука','ustanovka-avtozvuka']]},
 {id:'quiet',name:'Шумоизоляция',small:'Салон, двери, арки',photo:PHOTO.ambient,slug:'shumoizolyatsiya',price:'от 5 500 ₽',items:[]},
 {id:'doors',name:'Доводчики дверей',small:'Комфорт закрывания',photo:PHOTO.porsche,slug:'dovodchiki-dverey',price:'от 39 800 ₽',items:[]},
 {id:'trunk',name:'Электропривод багажника',small:'Комфорт доступа',photo:PHOTO.gw,slug:'elektroprivod-kryshki-bagazhnika',price:'от 4 000 ₽',items:[]},
 {id:'media',name:'Мультимедиа',small:'Android, экраны и камеры',photo:PHOTO.cabin,slug:'multimedia',items:[['Мониторы для задних пассажиров','monitory-dlya-zadnikh-passazhirov'],['Круговой обзор 360°','sistemy-krugovogo-obzora-sistemy-360'],['Камеры переднего и заднего вида','kamery-perednego-zadnego-vida'],['Штатные головные устройства Android','ustanovka-multimediyno-navigatsionnogo-bloka']]},
 {id:'parking',name:'Парктроники',small:'Контроль пространства',photo:PHOTO.toyota,slug:'parkovochnye-radary-parktroniki',items:[]},
 {id:'recorders',name:'Видеорегистраторы',small:'Фиксация движения',photo:PHOTO.mazda,slug:'videoregistratory',items:[]}
];
export const projects=[
 {title:'Устранение запотевания фары',car:'Audi A6',time:'1 день',price:'7 500 ₽',image:PHOTO.audi,link:'https://chizhavto.ru/projects/ustranenie-zapotevaniya-na-fare-audi/',desc:'Восстановление герметичности шва фары.'},
 {title:'Звёздное небо в салоне',car:'Mercedes',time:'1 неделя',price:'145 000 ₽',image:PHOTO.stars,link:'https://chizhavto.ru/projects/',desc:'Перетяжка потолка с оптоволоконными звёздами и кометами.'},
 {title:'Атмосферная подсветка',car:'Volkswagen Passat',time:'6 часов',price:'18 500 ₽',image:PHOTO.ambient,link:'https://chizhavto.ru/projects/',desc:'Подсветка салона по опубликованному проекту.'},
 {title:'Полировка и бронирование фар',car:'Toyota Prado 150',time:'1,5 часа',price:'8 000 ₽',image:PHOTO.toyota,link:'https://chizhavto.ru/projects/',desc:'Работы с оптикой Toyota.'},
 {title:'Установка дополнительного света',car:'Great Wall Poer',time:'10 часов',price:'15 000 ₽',image:PHOTO.gw,link:'https://chizhavto.ru/projects/',desc:'Подключение автомобильной люстры к штатной кнопке.'},
 {title:'Головное устройство и камеры',car:'Porsche Cayenne',time:'1 день',price:'109 000 ₽',image:PHOTO.porscheDashboard,link:'https://chizhavto.ru/projects/',desc:'Новая мультимедиа, круговой обзор и CarPlay.'},
 {title:'Модернизация автосвета',car:'Exeed TXL',time:'9 часов',price:'от 16 000 ₽',image:PHOTO.volkswagen,link:'https://chizhavto.ru/projects/',desc:'Работа с автомобильной оптикой.'},
 {title:'Установка мультимедиа BMW',car:'BMW',time:'по проекту',price:'по согласованию',image:PHOTO.bmwInterior,link:'https://chizhavto.ru/projects/',desc:'Автомобиль в мастерской и интерьер после установки.'},
 {title:'Подсветка и Android',car:'Geely Preface',time:'12 часов',price:'29 500 ₽',image:PHOTO.cabin,link:'https://chizhavto.ru/projects/',desc:'Контурная подсветка в штатные места.'},
 {title:'Полировка и бронирование оптики',car:'Mazda',time:'по проекту',price:'по согласованию',image:PHOTO.mazda,link:'https://chizhavto.ru/projects/',desc:'Автомобильная оптика в мастерской.'}
];
export const prices=[
 ['Оклейка цветной полиуретановой плёнкой','от 75 000 ₽'],
 ['Полная цветная полиуретановая оклейка кузова','от 210 000 ₽'],
 ['Полная виниловая оклейка кузова','от 210 000 ₽'],
 ['Тонировка','от 4 000 ₽'],
 ['Автосигнализации','от 9 150 ₽'],
 ['Мотосигнализации','от 6 300 ₽'],
 ['Автосвет, регулировка фар','от 1 000 ₽'],
 ['Звёздное небо (ручная работа)','от 115 000 ₽'],
 ['Контурная RGB-подсветка','от 21 000 ₽'],
 ['Устранение запотевания / чистка фар','от 6 000 ₽'],
 ['Полировка фар','от 2 500 ₽'],
 ['Bi-LED линзы','от 22 000 ₽'],
 ['Установка сабвуфера','от 4 000 ₽'],
 ['Шумоизоляция салона','от 45 000 ₽'],
 ['Шумоизоляция одной двери','от 4 500 ₽'],
 ['Доводчики дверей (комплект)','от 39 800 ₽'],
 ['Электропривод багажника','от 32 300 ₽'],
 ['Датчик открытия багажника ногой','от 4 000 ₽']
];
export const reviews=[
 {name:'Аслан Асланбеков',date:'22.12.2025',quote:'Профи своего дела, обращаюсь к ним не первый раз. Устанавливал видеорегистратор и менял повторитель. Всё сделали и вернули излишне уплаченную сумму.'},
 {name:'Юрий Кобж',date:'22.12.2025',quote:'До установки консультировали по всем вопросам, помогли подобрать продукт. Быстро выполнили работы и остались на связи после установки.'},
 {name:'Alex_Yan',date:'30.09.2026',quote:'Установили сигнализацию в новый гарантийный автомобиль. Всё чётко, быстро, подробно объяснили. Чистый и аккуратный сервис.'}
];
export const facts={address1:'Краснодар, ул. Жлобы, 115',address2:'Краснодар, ул. Каляева, 89',phone:'+7 (989) 199-00-22',tel:'+79891990022',email:'chizh-avto@mail.ru',hours:'Ежедневно, 09:00–18:00',map:'https://yandex.ru/maps/org/chizh_avto/1266081535/',youtube:'https://www.youtube.com/@chizhauto',video:'https://www.youtube.com/embed/7ocx6Vr29NY?rel=0'};
