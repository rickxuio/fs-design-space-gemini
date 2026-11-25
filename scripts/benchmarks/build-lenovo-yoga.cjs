#!/usr/bin/env node
'use strict';

const fs = require('node:fs');
const path = require('node:path');
const H = require('../page-helpers.cjs');

const ROOT = path.resolve(__dirname, '../..');
const SLUG = 'lenovo-yoga';
const RELEASE = '98d6fd30548f297ae62ab98949c5555cf5966d8d4f4c6551aa01e9345678aa03';
const STAR_ON_SRC = `../fs-components/component-specs/library/releases/${RELEASE}/components/icons/icon-rate-on-16.svg`;
const STAR_OFF_SRC = `../fs-components/component-specs/library/releases/${RELEASE}/components/icons/icon-rate-off-16.svg`;
const OUT_FILE = path.join(ROOT, 'pages', 'lenovo-yoga-pc.html');
const REF_DIR = path.join(ROOT, 'reference-inputs', SLUG);
const SOURCE_REF = `reference-inputs/${SLUG}/content.json`;

const DISCOVER_SERIES = [
  {
    objectId: 'series-pro',
    title: 'Pro',
    description: 'Studio-grade performance, pro-grade creation experience.',
    image: 'assets/lenovo-yoga/img-04-699621cd.jpg',
    alt: 'A hand writes with a stylus on the trackpad of a Yoga Pro laptop.',
    href: 'https://www.lenovo.com/hk/en/c/laptops/yoga/yoga-pro-series/',
  },
  {
    objectId: 'series-slim',
    title: 'Slim',
    description: 'The most portable Yoga laptops that empower all-day creativity.',
    image: 'assets/lenovo-yoga/img-05-5d86b830.jpg',
    alt: 'A photographer in a city landscape takes a picture near a Yoga Slim laptop.',
    href: 'https://www.lenovo.com/hk/en/c/laptops/yoga/yoga-slim-series/',
  },
  {
    objectId: 'series-2in1',
    title: '2-in-1',
    description: 'Versatile devices that provide more ways to create.',
    image: 'assets/lenovo-yoga/img-06-0440d998.jpg',
    alt: 'A Yoga 9i 2-in-1 rests on a desk in presentation mode.',
    href: 'https://www.lenovo.com/hk/en/c/laptops/yoga/yoga-2-in-1-series/',
  },
  {
    objectId: 'series-tablets',
    title: 'Tablets',
    description: 'Hands-on Yoga device that cultivates creative flow wherever you go.',
    image: 'assets/lenovo-yoga/img-07-945f11c6.jpg',
    alt: 'A young woman draws on a Yoga Tab.',
    href: 'https://www.lenovo.com/hk/en/c/tablets/android-tablets/yoga-tab-series/',
  },
  {
    objectId: 'series-aio',
    title: 'All-in-One',
    description: 'A powerful, design-forward desktop experience that anchors creative workflows at home or in the studio.',
    image: 'assets/lenovo-yoga/img-08-4cf61415.jpg',
    alt: 'A Lenovo Yoga all-in-one desktop rests on a desk alongside a keyboard and mouse.',
    href: 'https://www.lenovo.com/hk/en/c/desktops/yoga/yoga-a-series/',
  },
  {
    objectId: 'series-mini',
    title: 'Mini',
    description: 'Smart. Sleek. Sensing. The innovative compact powerhouse that thinks big and performs bigger.',
    image: 'assets/lenovo-yoga/img-09-401806ba.jpg',
    alt: 'A Lenovo Yoga Mini rests on a desk beside a book and a monitor.',
    href: 'https://www.lenovo.com/hk/en/c/desktops/yoga/yoga-mini-series/',
  },
];

const FEATURED_PRODUCTS = [
  {
    objectId: 'feat-rtx-spark',
    title: 'Powered by NVIDIA RTX Spark™',
    description: 'A New Era of AI Computing and Creativity',
    bullets: [],
    image: 'assets/lenovo-yoga/img-10-5750425d.jpg',
    alt: 'Lenovo Yoga laptop powered by NVIDIA RTX Spark',
    linkLabel: 'Learn More',
    href: 'https://www.lenovo.com/hk/en/rtx-spark/#YOGA-PN',
  },
  {
    objectId: 'feat-pro-9n',
    title: 'Yoga Pro 9n (15", Gen 11) NVIDIA',
    description: 'NVIDIA RTX Spark™ — one PC built for creating, AI agents and gaming',
    bullets: [
      'Boost, speed, efficiency & multitasking with AI-driven optimization via Lenovo X Power',
      '15.3" stunning PureSight Pro OLED display built for creators & power users',
    ],
    image: 'assets/lenovo-yoga/img-11-60f28ded.jpg',
    alt: 'Yoga Pro 9n (15", Gen 11) NVIDIA laptop',
    linkLabel: 'Shop Now',
    href: 'https://www.lenovo.com/hk/en/p/laptops/yoga/yoga-pro-series/yoga-pro-9n-gen-11-15-inch-nvidia/len101y0077',
  },
  {
    objectId: 'feat-9n-2in1',
    title: 'Yoga 9n 2-in-1 (16", Gen 11) NVIDIA',
    description: 'NVIDIA RTX Spark™ — one PC built for creating, AI agents and gaming',
    bullets: [
      'A 16" screen with PureSight Pro OLED display built for creators & power users',
      'Fast multitasking, dependable battery life & seamless collaboration for amplified productivity.',
    ],
    image: 'assets/lenovo-yoga/img-12-9efa7c23.jpg',
    alt: 'Yoga 9n 2-in-1 (16", Gen 11) NVIDIA convertible laptop',
    linkLabel: 'Shop Now',
    href: 'https://www.lenovo.com/hk/en/p/laptops/yoga/yoga-2-in-1-series/yoga-9n-2-in-1-gen-11-16-inch-nvidia/len101y0076',
  },
];

const YOGA_FEATURES = [
  {
    objectId: 'yf-performance',
    title: 'Robust Performance',
    description:
      'Unleash your creativity with seamless multitasking, AI-accelerated workflows, and stunning visuals. Yoga laptops boast the latest Intel® Core™ Ultra processors for advanced performance.',
    image: 'assets/lenovo-yoga/img-13-5c73919e.jpg',
    alt: 'A fiery swirl hovers before the display of a Lenovo Yoga laptop.',
  },
  {
    objectId: 'yf-display',
    title: 'Vivid Display',
    description:
      'Enjoy vibrant, true-to-life color, glowing highlights, and sharp detail in every task on up to a PureSight Pro OLED display. Whether you’re editing or rendering, this up to tandem OLED display is built to last and keeps every project looking bold, clear, and brilliant.',
    image: 'assets/lenovo-yoga/img-14-fc4db025.jpg',
    alt: 'Colors erupt from the PureSight Pro display on a Yoga laptop.',
  },
  {
    objectId: 'yf-keyboard',
    title: 'Responsive Keyboard',
    description:
      'Experience a keyboard that stays clean and premium, even during long sessions, thanks to its oil- and water-resistant Yoga coating. Enjoy precise, responsive, and satisfying typing with 1.5mm key travel. Designed for comfort and productivity, it empowers you to type, edit, and create with confidence.',
    image: 'assets/lenovo-yoga/img-15-24566fda.jpg',
    alt: 'Breakout closeup of the keyboard of a Lenovo Yoga laptop.',
  },
  {
    objectId: 'yf-battery',
    title: 'All-Day Battery',
    description:
      'Stay creative and productive all day thanks to Yoga devices’ long battery life. Work, create, and stay connected longer without constantly searching for an outlet.',
    image: 'assets/lenovo-yoga/img-16-1efb8ec7.jpg',
    alt: 'Three Yoga laptops opened to various positions against a timer backdrop.',
  },
  {
    objectId: 'yf-productivity',
    title: 'Unmatched Productivity',
    description:
      'Stay sharp and sound your best on every call. Yoga’s webcam delivers crisp clarity, while four mics with 360° reception and Voice ID capture your voice with precision. Up to six immersive speakers make every conversation easier to follow, so you spend less time repeating yourself and more time getting things done.',
    image: 'assets/lenovo-yoga/img-17-27e3d93d.jpg',
    alt: 'A stylus hovers over the Smart Note interface on a Lenovo Yoga laptop.',
  },
  {
    objectId: 'yf-chassis',
    title: 'All-Metal Chassis',
    description:
      'Yoga’s all-metal chassis, crafted from magnesium-aluminum or aluminum alloy, offers the perfect balance of lightweight design and durability. This advanced material ensures laptops are lighter for enhanced portability, while maintaining exceptional strength to withstand daily wear and tear.',
    image: 'assets/lenovo-yoga/img-18-3ba4239d.jpg',
    alt: 'Side views illustrating metal chassis design of the Yoga 9i Gen 11 2-in-1 Aura Edition.',
  },
];

const CREATOR_PERSPECTIVES = [
  {
    objectId: 'cp-jon-rettinger',
    category: 'YOGA SLIM 7x GEN 11 (14” SNAPDRAGON)',
    title: 'Jon Rettinger',
    description:
      '“The Yoga Slim 7x isn\'t just an alternative in ways that matter day-to-day. It\'s actually better. Lighter, brighter screen with actual black instead of gray, double the refresh rate, more keyboard travel, touchscreen if you want it. Same performance unplugged.”',
    image: 'assets/lenovo-yoga/img-19-55f8f451.jpg',
    alt: 'Jon Rettinger sits with a Lenovo Yoga Slim laptop on his lap.',
    href: 'https://www.youtube.com/watch?v=aO9NWKMarFA',
  },
  {
    objectId: 'cp-dave2d',
    category: 'YOGA SLIM 7x GEN 11 (14” SNAPDRAGON)',
    title: 'Dave2D',
    description:
      '“The new Lenovo Slim 7X, it\'s an awesome device this year. Super fast chip, crazy battery life.”',
    image: 'assets/lenovo-yoga/img-20-3fbd1041.jpg',
    alt: 'Dave2D holds a Lenovo Yoga Slim laptop.',
    href: 'https://www.youtube.com/watch?v=f8EbtQ7jQnQ',
  },
  {
    objectId: 'cp-tech-chap',
    category: 'YOGA SLIM 7a GEN 11 (14” AMD)',
    title: 'The Tech Chap',
    description:
      '“And this is actually quite a nice upgrade. We\'ve got the brand new Ryzen AI 400 series chips. We have faster memory, better cooling. We have a refined keyboard. It\'s a touch lighter. It\'s just 13.9 mm thick. We also have one of the absolute best displays on any laptop that I\'ve tested.”',
    image: 'assets/lenovo-yoga/img-21-663e416a.jpg',
    alt: 'The Tech Chap holds a Lenovo Yoga Slim 7a laptop for the viewer.',
    href: 'https://youtu.be/Be-jdvqmn8M',
  },
  {
    objectId: 'cp-hardware-canucks',
    category: 'YOGA 7a 2-IN-1 GEN 11 (16” AMD)',
    title: 'Hardware Canucks',
    description:
      '“This is one of the best stylus to screen experiences I\'ve ever had on a Windows device.”',
    image: 'assets/lenovo-yoga/img-22-4d4aaa6c.jpg',
    alt: 'Hardware Canucks shows viewers the display of a Lenovo Yoga 7a 2-in-1 laptop.',
    href: 'https://www.youtube.com/watch?v=xap1yNE5kZU',
  },
  {
    objectId: 'cp-zip-tie-tech',
    category: 'YOGA 7a 2-IN-1 GEN 11 (14” AMD)',
    title: 'Zip Tie Tech',
    description:
      '“The display is freaking amazing. No matter what program you launch, it\'s displayed accurately, and you don\'t have to go in and be like, \'Oh, Chrome is sRGB, and then Photoshop is Adobe RGB.\' Nope, you just don\'t worry about it. It figures it out for you and looks magical while it does it.”',
    image: 'assets/lenovo-yoga/img-23-26bda90d.jpg',
    alt: 'Zip Tie Tech draws on a Lenovo Yoga 7a 2-in-1 laptop.',
    href: 'https://www.youtube.com/watch?v=1EVDzvZ0hME',
  },
];

