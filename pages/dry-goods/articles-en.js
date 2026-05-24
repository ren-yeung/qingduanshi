/**
 * English translations of all 6 dry-goods articles
 * Structure mirrors articles.js exactly
 */
const ARTICLES_FULL_EN = {
  1: {
    id: 1,
    tag: 'Beginner',
    title: 'What is Intermittent Fasting? A 3-Minute Guide to This Global Health Trend',
    summary: 'Not dieting! Not starving! Intermittent fasting is an eating strategy where "when you eat" matters more than "what you eat." From Silicon Valley elites to Hollywood stars, more and more people are using it to manage weight and boost energy.',
    coverTitle: 'What is Intermittent Fasting?',
    readTime: '~3 min read',
    images: {
      cover: '/subpackages/article-detail/images/article1-cover.jpg',
      concept: '/subpackages/article-detail/images/article1-concept.jpg',
      autophagy: '/subpackages/article-detail/images/article1-autophagy.jpg',
      timeline: '/subpackages/article-detail/images/article1-timeline.jpg',
    },
    sections: [
      {
        heading: 'I. What Exactly Is Intermittent Fasting?',
        body: [
          'You\'ve probably heard the term "intermittent fasting" — people checking in on social media, coworkers discussing it, fitness influencers recommending it.',
          'But seriously, what is it?',
          'Simply put: intermittent fasting isn\'t about "not eating" — it\'s about "when to eat."',
        ],
        image: { type: 'concept', caption: 'The core of IF is "time management," not "calorie counting"' },
        highlight: null,
        bullets: [],
      },
      {
        heading: '',
        body: [
          'Traditional weight loss approaches focus on counting every calorie, weighing every bite. Intermittent fasting takes a completely different angle — it doesn\'t obsess over what you eat, but helps you plan your eating window. You eat normally during the designated period and let your body rest the rest of the time.',
          'Think of it as giving your digestive system some "time off."',
        ],
        image: null,
        highlight: 'Core concept: Intermittent Fasting (IF) is an eating pattern that cycles between periods of eating and fasting. It helps your body switch from "constant digestion mode" to "repair and cleanup mode."',
        bullets: [],
      },
      {
        heading: 'II. Why Is IF Trending Worldwide?',
        body: [
          'This isn\'t internet hype. Over the past decade, extensive scientific research has examined IF\'s effects on the human body, and the conclusions are remarkably consistent:',
        ],
        image: null,
        highlight: null,
        bullets: [
          'Easier weight management — limiting eating windows naturally reduces total intake without deliberate dieting',
          'Lower insulin levels — extended fasting gives insulin a break, helping fat burning',
          'Autophagy kicks in — this is Nobel Prize-level research! During fasting, the body actively cleans up damaged cells, like a "spring cleaning" for your body',
          'Better energy levels — many report clearer thinking in the morning and less afternoon drowsiness after adapting',
        ],
      },
      {
        heading: '',
        body: [
          'From Silicon Valley tech elites to Hollywood stars, from office workers to professional athletes — more and more people are embracing IF as a long-term health lifestyle, not a short-term weight loss tactic.',
        ],
        image: { src: 'autophagy', caption: 'Autophagy: your body\'s self-repair mechanism during fasting' },
        highlight: null,
        bullets: [],
      },
      {
        heading: 'III. IF ≠ Starving — This Is Important',
        body: [
          'When people hear "fasting," the first reaction is often:',
        ],
        image: null,
        highlight: null,
        bullets: [],
        quote: '"Isn\'t this just starving yourself?"',
      },
      {
        heading: '',
        body: ['Not at all. Scientific IF and "dieting/starvation" are fundamentally different:'],
        image: null,
        highlight: null,
        bullets: [],
        table: {
          headers: ['Aspect', 'Dieting/Starvation', 'Scientific IF'],
          rows: [
            ['Core logic', 'Eat as little as possible', 'Eat at regular times'],
            ['Nutrition intake', 'Often insufficient', 'Eat normally during window'],
            ['Hunger level', 'Constant', 'Gradually fades after adaptation'],
            ['Sustainability', 'Hard to maintain', 'Easy to fit into daily life'],
            ['Metabolic impact', 'Metabolism slows down', 'Metabolism largely unaffected'],
          ],
        },
      },
      {
        heading: '',
        body: [
          'IF\'s keyword is rhythm, not deprivation. In your 8-hour eating window (using 16:8 as an example), you can eat normally, even eat until full. The remaining 16 hours, you\'re mostly sleeping or busy — you barely notice the hunger.',
        ],
        image: null,
        highlight: null,
        bullets: [],
      },
      {
        heading: 'IV. Who Should Try IF?',
        body: [],
        image: null,
        highlight: null,
        bullets: [],
        tags: {
          yes: [
            'Want to manage weight without counting calories',
            'Too busy to research complex diet plans',
            'Want to improve metabolism and boost energy',
            'Have tried multiple weight loss methods without success',
          ],
          no: [
            'Pregnant or breastfeeding women',
            'People with a history of eating disorders',
            'Underweight or malnourished individuals',
            'Those on medications that must be taken with food',
            'Adolescents/teenagers (still in development)',
          ],
        },
      },
      {
        heading: 'V. How to Start Your First IF?',
        body: [
          'If this is your first time, we recommend starting with the classic 16:8 method:',
        ],
        image: null,
        highlight: null,
        bullets: [],
        steps: [
          {
            num: 1,
            title: 'Choose Your Eating Window',
            items: [
              'Pick an 8-hour window that fits your schedule (e.g., 10:00 AM - 6:00 PM)',
              'Eat 2-3 normal meals within this window',
              'During the remaining 16 hours, only drink water, black coffee, or unsweetened tea',
            ],
          },
          {
            num: 2,
            title: 'Take It Step by Step',
            items: [
              'Start with a 12-hour fast',
              'Gradually extend to 14 hours → 16 hours',
              'Don\'t rush — give your body time to adapt',
            ],
          },
          {
            num: 3,
            title: 'Managing Initial Discomfort',
            items: [
              'The first 3 days may bring hunger or discomfort — this is completely normal',
              'Your body is switching from "sugar-burning" to "fat-burning" mode',
              'Most people adapt within about a week',
            ],
          },
        ],
      },
      {
        heading: '',
        body: [],
        image: { type: 'timeline', caption: '16:8 Intermittent Fasting Schedule Diagram' },
        highlight: 'Remember: IF is not a sprint — it\'s a life rhythm you can sustain forever.',
        bullets: [],
      },
      {
        heading: 'Final Words',
        body: [
          'IF has remained popular globally for so long not because it\'s magical, but because it\'s simple, scientific, and sustainable.',
          'It won\'t force you to give up foods you love. It won\'t make you weigh every meal. It won\'t embarrass you at social gatherings. It simply helps you build a more rhythmic eating habit — and that habit may be easier to stick with than any complex diet plan.',
        ],
        image: null,
        highlight: null,
        bullets: [],
        ending: true,
        nextHint: 'Ready to start? The next article will guide you through creating your own 16:8 fasting schedule →',
      },
    ],
  },

  // ============================================================
  // Article 2: 16:8 Complete Guide
  // ============================================================
  2: {
    id: 2,
    tag: 'Method',
    title: '16:8 Fasting Complete Guide | The Best Beginner Plan for Office Workers',
    summary: 'Skip breakfast (or dinner) and compress eating into 8 hours — that\'s the entire secret of 16:8. No calorie counting, no special groceries. Perfect for office workers and students alike.',
    coverTitle: '16:8 Fasting Complete Guide',
    readTime: '~4 min read',
    images: {
      cover: '/subpackages/article-detail/images/article2-cover.jpg',
      schedules: '/subpackages/article-detail/images/article2-schedules.jpg',
    },
    sections: [
      {
        heading: 'I. What Is the 16:8 Method?',
        body: [
          '16:8 is currently the world\'s most popular IF protocol. The rules are incredibly simple:',
        ],
        image: null,
        highlight: null,
        bullets: [
          'Limit eating to a **continuous 8-hour window** each day',
          'Consume no caloric food during the remaining **16 hours**',
          'Can be done daily or a few days per week',
        ],
      },
      {
        heading: '',
        body: [
          'Sounds simple, right? But it\'s precisely this simplicity that makes it the easiest IF method to sustain. No complicated food combinations, no weighing, no calorie tracking — you only need to do one thing: manage your time.',
        ],
        image: null,
        highlight: 'The essence of 16:8: Not "eat less," but "eat at the right time."',
        bullets: [],
      },
      {
        heading: 'II. How to Choose Your Eating Window?',
        body: [
          'This is the most flexible part of 16:8 — you can freely arrange those 8 hours based on your lifestyle. Here are the three most common approaches:',
        ],
        image: { type: 'schedules', caption: 'Three 16:8 eating windows for different schedules' },
        highlight: null,
        bullets: [],
      },
      {
        heading: '',
        body: [],
        image: null,
        highlight: null,
        bullets: [],
        cards: [
          {
            badge: 'Most Popular',
            scheme: 'Standard Office Worker',
            time: '10:00 AM - 6:00 PM',
            desc: 'Push breakfast to 10 AM, finish dinner by 6 PM. Ideal for most 9-to-6 workers — lunch and afternoon snack are both fine.',
            pros: ['Social meals largely unaffected', 'Can have dinner with family', 'Flexible on weekends'],
            cons: ['May feel hungry in the early morning', 'Need to adjust to skipping breakfast'],
          },
          {
            badge: 'Night Owl Edition',
            scheme: 'Late Riser / Night Shift',
            time: '12:00 PM - 8:00 PM',
            desc: 'First meal at noon, last meal before 8 PM. Great for late sleepers or night shift workers.',
            pros: ['Naturally skips breakfast', 'No need to wake up early', 'Fits many young people\'s routines'],
            cons: ['Dinner is close to bedtime', 'May affect digestion for some'],
          },
          {
            badge: 'Early Bird Edition',
            scheme: 'Early Riser / Athlete',
            time: '8:00 AM - 4:00 PM',
            desc: 'Breakfast at 8 AM, finish by 4 PM. Perfect for early risers and morning exercisers.',
            pros: ['Long pre-sleep fast aids sleep quality', 'Morning fasted cardio maximizes fat burn', 'Ample nighttime gut repair time'],
            cons: ['Dinner time is very early, socially inconvenient', 'No food after 4 PM is challenging'],
          },
        ],
      },
      {
        heading: 'III. What to Eat in Those 8 Hours?',
        body: [
          'Good news: 16:8 doesn\'t strictly limit what you eat. But if you want to maximize results, here are some tips:',
        ],
        image: null,
        highlight: null,
        bullets: [
          '**Prioritize**: quality protein (eggs, chicken breast, fish), complex carbs (brown rice, sweet potato), plenty of vegetables, healthy fats (avocado, nuts)',
          '**Moderate**: fruits, dairy, legumes',
          '**Limit**: refined sugar, fried foods, processed snacks',
          '**Avoid**: sugary drinks (juice, bubble tea, soda)',
        ],
      },
      {
        heading: '',
        body: [
          'Core principle: eat until satisfied within the 8 hours, but don\'t binge just because "there\'s only 8 hours to eat." IF is not an excuse for overeating.',
        ],
        image: null,
        highlight: 'Remember: 16:8 manages "time," not "quantity." But quantity still matters — that\'s healthy IF.',
        bullets: [],
      },
      {
        heading: 'IV. What Can You Drink During the 16 Hours?',
        body: [
          'This is the most frequently asked question from beginners. The answer is simple:',
        ],
        image: null,
        highlight: null,
        bullets: [
          '✅ Water (best choice, drink as much as you want)',
          '✅ Black coffee (no sugar, no milk, 1-2 cups is fine)',
          '✅ Unsweetened tea (green, black, oolong — all okay)',
          '✅ Sparkling water (unsweetened)',
          '❌ Fruit juice (even fresh-squeezed contains lots of fructose)',
          '❌ Bubble tea, lattes (milk contains lactose and protein, breaks the fast)',
          '❌ Sugary drinks (soda, sports drinks, energy drinks)',
          '❌ Alcohol (not only breaks the fast but impairs fat burning)',
        ],
      },
      {
        heading: 'V. Beginner FAQ',
        body: [],
        image: null,
        highlight: null,
        bullets: [],
        qa: [
          { q: 'Do I have to do it every day?', a: 'No. You can start with 3-4 days per week and increase as you adapt. Many people do it on weekdays and relax on weekends.' },
          { q: 'What if I get hungry?', a: 'Initial hunger is normal. Drinking plenty of water often effectively alleviates it. If it\'s really unbearable, have a small handful of nuts or a cucumber — no need to be too strict.' },
          { q: 'Will it affect my menstrual cycle?', a: 'Women do need to be more cautious. If menstrual irregularities occur, stop immediately and consult a doctor. Women are advised to start gradually with 12-hour fasts.' },
          { q: 'Can I exercise?', a: 'Absolutely! In fact, light to moderate exercise during fasting can boost fat burning. High-intensity training is best done within the eating window. See the article on pairing IF with exercise.' },
          { q: 'How soon will I see results?', a: 'Generally, you\'ll notice energy changes in about 2 weeks. Weight changes vary by individual, usually visible after 3-4 weeks. Consistency is key.' },
        ],
      },
      {
        heading: 'Final Words',
        body: [
          'The beauty of 16:8 lies in its minimalist philosophy — you only need to remember one number: 8. Eat well during those 8 hours and let your body do its work the rest of the time.',
          'No expensive ingredients, no complicated recipes, no half-hour diet meal prep every day. If you\'re willing to adjust your eating schedule, your body will reward you.',
          'You can start today — choose your 8-hour window, and go for it.',
        ],
        image: null,
        highlight: null,
        bullets: [],
        ending: true,
        nextHint: 'Not sure what you can drink during fasting? The next article gives you the ultimate drink cheat sheet →',
      },
    ],
  },

  // ============================================================
  // Article 3: What to Drink During Fasting
  // ============================================================
  3: {
    id: 3,
    tag: 'Science',
    title: 'What Can You Drink During Fasting? Save This Checklist',
    summary: 'Water? Black coffee? Unsweetened tea? What about milk? One wrong sip during fasting could undo your progress! We\'ve compiled the most complete drink guide to help you avoid the "hidden sugars" that secretly break your fast.',
    coverTitle: 'Fasting Drink Cheat Sheet',
    readTime: '~3 min read',
    images: {
      cover: '/subpackages/article-detail/images/article3-cover.jpg',
    },
    sections: [
      {
        heading: 'Why "Drinking" Matters So Much?',
        body: [
          'You might think: "I just won\'t eat, drinking water is easy, right?"',
          'But the reality is, many people work hard to fast for over ten hours, only to unknowingly break their fast with a seemingly harmless drink.',
          'What\'s worse, the "damage" from some drinks is very subtle — you think there are no calories, but actually...',
        ],
        image: null,
        highlight: 'A single bubble tea can contain more calories than a full meal. And even "zero-calorie drinks" may interfere with fasting by stimulating insulin secretion.',
        bullets: [],
      },
      {
        heading: 'I. Green Zone ✅ Safe to Drink',
        body: ['These drinks are safe during fasting and won\'t break your fast:'],
        image: null,
        highlight: null,
        bullets: [],
        drinkList: [
          { name: 'Water', emoji: '💧', reason: 'Absolutely safe top choice. A slice of lemon is fine (minimal effect). Aim for at least 2000ml daily.', tip: 'Warm water is absorbed more easily than ice water and can help reduce hunger.' },
          { name: 'Black Coffee', emoji: '☕', reason: 'Pure black coffee is nearly zero-calorie, boosts metabolism, and suppresses appetite. 1-2 cups daily is fine.', tip: 'Only add a tiny bit of stevia if needed. Absolutely no sugar or milk.' },
          { name: 'Unsweetened Tea', emoji: '🍵', reason: 'Green, black, oolong, pu-erh — all fine as long as no sugar is added. Tea polyphenols also have antioxidant benefits.', tip: 'Cold or hot brew both work. Tea bags or loose leaf are fine. Avoid "flavored teas."' },
          { name: 'Apple Cider Vinegar Water', emoji: '🥤', reason: 'A small spoon of ACV in water helps stabilize blood sugar and reduce hunger. Many fasters\' secret weapon.', tip: 'Don\'t make it too concentrated or it may hurt your stomach. Better after meals than on an empty stomach.' },
        ],
      },
      {
        heading: 'II. Yellow Zone ⚠️ Use Caution',
        body: ['These drinks are controversial — depends on how strict you are:'],
        image: null,
        highlight: null,
        bullets: [],
        drinkList: [
          { name: 'Diet Sodas (Coke Zero, etc.)', emoji: '🥤', reason: 'Zero calories, but artificial sweeteners may stimulate the brain\'s reward system, making you crave more food.', tip: 'Strict fasters should avoid. In relaxed mode, occasional consumption is fine.' },
          { name: 'Soy/Almond Milk (Unsweetened)', emoji: '🥛', reason: 'Even "unsweetened" versions contain plant protein and small amounts of carbs.', tip: 'If strictly following 16:8, save these for your eating window.' },
          { name: 'Bone Broth', emoji: '🍲', reason: 'Rich in electrolytes and collagen, but contains small amounts of protein and amino acids from bones.', tip: 'Helpful for easing initial fasting discomfort, but technically breaks a strict fast mildly.' },
          { name: 'Lemon Water', emoji: '🍋', reason: 'A couple of lemon slices add negligible calories, but a tiny amount of fructose is still present.', tip: '1-2 slices is perfectly fine. Just don\'t squeeze an entire lemon.' },
        ],
      },
      {
        heading: 'III. Red Zone ❌ Absolutely Not',
        body: ['These drinks will immediately break your fast:'],
        image: null,
        highlight: null,
        bullets: [],
        drinkList: [
          { name: 'All Sugary Drinks', emoji: '🚫', reason: 'Soda, juice, bubble tea, sports drinks, energy drinks — these are IF\'s #1 enemy.', tip: 'A 500ml cola contains ~53g of sugar, equal to 13 sugar cubes.' },
          { name: 'Milk / Lattes', emoji: '🚫', reason: 'Milk contains lactose (sugar) and casein (protein), both of which stimulate insulin.', tip: 'Lattes, cappuccinos, flat whites — all off limits. Americano is fine.' },
          { name: 'Alcohol', emoji: '🚫', reason: 'Alcohol provides empty calories (7kcal/g) and gets metabolized by the liver first, pausing fat burning.', tip: 'No alcohol at all during fasting. It\'s not healthy regardless.' },
          { name: 'Honey Water / Maple Water', emoji: '🚫', reason: 'They look "natural," but are essentially sugar water. Honey is over 80% sugar.', tip: 'Natural doesn\'t mean low-calorie. Honey is great — just enjoy it within your eating window.' },
          { name: 'Protein Powder / Meal Replacement Shakes', emoji: '🚫', reason: 'Protein triggers the mTOR pathway, and mTOR activation suppresses autophagy — one of the key benefits of fasting.', tip: 'Take protein powder within your eating window for better results.' },
        ],
      },
      {
        heading: 'IV. Practical Tips',
        body: [],
        image: null,
        highlight: null,
        bullets: [
          'Get a nice big water bottle — seeing it will subconsciously make you drink more',
          'Drink 300-500ml warm water first thing in the morning to wake up your metabolism',
          'When hungry, drink a large glass of water and wait 10 minutes — often "thirst" is mistaken for "hunger"',
          'Drink black coffee in the morning to avoid affecting nighttime sleep',
          'If you dislike plain water, try adding mint leaves or cucumber slices — nearly zero calories and tasty',
        ],
      },
      {
        heading: 'Final Words',
        body: [
          'The drinking strategy during fasting can be summed up in one sentence: **Keep it simple. Keep it pure.**',
          'Water and caffeine-free tea are the safest choices. Black coffee in moderation is fine too. For everything else — if you\'re unsure, save it for your 8-hour eating window.',
          'Remember, IF is not an ascetic lifestyle. It\'s a rhythmic health strategy — enjoy food during the right times, and let your body quietly repair during the rest.',
          'Now you know what to drink. Next, let\'s look at how many of those widely circulated "fasting tips" are actually wrong.',
        ],
        image: null,
        highlight: null,
        bullets: [],
        ending: true,
        nextHint: '90% of beginners fall into these traps? The next article reveals the 5 biggest IF myths →',
      },
    ],
  },

  // ============================================================
  // Article 4: Common IF Mistakes
  // ============================================================
  4: {
    id: 4,
    tag: 'Avoid Pitfalls',
    title: '90% of Beginners Fall Into These 5 Traps | IF Pitfall Guide',
    summary: '"Fasting means not eating?" "If I\'m dizzy from hunger, it must be working?" These widely circulated claims are all wrong! This article lists the 5 biggest beginner traps — each one can undo your efforts.',
    coverTitle: 'IF Common Pitfalls Guide',
    readTime: '~3 min read',
    images: {
      cover: '/subpackages/article-detail/images/article4-cover.jpg',
      comic: '/subpackages/article-detail/images/article4-comic.jpg',
    },
    sections: [
      {
        heading: 'Myth #1: "Fasting = Not Eating / Starvation"',
        body: [
          'This is the biggest misconception, hands down.',
          'The word "fasting" indeed conjures images of hunger strikes or extreme dieting. But in reality, scientific IF and starvation are completely different:',
        ],
        image: { src: 'comic', caption: 'Left: painful starvation vs. Right: easy scientific IF' },
        highlight: null,
        bullets: [
          '**Starvation**: complete food deprivation for extended periods (days to weeks), dangerous and unsustainable',
          '**Intermittent Fasting**: regular, brief eating restrictions (~16 hours), safe and scientifically supported',
        ],
      },
      {
        heading: '',
        body: [
          'The essence of IF is **eating rhythmically**, not **not eating**. You eat every day — you\'re just concentrating your meals into one window.',
        ],
        image: null,
        highlight: 'IF ≠ not eating. IF = eating the right foods at the right time.',
        bullets: [],
      },
      {
        heading: 'Myth #2: "The Hungrier I Get, the Better It Works"',
        body: [
          'Some people think that stronger hunger means better results, and deliberately extend fasting or reduce food intake.',
          'This is a very dangerous mindset.',
        ],
        image: null,
        highlight: null,
        bullets: [
          'Excessive hunger leads to **binge eating tendencies** — after prolonged hunger, you\'ll want to eat everything',
          'Chronic calorie deficit **lowers basal metabolism** — your body enters "power-saving mode," making weight loss harder',
          'Severe energy deficit causes **muscle loss** — you may be losing more than just fat',
          'Excessive fasting in women can cause **menstrual irregularities, hair loss, weakened immunity**',
        ],
      },
      {
        heading: '',
        body: [
          'The correct approach: eat until **full and well-nourished** within your eating window. IF\'s goal isn\'t to create hunger — it\'s to establish healthy eating rhythms.',
        ],
        image: null,
        highlight: 'If you constantly feel unbearable hunger, your current plan may not suit you. Adjust your window or shorten fasting duration — that\'s perfectly fine.',
        bullets: [],
      },
      {
        heading: 'Myth #3: "I Can\'t Exercise While Fasting"',
        body: [
          'Many worry they won\'t have energy to exercise while fasting, fearing fainting or muscle loss.',
          'The truth is the opposite: **moderate exercise is not only doable but recommended.**',
        ],
        image: null,
        highlight: null,
        bullets: [
          'During fasting, **glycogen reserves are lower**, so the body shifts to **fat-burning mode** sooner',
          'Light to moderate exercise (walking, yoga, jogging) during fasting has **higher fat-burning efficiency**',
          'Exercise also **distracts you**, reducing the psychological sensation of hunger',
        ],
      },
      {
        heading: '',
        body: ['But differentiate by intensity:'],
        image: null,
        highlight: null,
        bullets: [
          '✅ Recommended (during fast): walking, yoga, light stretching, housework',
          '⚠️ Okay (late fast / after adaptation): jogging, cycling, moderate strength training',
          '❌ Better (within eating window): HIIT, heavy weight training, long-duration endurance',
        ],
      },
      {
        heading: 'Myth #4: "Fasting Cancels Out Bad Eating"',
        body: [
          'The thinking goes: "Since I\'m fasting 16 hours, I can eat whatever I want in the 8 hours."',
          'Unfortunately, math doesn\'t lie.',
        ],
        image: null,
        highlight: 'If you consume far more calories than your body needs in those 8 hours, no amount of fasting will make you lose weight — you might even gain.',
        bullets: [],
      },
      {
        heading: '',
        body: [
          'For example: suppose your daily energy expenditure is 1,800 kcal. If you eat 2,500 kcal of fried chicken, burgers, and pizza in 8 hours... even if you eat nothing for the other 16 hours, you\'re still in a caloric surplus.',
          'IF is a **supporting tool**, not a **free pass**. It can help naturally reduce some total intake, but it can\'t fully replace healthy food choices.',
        ],
        image: null,
        highlight: 'The best strategy: 16:8 time control + balanced eating within the window. Combined, the effect is maximized.',
        bullets: [],
      },
      {
        heading: 'Myth #5: "I\'ll Adapt on Day One"',
        body: [
          'Some people start IF with high expectations, only to feel dizzy and miserable on day one, conclude they\'re "not suited for fasting," and quit.',
          'Please give yourself some time.',
        ],
        image: null,
        highlight: null,
        bullets: [
          'Days 1-3: The hardest. Your body still relies on glucose for energy; blood sugar fluctuations cause hunger, irritability, headaches',
          'Days 4-7: Gradually improving. Your body starts mobilizing fat reserves for energy; hunger noticeably decreases',
          'Week 2+: The new normal. Many report improved energy and no longer constantly think about food',
        ],
      },
      {
        heading: '',
        body: [
          'Like any lifestyle change, adaptation takes time. No one runs a marathon on their first day of running, and no one adapts perfectly to IF on their first try.',
        ],
        image: null,
        highlight: 'If the first 3 days are especially tough, try starting with a 12-hour fast and build up gradually. Taking it slow is fine — what matters is consistency.',
        bullets: [],
      },
      {
        heading: 'Final Words',
        body: [
          'Avoid these 5 pitfalls, and you\'re already halfway to IF success.',
          'To sum it up: **Don\'t be extreme. Don\'t rush. Don\'t use fasting as an excuse. Treat it as a gentle, sustainable lifestyle rhythm adjustment, not a one-time extreme challenge.**',
          'Next, let\'s talk about the hurdle every beginner faces — the initial discomforts of fasting and how to gracefully get through them.',
        ],
        image: null,
        highlight: null,
        bullets: [],
        ending: true,
        nextHint: 'The first three days are the hardest? The next article shares 7 practical tips for a smooth adaptation period →',
      },
    ],
  },

  // ============================================================
  // Article 5: Getting Through the Adaptation Period
  // ============================================================
  5: {
    id: 5,
    tag: 'Tips',
    title: 'First 3 Days of Fasting Are the Hardest? 7 Tricks for a Smooth Adaptation',
    summary: 'Hunger pangs, trouble focusing, maybe even a bit irritable... Don\'t worry, your body is just "switching fuels"! This article shares 7 proven tips to help you breeze through the toughest first 72 hours.',
    coverTitle: 'Surviving Early Fasting Discomfort',
    readTime: '~3 min read',
    images: {
      cover: '/subpackages/article-detail/images/article5-cover.jpg',
      curve: '/subpackages/article-detail/images/article5-curve.jpg',
    },
    sections: [
      {
        heading: 'First, Understand: Why Do You Feel Uncomfortable?',
        body: [
          'When you start IF, your body is undergoing a major energy source switch.',
        ],
        image: null,
        highlight: null,
        bullets: [],
      },
      {
        heading: '',
        body: [
          'In the past, your body was used to getting glucose frequently from food as its main energy source. Suddenly, you tell it: "No delivery for the next 16 hours."',
          'Your body\'s reaction goes roughly like this:',
        ],
        image: null,
        highlight: null,
        bullets: [
          'First few hours: burns stored **glycogen** in the liver',
          'When glycogen runs low: sends "need energy!" signals → **you feel hungry**',
          'Can\'t find more sugar: starts mobilizing **fat tissue** into ketones → **switching fuels...**',
          'Switch complete: new stable energy system online → **discomfort gradually disappears**',
        ],
      },
      {
        heading: '',
        body: [
          'This process typically takes **3-7 days**. Knowing this, you understand: the discomfort isn\'t because you\'re doing something wrong — your body is simply learning a new skill.',
        ],
        image: { type: 'curve', caption: 'Typical discomfort curve: peaks in the first 3 days, then drops rapidly' },
        highlight: 'Think of this period as your body\'s "software update" — a little lag is normal, and everything works better afterward.',
        bullets: [],
      },
      {
        heading: 'Tip 1: Drink Lots of Water (Most Important!)',
        body: [
          'This isn\'t a cliché — it really works. Often when you think you\'re hungry, you\'re actually just thirsty.',
        ],
        image: null,
        highlight: null,
        bullets: [
          'Hunger and thirst are processed by the same brain region and easily confused',
          'Water fills stomach space, physically increasing fullness',
          'Cold water can even slightly boost metabolic rate',
          'Target: at least **2000-2500ml** of water during fasting',
        ],
      },
      {
        heading: 'Tip 2: Suppress Appetite with Black Coffee',
        body: [
          'Black coffee is a faster\'s best friend.',
        ],
        image: null,
        highlight: null,
        bullets: [
          '**Caffeine** naturally suppresses appetite',
          'Boosts alertness and focus, combating possible "brain fog" early in fasting',
          'Nearly zero calories, won\'t break the fast',
          'Recommendation: one cup around your usual breakfast time works best',
          'Note: no more than 2-3 cups daily; avoid after 4 PM (affects sleep)',
        ],
      },
      {
        heading: 'Tip 3: Stay Busy — Distract Yourself',
        body: [
          '"Boredom" amplifies hunger.',
          'When you have nothing to do, your brain starts seeking stimulation — and "eating something" is one of the easiest stimulations to get.',
        ],
        image: null,
        highlight: null,
        bullets: [
          '**Dive into work/study**: focus mode makes you forget hunger',
          '**Go for a walk**: fresh air and light exercise significantly reduce appetite',
          '**Take a hot shower**: warmth temporarily suppresses hunger',
          '**Brush your teeth**: a fresh mouth reduces the desire to eat',
          '**Watch shows / play games**: immersive entertainment is the best distraction',
        ],
      },
      {
        heading: 'Tip 4: Get Enough Sleep',
        body: [
          'This is often overlooked but has a huge impact.',
        ],
        image: null,
        highlight: null,
        bullets: [
          'Sleep deprivation **increases ghrelin (hunger hormone)** secretion',
          'While **lowering leptin (satiety hormone)** levels',
          'Result: you\'re hungrier and have more cravings, with significantly weakened willpower',
          'Studies show: sleep-deprived people consume an average of **300-400 extra kcal** the next day',
        ],
      },
      {
        heading: '',
        body: [
          'So in those first few days of fasting, try to go to bed early. Sleep through it — you won\'t feel hungry while sleeping. Two birds, one stone.',
        ],
        image: null,
        highlight: 'During early fasting, sleep is your strongest ally. If you\'re tired, sleep — don\'t force yourself to stay awake.',
        bullets: [],
      },
      {
        heading: 'Tip 5: Supplement Electrolytes Appropriately',
        body: [
          'In early fasting, you might feel dizzy, weak, or have headaches.',
        ],
        image: null,
        highlight: null,
        bullets: [
          'As insulin drops, kidneys accelerate **sodium and water** excretion',
          'Electrolyte imbalance causes the above symptoms',
          'Solution: add a small amount of **sea salt** (not refined salt) to water, or drink unsweetened electrolyte water',
          'A pinch of salt (about 1/4 teaspoon) dissolved in a large glass of water is sufficient',
        ],
      },
      {
        heading: 'Tip 6: Don\'t Stare at Food',
        body: [
          'This sounds like a joke, but it\'s quite serious.',
          'Research has found that merely **seeing or smelling food** can trigger insulin and stomach acid secretion — even if you\'re not eating.',
        ],
        image: null,
        highlight: null,
        bullets: [
          'During fasting, do **NOT** scroll through food videos or food bloggers',
          'Do **NOT** linger in the kitchen too long',
          'Do **NOT** help coworkers order takeout (unless you have iron willpower)',
          'If family is eating nearby, step away and do something else',
        ],
      },
      {
        heading: 'Tip 7: Tell Yourself "This Is Temporary"',
        body: [
          'An important psychological finding: when we know something unpleasant "has an end," it becomes much easier to endure.',
        ],
        image: null,
        highlight: null,
        bullets: [
          'Hunger typically naturally subsides within **30-45 minutes** (if you ignore it)',
          'After the toughest **first 3 days**, things improve dramatically',
          'Every time you want to quit, tell yourself: "Just a little longer, eating time is coming soon"',
          'Mark each day you get through on a calendar — watching the progress bar advance is very satisfying',
        ],
      },
      {
        heading: 'Final Words',
        body: [
          'The various discomforts of early fasting are like post-workout muscle soreness — they tell you that change is happening.',
          'The vast majority of people who successfully stick with it will tell you the same thing: **the hardest part is the first few days. Once you cross that threshold, you\'ll discover a new you — more energetic, with a smaller appetite, and stronger control over food.**',
          'So give yourself some patience. What you\'re doing is worth these few days of effort.',
        ],
        image: null,
        highlight: null,
        bullets: [],
        ending: true,
        nextHint: 'Adapted and want to accelerate results? The next article covers the perfect IF + exercise pairing →',
      },
    ],
  },

  // ============================================================
  // Article 6: IF + Exercise
  // ============================================================
  6: {
    id: 6,
    tag: 'Exercise',
    title: 'IF + Exercise = Fat-Burning Accelerator? Here\'s Your Pairing Guide',
    summary: 'Is fasted cardio really better for fat loss? Can you do strength training while fasting? Do you need supplements before/after exercise? Combining the latest research, this article tells you how to plan your workouts during IF — safely and effectively maximizing fat burn.',
    coverTitle: 'IF & Exercise Pairing Guide',
    readTime: '~4 min read',
    images: {
      cover: '/subpackages/article-detail/images/article6-cover.jpg',
      zones: '/subpackages/article-detail/images/article6-zones.jpg',
    },
    sections: [
      {
        heading: 'Why IF + Exercise Is the Golden Combo?',
        body: [
          'Individually, IF helps create a calorie deficit; exercise increases expenditure. But when combined, some interesting chemistry happens:',
        ],
        image: null,
        highlight: null,
        bullets: [
          'In a fasted state, **glycogen levels are lower**, so exercise mobilizes **fat** as fuel more quickly',
          'During fasting, **growth hormone (HGH)** secretion increases, helping preserve muscle while burning fat',
          'Exercise improves **insulin sensitivity**, allowing more efficient nutrient use when you eat again',
          'Exercise-produced **endorphins** can improve mood swings that may occur early in fasting',
        ],
      },
      {
        heading: '',
        body: [
          'But the key is — **what kind of exercise, and when**. Getting it wrong can backfire.',
        ],
        image: null,
        highlight: 'Principle: Exercise during fasting should focus on "aiding fat burn," not pursuing peak athletic performance.',
        bullets: [],
      },
      {
        heading: 'I. Best Exercise Types During Fasting',
        body: [],
        image: { type: 'zones', caption: 'Exercise intensity zones during fasting' },
        highlight: null,
        bullets: [],
        intensityZones: {
          green: {
            label: 'Green Zone ✅ Highly Recommended',
            desc: 'Low-Intensity Steady State (LISS), heart rate at 50-60% of max',
            items: [
              'Brisk walking (top recommendation! lowest barrier, great results)',
              'Easy jogging (pace where you can still chat)',
              'Yoga / stretching',
              'Cycling (leisure pace, not sprints)',
              'Swimming (slow pace)',
              'Housework / gardening',
            ],
            why: 'These primarily use fat for fuel, won\'t create too much stress, and actually accelerate fat burning. Can be done anytime, can stop anytime.',
          },
          yellow: {
            label: 'Yellow Caution Zone ⚠️ Proceed with Care',
            desc: 'Moderate intensity, heart rate at 60-75% of max',
            items: [
              'Fartlek / interval running',
              'Spinning (moderate resistance)',
              'Dance classes (Zumba, etc.)',
              'Moderate weight strength training',
              'Stair climber / elliptical (moderate intensity)',
            ],
            why: 'Can gradually add these after adapting (2+ weeks). Pay attention to how you feel — stop immediately if dizzy or nauseous.',
          },
          red: {
            label: 'Red Zone ❌ Best Avoided',
            desc: 'High intensity, heart rate above 75% of max',
            items: [
              'HIIT (High-Intensity Interval Training)',
              'Heavy weightlifting / powerlifting',
              'CrossFit / battle ropes',
              'Competitive ball sports (basketball, soccer, etc.)',
              'Long-distance running (over 10km)',
            ],
            why: 'High-intensity exercise needs ample glycogen and amino acids. Doing it fasted may cause muscle breakdown, cortisol spikes, and slower recovery. Best done within the eating window.',
          },
        },
      },
      {
        heading: 'II. Best Exercise Timing',
        body: ['Different exercise timings have different effects:'],
        image: null,
        highlight: null,
        bullets: [],
        timeSlots: [
          {
            when: 'During Fasting (Fasted Exercise)',
            bestFor: ['Low-intensity cardio', 'Brisk walking', 'Yoga/stretching'],
            pros: ['Highest fat-burning efficiency', 'Helps accelerate ketosis entry', 'Improves metabolic flexibility'],
            cons: ['Explosiveness and strength performance decrease', 'Not suitable for high-intensity or long-duration exercise'],
            tip: 'Best window: late fasting period (e.g., hours 14-16 in a 16:8 plan), when fat oxidation rate is highest.',
          },
          {
            when: 'Just Before Eating Window Opens',
            bestFor: ['Moderate-intensity exercise', 'Strength training'],
            pros: ['Can eat right after to replenish nutrients', 'Post-workout meal absorption is efficient'],
            cons: ['Timing must be precise or eating may be delayed'],
            tip: 'Plan ahead. E.g., if the fast ends at 6 PM, exercise at 5 PM and eat at 6 PM sharp.',
          },
          {
            when: 'Within Eating Window (Non-Fasted)',
            bestFor: ['HIIT', 'Heavy weight training', 'Team sports', 'Long endurance training'],
            pros: ['Peak physical performance', 'No hypoglycemia or dizziness worries', 'Timely post-workout nutrition aids muscle recovery'],
            cons: ['Lower fat-burning ratio (but higher total burn)', 'Must arrange exercise and meals within 8 hours'],
            tip: 'Exercise mid-window (2-3 hours after first meal), so you can eat another meal afterward for recovery.',
          },
        ],
      },
      {
        heading: 'III. Do You Need Supplements Before/After Exercise?',
        body: ['This depends on your exercise intensity:'],
        image: null,
        highlight: null,
        bullets: [],
        qa: [
          { q: 'Do I need supplements for low-intensity (walking/yoga)?', a: 'No. Water is enough.' },
          { q: 'What about moderate-intensity?', a: 'Generally no. If exercising over 45 min or sweating heavily, you can supplement with electrolyte water (unsweetened). BCAAs are controversial — some say they mildly interfere with autophagy, others say they help preserve muscle. Personal choice.' },
          { q: 'Can I drink protein powder during fasting?', a: 'Technically it breaks the fast (protein stimulates insulin). But if your goal is muscle preservation + fat loss, a scoop around exercise isn\'t the end of the world. Just know it\'s no longer strict fasting.' },
          { q: 'Must I eat immediately after training?', a: 'The "anabolic window" isn\'t as narrow as legend says. Eating within 1-2 hours post-workout is fine. No need to frantically stuff chicken breast while doing push-ups.' },
        ],
      },
      {
        heading: 'IV. Important Safety Reminders',
        body: [],
        image: null,
        highlight: null,
        bullets: [
          '**Listen to your body**: dizziness, heart palpitations, cold sweats = stop immediately and eat',
          '**Start low-intensity for your first fasted workout**: begin with 20-30 min brisk walking, don\'t sprint right away',
          '**Carry emergency snacks**: an energy bar or a few crackers, just in case',
          '**Tell someone**: if doing outdoor exercise while fasting, let someone know your whereabouts',
          '**These people should avoid fasted exercise**: diabetics, those with low blood pressure, pregnant women, those with eating disorder history',
        ],
      },
      {
        heading: 'Final Words',
        body: [
          'The relationship between IF and exercise can be summed up in four words: **mutually reinforcing**.',
          'IF creates a better fat-burning environment for exercise, and exercise multiplies IF\'s effects. But the prerequisite is respecting your body\'s rhythm, progressing gradually, and not blindly chasing intensity.',
          'The best workout plan isn\'t a template copied from the internet — it\'s a plan constantly adjusted based on your own physical condition and lifestyle. Start small, find the balance that makes you feel good — and stick with it.',
          'That wraps up all 6 of our articles. From beginner concepts to practical methods, from drink guides to exercise pairing, from pitfall warnings to adaptation tips — we hope this content provides a solid knowledge foundation for your IF journey.',
        ],
        image: null,
        highlight: 'IF isn\'t a short-term weight loss sprint — it\'s a long journey of dialogue with your body. Enjoy the journey 🌱',
        bullets: [],
        ending: true,
        nextHint: 'Back to the article list to explore more great content →',
      },
    ],
  },
};

module.exports = { ARTICLES_FULL_EN };