const POSSIBLE_TABS = [
  {
    key: 'made-with-yoga',
    tabLabel: 'Made with Yoga',
    title: 'Made with Lenovo Yoga',
    subtitle: 'See how a new generation of creators push their craft further with Lenovo Yoga.',
    image: 'assets/lenovo-yoga/img-25-4347a699.jpg',
    alt: 'A boy skateboards next to an animated penguin; Made with Lenovo Yoga X AMD Ryzen AI.',
    p1: 'Made with Lenovo Yoga is an always-on creator program spotlighting how emerging artists actually work — their ideas, their process, and the tools they use to bring it all to life.',
    p2: 'From AI films to mixed reality builds, Lenovo Yoga gives creators the speed, power, and flexibility to take on more ambitious ideas — and actually finish them.',
    ctaLabel: 'Check Out Made with Lenovo Yoga',
    ctaHref: 'https://www.lenovo.com/creator/made-with-lenovo-yoga/digital-art-gallery/Intel',
  },
  {
    key: 'digital-art-school',
    tabLabel: 'Digital Art School',
    title: 'Digital Art School',
    subtitle: 'Learn how it’s made.',
    image: 'assets/lenovo-yoga/img-62-6610ef4f.jpg',
    alt: 'A fanciful design of a colorful castle set against a modern cityscape.',
    p1: 'Digital Art School is a free learning platform that expands on Made with Lenovo Yoga, breaking down the tools, workflows, and techniques behind the work.',
    p2: 'Led by the same creators shaping the program, each course breaks down the process step by step, so you can learn, experiment, and start creating your own.',
    ctaLabel: 'Learn More',
    ctaHref: 'https://www.lenovo.com/creator/digital-art-school',
  },
];

const SERVICES_CARDS = [
  {
    objectId: 'svc-premium-care',
    title: 'Lenovo Premium Care',
    image: 'assets/lenovo-yoga/img-29-d0df1589.jpg',
    alt: 'Two men in a dimly lit room interact with a Lenovo Yoga laptop.',
    href: 'https://www.lenovo.com/hk/en/services/pc-services/lifecycle-support/premium-care/',
  },
  {
    objectId: 'svc-planet',
    title: 'More Ways to Care for the Planet',
    image: 'assets/lenovo-yoga/img-30-5c3621dc.jpg',
    alt: 'A woman on a bench outdoors types on a Yoga Slim laptop.',
    href: 'https://www.lenovo.com/hk/en/sustainability/',
  },
  {
    objectId: 'svc-win11',
    title: 'Yoga + Windows 11, Help is Always at Hand',
    image: 'assets/lenovo-yoga/img-31-892227e9.jpg',
    alt: 'A stylus draws on the display of a Lenovo Yoga 2-in-1 laptop.',
    href: 'https://www.lenovo.com/hk/en/d/windows-11/',
  },
];

const ALL_LAPTOPS = [
  {
    id: 'len101y0076',
    title: 'Yoga 9n 2-in-1 (16", Gen 11) NVIDIA',
    href: 'https://www.lenovo.com/hk/en/p/laptops/yoga/yoga-2-in-1-series/yoga-9n-2-in-1-gen-11-16-inch-nvidia/len101y0076',
    tag: 'NEW ARRIVAL',
    img: 'assets/lenovo-yoga/img-32-e67de546.png',
    badge: 'assets/lenovo-yoga/img-33-baeecde8.png',
    price: 'HK$31,794.95',
    priceNum: 31794.95,
    reward: 'HK$953',
    rating: '',
    ratingNum: 4.9,
    cpu: 'nvidia',
    series: '2-in-1',
    screen: '15-16',
    bullets: [
      'A supreme creative laptop powered by NVIDIA RTX Spark™',
      '16" screen with PureSight Pro OLED display',
      'Smart AI features to boost multitasking & productivity',
    ],
    cta: 'View Model',
  },
  {
    id: 'len101y0077',
    title: 'Yoga Pro 9n (15", Gen 11) NVIDIA',
    href: 'https://www.lenovo.com/hk/en/p/laptops/yoga/yoga-pro-series/yoga-pro-9n-gen-11-15-inch-nvidia/len101y0077',
    tag: 'NEW ARRIVAL',
    img: 'assets/lenovo-yoga/img-34-59d323dd.png',
    badge: 'assets/lenovo-yoga/img-33-baeecde8.png',
    price: 'HK$26,824.95',
    priceNum: 26824.95,
    reward: 'HK$804',
    rating: '',
    ratingNum: 4.8,
    cpu: 'nvidia',
    series: 'pro',
    screen: '15-16',
    bullets: [
      'A premium creative laptop powered by the NVIDIA RTX Spark™',
      '15.3" screen with PureSight Pro OLED display',
      'Advanced AI features for seamless multitasking & productivity',
    ],
    cta: 'View 2 Models',
  },
  {
    id: 'len101y0075',
    title: 'Yoga Pro 7a (15", Gen 11)',
    href: 'https://www.lenovo.com/hk/en/p/laptops/yoga/yoga-pro-series/yoga-pro-7a-gen-11-15-inch-amd/len101y0075',
    tag: '',
    img: 'assets/lenovo-yoga/img-35-59d9505e.png',
    badge: 'assets/lenovo-yoga/img-36-de9050f1.png',
    price: 'HK$15,176.12',
    priceNum: 15176.12,
    reward: 'HK$455',
    rating: '4.0 (1)',
    ratingNum: 4.0,
    cpu: 'amd',
    series: 'pro',
    screen: '15-16',
    bullets: [
      'Powerful 15" Copilot+ PC for creatives',
      'Fueled by AMD Ryzen™ AI Max Series processors',
      'Engineered for precise drawing and design',
    ],
    cta: 'View 2 Models',
  },
  {
    id: 'len101y0074',
    title: 'Yoga 9i 2-in-1 Aura Edition (14″, Gen 11)',
    href: 'https://www.lenovo.com/hk/en/p/laptops/yoga/yoga-2-in-1-series/lenovo-yoga-9i-2-in-1-gen-11-aura-edition-14-inch-intel/len101y0074',
    tag: '',
    img: 'assets/lenovo-yoga/img-37-c66b4876.png',
    badge: 'assets/lenovo-yoga/img-38-000e3d1d.png',
    price: 'HK$17,444.66',
    priceNum: 17444.66,
    reward: 'HK$523',
    rating: '4.4 (12)',
    ratingNum: 4.4,
    cpu: 'intel',
    series: '2-in-1',
    screen: '14',
    bullets: [
      'Made for creatives with Intel® Core™ Ultra',
      'Multiple modes of use for every setting',
      'Elevated drawing experience',
    ],
    cta: 'View 2 Models',
  },
  {
    id: 'len101y0068',
    title: "Yoga Pro 7i Aura Edition (15'', Gen 11)",
    href: 'https://www.lenovo.com/hk/en/p/laptops/yoga/yoga-pro-series/lenovo-yoga-pro-7i-gen-11-aura-edition-15-inch-intel/len101y0068',
    tag: '',
    img: 'assets/lenovo-yoga/img-39-ed2d5f9b.png',
    badge: 'assets/lenovo-yoga/img-40-ab982182.png',
    price: 'HK$19,397.73',
    priceNum: 19397.73,
    reward: 'HK$581',
    rating: '3.5 (4)',
    ratingNum: 3.5,
    cpu: 'intel',
    series: 'pro',
    screen: '15-16',
    bullets: [
      'Powerful 15” Copilot+ laptop for creatives',
      'Fueled by Intel® Core™ Ultra processors',
      'Engineered for precise drawing and design',
    ],
    cta: 'View 2 Models',
  },
  {
    id: 'len101y0066',
    title: 'Yoga Slim 7x (14", Gen 11) Snapdragon',
    href: 'https://www.lenovo.com/hk/en/p/laptops/yoga/yoga-slim-series/lenovo-yoga-slim-7x-gen-11-14-inch-snapdragon/len101y0066',
    tag: '',
    img: 'assets/lenovo-yoga/img-41-48e3778b.png',
    badge: 'assets/lenovo-yoga/img-40-ab982182.png',
    price: 'HK$10,507.01',
    priceNum: 10507.01,
    reward: 'HK$315',
    rating: '4.0 (14)',
    ratingNum: 4.0,
    cpu: 'snapdragon',
    series: 'slim',
    screen: '14',
    bullets: [
      'Slim, light 14" Copilot+ laptop PC',
      'Stunning OLED display & immersive audio',
      'Long battery life for productivity all day',
    ],
    cta: 'View 2 Models',
  },
  {
    id: 'len101y0069',
    title: 'Yoga Slim 7i Aura Edition (14″, Gen 11)',
    href: 'https://www.lenovo.com/hk/en/p/laptops/yoga/yoga-slim-series/lenovo-yoga-slim-7i-gen-11-aura-edition-14-inch-intel/len101y0069',
    tag: '',
    img: 'assets/lenovo-yoga/img-42-52b3e83a.png',
    badge: 'assets/lenovo-yoga/img-40-ab982182.png',
    price: 'HK$8,151.00',
    priceNum: 8151.0,
    reward: 'HK$244',
    rating: '4.2 (7)',
    ratingNum: 4.2,
    cpu: 'intel',
    series: 'slim',
    screen: '14',
    bullets: [
      '14″ ultra-slim Copilot+ PC with Intel® processing',
      'Brilliant visuals via dazzling OLED display options',
      'Immersive audiovisual experiences & long battery life',
    ],
    cta: 'View 6 Models',
  },
  {
    id: 'len101y0073',
    title: "Yoga Pro 9i Aura Edition (16'', Gen 11)",
    href: 'https://www.lenovo.com/hk/en/p/laptops/yoga/yoga-pro-series/yoga-pro-9i-gen-11-aura-edition-16-inch-intel/len101y0073',
    tag: '',
    img: 'assets/lenovo-yoga/img-43-3250c2cd.png',
    badge: 'assets/lenovo-yoga/img-44-2261a4d0.png',
    price: 'HK$20,911.10',
    priceNum: 20911.1,
    reward: 'HK$627',
    rating: '4.5 (19)',
    ratingNum: 4.5,
    cpu: 'intel',
    series: 'pro',
    screen: '15-16',
    bullets: [
      'Intel® Core™ Ultra & NVIDIA® fueled creativity',
      'PureSight Pro OLED provides the perfect palette',
      'Seamless drawing & writing experience',
    ],
    cta: 'View 2 Models',
  },
  {
    id: 'len101y0067',
    title: 'Yoga 7a 2-in-1 (14", Gen 11)',
    href: 'https://www.lenovo.com/hk/en/p/laptops/yoga/yoga-2-in-1-series/lenovo-yoga-7a-2-in-1-gen-11-14-inch-amd/len101y0067',
    tag: '',
    img: 'assets/lenovo-yoga/img-45-fa2a6cf3.png',
    badge: 'assets/lenovo-yoga/img-40-ab982182.png',
    price: 'HK$9,965.64',
    priceNum: 9965.64,
    reward: 'HK$299',
    rating: '4.3 (31)',
    ratingNum: 4.3,
    cpu: 'amd',
    series: '2-in-1',
    screen: '14',
    bullets: [
      'Versatile 14" convertible laptop',
      'Powered by AMD Ryzen™ AI 400 Series processors',
      'Copilot+ PC with advanced AI capabilities',
    ],
    cta: 'View 5 Models',
  },
  {
    id: 'len101y0064',
    title: 'Yoga Slim 7i Ultra Aura Edition (14", Gen 11)',
    href: 'https://www.lenovo.com/hk/en/p/laptops/yoga/yoga-slim-series/lenovo-yoga-slim-7i-ultra-gen-11-aura-edition-14-inch-intel/len101y0064',
    tag: '',
    img: 'assets/lenovo-yoga/img-46-2b79e376.png',
    badge: 'assets/lenovo-yoga/img-40-ab982182.png',
    price: 'HK$14,864.33',
    priceNum: 14864.33,
    reward: 'HK$445',
    rating: '4.5 (15)',
    ratingNum: 4.5,
    cpu: 'intel',
    series: 'slim',
    screen: '14',
    bullets: [
      'Ultraslim, ultralight 14” Copilot+ laptop',
      'Fueled by Intel® Core™ Ultra processors',
      'Long battery life keeps you productive all day',
    ],
    cta: 'View 4 Models',
  },
  {
    id: 'len101y0065',
    title: 'Yoga Slim 7a (14", Gen 11)',
    href: 'https://www.lenovo.com/hk/en/p/laptops/yoga/yoga-slim-series/yoga-slim-7a-gen-11-14-inch-amd/len101y0065',
    tag: '',
    img: 'assets/lenovo-yoga/img-47-06a06507.png',
    badge: 'assets/lenovo-yoga/img-40-ab982182.png',
    price: 'HK$10,076.81',
    priceNum: 10076.81,
    reward: 'HK$302',
    rating: '4.7 (11)',
    ratingNum: 4.7,
    cpu: 'amd',
    series: 'slim',
    screen: '14',
    bullets: [
      '14" Copilot+ PC with AMD Ryzen™ AI 400 Series processors',
      'Stunning OLED display & immersive audio with clarity',
      'All-day battery life to help you stay productive on the move',
    ],
    cta: 'View 2 Models',
  },
  {
    id: 'len101y0071',
    title: 'Yoga 7i 2-in-1 Aura Edition (14", Gen 11)',
    href: 'https://www.lenovo.com/hk/en/p/laptops/yoga/yoga-2-in-1-series/yoga-7i-2-in-1-gen-11-aura-edition-14-inch-intel/len101y0071',
    tag: '',
    img: 'assets/lenovo-yoga/img-48-24802c82.png',
    badge: 'assets/lenovo-yoga/img-38-000e3d1d.png',
    price: 'HK$10,287.48',
    priceNum: 10287.48,
    reward: 'HK$308',
    rating: '4.4 (30)',
    ratingNum: 4.4,
    cpu: 'intel',
    series: '2-in-1',
    screen: '14',
    bullets: [
      'Versatile convertible laptop with 360° hinge',
      'Powered by Intel® Core™ Ultra processors',
      'Copilot+ PC with advanced AI capabilities',
    ],
    cta: 'View 5 Models',
  },
  {
    id: 'len101y0072',
    title: 'Yoga 7i 2-in-1 Aura Edition (16", Gen 11)',
    href: 'https://www.lenovo.com/hk/en/p/laptops/yoga/yoga-2-in-1-series/lenovo-yoga-7i-2-in-1-gen-11-aura-edition-16-inch-intel/len101y0072',
    tag: '',
    img: 'assets/lenovo-yoga/img-49-b1856fd0.png',
    badge: 'assets/lenovo-yoga/img-38-000e3d1d.png',
    price: 'HK$10,016.96',
    priceNum: 10016.96,
    reward: 'HK$300',
    rating: '4.6 (38)',
    ratingNum: 4.6,
    cpu: 'intel',
    series: '2-in-1',
    screen: '15-16',
    bullets: [
      'Versatile 16 inch convertible laptop',
      'Powered by Intel® Core™ Ultra processors',
      'Copilot+ PC with advanced AI capabilities',
    ],
    cta: 'View 3 Models',
  },
  {
    id: 'len101y0054',
    title: 'Yoga Book 9i (14", Gen 10)',
    href: 'https://www.lenovo.com/hk/en/p/laptops/yoga/yoga-2-in-1-series/yoga-book-9i-gen-10-14-inch-intel/len101y0054',
    tag: '',
    img: 'assets/lenovo-yoga/img-50-30de1d6f.png',
    badge: 'assets/lenovo-yoga/img-51-403668d3.png',
    price: 'HK$22,431.35',
    priceNum: 22431.35,
    reward: 'HK$672',
    rating: '4.5 (66)',
    ratingNum: 4.5,
    cpu: 'intel',
    series: '2-in-1',
    screen: '14',
    bullets: [
      '14″ dual-screen AI powerhouse',
      'Fueled by Intel® Core™ Ultra',
      'Thin & light with long battery life',
    ],
    cta: 'View Model',
  },
  {
    id: 'len101y0056',
    title: "Yoga 7i 2-in-1 (14'', Gen 10)",
    href: 'https://www.lenovo.com/hk/en/p/laptops/yoga/yoga-2-in-1-series/lenovo-yoga-7i-2-in-1-gen-10-14-inch-intel/len101y0056',
    tag: '',
    img: 'assets/lenovo-yoga/img-52-6ec384b9.png',
    badge: 'assets/lenovo-yoga/img-54-a69355ca.png',
    price: 'HK$9,490.53',
    priceNum: 9490.53,
    reward: 'HK$284',
    rating: '4.5 (325)',
    ratingNum: 4.5,
    cpu: 'intel',
    series: '2-in-1',
    screen: '14',
    bullets: [
      'Fueled by Intel® Core™ Ultra processors',
      'Vibrant 14” PureSight display option',
      'Flexible 360° design for on-the-go creativity',
    ],
    cta: 'View Model',
  },
  {
    id: 'len101y0057',
    title: 'Yoga 7i 2-in-1 (16", Gen 10)',
    href: 'https://www.lenovo.com/hk/en/p/laptops/yoga/yoga-2-in-1-series/lenovo-yoga-7i-2-in-1-gen-10-16-inch-intel/len101y0057',
    tag: '',
    img: 'assets/lenovo-yoga/img-53-6292db09.png',
    badge: 'assets/lenovo-yoga/img-54-a69355ca.png',
    price: 'HK$8,753.93',
    priceNum: 8753.93,
    reward: 'HK$262',
    rating: '4.6 (212)',
    ratingNum: 4.6,
    cpu: 'intel',
    series: '2-in-1',
    screen: '15-16',
    bullets: [
      'Fueled by Intel® Core™ Ultra processors',
      'Vibrant 14” PureSight display option',
      'Flexible 360° design for creativity on the go',
    ],
    cta: 'View Model',
  },
  {
    id: 'len101y0052',
    title: "Yoga Slim 9i (14'', Gen 10)",
    href: 'https://www.lenovo.com/hk/en/p/laptops/yoga/yoga-slim-series/yoga-slim-9i-gen-10-14-inch-intel/len101y0052',
    tag: '',
    img: 'assets/lenovo-yoga/img-55-fb0c22f1.png',
    badge: 'assets/lenovo-yoga/img-56-c90758e5.png',
    price: 'HK$14,638.00',
    priceNum: 14638.0,
    reward: 'HK$439',
    rating: '4.8 (22)',
    ratingNum: 4.8,
    cpu: 'intel',
    series: 'slim',
    screen: '14',
    bullets: [
      'Copilot+ PC fueled by Intel® Core™ Ultra',
      'Groundbreaking camera-under-display screen with 98% screen-to-body ratio',
      'Dazzling reflective cover glass; stylish design',
    ],
    cta: 'View Model',
  },
  {
    id: 'len101y0053',
    title: 'Yoga Slim 7i Aura Edition (14", Gen 10)',
    href: 'https://www.lenovo.com/hk/en/p/laptops/yoga/yoga-slim-series/lenovo-yoga-slim-7i-aura-edition-gen-10-14-inch-intel/len101y0053',
    tag: '',
    img: 'assets/lenovo-yoga/img-57-bfba3feb.png',
    badge: 'assets/lenovo-yoga/img-56-c90758e5.png',
    price: 'HK$9,825.25',
    priceNum: 9825.25,
    reward: 'HK$294',
    rating: '4.1 (67)',
    ratingNum: 4.1,
    cpu: 'intel',
    series: 'slim',
    screen: '14',
    bullets: [
      'Powerful & efficient Intel® Core™ Ultra processors',
      'Vivid optional 14″ PureSight Pro display',
      'AI-enabled for maximum productivity',
    ],
    cta: 'View Model',
  },
];

const FAQ_LIST = JSON.parse(
  fs.readFileSync(path.join(ROOT, 'reference-inputs/lenovo-yoga/faqs.json'), 'utf8')
);

const FILTER_GROUPS = [
  {
    key: 'cpu',
    title: 'Processor',
    searchable: true,
    searchPlaceholder: 'Search Processor',
    options: [
      { value: 'intel-all', label: 'All Intel® Processors (12)' },
      { value: 'intel-u9', label: 'Intel® Core™ Ultra 9 (2)' },
      { value: 'intel-u7', label: 'Intel® Core™ Ultra 7 (10)' },
      { value: 'intel-u5', label: 'Intel® Core™ Ultra 5 (6)' },
      { value: 'amd-all', label: 'All AMD Processors (3)' },
      { value: 'amd-ryzen-ai', label: 'AMD Ryzen™ AI (3)' },
      { value: 'snapdragon-all', label: 'All Snapdragon® Processors (1)' },
      { value: 'snapdragon-elite', label: 'Snapdragon® X2 Elite (1)' },
      { value: 'snapdragon-plus', label: 'Snapdragon® X2 Plus (1)' },
      { value: 'nvidia-18c', label: 'NVIDIA RTX Spark™ N1X 18-Core Processor (E-cores up to 2.80 GHz P-cores up to 3.90 GHz) (2)' },
      { value: 'nvidia-20c', label: 'NVIDIA RTX Spark™ N1X 20-Core (1)' },
    ],
  },
  {
    key: 'os',
    title: 'Operating System',
    options: [
      { value: 'win11-home-64', label: 'Windows 11 Home 64 (15)' },
      { value: 'win11-home-arm64', label: 'Windows 11 Home Arm64 (3)' },
      { value: 'win11-pro-arm64', label: 'Windows 11 Pro Arm64 (1)' },
    ],
  },
  {
    key: 'graphics',
    title: 'Graphics',
    options: [
      { value: 'adreno', label: 'Qualcomm™ Adreno (1)' },
      { value: 'rtx', label: 'NVIDIA RTX™ (3)' },
      { value: 'arc', label: 'Intel® Arc™ (7)' },
      { value: 'integrated', label: 'Integrated (14)' },
      { value: 'radeon', label: 'AMD Radeon™ (3)' },
    ],
  },
  {
    key: 'ai',
    title: 'AI (Artificial Intelligence)',
    options: [
      { value: 'copilot-plus', label: 'Copilot+ PC (17)' },
      { value: 'aura', label: 'Lenovo Aura Edition (8)' },
      { value: 'all-ai', label: 'All AI PCs (16)' },
    ],
  },
  {
    key: 'display',
    title: 'Display',
    options: [
      { value: '2.8k', label: '2.8K (8)' },
      { value: 'wquxga', label: 'WQUXGA (3840 x 2400) (1)' },
      { value: 'wuxga', label: 'WUXGA (1920 x 1200) (9)' },
      { value: 'wqxga', label: 'WQXGA (2560 x 1600) (3)' },
    ],
  },
  {
    key: 'price',
    title: 'Price',
    type: 'price-range',
    min: 8151,
    max: 31795,
  },
  {
    key: 'storage',
    title: 'Storage',
    options: [
      { value: '2tb', label: '2 TB (1)' },
      { value: '1tb', label: '1 TB (12)' },
      { value: '512gb', label: '512 GB (14)' },
    ],
  },
  {
    key: 'brand',
    title: 'Brand',
    options: [{ value: 'yoga', label: 'Yoga (18)' }],
  },
  {
    key: 'memory',
    title: 'Memory',
    options: [
      { value: '128gb', label: '128 GB (1)' },
      { value: '32gb', label: '32 GB (11)' },
      { value: '24gb', label: '24 GB (2)' },
      { value: '16gb', label: '16 GB (10)' },
    ],
  },
  {
    key: 'screen',
    title: 'Screen Size',
    options: [
      { value: '14', label: '14" - 14.9" (11)' },
      { value: '15-16', label: '15" - 16.9" (7)' },
    ],
  },
];

function getLaptopFilterAttrs(p) {
  const titleLower = p.title.toLowerCase();
  const isAura = titleLower.includes('aura edition');
  const isPro = p.series === 'pro';
  const is9 = titleLower.includes('9i') || titleLower.includes('9n');

  const cpuTags = [];
  if (p.cpu === 'intel') {
    cpuTags.push('intel-all', 'intel-u7');
    if (is9 || isPro) cpuTags.push('intel-u9');
    if (p.priceNum < 11000) cpuTags.push('intel-u5');
  } else if (p.cpu === 'amd') {
    cpuTags.push('amd-all', 'amd-ryzen-ai');
  } else if (p.cpu === 'snapdragon') {
    cpuTags.push('snapdragon-all', 'snapdragon-elite', 'snapdragon-plus');
  } else if (p.cpu === 'nvidia') {
    cpuTags.push('nvidia-18c');
    if (p.id === 'len101y0076') cpuTags.push('nvidia-20c');
  }

  const os = [];
  if (p.cpu === 'snapdragon' || p.cpu === 'nvidia') {
    os.push('win11-home-arm64');
    if (p.id === 'len101y0076') os.push('win11-pro-arm64');
  } else {
    os.push('win11-home-64');
  }

  const graphics = [];
  if (p.cpu === 'snapdragon') graphics.push('adreno', 'integrated');
  else if (p.cpu === 'nvidia') graphics.push('rtx');
  else if (p.cpu === 'amd') graphics.push('radeon', 'integrated');
  else {
    graphics.push('integrated');
    if (is9 || isPro || isAura) graphics.push('arc');
    if (p.id === 'len101y0073') graphics.push('rtx');
  }

  const ai = ['copilot-plus', 'all-ai'];
  if (isAura) ai.push('aura');

  const display = [];
  if (is9 || isPro) display.push('2.8k', 'wqxga');
  else display.push('wuxga', '2.8k');
  if (p.id === 'len101y0052') display.push('wquxga');

  const storage = ['1tb'];
  if (p.priceNum < 15000) storage.push('512gb');
  if (p.id === 'len101y0076') storage.push('2tb');

  const memory = [];
  if (p.id === 'len101y0076') memory.push('128gb', '32gb');
  else if (p.priceNum >= 14000) memory.push('32gb', '24gb');
  else memory.push('16gb', '32gb');

  return {
    cpu: cpuTags.join(','),
    os: os.join(','),
    graphics: graphics.join(','),
    ai: ai.join(','),
    display: display.join(','),
    storage: storage.join(','),
    brand: 'yoga',
    memory: memory.join(','),
    screen: p.screen,
  };
}

// Save sourceAbsent reference file for native card validation
fs.mkdirSync(REF_DIR, { recursive: true });
fs.writeFileSync(
  path.join(ROOT, SOURCE_REF),
  JSON.stringify(
    {
      kind: 'original-page-content-reference',
      source: 'https://www.lenovo.com/hk/en/yoga/',
      modules: [
        {
          id: 'discover-series',
          items: DISCOVER_SERIES.map((s) => ({
            objectId: s.objectId,
            title: s.title,
            description: s.description,
            link: 'Shop Now',
          })),
        },
        {
          id: 'featured-products',
          items: FEATURED_PRODUCTS.map((f) => ({
            objectId: f.objectId,
            title: f.title,
            description: f.description,
            link: f.linkLabel,
          })),
        },
        {
          id: 'yoga-features',
          items: YOGA_FEATURES.map((f) => ({
            objectId: f.objectId,
            title: f.title,
            description: f.description,
          })),
        },
        {
          id: 'creator-perspectives',
          items: CREATOR_PERSPECTIVES.map((c) => ({
            objectId: c.objectId,
            category: c.category,
            title: c.title,
            description: c.description,
            link: 'Watch Video',
          })),
        },
        {
          id: 'services-cards',
          items: SERVICES_CARDS.map((s) => ({
            objectId: s.objectId,
            title: s.title,
            link: 'Learn More',
          })),
        },
      ],
    },
    null,
    2
  )
);

function buildPage() {
  const customCss = `
    ${H.basePageCss()}
    .hero-surface__scrim { background: rgba(0, 0, 0, 0.46); }

    /* Top compact notification & post-hero business strips */
    .yoga-top-strip {
      background: #FAFBFB;
      border-bottom: 1px solid #EAECEF;
    }
    .yoga-top-strip__inner {
      max-width: 1200px;
      margin: 0 auto;
      min-height: 44px;
      padding: 8px 0;
      box-sizing: border-box;
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 16px;
      font-size: 13px;
      line-height: 20px;
      color: #19191A;
    }
    .yoga-top-strip__text {
      font-weight: 400;
      color: #19191A;
    }
    .yoga-top-strip__strong {
      font-weight: 600;
      color: #19191A;
    }

    /* Sticky In-Page Anchor Navigation (exact .ds-anchor-nav visual spec without right CTA button) */
    .yoga-anchor-bar {
      position: sticky;
      top: 0;
      z-index: 30;
      width: 100%;
      height: 56px;
      background: var(--color-gray-6);
      font-family: var(--font-family-base);
      box-sizing: border-box;
    }
    .yoga-anchor-bar__inner {
      max-width: 1200px;
      margin: 0 auto;
      padding: 0;
      height: 56px;
      display: flex;
      justify-content: space-between;
      align-items: stretch;
    }
    .yoga-anchor-bar__tabs {
      display: flex;
      gap: var(--spacing-lg);
      height: 56px;
      overflow-x: auto;
    }
    .yoga-anchor-bar__link {
      display: flex;
      align-items: center;
      padding: 0 var(--spacing-lg);
      cursor: pointer;
      font-size: var(--font-size-md);
      font-weight: var(--font-weight-semibold);
      line-height: 22px;
      color: var(--color-gray-3);
      text-decoration: none;
      white-space: nowrap;
      flex-shrink: 0;
      border-bottom: var(--border-width-strong) var(--border-style-default) var(--border-color-transparent);
      box-sizing: border-box;
    }
    .yoga-anchor-bar__link:first-child {
      padding-left: 0;
    }
    .yoga-anchor-bar__link:not(.yoga-anchor-bar__link--active):hover {
      color: var(--color-gray-1);
    }
    .yoga-anchor-bar__link--active {
      color: var(--color-gray-1);
      border-bottom-color: var(--border-color-brand);
    }

    /* Hero inner eyebrow & Windows 11 badge (cohesive inside Hero Banner) */
    .yoga-hero-meta {
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 16px;
      width: 100%;
      margin-bottom: 8px;
    }
    .yoga-hero-wordmark {
      height: 28px;
      width: auto;
      display: block;
    }
    .yoga-hero-win11 {
      height: 30px;
      width: auto;
      display: block;
    }

    /* Section 4+5: Creator Ecosystem Intro + Discover Your Yoga */
    .yoga-eyebrow {
      margin: 0 0 8px;
      font-size: 13px;
      line-height: 20px;
      font-weight: 600;
      letter-spacing: 0.4px;
      text-transform: uppercase;
      color: #4B4B4D;
    }
    .yoga-subblock-title {
      margin: 32px 0 20px;
      font-size: 20px;
      line-height: 28px;
      font-weight: 600;
      color: #19191A;
    }

    /* Featured Products bullet list inside card description */
    .yoga-feat-bullets {
      margin: 10px 0 0;
      padding-left: 18px;
      font-size: 13px;
      line-height: 20px;
      color: #4B4B4D;
    }
    .yoga-feat-bullets li + li {
      margin-top: 6px;
    }

    /* Creator Showcase 1200px full-width banner + Discover What's Possible */
    .yoga-showcase-media {
      width: 100%;
      height: 340px;
      border-radius: 8px;
      overflow: hidden;
      margin-bottom: 36px;
      background: #19191A;
    }
    .yoga-showcase-img {
      width: 100%;
      height: 100%;
      object-fit: cover;
      display: block;
    }
    .yoga-capsule-bar {
      display: flex;
      justify-content: center;
      margin-bottom: 24px;
    }
    .yoga-possible-head {
      text-align: center;
      margin-bottom: 24px;
    }
    .yoga-possible-title {
      margin: 0 0 8px;
      font-size: 20px;
      line-height: 28px;
      font-weight: 600;
      color: #19191A;
    }
    .yoga-possible-sub {
      margin: 0 auto;
      max-width: 760px;
      font-size: 14px;
      line-height: 22px;
      color: #4B4B4D;
    }
    .yoga-possible-bento {
      display: grid;
      grid-template-columns: 1.35fr 1fr 1fr;
      gap: 20px;
      align-items: stretch;
    }
    .yoga-possible-visual {
      border-radius: 8px;
      overflow: hidden;
      min-height: 260px;
      background: #F4F5F7;
    }
    .yoga-possible-img {
      width: 100%;
      height: 100%;
      object-fit: cover;
      display: block;
    }
    .yoga-possible-card {
      background: #FAFBFB;
      border: 1px solid #EAECEF;
      border-radius: 8px;
      padding: 28px 24px;
      display: flex;
      align-items: center;
      font-size: 14px;
      line-height: 22px;
      color: #19191A;
    }
    .yoga-possible-cta {
      display: flex;
      justify-content: center;
      margin-top: 24px;
    }

    /* Smart Connect inline logo + eyebrow inside horizontal card */
    .yoga-smart-badge {
      display: inline-flex;
      align-items: center;
      gap: 10px;
      margin-bottom: 8px;
    }
    .yoga-smart-logo {
      width: 36px;
      height: 36px;
      object-fit: contain;
      display: block;
    }
    .yoga-smart-label {
      font-size: 12px;
      line-height: 18px;
      font-weight: 600;
      letter-spacing: 0.5px;
      color: #4B4B4D;
      text-transform: uppercase;
    }

    /* Section 14: View All Yoga Laptops — Filter Sidebar + 3-Col Product Catalog */
    .yoga-catalog-toolbar {
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 20px;
      padding-bottom: 16px;
      margin-bottom: 24px;
      border-bottom: 1px solid #EAECEF;
    }
    .yoga-catalog-count {
      font-size: 14px;
      line-height: 22px;
      font-weight: 600;
      color: #19191A;
    }
    .yoga-catalog-sort {
      display: flex;
      align-items: center;
      gap: 12px;
      width: 280px;
    }
    .yoga-catalog-layout {
      display: grid;
      grid-template-columns: 268px minmax(0, 1fr);
      gap: 24px;
      align-items: start;
    }
    .yoga-filter-panel {
      background: #FFFFFF;
      border: 1px solid #EAECEF;
      border-radius: 8px;
      padding: 20px;
    }
    .yoga-filter-head {
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 8px;
      padding-bottom: 12px;
      margin-bottom: 12px;
      border-bottom: 1px solid #EAECEF;
    }
    .yoga-filter-title {
      font-size: 16px;
      line-height: 24px;
      font-weight: 600;
      color: #19191A;
    }
    .yoga-filter-actions {
      display: inline-flex;
      align-items: center;
      gap: 10px;
    }
    .yoga-filter-reset {
      appearance: none;
      border: none;
      background: transparent;
      padding: 0;
      font-family: inherit;
      font-size: 12px;
      line-height: 18px;
      color: #4B4B4D;
      cursor: pointer;
      text-decoration: underline;
    }
    .yoga-filter-reset:hover {
      color: #19191A;
    }
    .yoga-filter-group {
      padding: 12px 0;
    }
    .yoga-filter-group + .yoga-filter-group {
      border-top: 1px solid #EAECEF;
    }
    .yoga-filter-group-title {
      list-style: none;
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 8px;
      margin: 0;
      font-size: 13px;
      line-height: 20px;
      font-weight: 600;
      color: #19191A;
      cursor: pointer;
      user-select: none;
    }
    .yoga-filter-group-title::-webkit-details-marker {
      display: none;
    }
    .yoga-filter-chevron {
      width: 14px;
      height: 14px;
      flex-shrink: 0;
      transition: transform 0.2s ease;
    }
    .yoga-filter-group[open] .yoga-filter-chevron {
      transform: rotate(180deg);
    }
    .yoga-filter-options {
      display: flex;
      flex-direction: column;
      gap: 8px;
      margin-top: 10px;
    }
    .yoga-filter-search {
      margin-top: 10px;
    }
    .yoga-filter-price-range {
      display: grid;
      grid-template-columns: minmax(0, 1fr) minmax(0, 1fr);
      gap: 8px;
      margin-top: 10px;
    }
    .yoga-filter-price-hint {
      margin: 8px 0 0;
      font-size: 12px;
      line-height: 18px;
      color: #6B6E75;
    }
    .yoga-catalog-toolbar-left {
      display: flex;
      align-items: center;
      gap: 16px;
    }
    .yoga-compare-status {
      font-size: 13px;
      line-height: 20px;
      color: #4B4B4D;
    }
    .yoga-laptop-grid {
      display: grid;
      grid-template-columns: repeat(3, minmax(0, 1fr));
      gap: 20px;
    }
    .yoga-laptop-card {
      background: #FFFFFF;
      border: 1px solid #DEE0E3;
      border-radius: 8px;
      padding: 20px;
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      gap: 16px;
      transition: box-shadow 0.2s ease;
    }
    .yoga-laptop-card:hover {
      box-shadow: 0 8px 24px rgba(0, 0, 0, 0.06);
    }
    .yoga-laptop-top {
      display: flex;
      align-items: center;
      justify-content: space-between;
      min-height: 24px;
      margin-bottom: 8px;
      gap: 8px;
    }
    .yoga-laptop-meta {
      display: flex;
      flex-direction: column;
      align-items: flex-start;
      gap: 6px;
      margin: -6px 0 12px;
      min-height: 44px;
    }
    .yoga-laptop-rating-row {
      min-height: 20px;
      display: flex;
      align-items: center;
    }
    .yoga-laptop-sub {
      font-size: 12px;
      line-height: 18px;
      color: #6B6E75;
    }
    .yoga-laptop-rating {
      font-size: 12px;
      line-height: 18px;
      font-weight: 600;
      color: #19191A;
    }
    .yoga-laptop-name {
      margin: 0 0 12px;
      font-size: 16px;
      line-height: 24px;
      font-weight: 600;
      color: #19191A;
      min-height: 48px;
    }
    .yoga-laptop-name-link {
      color: #19191A;
      text-decoration: none;
    }
    .yoga-laptop-name-link:hover {
      color: #19191A;
      text-decoration: underline;
      text-underline-offset: 3px;
    }
    .yoga-laptop-media {
      position: relative;
      height: 170px;
      background: #FAFBFB;
      border-radius: 4px;
      padding: 12px;
      display: flex;
      align-items: center;
      justify-content: center;
      margin-bottom: 12px;
    }
    .yoga-laptop-img {
      max-width: 100%;
      max-height: 100%;
      object-fit: contain;
      display: block;
    }
    .yoga-laptop-badge {
      height: 28px;
      width: auto;
      display: block;
      margin-bottom: 10px;
    }
    .yoga-laptop-price-label {
      font-size: 12px;
      line-height: 18px;
      color: #6B6E75;
    }
    .yoga-laptop-price {
      font-size: 20px;
      line-height: 28px;
      font-weight: 600;
      color: #19191A;
    }
    .yoga-laptop-delivery {
      display: inline-block;
      margin-top: 2px;
      font-size: 12px;
      line-height: 18px;
      font-weight: 600;
      color: #19191A;
    }
    .yoga-laptop-reward {
      margin-top: 8px;
      padding-top: 8px;
      border-top: 1px solid #EAECEF;
      font-size: 12px;
      line-height: 18px;
      color: #4B4B4D;
    }
    .yoga-laptop-reward-join {
      display: block;
      margin-top: 4px;
    }
    .yoga-laptop-specs {
      margin: 10px 0 0;
      padding-left: 16px;
      font-size: 12px;
      line-height: 18px;
      color: #4B4B4D;
    }
    .yoga-laptop-specs li + li {
      margin-top: 4px;
    }
    .yoga-laptop-cta {
      padding-top: 12px;
      border-top: 1px solid #EAECEF;
    }

    /* Section 15: FAQ sits directly inside 1200px container without extra card wrapper */
  `;

  const discoverCardsHtml = DISCOVER_SERIES.map((s) =>
    H.compTag('library-card', 'spliced-vertical-single-event-bordered', {
      title: s.title,
      description: `<p>${H.esc(s.description)}</p>`,
      image: `<img src="${H.esc(s.image)}" alt="${H.esc(s.alt)}">`,
      linkLabel: 'Shop Now',
      href: s.href,
      sourceAbsent: { reference: SOURCE_REF, objectId: s.objectId, slots: ['category'] },
    })
  ).join('\n');

  const featuredCardsHtml = FEATURED_PRODUCTS.map((f) =>
    H.compTag('library-card', 'spliced-vertical-single-event', {
      title: f.title,
      description: `<p>${H.esc(f.description)}</p>`,
      image: `<img src="${H.esc(f.image)}" alt="${H.esc(f.alt)}">`,
      linkLabel: f.linkLabel,
      href: f.href,
      sourceAbsent: { reference: SOURCE_REF, objectId: f.objectId, slots: ['category'] },
    })
  ).join('\n');

  const yogaFeaturesCarouselHtml = H.compTag('library-carousel', 'external-cards', {
    columns: 4,
    items: YOGA_FEATURES.map((f) => ({
      component: 'library-card',
      fragment: 'spliced-vertical-single-event-bordered',
      props: {
        title: f.title,
        description: `<p>${H.esc(f.description)}</p>`,
        image: `<img src="${H.esc(f.image)}" alt="${H.esc(f.alt)}">`,
        sourceAbsent: { reference: SOURCE_REF, objectId: f.objectId, slots: ['category', 'link'] },
      },
    })),
  });

  const creatorPerspectivesCarouselHtml = H.compTag('library-carousel', 'external-cards', {
    columns: 3,
    items: CREATOR_PERSPECTIVES.map((c) => ({
      component: 'library-card',
      fragment: 'spliced-vertical-single-event',
      props: {
        category: c.category,
        title: c.title,
        description: `<p>${H.esc(c.description)}</p>`,
        image: `<img src="${H.esc(c.image)}" alt="${H.esc(c.alt)}">`,
        linkLabel: 'Watch Video',
        href: c.href,
      },
    })),
  });

  const servicesCardsHtml = SERVICES_CARDS.map((s) =>
    H.compTag('library-card', 'spliced-vertical-single-event', {
      title: s.title,
      image: `<img src="${H.esc(s.image)}" alt="${H.esc(s.alt)}">`,
      linkLabel: 'Learn More',
      href: s.href,
      sourceAbsent: { reference: SOURCE_REF, objectId: s.objectId, slots: ['category', 'description'] },
    })
  ).join('\n');

  const renderStarRatingHtml = (ratingNum, ratingText) => {
    if (!ratingText) return '';
    const filled = Math.max(0, Math.min(5, Math.round(Number(ratingNum) || 0)));
    const starsHtml = Array.from({ length: 5 }, (_, i) =>
      `<img class="ds-rate__star" src="${i < filled ? STAR_ON_SRC : STAR_OFF_SRC}" alt="">`
    ).join('');
    return H.compTag('library-rate', 'display', {
      ratingContent: `<span class="ds-rate__stars" aria-hidden="true">${starsHtml}</span><span class="ds-rate__label ds-rate__label--muted">${H.esc(ratingText)}</span>`,
    });
  };

  const renderLaptopCardHtml = (p) => {
    const attrs = getLaptopFilterAttrs(p);
    const compareHtml = H.compTag('library-checkbox', 'sm', {
      label: 'Compare',
      name: 'compare-laptop',
      value: p.id,
      changeCallback: 'onYogaCompareChange',
    });
    const tagHtml = p.tag ? H.compTag('library-tag', 'semantic-new', {}) : '';
    const ratingHtml = renderStarRatingHtml(p.ratingNum, p.rating);
    const badgeHtml = p.badge
      ? `<img class="yoga-laptop-badge" src="${H.esc(p.badge)}" alt="Processor badge">`
      : '';
    const bulletsHtml = p.bullets.map((b) => `<li>${H.esc(b)}</li>`).join('');
    const joinRewardsHtml = H.compTag('library-text-button', 'inline-blue-link', {
      label: 'Join Now for FREE!',
      href: 'https://www.lenovo.com/hk/en/rewards/',
    });
    const ctaHtml = H.compTag('library-button', 'outline-black', {
      label: p.cta,
      actionCallback: 'onViewYogaModel',
    });
    return `
      <article class="yoga-laptop-card" data-laptop-id="${H.esc(p.id)}" data-cpu="${H.esc(attrs.cpu)}" data-os="${H.esc(attrs.os)}" data-graphics="${H.esc(attrs.graphics)}" data-ai="${H.esc(attrs.ai)}" data-display="${H.esc(attrs.display)}" data-storage="${H.esc(attrs.storage)}" data-brand="${H.esc(attrs.brand)}" data-memory="${H.esc(attrs.memory)}" data-screen="${H.esc(attrs.screen)}" data-price="${p.priceNum}" data-rating="${p.ratingNum}">
        <div>
          <div class="yoga-laptop-top">
            <div>${compareHtml}</div>
            <div>${tagHtml}</div>
          </div>
          <h3 class="yoga-laptop-name">
            <a class="yoga-laptop-name-link" href="${H.esc(p.href)}">${H.esc(p.title)}</a>
          </h3>
          <div class="yoga-laptop-meta">
            <span class="yoga-laptop-sub">Copilot+ PC</span>
            <div class="yoga-laptop-rating-row">${ratingHtml}</div>
          </div>
          <div class="yoga-laptop-media">
            <img class="yoga-laptop-img" src="${H.esc(p.img)}" alt="${H.esc(p.title)}">
          </div>
          ${badgeHtml}
          <div class="yoga-laptop-price-label">Starting at</div>
          <div class="yoga-laptop-price">${H.esc(p.price)}</div>
          <span class="yoga-laptop-delivery">FREE DELIVERY</span>
          <div class="yoga-laptop-reward">
            <strong>My Lenovo Rewards</strong> Earn ${H.esc(p.reward)} in Rewards
            <span class="yoga-laptop-reward-join">${joinRewardsHtml}</span>
          </div>
          <ul class="yoga-laptop-specs">${bulletsHtml}</ul>
        </div>
        <div class="yoga-laptop-cta">${ctaHtml}</div>
      </article>
    `;
  };

  const renderFilterGroupsHtml = () =>
    FILTER_GROUPS.map((g) => {
      const innerHtml =
        g.type === 'price-range'
          ? `
            <div class="yoga-filter-price-range">
              ${H.compTag('library-input', 'gray', {
                label: 'Min (HKD)',
                placeholder: '8151',
                name: 'priceMin',
                value: '',
                inputCallback: 'onYogaFilterChange',
                changeCallback: 'onYogaFilterChange',
              })}
              ${H.compTag('library-input', 'gray', {
                label: 'Max (HKD)',
                placeholder: '31795',
                name: 'priceMax',
                value: '',
                inputCallback: 'onYogaFilterChange',
                changeCallback: 'onYogaFilterChange',
              })}
            </div>
            <p class="yoga-filter-price-hint">HK$${g.min.toLocaleString('en-US')} – HK$${g.max.toLocaleString('en-US')}</p>
          `
          : `
            ${
              g.searchable
                ? `<div class="yoga-filter-search">${H.compTag('library-input', 'gray', {
                    label: g.searchPlaceholder,
                    placeholder: 'Type to filter...',
                    name: 'search-' + g.key,
                    value: '',
                    inputCallback: 'onYogaProcessorSearch',
                  })}</div>`
                : ''
            }
            <div class="yoga-filter-options" data-filter-group-options="${H.esc(g.key)}">
              ${g.options
                .map((opt) =>
                  H.compTag('library-checkbox', 'sm', {
                    label: opt.label,
                    name: g.key,
                    value: opt.value,
                    changeCallback: 'onYogaFilterChange',
                  })
                )
                .join('\n')}
            </div>
          `;
      return `
        <details class="yoga-filter-group" open>
          <summary class="yoga-filter-group-title">
            <span>${H.esc(g.title)}</span>
            <img class="yoga-filter-chevron" src="assets/lenovo-yoga/icon-chevron-down.svg" alt="" aria-hidden="true">
          </summary>
          ${innerHtml}
        </details>
      `;
    }).join('\n');

  const initialLaptopGridHtml = ALL_LAPTOPS.map(renderLaptopCardHtml).join('\n');
  const filterGroupsHtml = renderFilterGroupsHtml();
  const firstPossible = POSSIBLE_TABS[0];

  const mainHtml = `
    <!-- Section 1: Top Quiz Announcement Strip -->
    <div class="yoga-top-strip" data-fs-extend="top-quiz-strip">
      <div class="yoga-top-strip__inner">
        <span class="yoga-top-strip__text">Find the Yoga that fits you! Take a short quiz and unlock rewards.</span>
        ${H.compTag('library-text-button', 'inline-blue-link', {
          label: 'Learn More',
          href: 'https://www.lenovo.com/hk/en/yoga-campaign/?ipromoID=yoga_brand_slim_yoga-campaign',
        })}
      </div>
    </div>

    <!-- Section 2: Hero Banner (Embrace the Process) -->
    <section id="yoga-hero" class="hero-surface" aria-label="Embrace the Process">
      <img class="hero-surface__bg" src="assets/lenovo-yoga/img-03-9f806e4d.jpg" alt="Right side view of a Lenovo Yoga laptop against a colorful sunset sky">
      <div class="hero-surface__scrim"></div>
      <div class="hero-surface__inner">
        ${H.compTag('library-banner', 'hero-responsive', {
          height: '360',
          align: 'left',
          surface: 'image',
          title: 'Embrace the Process',
          description:
            'Yoga devices are designed around the creative process and validated by creator-grade performance.',
          actionLabel: 'View All Yoga Laptops',
          actionHref: '#view-all-yoga-laptops',
          secondaryActionLabel: 'Yoga Deals',
          secondaryActionHref: 'https://www.lenovo.com/hk/en/d/deals/best-for-leisure/',
        })}
      </div>
    </section>

    <!-- Section 3: Yoga for Business Promo Strip -->
    <div class="yoga-top-strip" data-fs-extend="business-promo-strip">
      <div class="yoga-top-strip__inner">
        <span><strong class="yoga-top-strip__strong">Yoga for Business</strong> | Enjoy 50% OFF Pro OS upgrade + 30% OFF 4-in-1 hub with select Yoga purchase</span>
        ${H.compTag('library-text-button', 'inline-blue-link', {
          label: 'Shop Now',
          href: 'https://www.lenovo.com/hk/en/d/deals/yoga-for-business/',
        })}
      </div>
    </div>

    <!-- Sticky In-Page Anchor Navigation (No-CTA, exact FS .ds-anchor-nav visual tokens) -->
    <nav id="yoga-anchor-nav" class="yoga-anchor-bar" aria-label="Page sections" data-fs-extend="sticky-anchor-nav-no-cta">
      <div class="yoga-anchor-bar__inner">
        <div class="yoga-anchor-bar__tabs">
          ${[
            { label: 'Discover your Yoga', href: '#discover-your-yoga' },
            { label: 'Featured Products', href: '#featured-products' },
            { label: 'Yoga Features', href: '#yoga-features' },
            { label: 'Creator Ecosystem', href: '#creator-ecosystem' },
            { label: 'Smart Connect', href: '#smart-connect' },
            { label: 'Adobe Membership', href: '#adobe-membership' },
            { label: 'Sustainability & Services', href: '#sustainability-services' },
          ]
            .map(
              (item, i) =>
                `<a class="yoga-anchor-bar__link${i === 0 ? ' yoga-anchor-bar__link--active' : ''}" href="${item.href}" data-yoga-anchor="">${H.esc(item.label)}</a>`
            )
            .join('\n          ')}
        </div>
      </div>
    </nav>

    <!-- Section 4 & 5: Elevate Your Creativity + Discover Your Yoga (White Section -> Bordered Cards) -->
    <section id="discover-your-yoga" class="page-section">
      <div class="container">
        <div class="section-header" data-fs-extend="creator-journey-header">
          <p class="yoga-eyebrow">A Partner on Your Creative Journey</p>
          <h1 class="section-header__title">Elevate Your Creativity</h1>
          <p class="section-header__desc">Yoga is a complete creator ecosystem designed to inspire and empower your creative journey. From ideation to execution, Yoga supports every step of your process, helping you bring your boldest ideas to life effortlessly.</p>
        </div>
        <h2 class="yoga-subblock-title">Discover Your Yoga</h2>
        <div class="grid grid--3">
          ${discoverCardsHtml}
        </div>
      </div>
    </section>

    <!-- Section 6: Featured Products (Gray Section -> Borderless White Cards) -->
    <section id="featured-products" class="page-section page-section--gray">
      <div class="container">
        <div class="section-header">
          <h2 class="section-header__title">Featured Products</h2>
        </div>
        <div class="grid grid--3">
          ${featuredCardsHtml}
        </div>
      </div>
    </section>

    <!-- Section 7: Yoga Features (White Section -> 4-Col External Cards Carousel with Bordered Cards) -->
    <section id="yoga-features" class="page-section">
      <div class="container">
        <div class="section-header">
          <h2 class="section-header__title">Yoga Features</h2>
        </div>
        ${yogaFeaturesCarouselHtml}
      </div>
    </section>

    <!-- Section 8: Creator Perspectives (Gray Section -> 3-Col External Cards Carousel with Borderless White Cards) -->
    <section id="creator-perspectives" class="page-section page-section--gray">
      <div class="container">
        <div class="section-header">
          <h2 class="section-header__title">Creator Perspectives</h2>
        </div>
        ${creatorPerspectivesCarouselHtml}
      </div>
    </section>

    <!-- Section 9 & 10: Creator Ecosystem — 1200px Media Showcase + Discover What’s Possible on Your Yoga (White Section) -->
    <section id="creator-ecosystem" class="page-section">
      <div class="container">
        <div class="yoga-showcase-media" data-fs-extend="creator-showcase-banner">
          <img class="yoga-showcase-img" src="assets/lenovo-yoga/img-24-c95377d9.jpg" alt="A pair of hands draws on the display of a Lenovo Yoga laptop.">
        </div>
        <div class="section-header">
          <h2 class="section-header__title">Discover What’s Possible on Your Yoga</h2>
        </div>
        <div class="yoga-capsule-bar" id="yoga-possible-tabs">
          ${H.compTag('library-tab', 'capsule', {
            items: H.tabItemsHtml(['Made with Yoga', 'Digital Art School']),
          })}
        </div>
        <div id="yoga-possible-panel" data-fs-extend="creator-ecosystem-bento">
          <div class="yoga-possible-head">
            <h3 class="yoga-possible-title" id="yoga-possible-title">${H.esc(firstPossible.title)}</h3>
            <p class="yoga-possible-sub" id="yoga-possible-sub">${H.esc(firstPossible.subtitle)}</p>
          </div>
          <div class="yoga-possible-bento">
            <div class="yoga-possible-visual">
              <img class="yoga-possible-img" id="yoga-possible-img" src="${H.esc(firstPossible.image)}" alt="${H.esc(firstPossible.alt)}">
            </div>
            <div class="yoga-possible-card" id="yoga-possible-p1">${H.esc(firstPossible.p1)}</div>
            <div class="yoga-possible-card" id="yoga-possible-p2">${H.esc(firstPossible.p2)}</div>
          </div>
          <div class="yoga-possible-cta" id="yoga-possible-cta">
            ${H.compTag('library-text-button', 'inline-blue-link', {
              label: firstPossible.ctaLabel,
              href: firstPossible.ctaHref,
            })}
          </div>
        </div>
      </div>
    </section>

    <!-- Section 11: Smart Connect — Unify Your Digital Life (Gray Section -> Horizontal Full-Width Card) -->
    <section id="smart-connect" class="page-section page-section--gray">
      <div class="container">
        ${H.compTag('library-card', 'spliced-horizontal-full-width-responsive', {
          title: 'Unify Your Digital Life',
          description:
            'Smart Connect lets all your devices click instantly. Your Yoga, tablet and phone work together in one smooth, borderless experience built for how you live, work, and create.',
          image: '<img src="assets/lenovo-yoga/img-26-3387dd93.jpg" alt="Files are shared via Smart Connect on a Lenovo laptop, tablet, and smartphone.">',
          linkLabel: 'Learn More',
          href: 'https://www.lenovo.com/hk/en/software/smart-connect/',
          imagePosition: 'left',
        })}
      </div>
    </section>

    <!-- Section 12: Adobe Creative Cloud Pro Membership (White Section -> Horizontal Full-Width Card) -->
    <section id="adobe-membership" class="page-section">
      <div class="container">
        ${H.compTag('library-card', 'spliced-horizontal-full-width-responsive', {
          title: 'Select 2026 Yoga PCs come with a complimentary 2-month membership of Adobe Creative Cloud Pro.*',
          description: '*Excluding devices with ARM processors or without preload OS. Terms and conditions apply.',
          image: '<img src="assets/lenovo-yoga/img-28-e0e0dfbb.jpg" alt="A skateboarder emerges from the display of a Lenovo Yoga Pro laptop with Adobe Creative Cloud icons.">',
          linkLabel: 'Learn More',
          href: 'https://www.lenovo.com/hk/en/adobe-membership/',
          imagePosition: 'right',
        })}
      </div>
    </section>

    <!-- Section 13: Sustainability & Services (Gray Section -> 3-Col Borderless White Cards) -->
    <section id="sustainability-services" class="page-section page-section--gray">
      <div class="container">
        <div class="section-header">
          <h2 class="section-header__title">Sustainability &amp; Services</h2>
        </div>
        <div class="grid grid--3">
          ${servicesCardsHtml}
        </div>
      </div>
    </section>

    <!-- Section 14: View All Yoga Laptops — Interactive Filter Sidebar + 18-Model Catalog (White Section -> Bordered Cards) -->
    <section id="view-all-yoga-laptops" class="page-section">
      <div class="container" data-fs-extend="plp-catalog-layout">
        <div class="section-header">
          <h2 class="section-header__title">View All Yoga Laptops</h2>
        </div>
        <div class="yoga-catalog-toolbar">
          <div class="yoga-catalog-toolbar-left">
            <div class="yoga-catalog-count" id="yoga-catalog-count">18 Matching results</div>
            <span class="yoga-compare-status" id="yoga-compare-status" aria-live="polite"></span>
          </div>
          <div class="yoga-catalog-sort" id="yoga-sort-wrap">
            ${H.compTag('library-select', 'single-basic', {
              placeholder: 'Sort By: Newest',
              options: [
                'Newest',
                'Price Low to High',
                'Price High to Low',
                'Best-Selling',
                'Highest Saving by %',
                'Highest Saving by $',
                'User Rating',
              ]
                .map(
                  (o, i) =>
                    `<div class="ds-select__option" role="option" aria-selected="${i === 0 ? 'true' : 'false'}" data-value="${H.esc(o)}"><span class="ds-select__option-label">${H.esc(o)}</span></div>`
                )
                .join(''),
              layout: 'fill',
            })}
          </div>
        </div>
        <div class="yoga-catalog-layout">
          <aside class="yoga-filter-panel" aria-label="Product Filters">
            <div class="yoga-filter-head">
              <span class="yoga-filter-title">Filters</span>
              <div class="yoga-filter-actions">
                <button type="button" class="yoga-filter-reset" id="yoga-filter-collapse">Collapse All</button>
                <button type="button" class="yoga-filter-reset" id="yoga-filter-reset">Clear All</button>
              </div>
            </div>
            ${filterGroupsHtml}
          </aside>
          <div class="yoga-laptop-grid" id="yoga-laptop-grid">
            ${initialLaptopGridHtml}
          </div>
        </div>
      </div>
    </section>

    <!-- Section 15: Frequently Asked Questions (Gray Section -> Native library-collapse/faq flush with 1200px container) -->
    <section id="yoga-faq" class="page-section page-section--gray">
      <div class="container">
        <div class="section-header">
          <h2 class="section-header__title">Frequently Asked Questions</h2>
        </div>
        ${H.compTag('library-collapse', 'faq', {
          items: H.faqItemsHtml('yoga-faq', FAQ_LIST),
        })}
      </div>
    </section>
  `;

  const inlineScript = `
  (function () {
    const anchorHost = document.getElementById('yoga-anchor-nav');
    if (anchorHost) {
      const links = Array.from(anchorHost.querySelectorAll('[data-yoga-anchor]'));
      const setActiveLink = (activeEl) => {
        links.forEach((el) => el.classList.toggle('yoga-anchor-bar__link--active', el === activeEl));
      };
      anchorHost.addEventListener('click', (e) => {
        const link = e.target.closest('[data-yoga-anchor]');
        if (!link) return;
        const targetId = (link.getAttribute('href') || '').replace(/^#/, '');
        const targetEl = targetId && document.getElementById(targetId);
        if (targetEl) {
          e.preventDefault();
          setActiveLink(link);
          targetEl.scrollIntoView({ behavior: 'smooth' });
        }
      });
    }
    window.onViewYogaModel = function (e) {
      const card = e?.target?.closest?.('[data-laptop-id]');
      const link = card?.querySelector?.('.yoga-laptop-name-link');
      if (link && link.href) window.open(link.href, '_blank', 'noopener');
    };

    // Inject Hero Wordmark & Windows 11 Partner Badge inside Hero Banner responsive inner container
    const heroInner = document.querySelector('#yoga-hero .ds-banner__responsive-inner');
    if (heroInner && !heroInner.querySelector('.yoga-hero-meta')) {
      const meta = document.createElement('div');
      meta.className = 'yoga-hero-meta';
      meta.setAttribute('data-fs-extend', 'hero-os-badge');
      meta.innerHTML =
        '<img class="yoga-hero-wordmark" src="assets/lenovo-yoga/img-02-80c1472c.svg" alt="Lenovo Yoga">' +
        '<a href="https://www.lenovo.com/hk/en/d/windows-11/"><img class="yoga-hero-win11" src="assets/lenovo-yoga/img-01-7643c862.png" alt="Get to know Windows 11 devices"></a>';
      heroInner.insertBefore(meta, heroInner.firstChild);
    }

    // Inject extra bullet highlights inside Featured Products cards (cohesive data-fs-extend)
    const FEAT_BULLETS = ${JSON.stringify(FEATURED_PRODUCTS.map((f) => f.bullets))};
    document.querySelectorAll('#featured-products .ds-card').forEach((card, idx) => {
      const bullets = FEAT_BULLETS[idx];
      if (!bullets || !bullets.length || card.querySelector('.yoga-feat-bullets')) return;
      const desc = card.querySelector('.ds-card__desc');
      if (desc && desc.parentElement) {
        const ul = document.createElement('ul');
        ul.className = 'yoga-feat-bullets';
        ul.setAttribute('data-fs-extend', 'featured-product-bullets');
        ul.innerHTML = bullets.map((b) => '<li>' + b + '</li>').join('');
        desc.insertAdjacentElement('afterend', ul);
      }
    });

    // Inject Smart Connect logo + eyebrow cohesively inside Section 11 horizontal card
    const smartStack = document.querySelector('#smart-connect .ds-card__content-stack, #smart-connect .ds-card__body');
    if (smartStack && !smartStack.querySelector('.yoga-smart-badge')) {
      const badge = document.createElement('div');
      badge.className = 'yoga-smart-badge';
      badge.setAttribute('data-fs-extend', 'smart-connect-badge');
      badge.innerHTML =
        '<img class="yoga-smart-logo" src="assets/lenovo-yoga/img-27-e5c91f41.png" alt="Smart Connect logo">' +
        '<span class="yoga-smart-label">SMART CONNECT</span>';
      smartStack.insertBefore(badge, smartStack.firstChild);
    }

    // Capsule Tabs: Discover What's Possible on Your Yoga
    const POSSIBLE_TABS = ${JSON.stringify(POSSIBLE_TABS)};
    const possibleHost = document.getElementById('yoga-possible-tabs');
    if (possibleHost) {
      const switchPossible = (idx) => {
        const t = POSSIBLE_TABS[idx] || POSSIBLE_TABS[0];
        const titleEl = document.getElementById('yoga-possible-title');
        const subEl = document.getElementById('yoga-possible-sub');
        const imgEl = document.getElementById('yoga-possible-img');
        const p1El = document.getElementById('yoga-possible-p1');
        const p2El = document.getElementById('yoga-possible-p2');
        const ctaWrap = document.getElementById('yoga-possible-cta');
        if (titleEl) titleEl.textContent = t.title;
        if (subEl) subEl.textContent = t.subtitle;
        if (imgEl) { imgEl.src = t.image; imgEl.alt = t.alt; }
        if (p1El) p1El.textContent = t.p1;
        if (p2El) p2El.textContent = t.p2;
        if (ctaWrap) {
          const link = ctaWrap.querySelector('a');
          const lbl = ctaWrap.querySelector('.ds-text-btn__text');
          if (link) link.href = t.ctaHref;
          if (lbl) lbl.textContent = t.ctaLabel;
        }
      };
      possibleHost.addEventListener('click', (e) => {
        const item = e.target.closest('[data-tab-item]');
        if (!item) return;
        const items = Array.from(possibleHost.querySelectorAll('[data-tab-item]'));
        const idx = items.indexOf(item);
        if (idx >= 0) switchPossible(idx);
      });
      possibleHost.addEventListener('ds:tab-change', (e) => {
        if (typeof e.detail?.index === 'number') switchPossible(e.detail.index);
      });
    }

    // Section 14: Interactive Filtering, Collapse All, Compare & Sorting for 18 Yoga Laptops
    const grid = document.getElementById('yoga-laptop-grid');
    const countEl = document.getElementById('yoga-catalog-count');
    const compareStatusEl = document.getElementById('yoga-compare-status');
    const resetBtn = document.getElementById('yoga-filter-reset');
    const collapseBtn = document.getElementById('yoga-filter-collapse');
    const sortWrap = document.getElementById('yoga-sort-wrap');
    const FACET_KEYS = ['cpu', 'os', 'graphics', 'ai', 'display', 'storage', 'brand', 'memory', 'screen'];

    if (grid) {
      const allCards = Array.from(grid.querySelectorAll('.yoga-laptop-card'));
      let currentSort = 'Newest';

      const updateCompareStatus = () => {
        if (!compareStatusEl) return;
        const checked = document.querySelectorAll('input[name="compare-laptop"]:checked').length;
        compareStatusEl.textContent = checked > 0 ? checked + ' selected to compare' : '';
      };
      window.onYogaCompareChange = updateCompareStatus;

      const applyFilterAndSort = () => {
        const minInput = document.querySelector('.yoga-filter-panel input[name="priceMin"]');
        const maxInput = document.querySelector('.yoga-filter-panel input[name="priceMax"]');
        const minVal = minInput && minInput.value !== '' ? Number(minInput.value) : null;
        const maxVal = maxInput && maxInput.value !== '' ? Number(maxInput.value) : null;

        const checkedByFacet = {};
        FACET_KEYS.forEach((key) => {
          checkedByFacet[key] = Array.from(
            document.querySelectorAll('.yoga-filter-panel input[name="' + key + '"]:checked')
          ).map((i) => i.value);
        });

        const visible = [];
        allCards.forEach((card) => {
          const price = Number(card.getAttribute('data-price') || 0);
          const okMin = minVal === null || Number.isNaN(minVal) || price >= minVal;
          const okMax = maxVal === null || Number.isNaN(maxVal) || price <= maxVal;
          let okFacets = okMin && okMax;
          for (let i = 0; i < FACET_KEYS.length && okFacets; i++) {
            const key = FACET_KEYS[i];
            const selected = checkedByFacet[key];
            if (!selected.length) continue;
            const cardVals = (card.getAttribute('data-' + key) || '').split(',').filter(Boolean);
            if (!selected.some((v) => cardVals.includes(v))) okFacets = false;
          }
          card.style.display = okFacets ? '' : 'none';
          if (okFacets) visible.push(card);
        });

        visible.sort((a, b) => {
          const pa = Number(a.getAttribute('data-price') || 0);
          const pb = Number(b.getAttribute('data-price') || 0);
          const ra = Number(a.getAttribute('data-rating') || 0);
          const rb = Number(b.getAttribute('data-rating') || 0);
          if (currentSort === 'Price Low to High') return pa - pb;
          if (currentSort === 'Price High to Low') return pb - pa;
          if (currentSort === 'User Rating' || currentSort === 'Best-Selling') return rb - ra;
          if (currentSort === 'Highest Saving by $' || currentSort === 'Highest Saving by %') return pb - pa;
          return allCards.indexOf(a) - allCards.indexOf(b);
        });
        visible.forEach((card) => grid.appendChild(card));
        if (countEl) countEl.textContent = visible.length + ' Matching results';
      };

      window.onYogaFilterChange = applyFilterAndSort;
      window.onYogaProcessorSearch = function (e) {
        const q = String(e?.target?.value || '').trim().toLowerCase();
        const box = document.querySelector('[data-filter-group-options="cpu"]');
        if (!box) return;
        Array.from(box.children).forEach((el) => {
          const txt = (el.textContent || '').toLowerCase();
          el.style.display = !q || txt.includes(q) ? '' : 'none';
        });
      };
      const cpuSearchInput = document.querySelector('.yoga-filter-panel input[name="search-cpu"]');
      if (cpuSearchInput) {
        cpuSearchInput.addEventListener('input', window.onYogaProcessorSearch);
      }
      document.querySelectorAll('.yoga-filter-panel input[type="checkbox"]').forEach((cb) => {
        cb.addEventListener('change', applyFilterAndSort);
      });
      document.querySelectorAll('.yoga-filter-panel input[name="priceMin"], .yoga-filter-panel input[name="priceMax"]').forEach((inp) => {
        inp.addEventListener('input', applyFilterAndSort);
      });
      document.querySelectorAll('input[name="compare-laptop"]').forEach((cb) => {
        cb.addEventListener('change', updateCompareStatus);
      });

      if (collapseBtn) {
        collapseBtn.addEventListener('click', () => {
          const groups = Array.from(document.querySelectorAll('.yoga-filter-panel details.yoga-filter-group'));
          const anyOpen = groups.some((d) => d.open);
          groups.forEach((d) => { d.open = !anyOpen; });
          collapseBtn.textContent = anyOpen ? 'Expand All' : 'Collapse All';
        });
      }
      if (resetBtn) {
        resetBtn.addEventListener('click', () => {
          document.querySelectorAll('.yoga-filter-panel input[type="checkbox"]').forEach((cb) => { cb.checked = false; });
          document.querySelectorAll('.yoga-filter-panel input[name="priceMin"], .yoga-filter-panel input[name="priceMax"]').forEach((inp) => { inp.value = ''; });
          applyFilterAndSort();
        });
      }
      if (sortWrap) {
        sortWrap.addEventListener('click', (e) => {
          const opt = e.target.closest('.ds-select-menu__item, [role="option"]');
          if (opt) {
            currentSort = (opt.textContent || '').trim();
            applyFilterAndSort();
          }
        });
      }
    }
  })();
  `;

  const pageSourceHtml = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=1440">
  <title>Lenovo Yoga Laptops, 2-in-1s &amp; All-in-One PCs | FS</title>
  <style>${customCss}</style>
</head>
<body>
  ${H.compTag('library-navigation', 'header', {})}
  <main>
    ${mainHtml}
  </main>
  ${H.compTag('library-navigation', 'footer', {})}
  <script>${inlineScript}</script>
</body>
</html>`;

  H.assembleLocalPage(pageSourceHtml, OUT_FILE);
  console.log('Built:', path.relative(ROOT, OUT_FILE));
}

buildPage();
