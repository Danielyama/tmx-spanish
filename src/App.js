import { useState, useRef, useEffect } from "react";

// ─── DATA: 20 vocab + phrases per stage ──────────────────────────────────────

const STAGES = [
  {
    id: 1,
    title: "挨拶・基本",
    emoji: "👋",
    color: "#0D47A1",
    lesson: {
      title: "メキシコ流！挨拶の基本",
      slides: [
        {
          type: "intro",
          title: "メキシコのスペイン語って？",
          body: "スペイン語は世界21カ国で話されています。\n\nメキシコは世界最大のスペイン語話者人口（約1.3億人）を持つ国。\n\n発音がクリアで聞き取りやすく、日本人が最初に学ぶのに最適な スペイン語です！",
          note: "「スペインのスペイン語」と「メキシコのスペイン語」は英国英語とアメリカ英語ほどの違いがあります"
        },
        {
          type: "table",
          title: "時間帯で使い分ける挨拶",
          rows: [
            { es: "Buenos días", jp: "おはようございます（〜12時）", icon: "🌅" },
            { es: "Buenas tardes", jp: "こんにちは（12〜19時）", icon: "☀️" },
            { es: "Buenas noches", jp: "こんばんは・おやすみ（19時〜）", icon: "🌙" },
            { es: "¡Hola!", jp: "やあ！（いつでも使えるカジュアル）", icon: "👋" },
            { es: "¿Qué tal?", jp: "調子どう？（友達に）", icon: "😊" },
            { es: "¿Cómo estás?", jp: "元気ですか？（友人・知人に）", icon: "🤝" },
          ]
        },
        {
          type: "usage",
          title: "メキシコでよく使うリアクション",
          examples: [
            { es: "¡Muy bien, gracias!", jp: "とても元気です、ありがとう！" },
            { es: "Bien, ¿y tú?", jp: "元気です、あなたは？" },
            { es: "Más o menos.", jp: "まあまあです。" },
            { es: "¡Qué bueno!", jp: "それは良かった！" },
            { es: "No hay problema.", jp: "問題ないよ。／どういたしまして。" },
            { es: "¡Ándale!", jp: "了解！／いいね！（メキシコ特有）" },
          ]
        },
        {
          type: "negation",
          title: "丁寧 vs カジュアル",
          examples: [
            { es: "Mucho gusto.", jp: "はじめまして。（フォーマル）", label: "丁寧" },
            { es: "¿Cómo está usted?", jp: "お元気ですか？（フォーマル）", label: "丁寧" },
            { es: "¿Qué onda?", jp: "どう？調子は？（カジュアル・メキシコ）", label: "カジュアル" },
            { es: "¡Chao!", jp: "バイバイ！（カジュアル）", label: "カジュアル" },
          ]
        }
      ]
    },
    vocab: [
      { es: "hola",          jp: "こんにちは",         desc: "最も基本的な挨拶。時間帯を問わず使える。", ex: ["¡Hola! ¿Cómo estás?（こんにちは！元気ですか？）", "¡Hola, María! ¿Qué tal?（やあ、マリア！調子は？）", "¡Hola a todos!（みなさん、こんにちは！）"] },
      { es: "adiós",         jp: "さようなら",         desc: "別れの挨拶。少し改まった表現。", ex: ["¡Adiós! Hasta luego.（さようなら！またね。）", "Adiós, señor López.（ロペスさん、さようなら。）", "¡Adiós y buenas noches!（さようなら、おやすみなさい！）"] },
      { es: "gracias",       jp: "ありがとう",         desc: "'muchas gracias'で「とてもありがとう」。", ex: ["Muchas gracias por tu ayuda.（助けてくれてありがとう。）", "Gracias, muy amable.（ありがとう、ご親切に。）", "¡Gracias a ti!（こちらこそありがとう！）"] },
      { es: "de nada",       jp: "どういたしまして",   desc: "'gracias'への返答。", ex: ["— Gracias. — De nada.（ありがとう。― どういたしまして。）", "De nada, es un placer.（どういたしまして、喜んで。）", "¡De nada, para eso estamos!（いいえいいえ、そのためにいますから！）"] },
      { es: "por favor",     jp: "お願いします",       desc: "依頼するときに添える丁寧な言葉。文頭・文末どちらでも使える。", ex: ["Un café, por favor.（コーヒーを一つ、お願いします。）", "Por favor, habla más despacio.（もう少しゆっくり話してください。）", "¿Puede repetir, por favor?（繰り返してもらえますか？）"] },
      { es: "perdona",       jp: "すみません",         desc: "呼びかけや軽い謝罪に使う。", ex: ["Perdona, ¿dónde está el baño?（すみません、お手洗いはどこですか？）", "Perdona el retraso.（遅れてすみません。）", "Perdona, no te he visto.（ごめん、気づかなかったよ。）"] },
      { es: "buenos días",   jp: "おはようございます", desc: "朝（だいたい12時まで）に使う挨拶。", ex: ["¡Buenos días! ¿Cómo estás?（おはようございます！お元気ですか？）", "Buenos días, señora.（おはようございます、奥様。）", "Cada mañana digo buenos días.（毎朝おはようと言います。）"] },
      { es: "buenas tardes", jp: "こんにちは（午後）", desc: "午後〜日没ごろに使う挨拶。", ex: ["Buenas tardes, ¿en qué puedo ayudarle?（こんにちは、何かお手伝いできますか？）", "Buenas tardes a todos.（皆さん、こんにちは。）", "Son las tres — buenas tardes.（3時です、こんにちは。）"] },
      { es: "buenas noches", jp: "おやすみなさい",     desc: "夜の挨拶と別れの両方に使う。", ex: ["Buenas noches, que descanses.（おやすみ、ゆっくり休んでね。）", "¡Buenas noches a todos!（みなさん、おやすみなさい！）", "Buenas noches — nos vemos mañana.（おやすみ、また明日。）"] },
      { es: "sí",            jp: "はい",              desc: "肯定の返答。強調するときは'sí, sí'と繰り返す。", ex: ["¿Hablas español? — Sí.（スペイン語話せる？ ― うん。）", "Sí, claro.（はい、もちろん。）", "Sí, entiendo.（はい、わかります。）"] },
      { es: "no",            jp: "いいえ",             desc: "否定の返答。'No, gracias'で「いいえ、結構です」。", ex: ["No, gracias.（いいえ、結構です。）", "No entiendo.（わかりません。）", "No, no es correcto.（いいえ、それは正しくありません。）"] },
      { es: "bien",          jp: "元気 / 良い",        desc: "'muy bien'で「とても良い」。", ex: ["Estoy muy bien, gracias.（とても元気です、ありがとう。）", "Todo está bien.（全部大丈夫です。）", "¡Bien hecho!（よくできました！）"] },
      { es: "mal",           jp: "悪い / 体調が悪い",  desc: "状態が悪いことを表す。", ex: ["Estoy mal hoy.（今日は体調が悪いです。）", "¿Te encuentras mal?（気分が悪いですか？）", "Eso está mal.（それは良くないです。）"] },
      { es: "¿cómo estás?",  jp: "元気ですか？",       desc: "友人・知人への挨拶。'¿cómo está usted?'はより丁寧な形。", ex: ["¡Hola! ¿Cómo estás?（こんにちは！元気ですか？）", "¿Cómo estás hoy?（今日は調子どう？）", "¿Cómo estás, amigo?（元気かい、友よ？）"] },
      { es: "¿qué tal?",     jp: "調子はどう？",       desc: "カジュアルな挨拶表現。友人同士でよく使う。", ex: ["¿Qué tal el trabajo?（仕事はどう？）", "¿Qué tal todo?（全部どう？）", "¡Hola! ¿Qué tal?（やあ！調子はどう？）"] },
      { es: "mucho gusto",   jp: "はじめまして",       desc: "初対面の挨拶。'encantado/a'も同じ意味で使える。", ex: ["Mucho gusto, soy Ana.（はじめまして、アナです。）", "— Me llamo Kenji. — Mucho gusto.（ケンジと申します。― はじめまして。）", "El gusto es mío.（こちらこそよろしく。）"] },
      { es: "hasta luego",   jp: "またね",             desc: "別れの挨拶。'adiós'よりカジュアル。", ex: ["¡Hasta luego! Que te vaya bien.（またね！うまくいくといいね。）", "Hasta luego, nos vemos.（またね、また会おう。）", "¡Hasta luego, chao!（またね、バイバイ！）"] },
      { es: "hasta mañana",  jp: "また明日",           desc: "翌日また会う人への別れの挨拶。", ex: ["Hasta mañana, buenas noches.（また明日、おやすみ。）", "— Hasta mañana. — Sí, hasta mañana.（また明日。― うん、また明日。）", "Nos vemos hasta mañana en clase.（また明日授業で。）"] },
      { es: "lo siento",     jp: "ごめんなさい",       desc: "謝罪の言葉。'perdona'より気持ちが込もった表現。", ex: ["Lo siento mucho.（本当にごめんなさい。）", "Lo siento, llego tarde.（ごめん、遅れました。）", "Lo siento, no es mi culpa.（ごめん、私のせいじゃないけど。）"] },
      { es: "no entiendo",   jp: "わかりません",       desc: "理解できないときの表現。'¿puede repetir?'と続けると自然。", ex: ["Lo siento, no entiendo.（すみません、わかりません。）", "No entiendo la pregunta.（質問が理解できません。）", "No entiendo, ¿puede hablar más despacio?（わかりません、もう少しゆっくり話してもらえますか？）"] },
    ],
    phrases: [
      { es: "¡Hola! ¿Cómo estás?",      jp: "こんにちは！元気ですか？",        blank: "¡___! ¿Cómo estás?",       answer: "Hola",       opts: ["Hola", "Adiós", "Gracias", "Perdona"] },
      { es: "Muy bien, gracias.",        jp: "とても元気です、ありがとう。",      blank: "Muy bien, ___.",            answer: "gracias",    opts: ["gracias", "perdona", "sí", "bien"] },
      { es: "Buenos días, señor.",       jp: "おはようございます。",             blank: "___ días, señor.",          answer: "Buenos",     opts: ["Buenos", "Buenas", "Hola", "Hasta"] },
      { es: "Lo siento, no entiendo.",   jp: "ごめんなさい、わかりません。",      blank: "Lo siento, no ___.",        answer: "entiendo",   opts: ["entiendo", "estás", "gusto", "tal"] },
      { es: "Mucho gusto, me llamo Ana.",jp: "はじめまして、アナです。",         blank: "Mucho ___, me llamo Ana.", answer: "gusto",      opts: ["gusto", "bien", "mal", "tal"] },
      { es: "Hasta luego, hasta mañana.",jp: "またね、また明日。",               blank: "Hasta luego, hasta ___.",  answer: "mañana",     opts: ["mañana", "luego", "días", "noches"] },
      { es: "De nada, por favor.",       jp: "どういたしまして、どうぞ。",        blank: "De ___, por favor.",        answer: "nada",       opts: ["nada", "bien", "mal", "sí"] },
      { es: "¿Qué tal? — Bien, ¿y tú?", jp: "調子はどう？ — 元気、あなたは？",  blank: "¿___ tal? — Bien, ¿y tú?", answer: "Qué",        opts: ["Qué", "Cómo", "Cuánto", "Dónde"] },
    ],
    chatPrompt: "「Hola」から始めて、挨拶の会話を練習しましょう！",
  },
  {
    id: 2,
    title: "基本動詞",
    emoji: "🏃",
    color: "#1565C0",
    vocab: [
      { es: "estar",   jp: "〜にいる／〜の状態",  desc: "場所や一時的な状態を表す。挨拶の'¿cómo estás?'や'bien/mal'と一緒に使う。", ex: ["Estoy bien.（元気です。）", "Estoy mal hoy.（今日は体調が悪いです。）", "¿Cómo estás? — Estoy muy bien.（元気ですか？ ― とても元気です。）"] , conj: [
  ["yo","estoy","Yo estoy bien.（私は元気です。）|Yo estoy en casa.（私は家にいます。）|Yo no estoy bien.（私は元気ではありません。）"],
  ["tú","estás","Tú estás bien.（あなたは元気です。）|Tú estás en la oficina.（あなたはオフィスにいます。）|Tú no estás bien.（あなたは元気ではありません。）"],
  ["él/ella","está","Él está bien.（彼は元気です。）|Él está en casa.（彼は家にいます。）|Él no está bien.（彼は元気ではありません。）"],
  ["nosotros","estamos","Nosotros estamos bien.（私たちは元気です。）|Nosotros estamos en Tokio.（私たちは東京にいます。）|Nosotros no estamos bien.（私たちは元気ではありません。）"],
  ["vosotros","estáis","Vosotros estáis bien.（あなたたちは元気です。）|Vosotros estáis en casa.（あなたたちは家にいます。）|Vosotros no estáis bien.（あなたたちは元気ではありません。）"],
  ["ellos","están","Ellos están bien.（彼らは元気です。）|Ellos están en la tienda.（彼らはお店にいます。）|Ellos no están bien.（彼らは元気ではありません。）"]
]},
      { es: "ser",     jp: "〜である（本質）",    desc: "本質・国籍・性格を表す。'mucho gusto, soy...'のように自己紹介で使う。", ex: ["Soy japonés.（私は日本人です。）", "Mucho gusto, soy Kenji.（はじめまして、ケンジです。）", "No, no soy de aquí.（いいえ、ここの出身ではありません。）"] , conj: [
  ["yo","soy","Yo soy japonés.（私は日本人です。）|Yo soy de Tokio.（私は東京出身です。）|Yo no soy de España.（私はスペイン出身ではありません。）"],
  ["tú","eres","Tú eres japonés.（あなたは日本人です。）|Tú eres de Japón.（あなたは日本出身です。）|Tú no eres español.（あなたはスペイン人ではありません。）"],
  ["él/ella","es","Él es japonés.（彼は日本人です。）|Él es de Tokio.（彼は東京出身です。）|Él no es español.（彼はスペイン人ではありません。）"],
  ["nosotros","somos","Nosotros somos japoneses.（私たちは日本人です。）|Nosotros somos de Japón.（私たちは日本出身です。）|Nosotros no somos españoles.（私たちはスペイン人ではありません。）"],
  ["vosotros","sois","Vosotros sois japoneses.（あなたたちは日本人です。）|Vosotros sois de Japón.（あなたたちは日本出身です。）|Vosotros no sois españoles.（あなたたちはスペイン人ではありません。）"],
  ["ellos","son","Ellos son japoneses.（彼らは日本人です。）|Ellos son de Tokio.（彼らは東京出身です。）|Ellos no son españoles.（彼らはスペイン人ではありません。）"]
]},
      { es: "tener",   jp: "持っている／ある",    desc: "所有を表す。'no tengo'で「持っていない」。", ex: ["Tengo un problema.（問題があります。）", "No tengo tiempo.（時間がありません。）", "¿Tienes el número?（番号を持っていますか？）"] , conj: [
  ["yo","tengo","Yo tengo tiempo.（私は時間があります。）|Yo tengo un coche.（私は車を持っています。）|Yo no tengo tiempo.（私は時間がありません。）"],
  ["tú","tienes","Tú tienes tiempo.（あなたは時間があります。）|Tú tienes un amigo.（あなたは友達がいます。）|Tú no tienes tiempo.（あなたは時間がありません。）"],
  ["él/ella","tiene","Él tiene tiempo.（彼は時間があります。）|Él tiene un perro.（彼は犬を飼っています。）|Él no tiene tiempo.（彼は時間がありません。）"],
  ["nosotros","tenemos","Nosotros tenemos tiempo.（私たちは時間があります。）|Nosotros tenemos una casa.（私たちは家があります。）|Nosotros no tenemos tiempo.（私たちは時間がありません。）"],
  ["vosotros","tenéis","Vosotros tenéis tiempo.（あなたたちは時間があります。）|Vosotros tenéis un coche.（あなたたちは車を持っています。）|Vosotros no tenéis tiempo.（あなたたちは時間がありません。）"],
  ["ellos","tienen","Ellos tienen tiempo.（彼らは時間があります。）|Ellos tienen una casa.（彼らは家があります。）|Ellos no tienen tiempo.（彼らは時間がありません。）"]
]},
      { es: "ir",      jp: "行く",              desc: "移動を表す基本動詞。'hasta luego'と一緒に「じゃあ行くね」のニュアンスで使える。", ex: ["Voy. Hasta luego.（行きます。またね。）", "¿Adónde vas?（どこへ行くの？）", "Voy bien, gracias.（順調です、ありがとう。）"] , conj: [
  ["yo","voy","Yo voy a casa.（私は家へ行きます。）|Yo voy al trabajo.（私は仕事へ行きます。）|Yo no voy a la tienda.（私はお店へ行きません。）"],
  ["tú","vas","Tú vas a casa.（あなたは家へ行きます。）|Tú vas al trabajo.（あなたは仕事へ行きます。）|Tú no vas a la tienda.（あなたはお店へ行きません。）"],
  ["él/ella","va","Él va a casa.（彼は家へ行きます。）|Él va al trabajo.（彼は仕事へ行きます。）|Él no va a la tienda.（彼はお店へ行きません。）"],
  ["nosotros","vamos","Nosotros vamos a casa.（私たちは家へ行きます。）|Nosotros vamos al trabajo.（私たちは仕事へ行きます。）|Nosotros no vamos a la tienda.（私たちはお店へ行きません。）"],
  ["vosotros","vais","Vosotros vais a casa.（あなたたちは家へ行きます。）|Vosotros vais al trabajo.（あなたたちは仕事へ行きます。）|Vosotros no vais a la tienda.（あなたたちはお店へ行きません。）"],
  ["ellos","van","Ellos van a casa.（彼らは家へ行きます。）|Ellos van al trabajo.（彼らは仕事へ行きます。）|Ellos no van a la tienda.（彼らはお店へ行きません。）"]
]},
      { es: "entender",jp: "わかる／理解する",   desc: "会話中に'no entiendo'（わかりません）として既に登場した動詞。", ex: ["No entiendo.（わかりません。）", "¿Entiendes?（わかりますか？）", "Sí, entiendo bien.（はい、よくわかります。）"] , conj: [
  ["yo","entiendo","Yo entiendo español.（私はスペイン語がわかります。）|Yo entiendo la pregunta.（私は質問がわかります。）|Yo no entiendo español.（私はスペイン語がわかりません。）"],
  ["tú","entiendes","Tú entiendes español.（あなたはスペイン語がわかります。）|Tú entiendes la pregunta.（あなたは質問がわかります。）|Tú no entiendes español.（あなたはスペイン語がわかりません。）"],
  ["él/ella","entiende","Él entiende español.（彼はスペイン語がわかります。）|Él entiende la pregunta.（彼は質問がわかります。）|Él no entiende español.（彼はスペイン語がわかりません。）"],
  ["nosotros","entendemos","Nosotros entendemos español.（私たちはスペイン語がわかります。）|Nosotros entendemos la pregunta.（私たちは質問がわかります。）|Nosotros no entendemos español.（私たちはスペイン語がわかりません。）"],
  ["vosotros","entendéis","Vosotros entendéis español.（あなたたちはスペイン語がわかります。）|Vosotros entendéis la pregunta.（あなたたちは質問がわかります。）|Vosotros no entendéis español.（あなたたちはスペイン語がわかりません。）"],
  ["ellos","entienden","Ellos entienden español.（彼らはスペイン語がわかります。）|Ellos entienden la pregunta.（彼らは質問がわかります。）|Ellos no entienden español.（彼らはスペイン語がわかりません。）"]
]},
    ],
    phrases: [
      { es: "Estoy bien, gracias.",       jp: "元気です、ありがとう。",      blank: "___ bien, gracias.",        answer: "Estoy",    opts: ["Estoy", "Soy", "Tengo", "Voy"] },
      { es: "Soy japonés.",              jp: "私は日本人です。",            blank: "___ japonés.",             answer: "Soy",      opts: ["Soy", "Estoy", "Tengo", "Entiendo"] },
      { es: "No tengo tiempo.",          jp: "時間がありません。",           blank: "No ___ tiempo.",           answer: "tengo",    opts: ["tengo", "soy", "estoy", "entiendo"] },
      { es: "Voy. Hasta luego.",         jp: "行きます。またね。",           blank: "___. Hasta luego.",        answer: "Voy",      opts: ["Voy", "Soy", "Estoy", "Tengo"] },
      { es: "No entiendo, lo siento.",   jp: "わかりません、ごめんなさい。", blank: "No ___, lo siento.",       answer: "entiendo", opts: ["entiendo", "tengo", "voy", "soy"] },
    ],
    chatPrompt: "「¿Cómo estás?」から始めて、習った動詞を使って会話してみましょう！",
  },
  {
    id: 3,
    title: "自己紹介",
    emoji: "🙋",
    color: "#5C6BC0",
    vocab: [
      { es: "me llamo",    jp: "私の名前は〜",      desc: "'llamarse'動詞の一人称。'mucho gusto'と一緒に使うと自然な自己紹介になる。", ex: ["Me llamo Kenji. Mucho gusto.（ケンジです。はじめまして。）", "¿Cómo te llamas? — Me llamo Ana.（お名前は？ ― アナです。）", "Hola, me llamo Juan. ¿Y tú?（こんにちは、フアンです。あなたは？）"] },
      { es: "soy de",      jp: "〜出身です",        desc: "'ser'動詞＋'de'で出身地を表す。既習の'soy'を使う。", ex: ["Soy de Japón.（日本出身です。）", "¿De dónde eres? — Soy de España.（どこの出身？ ― スペインです。）", "Soy de Tokio.（東京出身です。）"] },
      { es: "tengo",       jp: "〜歳です／持つ",    desc: "年齢は'tener'で表す。既習の'tengo'を年齢に応用する。", ex: ["Tengo treinta años.（30歳です。）", "¿Cuántos años tienes? — Tengo veinte.（何歳？ ― 20歳です。）", "Tengo un hijo.（子どもが一人います。）"] },
      { es: "estoy bien",  jp: "元気です",          desc: "既習の'estar'＋'bien'の組み合わせ。自己紹介の流れで使える。", ex: ["¿Cómo estás? — Estoy bien, gracias.（元気ですか？ ― 元気です、ありがとう。）", "Estoy muy bien hoy.（今日はとても元気です。）", "Estoy bien, ¿y tú?（元気です、あなたは？）"] },
      { es: "no entiendo", jp: "わかりません",      desc: "既習フレーズ。自己紹介の会話で「うまく聞き取れない」ときに使う。", ex: ["Lo siento, no entiendo.（すみません、わかりません。）", "No entiendo bien el español.（スペイン語がよくわかりません。）", "¿Puede repetir? No entiendo.（繰り返してもらえますか？わかりません。）"] },
      { es: "sí / no",     jp: "はい／いいえ",      desc: "既習の基本返答。自己紹介中の質問への答えに使う。", ex: ["¿Eres de Japón? — Sí.（日本人ですか？ ― はい。）", "¿Hablas español? — No, lo siento.（スペイン語話せる？ ― いいえ、すみません。）", "¿Estás bien? — Sí, muy bien.（元気ですか？ ― はい、とても。）"] },
      { es: "gracias",     jp: "ありがとう",        desc: "既習語。自己紹介の締めや会話の随所で使う。", ex: ["Mucho gusto. — Gracias.（はじめまして。― ありがとうございます。）", "Gracias por hablar conmigo.（話しかけてくれてありがとう。）", "Muchas gracias, hasta luego.（ありがとうございました、またね。）"] },
      { es: "perdona",     jp: "すみません",        desc: "既習語。会話が聞き取れなかったり、呼びかけるときに使う。", ex: ["Perdona, ¿cómo te llamas?（すみません、お名前は？）", "Perdona, no entiendo.（すみません、わかりません。）", "Perdona, ¿de dónde eres?（すみません、どちらの出身ですか？）"] },
    ],
    phrases: [
      { es: "Me llamo Kenji. Mucho gusto.", jp: "ケンジです。はじめまして。",   blank: "___ llamo Kenji. Mucho gusto.", answer: "Me",       opts: ["Me", "Mi", "Yo", "Soy"] },
      { es: "Soy de Japón.",               jp: "日本出身です。",              blank: "Soy ___ Japón.",               answer: "de",       opts: ["de", "en", "a", "con"] },
      { es: "Tengo treinta años.",         jp: "30歳です。",                 blank: "___ treinta años.",            answer: "Tengo",    opts: ["Tengo", "Soy", "Estoy", "Voy"] },
      { es: "Estoy bien, ¿y tú?",         jp: "元気です、あなたは？",         blank: "___ bien, ¿y tú?",            answer: "Estoy",    opts: ["Estoy", "Soy", "Tengo", "Voy"] },
      { es: "Lo siento, no entiendo.",    jp: "すみません、わかりません。",    blank: "Lo siento, no ___.",          answer: "entiendo", opts: ["entiendo", "tengo", "soy", "voy"] },
      { es: "Perdona, ¿de dónde eres?",  jp: "すみません、どちらの出身ですか？", blank: "Perdona, ¿de ___ eres?",   answer: "dónde",    opts: ["dónde", "cómo", "qué", "cuánto"] },
    ],
    chatPrompt: "「Hola, me llamo ___. Soy de Japón.」と自己紹介してみましょう！",
  },
  {
    id: 4,
    title: "月・季節",
    emoji: "📅",
    color: "#00897B",
    lesson: {
      title: "Hace ＋ 天気の表現",
      slides: [
        {
          type: "intro",
          title: "天気の言い方",
          body: "スペイン語で天気を表すときは「hace」を使います。\n\n「hace」は動詞「hacer」の3人称単数形。直訳すると「〜がある／している」ですが、天気表現では「〜です」という意味になります。\n\n主語は不要！「Hace frío.」だけでOKです。",
          note: "英語の「It is cold.」と同じ感覚です"
        },
        {
          type: "table",
          title: "基本の天気表現",
          rows: [
            { es: "Hace frío.", jp: "寒いです。", icon: "🥶" },
            { es: "Hace calor.", jp: "暑いです。", icon: "🥵" },
            { es: "Hace buen tiempo.", jp: "良い天気です。", icon: "☀️" },
            { es: "Hace mal tiempo.", jp: "悪い天気です。", icon: "🌧️" },
            { es: "Hace viento.", jp: "風が吹いています。", icon: "💨" },
            { es: "Hace sol.", jp: "日が照っています。", icon: "🌞" },
          ]
        },
        {
          type: "usage",
          title: "月・季節と組み合わせる",
          examples: [
            { es: "En enero hace frío.", jp: "1月は寒いです。" },
            { es: "En verano hace mucho calor.", jp: "夏はとても暑いです。" },
            { es: "En primavera hace buen tiempo.", jp: "春は良い天気です。" },
            { es: "En otoño hace frío.", jp: "秋は寒いです。" },
            { es: "En julio hace mucho calor.", jp: "7月はとても暑いです。" },
            { es: "En diciembre hace mal tiempo.", jp: "12月は悪い天気です。" },
          ]
        },
        {
          type: "negation",
          title: "否定形・疑問形",
          examples: [
            { es: "No hace frío.", jp: "寒くないです。", label: "否定" },
            { es: "No hace calor.", jp: "暑くないです。", label: "否定" },
            { es: "¿Hace frío en Japón?", jp: "日本は寒いですか？", label: "疑問" },
            { es: "¿Qué tiempo hace?", jp: "どんな天気ですか？", label: "疑問" },
          ]
        }
      ]
    },
    vocab: [
      { es: "enero",      jp: "1月",  desc: "1月。冬の始まり。スペインでは比較的寒い。", ex: ["En enero hace frío.（1月は寒いです。）", "Mi cumpleaños es en enero.（誕生日は1月です。）", "Enero es el primer mes.（1月は最初の月です。）"] },
      { es: "febrero",    jp: "2月",  desc: "2月。冬の月。バレンタインデーがある。", ex: ["En febrero hace frío.（2月は寒いです。）", "Febrero es el mes del amor.（2月は愛の月です。）", "Febrero tiene 28 días.（2月は28日あります。）"] },
      { es: "marzo",      jp: "3月",  desc: "3月。春の始まり。だんだん暖かくなる。", ex: ["En marzo empieza la primavera.（3月に春が始まります。）", "En marzo hace buen tiempo.（3月は良い天気です。）", "Marzo es mi mes favorito.（3月は私のお気に入りの月です。）"] },
      { es: "abril",      jp: "4月",  desc: "4月。春の月。花が咲く季節。", ex: ["En abril hace calor.（4月は暖かいです。）", "En abril tengo vacaciones.（4月は休暇があります。）", "Abril es un mes bonito.（4月は素敵な月です。）"] },
      { es: "mayo",       jp: "5月",  desc: "5月。春の終わり。過ごしやすい気候。", ex: ["En mayo hace buen tiempo.（5月は良い天気です。）", "Mayo es un mes agradable.（5月は気持ちの良い月です。）", "En mayo estoy bien.（5月は元気です。）"] },
      { es: "junio",      jp: "6月",  desc: "6月。夏の始まり。スペインでは暑くなり始める。", ex: ["En junio empieza el verano.（6月に夏が始まります。）", "En junio hace calor.（6月は暑いです。）", "En junio tengo trabajo.（6月は仕事があります。）"] },
      { es: "julio",      jp: "7月",  desc: "7月。真夏。スペインでは非常に暑くなる。", ex: ["En julio hace mucho calor.（7月はとても暑いです。）", "Voy a España en julio.（7月にスペインへ行きます。）", "Julio es el mes más caliente.（7月は最も暑い月です。）"] },
      { es: "agosto",     jp: "8月",  desc: "8月。夏の終わり。バカンスシーズン。", ex: ["En agosto hace mucho calor.（8月はとても暑いです。）", "En agosto tengo vacaciones.（8月は休暇があります。）", "Agosto es un mes de verano.（8月は夏の月です。）"] },
      { es: "septiembre", jp: "9月",  desc: "9月。秋の始まり。涼しくなる。", ex: ["En septiembre empieza el otoño.（9月に秋が始まります。）", "En septiembre voy al trabajo.（9月は仕事に行きます。）", "Septiembre es un mes agradable.（9月は気持ちの良い月です。）"] },
      { es: "octubre",    jp: "10月", desc: "10月。秋の月。過ごしやすい気候。", ex: ["En octubre hace buen tiempo.（10月は良い天気です。）", "Estoy en Tokio en octubre.（10月は東京にいます。）", "Octubre es mi mes favorito.（10月は私のお気に入りの月です。）"] },
      { es: "noviembre",  jp: "11月", desc: "11月。晩秋。寒くなり始める。", ex: ["En noviembre hace frío.（11月は寒いです。）", "En noviembre tengo trabajo.（11月は仕事があります。）", "Noviembre es un mes frío.（11月は寒い月です。）"] },
      { es: "diciembre",  jp: "12月", desc: "12月。冬。クリスマスと年末の月。", ex: ["En diciembre hace mucho frío.（12月はとても寒いです。）", "En diciembre tengo vacaciones.（12月は休暇があります。）", "Diciembre es el último mes.（12月は最後の月です。）"] },
      { es: "primavera",  jp: "春",   desc: "3〜5月。花が咲く暖かい季節。", ex: ["En primavera hace buen tiempo.（春は良い天気です。）", "Me gusta la primavera.（春が好きです。）", "En primavera estoy bien.（春は元気です。）"] },
      { es: "verano",     jp: "夏",   desc: "6〜8月。スペインは非常に暑くなる。", ex: ["En verano hace mucho calor.（夏はとても暑いです。）", "En verano voy a la playa.（夏は海へ行きます。）", "No me gusta el verano.（夏は好きではありません。）"] },
      { es: "otoño",      jp: "秋",   desc: "9〜11月。涼しくなる収穫の季節。", ex: ["En otoño hace frío.（秋は寒いです。）", "Me gusta el otoño.（秋が好きです。）", "En otoño estoy en Japón.（秋は日本にいます。）"] },
      { es: "invierno",   jp: "冬",   desc: "12〜2月。寒い季節。北部は雪が降ることも。", ex: ["En invierno hace mucho frío.（冬はとても寒いです。）", "No me gusta el invierno.（冬は好きではありません。）", "En invierno tengo vacaciones.（冬は休暇があります。）"] },
    ],
    phrases: [
      { es: "En enero hace frío.",         jp: "1月は寒いです。",          blank: "En ___ hace frío.",           answer: "enero",      opts: ["enero", "julio", "agosto", "mayo"] },
      { es: "En julio hace calor.",        jp: "7月は暑いです。",          blank: "En ___ hace calor.",          answer: "julio",      opts: ["julio", "enero", "marzo", "octubre"] },
      { es: "En primavera hace buen tiempo.", jp: "春は良い天気です。",    blank: "En ___ hace buen tiempo.",    answer: "primavera",  opts: ["primavera", "invierno", "otoño", "verano"] },
      { es: "En verano hace mucho calor.", jp: "夏はとても暑いです。",      blank: "En verano hace mucho ___.",   answer: "calor",      opts: ["calor", "frío", "tiempo", "sol"] },
      { es: "Tengo vacaciones en agosto.", jp: "8月に休暇があります。",     blank: "Tengo vacaciones en ___.",    answer: "agosto",     opts: ["agosto", "enero", "marzo", "noviembre"] },
      { es: "En otoño estoy en Japón.",   jp: "秋は日本にいます。",        blank: "En ___ estoy en Japón.",      answer: "otoño",      opts: ["otoño", "verano", "primavera", "invierno"] },
      { es: "Diciembre es el último mes.", jp: "12月は最後の月です。",      blank: "___ es el último mes.",       answer: "Diciembre",  opts: ["Diciembre", "Enero", "Noviembre", "Octubre"] },
      { es: "Mi cumpleaños es en marzo.", jp: "誕生日は3月です。",          blank: "Mi cumpleaños es en ___.",    answer: "marzo",      opts: ["marzo", "junio", "septiembre", "diciembre"] },
    ],
    chatPrompt: "「¿En qué mes estamos?」（今何月ですか？）から始めて、月や季節を使って会話しましょう！",
  },
  {
    id: 5,
    title: "TSK営業スペイン語",
    emoji: "💼",
    color: "#0D47A1",
    lesson: {
      title: "TSK流！営業スペイン語入門",
      slides: [
        {
          type: "intro",
          title: "関口さん、ここまで来た！",
          body: "挨拶・動詞・自己紹介・月と季節…\n\nここまで学んだあなたは、もうスペイン語圏のクライアントに\n基本的な挨拶と自己紹介ができます。\n\n最後のステージでは、TSKの営業シーンで\n実際に使えるフレーズを学びます！\n\n¡Tú puedes, Sekiguchi-san! 🔥",
          note: "スペイン語圏の主要市場：メキシコ・コロンビア・スペイン・アルゼンチン"
        },
        {
          type: "new_words",
          title: "まず新しい単語を覚えよう",
          words: [
            { es: "la empresa",  jp: "会社・企業" },
            { es: "el cliente",  jp: "お客様・クライアント" },
            { es: "la reunión",  jp: "会議・ミーティング" },
            { es: "el producto", jp: "製品・商品" },
            { es: "la calidad",  jp: "品質・クオリティ" },
            { es: "la tarjeta",  jp: "名刺・カード" },
            { es: "nuestro",     jp: "私たちの" },
            { es: "bueno/a",     jp: "良い" },
            { es: "importante",  jp: "大切な・重要な" },
            { es: "repetir",     jp: "繰り返す" },
            { es: "interesado",  jp: "興味がある" },
            { es: "el placer",   jp: "光栄・喜び" },
          ]
        },
        {
          type: "table",
          title: "営業の第一声で使えるフレーズ",
          rows: [
            { es: "Buenos días, mucho gusto.", jp: "おはようございます、はじめまして。", icon: "🤝" },
            { es: "Soy Sekiguchi de TSK.", jp: "TSKの関口です。", icon: "💼" },
            { es: "Gracias por su tiempo.", jp: "お時間をいただきありがとうございます。", icon: "🙏" },
            { es: "¿Habla japonés?", jp: "日本語は話せますか？", icon: "🇯🇵" },
            { es: "Lo siento, no entiendo bien.", jp: "すみません、よく聞き取れません。", icon: "👂" },
            { es: "¿Puede repetir, por favor?", jp: "もう一度おっしゃっていただけますか？", icon: "🔁" },
          ]
        },
        {
          type: "usage",
          title: "商談で使える一言",
          examples: [
            { es: "Somos de Japón.", jp: "私たちは日本の会社です。" },
            { es: "TSK es una empresa japonesa.", jp: "TSKは日本の企業です。" },
            { es: "Tenemos buena calidad.", jp: "私たちは品質が良いです。" },
            { es: "Estoy muy interesado.", jp: "とても興味があります。" },
            { es: "¿Tiene tarjeta?", jp: "名刺はお持ちですか？" },
            { es: "Hasta luego, fue un placer.", jp: "またお会いしましょう、光栄でした。" },
          ]
        },
        {
          type: "negation",
          title: "知っておくと安心なフレーズ",
          examples: [
            { es: "No hablo español bien.", jp: "スペイン語はあまり話せません。", label: "正直に" },
            { es: "Estoy aprendiendo español.", jp: "スペイン語を勉強中です。", label: "好印象" },
            { es: "¿Habla inglés?", jp: "英語は話せますか？", label: "確認" },
            { es: "Muchas gracias por todo.", jp: "いろいろとありがとうございました。", label: "締め" },
          ]
        }
      ]
    },
    vocab: [
      { es: "la empresa",     jp: "会社",         desc: "会社・企業を表す基本語。'empresa japonesa'で「日本の会社」。", ex: ["TSK es una empresa japonesa.（TSKは日本の企業です。）", "Trabajo en una empresa.（会社で働いています。）", "Nuestra empresa es buena.（私たちの会社は良いです。）"] },
      { es: "el cliente",     jp: "クライアント・お客様", desc: "顧客・取引先を表す語。営業の基本単語。", ex: ["El cliente es muy importante.（お客様はとても大切です。）", "Tengo un cliente hoy.（今日クライアントがいます。）", "El cliente está bien.（クライアントは元気です。）"] },
      { es: "la reunión",     jp: "会議・ミーティング", desc: "会議や打ち合わせを表す語。'tener una reunión'で「会議がある」。", ex: ["Tengo una reunión hoy.（今日会議があります。）", "La reunión está bien.（ミーティングは順調です。）", "¿Tiene reunión?（ミーティングはありますか？）"] },
      { es: "el producto",    jp: "製品・商品",    desc: "製品・商品を表す語。'nuestro producto'で「私たちの製品」。", ex: ["Nuestro producto es bueno.（私たちの製品は良いです。）", "¿Le gusta el producto?（製品はいかがですか？）", "Tenemos un buen producto.（良い製品があります。）"] },
      { es: "la calidad",     jp: "品質・クオリティ", desc: "品質を表す語。'buena calidad'で「良い品質」。", ex: ["Tenemos buena calidad.（品質が良いです。）", "La calidad es muy importante.（品質はとても大切です。）", "Nuestra calidad está bien.（私たちの品質は良いです。）"] },
      { es: "la tarjeta",     jp: "名刺・カード",  desc: "名刺やカードを表す語。商談の第一歩。", ex: ["¿Tiene tarjeta?（名刺はお持ちですか？）", "Aquí tiene mi tarjeta.（こちらが私の名刺です。）", "Tengo su tarjeta.（名刺をいただきました。）"] },
      { es: "interesado",     jp: "興味がある",    desc: "'estar interesado'で「興味がある」。商談で頻出の表現。", ex: ["Estoy muy interesado.（とても興味があります。）", "¿Está interesado?（興味はありますか？）", "Sí, estoy interesado.（はい、興味があります。）"] },
      { es: "el placer",      jp: "光栄・喜び",   desc: "'fue un placer'で「光栄でした」。別れ際の丁寧な表現。", ex: ["Fue un placer.（光栄でした。）", "El placer es mío.（こちらこそ光栄です。）", "Mucho gusto, el placer es mío.（はじめまして、こちらこそ。）"] },
    ],
    phrases: [
      { es: "Soy Sekiguchi de TSK.",          jp: "TSKの関口です。",              blank: "Soy Sekiguchi ___ TSK.",        answer: "de",         opts: ["de", "en", "a", "con"] },
      { es: "Tengo una reunión hoy.",         jp: "今日会議があります。",           blank: "___ una reunión hoy.",         answer: "Tengo",      opts: ["Tengo", "Estoy", "Soy", "Voy"] },
      { es: "Nuestro producto es bueno.",     jp: "私たちの製品は良いです。",        blank: "Nuestro producto ___ bueno.",  answer: "es",         opts: ["es", "está", "tiene", "hay"] },
      { es: "Estoy muy interesado.",          jp: "とても興味があります。",          blank: "___ muy interesado.",          answer: "Estoy",      opts: ["Estoy", "Soy", "Tengo", "Voy"] },
      { es: "¿Puede repetir, por favor?",    jp: "もう一度おっしゃっていただけますか？", blank: "¿Puede ___, por favor?",   answer: "repetir",    opts: ["repetir", "hablar", "ir", "tener"] },
      { es: "Fue un placer.",                jp: "光栄でした。",                   blank: "Fue un ___.",                  answer: "placer",     opts: ["placer", "cliente", "producto", "tiempo"] },
      { es: "Tenemos buena calidad.",         jp: "品質が良いです。",               blank: "Tenemos buena ___.",           answer: "calidad",    opts: ["calidad", "empresa", "reunión", "tarjeta"] },
      { es: "Lo siento, no entiendo bien.",  jp: "すみません、よく聞き取れません。",  blank: "Lo siento, no ___ bien.",      answer: "entiendo",   opts: ["entiendo", "tengo", "soy", "estoy"] },
    ],
    chatPrompt: "TSKの関口さんとして、スペイン語圏のクライアントに自己紹介と製品紹介をしてみましょう！",
  }
];


// ─── UTILS ───────────────────────────────────────────────────────────────────
const shuffle = (arr) => [...arr].sort(() => Math.random() - 0.5);

// 男女交互カウンター
let _speakCount = 0;

const speakText = (text) => {
  if (!window.speechSynthesis) return;
  window.speechSynthesis.cancel();
  const u = new SpeechSynthesisUtterance(text);
  u.lang = "es-MX"; u.rate = 0.82;

  const doSpeak = () => {
    const voices = window.speechSynthesis.getVoices();
    // メキシコ（es-MX）を最優先、なければスペイン語全般
    const mxVoices = voices.filter(v => v.lang === "es-MX" || v.lang === "es_MX");
    const esVoices = voices.filter(v => v.lang.startsWith("es"));
    const pool = mxVoices.length > 0 ? mxVoices : esVoices;

    if (pool.length > 0) {
      // 男女交互：偶数回は女性、奇数回は男性を優先
      const useFemale = _speakCount % 2 === 0;
      // メキシコの代表的な音声名
      const female = pool.find(v =>
        v.name.includes("Paulina") || v.name.includes("Mónica") || v.name.includes("Monica") ||
        v.name.includes("Luciana") || v.name.includes("female") || v.name.includes("Female") ||
        v.name.toLowerCase().includes("mujer")
      );
      const male = pool.find(v =>
        v.name.includes("Juan") || v.name.includes("Jorge") || v.name.includes("Carlos") ||
        v.name.includes("Diego") || v.name.includes("Miguel") ||
        v.name.toLowerCase().includes("male") || v.name.toLowerCase().includes("hombre")
      );
      const voice = useFemale ? (female || pool[0]) : (male || pool[pool.length - 1]);
      u.voice = voice;
      _speakCount++;
    }
    window.speechSynthesis.speak(u);
  };

  if (window.speechSynthesis.getVoices().length > 0) {
    doSpeak();
  } else {
    window.speechSynthesis.onvoiceschanged = () => { doSpeak(); window.speechSynthesis.onvoiceschanged = null; };
  }
};

const sendGmailNotification = async (stagesCleared, totalXp) => {
  console.log(`全クリア: ${stagesCleared}ステージ, ${totalXp}TMXポイント`);
  return true;
};

// ─── DESIGN TOKENS ────────────────────────────────────────────────────────────
const C = {
  bg: "#F0F4FF",       // 全体背景：薄い青
  card: "#FFFFFF",
  coral: "#2979FF",    // アクセント→明るい青
  orange: "#1565C0",   // サブアクセント→濃い青
  yellow: "#64B5F6",   // ハイライト→水色
  green: "#00897B",    // 正解・完了→ティール
  blue: "#1A73E8",     // メインブルー
  purple: "#5C6BC0",   // セカンダリ→インディゴ
  pink: "#26A69A",     // アクセント→ティール系
  dark: "#1A237E",     // テキスト→ダークネイビー
  muted: "#78909C",    // サブテキスト→ブルーグレー
};

const PHASE_ORDER  = ["lesson", "cards", "handwriting", "vocabTest", "phraseCards", "phraseTest", "chat"];
const PHASE_LABELS = { lesson: "🎓 講座", cards: "📖 単語", handwriting: "✏️ 手書き", vocabTest: "✅ テスト", phraseCards: "📝 フレーズ", phraseTest: "📝 フレーズTest", chat: "💬 フレーズ練習" };
const PHASE_COLORS = { lesson: "#1565C0", cards: C.blue, handwriting: C.purple, vocabTest: C.coral, phraseCards: C.orange, phraseTest: C.pink, chat: C.green };
const PASS_RATE = 0.8;

// ─── SHARED COMPONENTS ────────────────────────────────────────────────────────

function Btn({ children, onClick, color = C.coral, disabled, style = {} }) {
  return (
    <button onClick={onClick} disabled={disabled} style={{
      background: disabled ? "#DDD" : color,
      color: "white", border: "none", borderRadius: 18,
      padding: "14px 20px", fontSize: 15, fontWeight: "bold",
      fontFamily: "inherit", cursor: disabled ? "default" : "pointer",
      boxShadow: disabled ? "none" : `0 4px 0 ${color}99`,
      transform: "translateY(0)", transition: "all 0.12s",
      ...style,
    }}
    onMouseDown={e => { if (!disabled) e.currentTarget.style.transform = "translateY(3px)"; e.currentTarget.style.boxShadow = "none"; }}
    onMouseUp={e => { e.currentTarget.style.transform = ""; e.currentTarget.style.boxShadow = disabled ? "none" : `0 4px 0 ${color}99`; }}
    onTouchStart={e => { if (!disabled) e.currentTarget.style.transform = "translateY(3px)"; e.currentTarget.style.boxShadow = "none"; }}
    onTouchEnd={e => { e.currentTarget.style.transform = ""; e.currentTarget.style.boxShadow = disabled ? "none" : `0 4px 0 ${color}99`; }}
    >
      {children}
    </button>
  );
}

function Card({ children, style = {}, color, onClick }) {
  return (
    <div onClick={onClick} style={{
      background: C.card, borderRadius: 24,
      border: `3px solid ${color || "#EEE"}`,
      padding: "18px 16px", marginBottom: 14,
      boxShadow: `0 6px 0 ${color ? color + "55" : "#EEE"}`,
      cursor: onClick ? "pointer" : "default",
      ...style,
    }}>
      {children}
    </div>
  );
}

function XPToast({ amount, onDone }) {
  useEffect(() => { const t = setTimeout(onDone, 1200); return () => clearTimeout(t); }, []);
  return (
    <div style={{
      position: "fixed", top: "38%", left: "50%", transform: "translate(-50%,-50%)",
      background: C.yellow, color: C.dark, padding: "14px 32px", borderRadius: 99,
      fontSize: 22, fontWeight: "bold", zIndex: 9999, pointerEvents: "none",
      border: `3px solid ${C.orange}`,
      animation: "floatUp 1.2s ease-out forwards",
    }}>🔵 +{amount} TMXポイント！</div>
  );
}

function ResultBanner({ passed, score, total, passRate, onRetry, onNext, nextLabel }) {
  const pct = Math.round(score / total * 100);
  return (
    <div style={{ textAlign: "center", padding: "2rem 1rem" }}>
      <div style={{ fontSize: 64, marginBottom: 8 }}>{passed ? "🎉" : "😢"}</div>
      <div style={{ fontSize: 24, fontWeight: "bold", color: C.dark, marginBottom: 6 }}>
        {passed ? "合格！¡Muy bien!" : "もう一度！"}
      </div>
      <div style={{ display: "inline-block", background: passed ? C.green : C.coral, color: "white", borderRadius: 99, padding: "6px 20px", fontSize: 16, fontWeight: "bold", marginBottom: 8 }}>
        {score}/{total}問 {pct}%
      </div>
      <div style={{ fontSize: 13, color: C.muted, marginBottom: 28 }}>合格ライン {Math.round(passRate * 100)}%以上</div>
      {passed
        ? <Btn onClick={onNext} color={C.green} style={{ width: "100%", fontSize: 16, padding: 16 }}>{nextLabel} →</Btn>
        : <Btn onClick={onRetry} color={C.coral} style={{ width: "100%", fontSize: 16, padding: 16 }}>↺ もう一度挑戦！</Btn>
      }
    </div>
  );
}

// ─── DRAWING CANVAS ──────────────────────────────────────────────────────────

function DrawingCanvas({ word, onCountReached }) {
  const canvasRef = useRef(null);
  const [drawing, setDrawing] = useState(false);
  const [writeCount, setWriteCount] = useState(0);
  const lastPos = useRef(null);
  const getPos = (e, c) => { const r = c.getBoundingClientRect(); const s = e.touches ? e.touches[0] : e; return { x: s.clientX - r.left, y: s.clientY - r.top }; };
  const startDraw = (e) => { e.preventDefault(); const c = canvasRef.current; const p = getPos(e, c); lastPos.current = p; setDrawing(true); const ctx = c.getContext("2d"); ctx.beginPath(); ctx.moveTo(p.x, p.y); };
  const draw = (e) => { e.preventDefault(); if (!drawing) return; const c = canvasRef.current; const ctx = c.getContext("2d"); const p = getPos(e, c); ctx.lineTo(p.x, p.y); ctx.strokeStyle = C.dark; ctx.lineWidth = 3; ctx.lineCap = "round"; ctx.lineJoin = "round"; ctx.stroke(); lastPos.current = p; };
  const endDraw = (e) => { e.preventDefault(); setDrawing(false); lastPos.current = null; };
  const clearCanvas = () => { const c = canvasRef.current; c.getContext("2d").clearRect(0, 0, c.width, c.height); };
  const countWrite = () => { const n = writeCount + 1; setWriteCount(n); clearCanvas(); if (n >= 5) onCountReached(); };
  return (
    <div style={{ marginTop: 14 }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
        <div style={{ fontSize: 14, fontWeight: "bold", color: C.purple }}>✏️ 5回書いてみよう！</div>
        <div style={{ display: "flex", gap: 5 }}>
          {[1,2,3,4,5].map(n => <div key={n} style={{ width: 12, height: 12, borderRadius: "50%", background: n <= writeCount ? C.yellow : "#EEE", border: `2px solid ${n <= writeCount ? C.orange : "#DDD"}`, transition: "all 0.3s" }} />)}
        </div>
      </div>
      <div style={{ fontSize: 12, color: C.muted, marginBottom: 8, textAlign: "center" }}>「{word}」を書いてください</div>
      <canvas ref={canvasRef} width={600} height={150}
        onMouseDown={startDraw} onMouseMove={draw} onMouseUp={endDraw} onMouseLeave={endDraw}
        onTouchStart={startDraw} onTouchMove={draw} onTouchEnd={endDraw}
        style={{ width: "100%", height: 150, borderRadius: 16, background: "#F0F6FF", border: `2.5px dashed ${C.yellow}`, cursor: "crosshair", display: "block", touchAction: "none" }} />
      <div style={{ display: "flex", gap: 8, marginTop: 8 }}>
        <button onClick={clearCanvas} style={{ flex: 1, padding: "10px", borderRadius: 12, border: `2px solid #EEE`, background: "white", color: C.muted, cursor: "pointer", fontSize: 13, fontFamily: "inherit" }}>🗑 クリア</button>
        <Btn onClick={countWrite} disabled={writeCount >= 5} color={writeCount >= 5 ? C.green : C.purple} style={{ flex: 2, padding: "10px", fontSize: 13 }}>
          {writeCount >= 5 ? "✓ 5回完了！" : `✓ 書けた！(${writeCount + 1}/5)`}
        </Btn>
      </div>
    </div>
  );
}

// ─── PHASE 1: FLASHCARDS ─────────────────────────────────────────────────────

function FlashcardPhase({ stage, onDone }) {
  const [idx, setIdx] = useState(0);
  const [flipped, setFlipped] = useState(false);
  const [seen, setSeen] = useState(new Set());
  const [written, setWritten] = useState(new Set());
  const vocab = stage.vocab;
  const allSeen = seen.size === vocab.length;
  const goTo = (i) => { setIdx(i); setFlipped(false); };

  return (
    <div>
      {/* Progress dots */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 10 }}>
        <span style={{ fontSize: 13, fontWeight: "bold", color: C.blue }}>📖 {idx + 1} / {vocab.length}</span>
        <span style={{ fontSize: 13, color: C.muted }}>確認済み {seen.size}/{vocab.length}</span>
      </div>
      <div style={{ display: "flex", flexWrap: "wrap", gap: 4, marginBottom: 14, justifyContent: "center" }}>
        {vocab.map((_, i) => (
          <div key={i} onClick={() => goTo(i)} style={{ width: i === idx ? 20 : 8, height: 8, borderRadius: 99, background: seen.has(i) ? C.yellow : i === idx ? C.blue : "#DDD", cursor: "pointer", transition: "all 0.3s", border: i === idx ? `2px solid ${C.blue}` : "none" }} />
        ))}
      </div>

      {/* Front */}
      {!flipped ? (
        <Card color={C.blue} style={{ textAlign: "center", padding: "2.5rem 1.5rem", cursor: "pointer", background: "#F0F6FF" }}
          onClick={() => { setFlipped(true); setSeen(s => new Set([...s, idx])); }}>
          <div style={{ fontSize: 11, color: C.blue, letterSpacing: 2, fontWeight: "bold", marginBottom: 8 }}>ES</div>
          <div style={{ fontSize: 36, fontWeight: "bold", color: C.dark, marginBottom: 14 }}>{vocab[idx].es}</div>
          <button onClick={e => { e.stopPropagation(); speakText(vocab[idx].es); }}
            style={{ background: C.blue, border: "none", borderRadius: 99, padding: "8px 20px", color: "white", cursor: "pointer", fontSize: 14, fontWeight: "bold", fontFamily: "inherit" }}>🔊 発音</button>
          <div style={{ fontSize: 12, color: C.muted, marginTop: 14 }}>タップして詳細を見る 👆</div>
        </Card>
      ) : (
        <Card color={C.purple} style={{ background: "#FAF0FF" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 12 }}>
            <div>
              <div style={{ fontSize: 20, fontWeight: "bold", color: C.dark }}>{vocab[idx].es}</div>
              <div style={{ fontSize: 26, fontWeight: "bold", color: C.purple, marginTop: 2 }}>{vocab[idx].jp}</div>
            </div>
            <button onClick={() => speakText(vocab[idx].es)} style={{ background: C.purple, border: "none", borderRadius: 99, padding: "8px 14px", color: "white", cursor: "pointer", fontSize: 14, fontFamily: "inherit", flexShrink: 0 }}>🔊</button>
          </div>
          {vocab[idx].desc && (
            <div style={{ background: "#F0E8FF", borderRadius: 14, padding: "10px 12px", marginBottom: 12, fontSize: 13, color: C.dark, lineHeight: 1.6, border: `2px solid ${C.purple}33` }}>
              💡 {vocab[idx].desc}
            </div>
          )}
          {vocab[idx].conj && (
            <div style={{ marginBottom: 12 }}>
              <div style={{ fontSize: 11, fontWeight: "bold", color: C.purple, letterSpacing: 1, marginBottom: 8 }}>📊 活用表（現在形）</div>
              <div style={{ background: "white", borderRadius: 12, border: "2px solid #EEE", overflow: "hidden" }}>
                {vocab[idx].conj.map(([pro, form], i) => (
                  <div key={i} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "7px 12px", borderBottom: i < vocab[idx].conj.length - 1 ? "1px solid #F0F0F0" : "none", background: i % 2 === 0 ? "white" : "#FAFAFA" }}>
                    <span style={{ fontSize: 12, color: C.muted, minWidth: 80 }}>{pro}</span>
                    <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                      <span style={{ fontSize: 14, fontWeight: "bold", color: C.purple }}>{form}</span>
                      <button onClick={() => speakText(form)} style={{ background: "none", border: "none", cursor: "pointer", fontSize: 12, padding: 0, color: C.muted }}>🔊</button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
          {vocab[idx].ex && (
            <div>
              <div style={{ fontSize: 11, fontWeight: "bold", color: C.purple, letterSpacing: 1, marginBottom: 8 }}>例文 📝</div>
              {vocab[idx].ex.map((e, i) => {
                const lastOpen = e.lastIndexOf("（");
                const es_part = lastOpen > 0 ? e.slice(0, lastOpen).trim() : e.trim();
                const jp_part = lastOpen > 0 ? e.slice(lastOpen + 1).replace(/）$/, "").trim() : "";
                return (
                  <div key={i} style={{ background: "white", borderRadius: 12, padding: "10px 12px", marginBottom: 8, border: "2px solid #EEE" }}>
                    <div style={{ display: "flex", justifyContent: "space-between", gap: 8 }}>
                      <div>
                        <div style={{ fontSize: 13, fontWeight: "bold", color: C.dark, marginBottom: 3 }}>{es_part}</div>
                        {jp_part && <div style={{ fontSize: 12, color: C.muted }}>{jp_part}</div>}
                      </div>
                      <button onClick={() => speakText(es_part)} style={{ background: "none", border: "none", cursor: "pointer", fontSize: 16, flexShrink: 0, padding: 0 }}>🔊</button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
          {/* Drawing area */}
          <div style={{ background: "#FAF0FF", borderRadius: 16, padding: "12px", border: `2px solid ${C.purple}44`, marginTop: 8 }}>
            <DrawingCanvas key={idx} word={vocab[idx].es} onCountReached={() => setWritten(w => new Set([...w, idx]))} />
            {written.has(idx) && <div style={{ textAlign: "center", marginTop: 10, fontSize: 14, color: C.green, fontWeight: "bold" }}>🎉 ¡Perfecto! 5回完了！</div>}
          </div>
          <button onClick={() => setFlipped(false)} style={{ marginTop: 12, width: "100%", background: "none", border: `2px solid ${C.purple}44`, borderRadius: 14, padding: "10px", color: C.muted, cursor: "pointer", fontSize: 13, fontFamily: "inherit" }}>↩ 戻る</button>
        </Card>
      )}

      {/* Nav buttons */}
      <div style={{ display: "flex", gap: 10, marginBottom: 14 }}>
        <Btn onClick={() => goTo(Math.max(0, idx - 1))} disabled={idx === 0} color={C.blue} style={{ flex: 1, opacity: idx === 0 ? 0.4 : 1 }}>← 前へ</Btn>
        {idx < vocab.length - 1
          ? <Btn onClick={() => goTo(idx + 1)} color={C.blue} style={{ flex: 2 }}>次へ →</Btn>
          : <Btn onClick={() => goTo(0)} color={C.muted} style={{ flex: 2 }}>↺ 最初から</Btn>
        }
      </div>
      {allSeen && <Btn onClick={onDone} color={C.green} style={{ width: "100%", fontSize: 16, padding: 16 }}>✓ 全単語確認！次へ進む 🎉</Btn>}
    </div>
  );
}

// ─── PHASE 1b: HANDWRITING ───────────────────────────────────────────────────

function HandwritingPhase({ stage, onDone }) {
  const vocab = stage.vocab;
  const hasVerbs = vocab.some(v => v.conj);

  // 動詞ステージ：活用の書き取り練習
  if (hasVerbs) {
    return <ConjWritingPhase vocab={vocab} onDone={onDone} />;
  }

  // 通常ステージ：単語の書き取り
  const total = vocab.length;
  const groupSize = 10;
  const groups = [];
  for (let i = 0; i < total; i += groupSize) {
    groups.push(vocab.slice(i, i + groupSize));
  }
  const [groupDone, setGroupDone] = useState(0);
  const allDone = groupDone >= groups.length;

  return (
    <div>
      <div style={{ textAlign: "center", marginBottom: 20 }}>
        <div style={{ fontSize: 48, marginBottom: 8 }}>✏️</div>
        <div style={{ fontSize: 20, fontWeight: "bold", color: C.dark, marginBottom: 8 }}>iPadで手書き練習！</div>
        <div style={{ background: "#E8EAF6", border: `2px solid ${C.pink}`, borderRadius: 16, padding: "12px 16px", fontSize: 13, color: C.dark, lineHeight: 1.7 }}>
          単語を<span style={{ color: C.pink, fontWeight: "bold" }}>スペイン語＋日本語</span>セットで<br />
          <span style={{ color: C.pink, fontWeight: "bold" }}>全{total}語</span>書いてください ✍️
        </div>
      </div>
      {groups.map((group, gi) => {
        const done = groupDone > gi;
        const locked = gi > 0 && groupDone < gi;
        const startNum = gi * groupSize + 1;
        const endNum   = Math.min(startNum + group.length - 1, total);
        const label    = groups.length === 1 ? `全${total}語` : gi === 0 ? `前半 ${startNum}〜${endNum}語` : `後半 ${startNum}〜${endNum}語`;
        return (
          <Card key={gi} color={done ? C.green : locked ? "#DDD" : C.orange} style={{ opacity: locked ? 0.4 : 1, background: done ? "#F0FFF4" : locked ? "#F9F9F9" : "#EEF4FF" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
              <div style={{ fontSize: 14, fontWeight: "bold", color: done ? C.green : C.orange }}>
                {done ? "✓ " : locked ? "🔒 " : ""}{label}
              </div>
              {done && <span style={{ background: C.green, color: "white", borderRadius: 99, padding: "3px 12px", fontSize: 12, fontWeight: "bold" }}>完了！</span>}
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 6, marginBottom: done ? 0 : 12 }}>
              {group.map((v, i) => (
                <div key={i} style={{ background: "white", borderRadius: 10, padding: "8px 10px", display: "flex", justifyContent: "space-between", alignItems: "center", border: "2px solid #F0F0F0" }}>
                  <div><div style={{ fontSize: 13, fontWeight: "bold", color: C.dark }}>{v.es}</div><div style={{ fontSize: 11, color: C.muted }}>{v.jp}</div></div>
                  <button onClick={() => speakText(v.es)} style={{ background: "none", border: "none", cursor: "pointer", fontSize: 16, padding: 0 }}>🔊</button>
                </div>
              ))}
            </div>
            {!done && !locked && (
              <Btn onClick={() => setGroupDone(gi + 1)} color={C.orange} style={{ width: "100%" }}>
                ✓ {label}を書きました！
              </Btn>
            )}
          </Card>
        );
      })}
      {allDone && <Btn onClick={onDone} color={C.green} style={{ width: "100%", fontSize: 16, padding: 16 }}>✓ 全{total}語書いた！テストへ 🚀</Btn>}
    </div>
  );
}

// ─── CONJUGATION WRITING PHASE（動詞ステージ専用）────────────────────────────

function ConjWritingPhase({ vocab, onDone }) {
  const verbs = vocab.filter(v => v.conj);
  const [verbIdx, setVerbIdx] = useState(0);
  const [rowDone, setRowDone] = useState(0);
  const [allVerbsDone, setAllVerbsDone] = useState(false);
  const canvasRef = useRef(null);
  const isDrawing = useRef(false);

  const verb = verbs[verbIdx];
  const rows = verb.conj.filter((_, i) => i !== 4); // vosotros除く
  const totalRows = rows.length;
  const pronounColors = ["#1E88E5","#1565C0","#64B5F6","#00897B","#5C6BC0"];

  // キャンバスをリセット（次の行へ進むとき）
  const clearCanvas = () => {
    const c = canvasRef.current;
    if (c) c.getContext("2d").clearRect(0, 0, c.width, c.height);
  };

  const getPos = (e, c) => {
    const r = c.getBoundingClientRect();
    const s = e.touches ? e.touches[0] : e;
    return { x: (s.clientX - r.left) * (c.width / r.width), y: (s.clientY - r.top) * (c.height / r.height) };
  };
  const startDraw = (e) => {
    e.preventDefault();
    isDrawing.current = true;
    const c = canvasRef.current;
    const ctx = c.getContext("2d");
    const p = getPos(e, c);
    ctx.beginPath(); ctx.moveTo(p.x, p.y);
  };
  const draw = (e) => {
    e.preventDefault();
    if (!isDrawing.current) return;
    const c = canvasRef.current;
    const ctx = c.getContext("2d");
    const p = getPos(e, c);
    ctx.lineTo(p.x, p.y);
    ctx.strokeStyle = "#2D2D2D"; ctx.lineWidth = 3;
    ctx.lineCap = "round"; ctx.lineJoin = "round";
    ctx.stroke();
  };
  const endDraw = (e) => { e.preventDefault(); isDrawing.current = false; };

  const handleNext = () => {
    clearCanvas();
    if (rowDone < totalRows - 1) {
      setRowDone(r => r + 1);
    } else if (verbIdx < verbs.length - 1) {
      setVerbIdx(v => v + 1);
      setRowDone(0);
    } else {
      setAllVerbsDone(true);
    }
  };

  if (allVerbsDone) return (
    <div style={{ textAlign: "center", padding: "2rem 1rem" }}>
      <div style={{ fontSize: 64, marginBottom: 12 }}>🎉</div>
      <div style={{ fontSize: 22, fontWeight: "bold", color: C.dark, marginBottom: 8 }}>全活用を書いた！</div>
      <div style={{ fontSize: 14, color: C.muted, marginBottom: 28 }}>
        {verbs.length}動詞 × 5活用 = {verbs.length * 5}パターン書き切りました！
      </div>
      <Btn onClick={onDone} color={C.green} style={{ width: "100%", fontSize: 16, padding: 16 }}>テストへ進む 🚀</Btn>
    </div>
  );

  const currentRow = rows[rowDone];

  return (
    <div>
      {/* 動詞の進捗バー */}
      <div style={{ display: "flex", gap: 4, marginBottom: 14 }}>
        {verbs.map((v, i) => (
          <div key={i} style={{ flex: 1, textAlign: "center" }}>
            <div style={{ height: 6, borderRadius: 99, background: i < verbIdx ? C.green : i === verbIdx ? "#1565C0" : "#EEE", marginBottom: 3, transition: "all 0.3s" }} />
            <div style={{ fontSize: 9, color: i <= verbIdx ? C.dark : C.muted, fontWeight: "bold" }}>{v.es}</div>
          </div>
        ))}
      </div>

      {/* 今書く活用を大きく表示 */}
      <Card color="#1565C0" style={{ background: "#EEF4FF", marginBottom: 12 }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 10 }}>
          <div style={{ fontSize: 13, color: C.muted }}>
            <span style={{ fontWeight: "bold", color: "#1565C0" }}>{verb.es}</span>（{verb.jp}）の活用 {rowDone + 1}/{totalRows}
          </div>
          <button onClick={() => speakText(`${currentRow[0]} ${currentRow[1]}`)}
            style={{ background: "#1565C0", border: "none", borderRadius: 99, padding: "6px 14px", color: "white", cursor: "pointer", fontSize: 13, fontFamily: "inherit" }}>🔊</button>
        </div>
        {/* お手本 */}
        <div style={{ display: "flex", alignItems: "center", gap: 10, background: "white", borderRadius: 12, padding: "14px 16px", marginBottom: 12, border: "2px dashed #FFD0A0" }}>
          <div style={{ width: 12, height: 12, borderRadius: "50%", background: pronounColors[rowDone], flexShrink: 0 }} />
          <span style={{ fontSize: 18, color: C.muted, minWidth: 80 }}>{currentRow[0]}</span>
          <span style={{ fontSize: 30, fontWeight: "bold", color: C.dark }}>{currentRow[1]}</span>
        </div>
        {currentRow[2] && (
          <div style={{ marginBottom: 10 }}>
            <div style={{ fontSize: 11, color: "#1565C0", fontWeight: "bold", marginBottom: 6 }}>📝 例文で確認しよう</div>
            {currentRow[2].split("|").map((ex, ei) => {
              const lastOpen = ex.lastIndexOf("（");
              const esPart = lastOpen > 0 ? ex.slice(0, lastOpen).trim() : ex.trim();
              const jpPart = lastOpen > 0 ? ex.slice(lastOpen + 1).replace(/）$/, "").trim() : "";
              const exColors = ["#E3F2FD", "#FFF8E0", "#FFF0F8"];
              const exBorders = ["#90CAF9", "#FFE0A0", "#FFD0D8"];
              return (
                <div key={ei} style={{ background: exColors[ei] || "#E3F2FD", borderRadius: 10, padding: "9px 12px", marginBottom: 6, border: `1.5px solid ${exBorders[ei] || "#90CAF9"}` }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 8 }}>
                    <div>
                      <div style={{ fontSize: 14, fontWeight: "bold", color: C.dark, fontStyle: "italic" }}>{esPart}</div>
                      {jpPart && <div style={{ fontSize: 12, color: C.muted, marginTop: 2 }}>{jpPart}</div>}
                    </div>
                    <button onClick={() => speakText(esPart)}
                      style={{ background: "#1565C0", border: "none", borderRadius: 99, padding: "4px 10px", color: "white", cursor: "pointer", fontSize: 12, fontFamily: "inherit", flexShrink: 0 }}>🔊</button>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* 手書きキャンバス */}
        <div style={{ fontSize: 12, color: C.muted, marginBottom: 6, textAlign: "center" }}>↓ 上を見ながらここに書いてください</div>
        <canvas
          ref={canvasRef}
          width={560} height={120}
          onMouseDown={startDraw} onMouseMove={draw} onMouseUp={endDraw} onMouseLeave={endDraw}
          onTouchStart={startDraw} onTouchMove={draw} onTouchEnd={endDraw}
          style={{ width: "100%", height: 120, borderRadius: 12, background: "#F0F6FF", border: "2.5px dashed #FFD93D", display: "block", touchAction: "none", cursor: "crosshair" }}
        />
        <div style={{ display: "flex", gap: 8, marginTop: 8 }}>
          <button onClick={clearCanvas}
            style={{ flex: 1, padding: "9px", borderRadius: 10, border: "2px solid #EEE", background: "white", color: C.muted, cursor: "pointer", fontSize: 13, fontFamily: "inherit" }}>
            🗑 クリア
          </button>
        </div>
      </Card>

      {/* 全行リスト */}
      <Card color="#1565C0" style={{ background: "#EEF4FF", padding: "10px 14px", marginBottom: 14 }}>
        {rows.map(([pro, form], i) => (
          <div key={i} style={{ display: "flex", alignItems: "center", gap: 10, padding: "7px 0", borderBottom: i < rows.length - 1 ? "1px solid #FFE0C0" : "none", opacity: i > rowDone ? 0.3 : 1 }}>
            <div style={{ width: 10, height: 10, borderRadius: "50%", background: i < rowDone ? C.green : i === rowDone ? pronounColors[i] : "#DDD", flexShrink: 0, transition: "all 0.3s" }} />
            <span style={{ fontSize: 13, color: C.muted, minWidth: 72 }}>{pro}</span>
            <span style={{ fontSize: 15, fontWeight: "bold", color: i <= rowDone ? C.dark : C.muted }}>{form}</span>
            {i < rowDone && <span style={{ marginLeft: "auto", color: C.green, fontSize: 14 }}>✓</span>}
            {i === rowDone && <span style={{ marginLeft: "auto", color: "#1565C0", fontSize: 11, fontWeight: "bold" }}>← 今ここ</span>}
          </div>
        ))}
      </Card>

      <Btn onClick={handleNext} color="#1565C0" style={{ width: "100%", fontSize: 15, padding: 16 }}>
        ✓ 書けた！ →
        {rowDone < totalRows - 1
          ? ` 次: ${rows[rowDone + 1][0]} ${rows[rowDone + 1][1]}`
          : verbIdx < verbs.length - 1
            ? ` 次の動詞: ${verbs[verbIdx + 1].es}`
            : " 全完了！"}
      </Btn>
    </div>
  );
}

// ─── PHASE 2: VOCAB TEST ─────────────────────────────────────────────────────

function VocabTestPhase({ stage, onPass, onRetryCards }) {
  const vocab = stage.vocab;
  const [idx, setIdx] = useState(0);
  const [selected, setSelected] = useState(null);
  const [score, setScore] = useState(0);
  const [finished, setFinished] = useState(false);
  const [{ questions, opts }] = useState(() => {
    const maxQ = Math.min(10, vocab.length);  // 語数を超えた問題は出さない
    const qs = shuffle(vocab).slice(0, maxQ);
    const os = qs.map(item => {
      const wrongs = shuffle(vocab.filter(v => v.jp !== item.jp)).slice(0, 3);
      // 選択肢が3つ未満なら残りをダミーで補わない（そのまま少ない選択肢で出す）
      return shuffle([item, ...wrongs]);
    });
    return { questions: qs, opts: os };
  });
  const answer = (i) => { if (selected !== null) return; setSelected(i); if (opts[idx][i].jp === questions[idx].jp) setScore(s => s + 1); };
  const next = () => { if (idx < questions.length - 1) { setIdx(i => i + 1); setSelected(null); } else setFinished(true); };
  if (finished) return <ResultBanner passed={score / questions.length >= PASS_RATE} score={score} total={questions.length} passRate={PASS_RATE} onRetry={onRetryCards} onNext={onPass} nextLabel="フレーズ練習へ" />;
  const q = questions[idx];
  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 10 }}>
        <span style={{ fontSize: 13, fontWeight: "bold", color: C.coral }}>✅ {idx + 1}/10問</span>
        <span style={{ background: C.yellow, color: C.dark, borderRadius: 99, padding: "3px 12px", fontSize: 12, fontWeight: "bold" }}>合格ライン 80%</span>
      </div>
      <Card color={C.coral} style={{ textAlign: "center", background: "#FFF0F0" }}>
        <div style={{ fontSize: 12, color: C.muted, marginBottom: 8 }}>このスペイン語の意味は？</div>
        <div style={{ fontSize: 34, fontWeight: "bold", color: C.dark, marginBottom: 10 }}>{q.es}</div>
        <button onClick={() => speakText(q.es)} style={{ background: C.coral, border: "none", borderRadius: 99, padding: "7px 20px", color: "white", cursor: "pointer", fontSize: 14, fontWeight: "bold", fontFamily: "inherit" }}>🔊 発音</button>
      </Card>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginBottom: 14 }}>
        {opts[idx].map((opt, i) => {
          const isAns = opt.jp === q.jp, isSel = selected === i;
          let bg = "white", border = "3px solid #EEE", color = C.dark;
          if (selected !== null) { if (isAns) { bg = "#F0FFF4"; border = `3px solid ${C.green}`; color = C.green; } else if (isSel) { bg = "#FFF0F0"; border = `3px solid ${C.coral}`; color = C.coral; } }
          return <button key={i} onClick={() => answer(i)} style={{ padding: "16px 8px", borderRadius: 16, border, background: bg, color, fontFamily: "inherit", fontSize: 14, fontWeight: "bold", cursor: selected !== null ? "default" : "pointer", transition: "all 0.2s" }}>{opt.jp}</button>;
        })}
      </div>
      {selected !== null && <Btn onClick={next} color={C.coral} style={{ width: "100%" }}>{idx < questions.length - 1 ? "次の問題 →" : "結果を見る 🎊"}</Btn>}
    </div>
  );
}

// ─── PHASE 3: PHRASE CARDS ───────────────────────────────────────────────────

function PhraseCardPhase({ stage, onDone }) {
  const [idx, setIdx] = useState(0), [flipped, setFlipped] = useState(false), [seen, setSeen] = useState(new Set());
  const phrases = stage.phrases, allSeen = seen.size === phrases.length;
  const goTo = (i) => { setIdx(i); setFlipped(false); };
  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 10 }}>
        <span style={{ fontSize: 13, fontWeight: "bold", color: C.orange }}>📝 {idx + 1}/{phrases.length}</span>
        <span style={{ fontSize: 13, color: C.muted }}>確認 {seen.size}/{phrases.length}</span>
      </div>
      <div style={{ display: "flex", gap: 4, marginBottom: 14, justifyContent: "center" }}>
        {phrases.map((_, i) => <div key={i} onClick={() => goTo(i)} style={{ width: i === idx ? 20 : 8, height: 8, borderRadius: 99, background: seen.has(i) ? C.yellow : i === idx ? C.orange : "#DDD", cursor: "pointer", transition: "all 0.3s" }} />)}
      </div>
      {!flipped ? (
        <Card color={C.orange} style={{ textAlign: "center", padding: "2.5rem 1.5rem", cursor: "pointer", background: "#EEF4FF" }} onClick={() => { setFlipped(true); setSeen(s => new Set([...s, idx])); }}>
          <div style={{ fontSize: 12, color: C.orange, fontWeight: "bold", letterSpacing: 1, marginBottom: 8 }}>日本語</div>
          <div style={{ fontSize: 20, color: C.dark, lineHeight: 1.7 }}>{phrases[idx].jp}</div>
          <div style={{ fontSize: 12, color: C.muted, marginTop: 14 }}>タップしてスペイン語を確認 👆</div>
        </Card>
      ) : (
        <Card color={C.orange} style={{ background: "#EEF4FF" }}>
          <div style={{ fontSize: 13, color: C.muted, marginBottom: 6 }}>{phrases[idx].jp}</div>
          <div style={{ fontSize: 22, fontWeight: "bold", color: C.dark, marginBottom: 10 }}>{phrases[idx].es}</div>
          <button onClick={() => speakText(phrases[idx].es)} style={{ background: C.orange, border: "none", borderRadius: 99, padding: "8px 20px", color: "white", cursor: "pointer", fontSize: 14, fontWeight: "bold", fontFamily: "inherit" }}>🔊 発音</button>
          <button onClick={() => setFlipped(false)} style={{ marginTop: 12, width: "100%", background: "none", border: `2px solid ${C.orange}44`, borderRadius: 14, padding: "10px", color: C.muted, cursor: "pointer", fontSize: 13, fontFamily: "inherit" }}>↩ 戻る</button>
        </Card>
      )}
      <div style={{ display: "flex", gap: 10, marginBottom: 14 }}>
        <Btn onClick={() => goTo(Math.max(0, idx - 1))} disabled={idx === 0} color={C.orange} style={{ flex: 1, opacity: idx === 0 ? 0.4 : 1 }}>← 前へ</Btn>
        {idx < phrases.length - 1 ? <Btn onClick={() => goTo(idx + 1)} color={C.orange} style={{ flex: 2 }}>次へ →</Btn> : <Btn onClick={() => goTo(0)} color={C.muted} style={{ flex: 2 }}>↺ もう一度</Btn>}
      </div>
      {allSeen && <Btn onClick={onDone} color={C.green} style={{ width: "100%", fontSize: 16, padding: 16 }}>✓ 全フレーズ確認！テストへ 🚀</Btn>}
    </div>
  );
}

// ─── PHASE 4: PHRASE TEST ────────────────────────────────────────────────────

function PhraseTestPhase({ stage, onPass, onRetryCards }) {
  const phrases = stage.phrases;
  const [idx, setIdx] = useState(0), [selected, setSelected] = useState(null), [score, setScore] = useState(0), [finished, setFinished] = useState(false);
  const answer = (opt) => { if (selected !== null) return; setSelected(opt); if (opt === phrases[idx].answer) setScore(s => s + 1); };
  const next = () => { if (idx < phrases.length - 1) { setIdx(i => i + 1); setSelected(null); } else setFinished(true); };
  if (finished) return <ResultBanner passed={score / phrases.length >= PASS_RATE} score={score} total={phrases.length} passRate={PASS_RATE} onRetry={onRetryCards} onNext={onPass} nextLabel="AI会話練習へ" />;
  const p = phrases[idx];
  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 10 }}>
        <span style={{ fontSize: 13, fontWeight: "bold", color: C.pink }}>📝 {idx + 1}/{phrases.length}問</span>
        <span style={{ background: C.yellow, color: C.dark, borderRadius: 99, padding: "3px 12px", fontSize: 12, fontWeight: "bold" }}>合格ライン 80%</span>
      </div>
      <Card color={C.pink} style={{ textAlign: "center", background: "#FFF0F8" }}>
        <div style={{ fontSize: 12, color: C.muted, marginBottom: 10 }}>空欄に入る単語は？</div>
        <div style={{ fontSize: 20, fontWeight: "bold", color: C.dark, lineHeight: 1.7, marginBottom: 8 }}>{p.blank}</div>
        <div style={{ fontSize: 13, color: C.muted, marginBottom: 10 }}>（{p.jp}）</div>
        <button onClick={() => speakText(p.es)} style={{ background: C.pink, border: "none", borderRadius: 99, padding: "7px 20px", color: "white", cursor: "pointer", fontSize: 14, fontWeight: "bold", fontFamily: "inherit" }}>🔊 正解を聴く</button>
      </Card>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginBottom: 14 }}>
        {p.opts.map((opt, i) => {
          const isAns = opt === p.answer, isSel = selected === opt;
          let bg = "white", border = "3px solid #EEE", color = C.dark;
          if (selected !== null) { if (isAns) { bg = "#F0FFF4"; border = `3px solid ${C.green}`; color = C.green; } else if (isSel) { bg = "#FFF0F8"; border = `3px solid ${C.pink}`; color = C.pink; } }
          return <button key={i} onClick={() => answer(opt)} style={{ padding: "16px 8px", borderRadius: 16, border, background: bg, color, fontFamily: "inherit", fontSize: 15, fontWeight: "bold", cursor: selected !== null ? "default" : "pointer", transition: "all 0.2s" }}>{opt}</button>;
        })}
      </div>
      {selected !== null && (
        <>
          <div style={{ textAlign: "center", marginBottom: 10, fontSize: 14, fontWeight: "bold", color: selected === p.answer ? C.green : C.pink }}>
            {selected === p.answer ? `✓ 正解！「${p.es}」` : `× 正解は「${p.answer}」`}
          </div>
          <Btn onClick={next} color={C.pink} style={{ width: "100%" }}>{idx < phrases.length - 1 ? "次の問題 →" : "結果を見る 🎊"}</Btn>
        </>
      )}
    </div>
  );
}

// ─── PHASE 5: CONVERSATION PHRASES ──────────────────────────────────────────

function ChatPhase({ stage, onComplete, alreadyCleared }) {
  const [seen, setSeen] = useState(new Set());
  const allSeen = seen.size >= Math.min(5, stage.phrases.length);

  // ステージごとの会話フレーズ集
  const convoPhrases = [
    ...stage.phrases.slice(0, 5).map(p => ({ es: p.es, jp: p.jp })),
  ];

  return (
    <div>
      <div style={{ background: "#F0F8FF", border: `2px solid ${C.blue}44`, borderRadius: 16, padding: "12px 16px", marginBottom: 16, fontSize: 13, color: C.dark, lineHeight: 1.7 }}>
        💬 <span style={{ fontWeight: "bold" }}>会話フレーズ練習</span><br />
        <span style={{ color: C.muted }}>声に出して練習しましょう！各フレーズを5回読んでね。</span>
      </div>

      {convoPhrases.map((p, i) => (
        <Card key={i} color={seen.has(i) ? C.green : C.blue}
          style={{ background: seen.has(i) ? "#F0FFF4" : "#F0F6FF", cursor: "pointer" }}
          onClick={() => setSeen(s => new Set([...s, i]))}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 10 }}>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 18, fontWeight: "bold", color: C.dark, marginBottom: 4 }}>{p.es}</div>
              <div style={{ fontSize: 14, color: C.muted }}>{p.jp}</div>
            </div>
            <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 6, flexShrink: 0 }}>
              <button onClick={e => { e.stopPropagation(); speakText(p.es); }}
                style={{ background: seen.has(i) ? C.green : C.blue, border: "none", borderRadius: 99, padding: "7px 14px", color: "white", cursor: "pointer", fontSize: 13, fontWeight: "bold", fontFamily: "inherit" }}>
                🔊×5
              </button>
              {seen.has(i) && <span style={{ fontSize: 18 }}>✓</span>}
            </div>
          </div>
          {!seen.has(i) && (
            <div style={{ fontSize: 11, color: C.muted, marginTop: 8, textAlign: "center" }}>
              タップして練習完了にする 👆
            </div>
          )}
        </Card>
      ))}

      <div style={{ background: "#EEF4FF", border: `2px solid ${C.orange}44`, borderRadius: 14, padding: "12px 16px", marginBottom: 16, fontSize: 13, color: C.dark, lineHeight: 1.8 }}>
        🗣 <span style={{ fontWeight: "bold" }}>練習のコツ</span><br />
        <span style={{ color: C.muted }}>
          ① 🔊を押して発音を確認<br />
          ② 声に出して5回繰り返す<br />
          ③ 自分のことに置き換えて言ってみる
        </span>
      </div>

      {!alreadyCleared
        ? <Btn onClick={onComplete} color={C.green} style={{ width: "100%", fontSize: 17, padding: 18 }}
            disabled={!allSeen}>
            {allSeen ? "🎉 ステージクリア！ +100 TMXポイント" : `あと${Math.min(5, stage.phrases.length) - seen.size}フレーズ練習しよう`}
          </Btn>
        : <div style={{ textAlign: "center", padding: 14, borderRadius: 16, background: "#F0FFF4", color: C.green, fontSize: 14, fontWeight: "bold", border: `3px solid ${C.green}44` }}>✓ クリア済みです 🌟</div>
      }
    </div>
  );
}


// ─── CONJUGATION TABLE WITH EXPANDABLE EXAMPLES ─────────────────────────────

function ConjTable({ conj, pronounColors }) {
  const [open, setOpen] = useState(null);
  const rows = conj.filter((_, i) => i !== 4); // skip vosotros

  return (
    <div style={{ borderRadius: 12, overflow: "hidden", border: "2px solid #FFE0C0" }}>
      {rows.map(([pro, form, ex], i) => {
        const colorIdx = i < 4 ? i : i + 1;
        const isOpen = open === i;
        const exList = ex ? ex.split("|") : [];
        const firstEx = exList[0] || "";
        const lastOpen = firstEx.lastIndexOf("（");
        const es_part = lastOpen > 0 ? firstEx.slice(0, lastOpen).trim() : firstEx.trim();
        const jp_part = lastOpen > 0 ? firstEx.slice(lastOpen + 1).replace(/）$/, "").trim() : "";
        return (
          <div key={i} style={{ borderBottom: i < rows.length - 1 ? "1px solid #FFE0C0" : "none" }}>
            {/* Row */}
            <div onClick={() => setOpen(isOpen ? null : i)}
              style={{ display: "flex", alignItems: "center", gap: 0, background: isOpen ? "#E3F2FD" : i % 2 === 0 ? "white" : "#E3F2FD", cursor: "pointer", transition: "background 0.2s" }}>
              <div style={{ width: 8, background: pronounColors[colorIdx], alignSelf: "stretch" }} />
              <div style={{ flex: 1, padding: "11px 12px", fontSize: 13, color: C.muted }}>{pro}</div>
              <div style={{ padding: "11px 12px", fontSize: 16, fontWeight: "bold", color: C.dark, minWidth: 90 }}>{form}</div>
              <button onClick={e => { e.stopPropagation(); speakText(`${pro} ${form}`); }}
                style={{ background: "none", border: "none", cursor: "pointer", fontSize: 14, padding: "11px 10px", color: C.muted }}>🔊</button>
              <div style={{ padding: "11px 10px", fontSize: 12, color: "#1565C0" }}>{isOpen ? "▲" : "▼"}</div>
            </div>
            {/* Expanded example */}
            {isOpen && ex && (
              <div style={{ background: "#EEF4FF", borderTop: "1px dashed #FFD0A0", padding: "10px 14px 12px 18px" }}>
                <div style={{ fontSize: 11, color: "#1565C0", fontWeight: "bold", marginBottom: 8 }}>📝 例文（タップして音声確認）</div>
                {exList.map((ex2, ei) => {
                  const lo2 = ex2.lastIndexOf("（");
                  const es2 = lo2 > 0 ? ex2.slice(0, lo2).trim() : ex2.trim();
                  const jp2 = lo2 > 0 ? ex2.slice(lo2 + 1).replace(/）$/, "").trim() : "";
                  const exColors = ["#EEF4FF","#FFFBF0","#FFF0F8"];
                  return (
                    <div key={ei} style={{ background: exColors[ei]||"#EEF4FF", borderRadius: 8, padding: "8px 10px", marginBottom: 6, border: "1px solid #FFE0C0" }}>
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 8 }}>
                        <div>
                          <div style={{ fontSize: 13, fontWeight: "bold", color: C.dark }}>{es2}</div>
                          {jp2 && <div style={{ fontSize: 11, color: C.muted, marginTop: 2 }}>{jp2}</div>}
                        </div>
                        <button onClick={() => speakText(es2)}
                          style={{ background: "#1565C0", border: "none", borderRadius: 99, padding: "5px 10px", color: "white", cursor: "pointer", fontSize: 11, fontFamily: "inherit", flexShrink: 0 }}>🔊</button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}

// ─── GENERIC LESSON PHASE（挨拶・月・季節ステージ）────────────────────────────

function GenericLessonPhase({ stage, onDone }) {
  const slides = stage.lesson.slides;
  const [step, setStep] = useState(0);
  const total = slides.length;
  const slide = slides[step];
  const C2 = "#00897B"; // green theme

  return (
    <div>
      {/* Progress */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
        <span style={{ fontSize: 13, fontWeight: "bold", color: C2 }}>🎓 文法講座 {step + 1}/{total}</span>
        <div style={{ display: "flex", gap: 4 }}>
          {Array.from({ length: total }).map((_, i) => (
            <div key={i} style={{ width: i === step ? 20 : 8, height: 8, borderRadius: 99, background: i < step ? C.green : i === step ? C2 : "#DDD", transition: "all 0.3s" }} />
          ))}
        </div>
      </div>

      {/* Slide title */}
      <div style={{ fontSize: 18, fontWeight: "bold", color: C.dark, marginBottom: 12 }}>{slide.title}</div>

      {/* INTRO slide */}
      {slide.type === "intro" && (
        <Card color={C2} style={{ background: "#F0FFF4" }}>
          <div style={{ fontSize: 14, color: C.dark, lineHeight: 1.9, whiteSpace: "pre-line", marginBottom: 14 }}>{slide.body}</div>
          <div style={{ background: "#E0F7E9", border: `2px solid ${C2}66`, borderRadius: 12, padding: "10px 14px", fontSize: 13, color: "#2D7A4F", fontWeight: "bold" }}>
            💡 {slide.note}
          </div>
        </Card>
      )}

      {/* TABLE slide */}
      {slide.type === "table" && (
        <Card color={C2} style={{ background: "#F0FFF4", padding: "14px" }}>
          <div style={{ borderRadius: 12, overflow: "hidden", border: `2px solid ${C2}66` }}>
            {slide.rows.map((row, i) => (
              <div key={i} style={{ display: "flex", alignItems: "center", gap: 0, background: i % 2 === 0 ? "white" : "#F0FFF4", borderBottom: i < slide.rows.length - 1 ? `1px solid ${C2}33` : "none" }}>
                <div style={{ width: 44, textAlign: "center", fontSize: 22, padding: "12px 0", flexShrink: 0 }}>{row.icon}</div>
                <div style={{ flex: 1, padding: "12px 8px" }}>
                  <div style={{ fontSize: 16, fontWeight: "bold", color: C.dark }}>{row.es}</div>
                  <div style={{ fontSize: 12, color: C.muted, marginTop: 2 }}>{row.jp}</div>
                </div>
                <button onClick={() => speakText(row.es)}
                  style={{ background: C2, border: "none", borderRadius: 99, padding: "6px 12px", color: "white", cursor: "pointer", fontSize: 13, fontFamily: "inherit", margin: "0 10px", flexShrink: 0 }}>🔊</button>
              </div>
            ))}
          </div>
          <div style={{ marginTop: 12, background: "#E0F7E9", border: `2px solid ${C2}66`, borderRadius: 12, padding: "10px 14px", fontSize: 13, color: "#2D7A4F", fontWeight: "bold" }}>
            🗣 声に出して5回読もう！
          </div>
        </Card>
      )}

      {/* USAGE slide */}
      {slide.type === "usage" && (
        <Card color={C2} style={{ background: "#F0FFF4" }}>
          <div style={{ fontSize: 12, color: C.muted, marginBottom: 10 }}>🗣 各フレーズを声に出して練習しましょう！</div>
          {slide.examples.map((ex, i) => (
            <div key={i} style={{ background: "white", borderRadius: 12, padding: "10px 12px", marginBottom: 8, border: `2px solid ${C2}44` }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 8 }}>
                <div>
                  <div style={{ fontSize: 15, fontWeight: "bold", color: C.dark }}>{ex.es}</div>
                  <div style={{ fontSize: 12, color: C.muted, marginTop: 2 }}>{ex.jp}</div>
                </div>
                <button onClick={() => speakText(ex.es)}
                  style={{ background: C2, border: "none", borderRadius: 99, padding: "6px 12px", color: "white", cursor: "pointer", fontSize: 12, fontWeight: "bold", fontFamily: "inherit", flexShrink: 0 }}>🔊×5</button>
              </div>
            </div>
          ))}
        </Card>
      )}

      {/* NEW WORDS slide */}
      {slide.type === "new_words" && (
        <Card color={C2} style={{ background: "#F0FFF4" }}>
          <div style={{ fontSize: 12, color: C.muted, marginBottom: 12 }}>🗣 声に出して覚えよう！</div>
          <div style={{ borderRadius: 12, overflow: "hidden", border: `2px solid ${C2}66` }}>
            {slide.words.map((w, i) => (
              <div key={i} style={{ display: "flex", alignItems: "center", background: i % 2 === 0 ? "white" : "#F0FFF4", borderBottom: i < slide.words.length - 1 ? `1px solid ${C2}33` : "none", padding: "0" }}>
                <div style={{ flex: 1, padding: "11px 14px" }}>
                  <div style={{ fontSize: 16, fontWeight: "bold", color: C.dark }}>{w.es}</div>
                  <div style={{ fontSize: 12, color: C.muted, marginTop: 2 }}>{w.jp}</div>
                </div>
                <button onClick={() => speakText(w.es)}
                  style={{ background: C2, border: "none", borderRadius: 99, padding: "6px 12px", color: "white", cursor: "pointer", fontSize: 13, fontFamily: "inherit", margin: "0 10px", flexShrink: 0 }}>🔊</button>
              </div>
            ))}
          </div>
          <div style={{ marginTop: 12, background: "#E0F7E9", border: `2px solid ${C2}66`, borderRadius: 12, padding: "10px 14px", fontSize: 13, color: "#2D7A4F", fontWeight: "bold" }}>
            🗣 声に出して5回読もう！
          </div>
        </Card>
      )}

      {/* NEGATION slide */}
      {slide.type === "negation" && (
        <Card color={C2} style={{ background: "#F0FFF4" }}>
          {slide.examples.map((ex, i) => (
            <div key={i} style={{ background: "white", borderRadius: 12, padding: "10px 12px", marginBottom: 8, border: `2px solid ${C2}44` }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 8 }}>
                <div style={{ flex: 1 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 3 }}>
                    <span style={{ background: ex.label === "否定" ? C.coral : C.blue, color: "white", fontSize: 10, fontWeight: "bold", borderRadius: 99, padding: "2px 8px" }}>{ex.label}</span>
                    <span style={{ fontSize: 15, fontWeight: "bold", color: C.dark }}>{ex.es}</span>
                  </div>
                  <div style={{ fontSize: 12, color: C.muted }}>{ex.jp}</div>
                </div>
                <button onClick={() => speakText(ex.es)}
                  style={{ background: C2, border: "none", borderRadius: 99, padding: "6px 12px", color: "white", cursor: "pointer", fontSize: 12, fontWeight: "bold", fontFamily: "inherit", flexShrink: 0 }}>🔊</button>
              </div>
            </div>
          ))}
        </Card>
      )}

      {/* Navigation */}
      <div style={{ display: "flex", gap: 10, marginTop: 4 }}>
        {step > 0 && (
          <Btn onClick={() => setStep(s => s - 1)} color={C.muted} style={{ flex: 1 }}>← 戻る</Btn>
        )}
        {step < total - 1 ? (
          <Btn onClick={() => setStep(s => s + 1)} color={C2} style={{ flex: 2 }}>次へ →</Btn>
        ) : (
          <Btn onClick={onDone} color={C.green} style={{ flex: 2, fontSize: 15, padding: 16 }}>✓ 講座完了！単語カードへ 🎉</Btn>
        )}
      </div>
    </div>
  );
}

// ─── VERB LESSON PHASE ───────────────────────────────────────────────────────

function VerbLessonPhase({ stage, onDone }) {
  const verbs = stage.vocab.filter(v => v.conj);
  const [step, setStep] = useState(0); // 0=導入, 1〜N=各動詞

  const totalSteps = verbs.length + 1; // 導入 + 各動詞
  const isIntro = step === 0;
  const verb = isIntro ? null : verbs[step - 1];

  const pronounColors = ["#1E88E5","#1565C0","#64B5F6","#00897B","#4D96FF","#5C6BC0"];

  return (
    <div>
      {/* progress */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
        <span style={{ fontSize: 13, fontWeight: "bold", color: "#1565C0" }}>🎓 動詞講座 {step + 1}/{totalSteps}</span>
        <div style={{ display: "flex", gap: 4 }}>
          {Array.from({ length: totalSteps }).map((_, i) => (
            <div key={i} style={{ width: i === step ? 20 : 8, height: 8, borderRadius: 99, background: i < step ? C.green : i === step ? "#1565C0" : "#DDD", transition: "all 0.3s" }} />
          ))}
        </div>
      </div>

      {/* 導入スライド */}
      {isIntro && (
        <div>
          <Card color="#1565C0" style={{ background: "#EEF4FF", textAlign: "center", padding: "2rem 1rem" }}>
            <div style={{ fontSize: 40, marginBottom: 12 }}>📚</div>
            <div style={{ fontSize: 20, fontWeight: "bold", color: C.dark, marginBottom: 12 }}>スペイン語の動詞活用</div>
            <div style={{ fontSize: 14, color: C.muted, lineHeight: 1.8, textAlign: "left" }}>
              スペイン語の動詞は<span style={{ color: "#1565C0", fontWeight: "bold" }}>主語によって形が変わります</span>。<br /><br />
              英語では "I go / You go / He goes" と3人称単数だけ変わりますが、スペイン語では<span style={{ color: "#1565C0", fontWeight: "bold" }}>6つ全部</span>変わります！<br /><br />
              でも大丈夫。A1では<span style={{ color: "#1565C0", fontWeight: "bold" }}>yo（私）とtú（あなた）</span>だけ覚えれば会話できます。
            </div>
          </Card>
          <Card color="#1565C0" style={{ background: "#EEF4FF" }}>
            <div style={{ fontSize: 13, fontWeight: "bold", color: "#1565C0", marginBottom: 10 }}>6つの主語（代名詞）</div>
            {[
              ["yo", "私", "I"],
              ["tú", "あなた", "you"],
              ["él / ella", "彼 / 彼女", "he / she"],
              ["nosotros", "私たち", "we"],
              ["vosotros", "あなたたち（スペイン）", "you all"],
              ["ellos / ellas", "彼ら / 彼女ら", "they"],
            ].map(([es, jp, en], i) => (
              <div key={i} style={{ display: "flex", alignItems: "center", gap: 10, padding: "8px 0", borderBottom: i < 5 ? "1px solid #F0F0F0" : "none" }}>
                <div style={{ width: 10, height: 10, borderRadius: "50%", background: pronounColors[i], flexShrink: 0 }} />
                <span style={{ fontSize: 15, fontWeight: "bold", color: C.dark, minWidth: 90 }}>{es}</span>
                <span style={{ fontSize: 13, color: C.muted }}>{jp}（{en}）</span>
              </div>
            ))}
          </Card>
        </div>
      )}

      {/* 各動詞スライド */}
      {!isIntro && verb && (
        <div>
          <Card color="#1565C0" style={{ background: "#EEF4FF", textAlign: "center", padding: "1.5rem 1rem" }}>
            <div style={{ fontSize: 28, fontWeight: "bold", color: C.dark, marginBottom: 4 }}>{verb.es}</div>
            <div style={{ fontSize: 18, color: "#1565C0", marginBottom: 6 }}>{verb.jp}</div>
            <div style={{ fontSize: 13, color: C.muted, lineHeight: 1.6 }}>{verb.desc}</div>
          </Card>

          {/* 活用表 */}
          <Card color="#1565C0" style={{ background: "#EEF4FF", padding: "14px" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 10 }}>
              <div style={{ fontSize: 13, fontWeight: "bold", color: "#1565C0" }}>現在形の活用</div>
              <div style={{ fontSize: 11, color: C.muted, background: "#BBDEFB", borderRadius: 99, padding: "3px 10px" }}>vosotros は省略</div>
            </div>
            <ConjTable conj={verb.conj} pronounColors={pronounColors} />
            <div style={{ marginTop: 12, background: "#E3F2FD", border: "2px solid #FFD0A0", borderRadius: 12, padding: "10px 14px", fontSize: 13, color: "#993C1D", lineHeight: 1.6 }}>
              🗣 <span style={{ fontWeight: "bold" }}>声に出して5回読もう！</span><br />
              🔊ボタンを押しながら、各活用形を5回ずつ声に出して練習してください。
            </div>
          </Card>

          {/* 例文 */}
          {verb.ex && (
            <Card color="#1565C0" style={{ background: "#EEF4FF" }}>
              <div style={{ fontSize: 13, fontWeight: "bold", color: "#1565C0", marginBottom: 4 }}>例文で覚えよう 💡</div>
              <div style={{ fontSize: 12, color: C.muted, marginBottom: 10 }}>🗣 各例文を声に出して5回読んでみましょう！</div>
              {verb.ex.map((e, i) => {
                const lastOpen = e.lastIndexOf("（");
                const es_part = lastOpen > 0 ? e.slice(0, lastOpen).trim() : e.trim();
                const jp_part = lastOpen > 0 ? e.slice(lastOpen + 1).replace(/）$/, "").trim() : "";
                return (
                  <div key={i} style={{ background: "white", borderRadius: 10, padding: "10px 12px", marginBottom: 8, border: "2px solid #FFE0C0" }}>
                    <div style={{ display: "flex", justifyContent: "space-between", gap: 8 }}>
                      <div style={{ flex: 1 }}>
                        <div style={{ fontSize: 14, fontWeight: "bold", color: C.dark, marginBottom: 3 }}>{es_part}</div>
                        {jp_part && <div style={{ fontSize: 12, color: C.muted }}>{jp_part}</div>}
                      </div>
                      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 2, flexShrink: 0 }}>
                        <button onClick={() => speakText(es_part)} style={{ background: "#1565C0", border: "none", borderRadius: 99, padding: "5px 10px", color: "white", cursor: "pointer", fontSize: 12, fontWeight: "bold", fontFamily: "inherit" }}>🔊×5</button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </Card>
          )}
        </div>
      )}

      <div style={{ display: "flex", gap: 10 }}>
        {step > 0 && (
          <Btn onClick={() => setStep(s => s - 1)} color={C.muted} style={{ flex: 1 }}>← 戻る</Btn>
        )}
        {step < totalSteps - 1 ? (
          <Btn onClick={() => setStep(s => s + 1)} color="#1565C0" style={{ flex: 2 }}>次へ →</Btn>
        ) : (
          <Btn onClick={onDone} color={C.green} style={{ flex: 2, fontSize: 15, padding: 16 }}>✓ 講座完了！単語カードへ 🎉</Btn>
        )}
      </div>
    </div>
  );
}






// ─── MAIN APP ─────────────────────────────────────────────────────────────────

export default function App() {
  const [screen, setScreen]         = useState("map");
  const [stageIdx, setStageIdx]     = useState(0);
  const [phase, setPhase]           = useState("cards");
  const [totalXp, setTotalXp]       = useState(0);
  const [clearedStages, setClearedStages] = useState(new Set());
  const [xpToast, setXpToast]       = useState(null);
  const [allCleared, setAllCleared] = useState(false);
  const [notifStatus, setNotifStatus] = useState(null);
  const [loaded, setLoaded]         = useState(false);
  const [phaseSelectIdx, setPhaseSelectIdx] = useState(null);
  const [showWelcome, setShowWelcome] = useState(false);
  const [showResetConfirm, setShowResetConfirm] = useState(false);
  const [showAdminLogin, setShowAdminLogin] = useState(false);
  const [adminPass, setAdminPass]   = useState("");
  const [adminError, setAdminError] = useState(false);
  const [isAdmin, setIsAdmin]       = useState(false);

  useEffect(() => {
    (async () => {
      try {
        let d = null;
        if (window.storage) {
          // claude.ai環境
          const saved = await window.storage.get("progress");
          if (saved) d = JSON.parse(saved.value);
        } else {
          // Vercel等の通常ブラウザ環境 → localStorage使用
          const saved = localStorage.getItem("tmx_progress");
          if (saved) d = JSON.parse(saved);
        }
        if (d) {
          if (d.totalXp)       setTotalXp(d.totalXp);
          if (d.clearedStages) setClearedStages(new Set(d.clearedStages));
          if (d.allCleared)    setAllCleared(d.allCleared);
          if (d.notifStatus)   setNotifStatus(d.notifStatus);
          if (!d.welcomeSeen)  setShowWelcome(true);
        } else {
          setShowWelcome(true);
        }
      } catch (_) { setShowWelcome(true); }
      setLoaded(true);
    })();
  }, []);

  useEffect(() => {
    if (!loaded) return;
    (async () => {
      try {
        const data = JSON.stringify({ totalXp, clearedStages: [...clearedStages], allCleared, notifStatus, welcomeSeen: true });
        if (window.storage) {
          await window.storage.set("progress", data);
        } else {
          localStorage.setItem("tmx_progress", data);
        }
      } catch (_) {}
    })();
  }, [totalXp, clearedStages, allCleared, notifStatus, loaded]);

  const gainXp = (n) => { setTotalXp(p => p + n); setXpToast(n); };

  const handleAdminLogin = () => {
    if (adminPass === "tsksipuedo") {
      setIsAdmin(true);
      setShowAdminLogin(false);
      setAdminPass("");
      setAdminError(false);
      const allStages = new Set(STAGES.map((_, i) => i));
      setClearedStages(allStages);
      setAllCleared(true);
    } else {
      setAdminError(true);
      setAdminPass("");
    }
  };

  const adminTapCount = useRef(0);
  const adminTapTimer = useRef(null);
  const handleAdminTap = () => {
    adminTapCount.current += 1;
    clearTimeout(adminTapTimer.current);
    if (adminTapCount.current >= 5) {
      adminTapCount.current = 0;
      setShowAdminLogin(true);
    } else {
      adminTapTimer.current = setTimeout(() => { adminTapCount.current = 0; }, 2000);
    }
  };

  const openStage = (idx) => {
    if (clearedStages.has(idx)) { setPhaseSelectIdx(idx); }
    else { setStageIdx(idx); setPhase(STAGES[idx].vocab.some(v => v.conj) || STAGES[idx].lesson ? "lesson" : "cards"); setScreen("stage"); }
  };
  const openStagePhase = (idx, ph) => { setPhaseSelectIdx(null); setStageIdx(idx); setPhase(ph); setScreen("stage"); };
  const resetProgress = async () => {
    setTotalXp(0); setClearedStages(new Set()); setAllCleared(false); setNotifStatus(null); setIsAdmin(false);
    try {
      if (window.storage) { await window.storage.delete("progress"); }
      else { localStorage.removeItem("tmx_progress"); }
    } catch (_) {}
  };

  const completeStage = () => {
    gainXp(100);
    const newCleared = new Set([...clearedStages, stageIdx]);
    setClearedStages(newCleared);
    if (newCleared.size === STAGES.length && !allCleared) {
      setAllCleared(true);
      sendGmailNotification(newCleared.size, totalXp + 100).then(ok => setNotifStatus(ok ? "sent" : "error"));
    }
    setTimeout(() => setScreen("map"), 400);
  };

  if (!loaded) return (
    <div style={{ minHeight: "100vh", background: "#F0F4FF", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", fontFamily: "inherit" }}>
      <div style={{ fontSize: 48, marginBottom: 16 }}>🇪🇸</div>
      <div style={{ fontSize: 16, color: "#9A9A9A" }}>読み込み中...</div>
    </div>
  );

  // ── ウェルカム画面 ─────────────────────────────────────────────────────────
  if (showWelcome) return (
    <div style={{ minHeight: "100vh", background: "linear-gradient(160deg, #0D47A1 0%, #1565C0 40%, #1976D2 100%)", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "2rem", fontFamily: "'Helvetica Neue', Arial, sans-serif" }}>
      <div style={{ maxWidth: 420, width: "100%", textAlign: "center" }}>
        <div style={{ fontSize: 72, marginBottom: 8 }}>🇪🇸</div>
        <div style={{ fontSize: 13, color: "rgba(255,255,255,0.8)", fontWeight: "bold", letterSpacing: 2, marginBottom: 4 }}>DELE A1 スペイン語</div>
        <div style={{ fontSize: 26, fontWeight: "bold", color: "white", marginBottom: 28, textShadow: "0 2px 8px rgba(0,0,0,0.15)" }}>エピソード 1</div>
        <div style={{ background: "white", borderRadius: 24, padding: "28px 24px", marginBottom: 24, boxShadow: "0 8px 32px rgba(0,0,0,0.12)" }}>
          <div style={{ fontSize: 20, marginBottom: 12 }}>👋</div>
          <div style={{ fontSize: 20, fontWeight: "bold", color: "#2D2D2D", marginBottom: 16 }}>関口さん、<br />こんにちは！</div>
          <div style={{ fontSize: 15, color: "#666", lineHeight: 1.8, marginBottom: 20 }}>
            このアプリはあなたのために作りました。<br /><br />
            スペイン語A1合格に向けて、<br />一緒にがんばりましょう！<br /><br />
            <span style={{ color: "#1E88E5", fontWeight: "bold" }}>¡Tú puedes!</span><br />
            <span style={{ fontSize: 13, color: "#999" }}>（あなたならできる！）</span>
          </div>
          <div style={{ background: "#EEF4FF", border: "2px solid #FFE0C0", borderRadius: 14, padding: "12px 16px", fontSize: 13, color: "#993C1D", lineHeight: 1.7 }}>
            📖 挨拶・基本 → 🏃 基本動詞<br />
            🙋 自己紹介 → 📅 月・季節<br />
            <span style={{ fontSize: 12, color: "#999" }}>全4ステージ収録</span>
          </div>
        </div>
        <button onClick={() => setShowWelcome(false)}
          style={{ width: "100%", padding: "18px", borderRadius: 18, border: "none", background: "white", color: "#1E88E5", fontSize: 18, fontWeight: "bold", cursor: "pointer", fontFamily: "inherit", boxShadow: "0 6px 0 rgba(0,0,0,0.1)" }}>
          ¡Vamos! はじめよう 🚀
        </button>
        <div style={{ marginTop: 16, fontSize: 12, color: "rgba(255,255,255,0.7)" }}>ダニエルより愛をこめて ❤️</div>
      </div>
    </div>
  );

  // ── 管理者ログイン ─────────────────────────────────────────────────────────
  if (showAdminLogin) return (
    <div style={{ minHeight: "100vh", background: "#0D1B3E", display: "flex", alignItems: "center", justifyContent: "center", padding: "2rem", fontFamily: "inherit" }}>
      <div style={{ background: "#1A2F5E", borderRadius: 24, padding: "32px 24px", maxWidth: 340, width: "100%", textAlign: "center", border: "2px solid rgba(199,125,255,0.3)" }}>
        <div style={{ fontSize: 48, marginBottom: 12 }}>🔐</div>
        <div style={{ fontSize: 20, fontWeight: "bold", color: "white", marginBottom: 6 }}>管理者ログイン</div>
        <div style={{ fontSize: 13, color: "rgba(255,255,255,0.4)", marginBottom: 24 }}>Admin Access Only</div>
        <input type="password" value={adminPass}
          onChange={e => { setAdminPass(e.target.value); setAdminError(false); }}
          onKeyDown={e => e.key === "Enter" && handleAdminLogin()}
          placeholder="パスワードを入力" autoFocus
          style={{ width: "100%", padding: "14px 16px", borderRadius: 14, border: `2px solid ${adminError ? "#1E88E5" : "rgba(199,125,255,0.3)"}`, background: "rgba(255,255,255,0.06)", color: "white", fontSize: 16, fontFamily: "inherit", outline: "none", boxSizing: "border-box", marginBottom: 8, textAlign: "center", letterSpacing: 2 }}
        />
        {adminError && <div style={{ fontSize: 13, color: "#1E88E5", marginBottom: 10 }}>❌ パスワードが違います</div>}
        <div style={{ display: "flex", gap: 10, marginTop: 8 }}>
          <button onClick={() => { setShowAdminLogin(false); setAdminPass(""); setAdminError(false); }}
            style={{ flex: 1, padding: "13px", borderRadius: 14, border: "2px solid rgba(255,255,255,0.15)", background: "transparent", color: "rgba(255,255,255,0.6)", fontSize: 14, cursor: "pointer", fontFamily: "inherit" }}>キャンセル</button>
          <button onClick={handleAdminLogin}
            style={{ flex: 1, padding: "13px", borderRadius: 14, border: "none", background: "linear-gradient(90deg,#C77DFF,#4D96FF)", color: "white", fontSize: 14, fontWeight: "bold", cursor: "pointer", fontFamily: "inherit" }}>ログイン</button>
        </div>
      </div>
    </div>
  );

  // ── リセット確認 ───────────────────────────────────────────────────────────
  if (showResetConfirm) return (
    <div style={{ minHeight: "100vh", background: "rgba(0,0,0,0.6)", display: "flex", alignItems: "center", justifyContent: "center", padding: "2rem", fontFamily: "inherit" }}>
      <div style={{ background: "white", borderRadius: 24, padding: "28px 24px", maxWidth: 340, width: "100%", textAlign: "center", boxShadow: "0 12px 40px rgba(0,0,0,0.2)" }}>
        <div style={{ fontSize: 48, marginBottom: 12 }}>⚠️</div>
        <div style={{ fontSize: 18, fontWeight: "bold", color: "#2D2D2D", marginBottom: 10 }}>進捗をリセットしますか？</div>
        <div style={{ fontSize: 14, color: "#9A9A9A", marginBottom: 24, lineHeight: 1.6 }}>TMXポイント・クリア記録がすべて消えます。<br />この操作は元に戻せません。</div>
        <div style={{ display: "flex", gap: 10 }}>
          <button onClick={() => setShowResetConfirm(false)}
            style={{ flex: 1, padding: "14px", borderRadius: 14, border: "3px solid #EEE", background: "white", color: "#9A9A9A", fontSize: 15, fontWeight: "bold", cursor: "pointer", fontFamily: "inherit" }}>キャンセル</button>
          <button onClick={() => { setShowResetConfirm(false); resetProgress(); }}
            style={{ flex: 1, padding: "14px", borderRadius: 14, border: "none", background: "#1E88E5", color: "white", fontSize: 15, fontWeight: "bold", cursor: "pointer", fontFamily: "inherit", boxShadow: "0 4px 0 #CC4444" }}>リセット</button>
        </div>
      </div>
    </div>
  );

  const stage = STAGES[stageIdx];
  const phaseIdx = PHASE_ORDER.indexOf(phase);

  // ── フェーズ選択（復習） ───────────────────────────────────────────────────
  if (phaseSelectIdx !== null) {
    const s = STAGES[phaseSelectIdx];
    return (
      <div style={{ minHeight: "100vh", background: "#F0F4FF", fontFamily: "'Helvetica Neue', Arial, sans-serif" }}>
        <div style={{ background: s.color, padding: "20px 18px", borderRadius: "0 0 28px 28px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <button onClick={() => setPhaseSelectIdx(null)} style={{ background: "rgba(255,255,255,0.25)", border: "none", borderRadius: 99, width: 36, height: 36, color: "white", fontSize: 18, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}>←</button>
            <div style={{ fontWeight: "bold", fontSize: 18, color: "white" }}>{s.emoji} {s.title}</div>
          </div>
          <div style={{ marginTop: 10, fontSize: 13, color: "rgba(255,255,255,0.8)", textAlign: "center" }}>どこから復習する？🎯</div>
        </div>
        <div style={{ padding: 18 }}>
          {PHASE_ORDER.filter(ph => ph !== "lesson" || STAGES[phaseSelectIdx].vocab.some(v => v.conj) || STAGES[phaseSelectIdx].lesson).map((ph) => (
            <div key={ph} onClick={() => openStagePhase(phaseSelectIdx, ph)}
              style={{ display: "flex", alignItems: "center", gap: 14, background: "white", border: `3px solid ${PHASE_COLORS[ph]}44`, borderRadius: 20, padding: "14px 16px", marginBottom: 12, cursor: "pointer", boxShadow: `0 4px 0 ${PHASE_COLORS[ph]}33` }}>
              <div style={{ width: 46, height: 46, borderRadius: "50%", background: PHASE_COLORS[ph], display: "flex", alignItems: "center", justifyContent: "center", fontSize: 20, flexShrink: 0 }}>
                {PHASE_LABELS[ph].split(" ")[0]}
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ fontWeight: "bold", fontSize: 15, color: "#2D2D2D" }}>{PHASE_LABELS[ph]}</div>
                <div style={{ fontSize: 12, color: "#9A9A9A", marginTop: 2 }}>
                  {ph === "lesson" ? "動詞活用の講座を見る" : ph === "cards" ? `単語${STAGES[phaseSelectIdx].vocab.length}語をフラッシュカードで` : ph === "handwriting" ? `${STAGES[phaseSelectIdx].vocab.length}語を手書き練習` : ph === "vocabTest" ? "単語テスト" : ph === "phraseCards" ? `フレーズ${STAGES[phaseSelectIdx].phrases.length}文を確認` : ph === "phraseTest" ? "フレーズ穴埋めテスト" : "フレーズ発音練習"}
                </div>
              </div>
              <div style={{ color: PHASE_COLORS[ph], fontSize: 20, fontWeight: "bold" }}>→</div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  // ── マップ画面 ──────────────────────────────────────────────────────────────
  if (screen === "map") return (
    <div style={{ minHeight: "100vh", background: "#F0F4FF", fontFamily: "'Helvetica Neue', Arial, sans-serif" }}>
      <style>{`@keyframes floatUp{0%{opacity:1;transform:translate(-50%,-50%)}100%{opacity:0;transform:translate(-50%,-160%)}}`}</style>
      {xpToast && <XPToast amount={xpToast} onDone={() => setXpToast(null)} />}

      {/* Header */}
      <div style={{ background: `linear-gradient(135deg, #FF6B6B, #FF8E3C)`, padding: "24px 18px 32px", borderRadius: "0 0 32px 32px" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 14 }}>
          <div>
            <div style={{ fontSize: 12, color: "rgba(255,255,255,0.8)", fontWeight: "bold", letterSpacing: 1 }}>
              🇪🇸 DELE A1 — エピソード 1 {isAdmin && <span style={{ fontSize: 10, color: "#64B5F6" }}>👑 ADMIN</span>}
            </div>
            <div style={{ fontSize: 28, fontWeight: "bold", color: "white", marginTop: 2 }}>🔵 {totalXp} TMXポイント</div>
          </div>
          <div style={{ textAlign: "right" }}>
            <div onClick={handleAdminTap}
              style={{ background: "rgba(255,255,255,0.25)", borderRadius: 16, padding: "8px 14px", color: "white", fontWeight: "bold", fontSize: 15, cursor: "pointer", userSelect: "none" }}>
              {clearedStages.size}/{STAGES.length} クリア 🏆
            </div>
            <button onClick={() => setShowResetConfirm(true)} style={{ marginTop: 6, background: "none", border: "1px solid rgba(255,255,255,0.4)", borderRadius: 99, padding: "4px 12px", color: "rgba(255,255,255,0.7)", cursor: "pointer", fontSize: 11, fontFamily: "inherit" }}>↺ リセット</button>
          </div>
        </div>
        <div style={{ background: "rgba(255,255,255,0.3)", borderRadius: 99, height: 10, overflow: "hidden" }}>
          <div style={{ height: 10, borderRadius: 99, background: "white", width: `${Math.round(clearedStages.size / STAGES.length * 100)}%`, transition: "width 0.6s" }} />
        </div>
      </div>

      {allCleared && (
        <div style={{ margin: "16px 18px 0", background: "#F0FFF4", border: `3px solid #6BCB77`, borderRadius: 20, padding: "14px 16px", textAlign: "center" }}>
          <div style={{ fontWeight: "bold", fontSize: 16, color: "#00897B" }}>🎉 全ステージクリア！¡Felicidades!</div>
          <div style={{ fontSize: 13, color: "#9A9A9A", marginTop: 4 }}>¡Tú puedes! — DELE A1合格目指してがんばろう！</div>
        </div>
      )}

      {/* 学習サイクル */}
      <div style={{ margin: "18px 18px 0", background: "white", border: "3px solid #EEE", borderRadius: 20, padding: "14px" }}>
        <div style={{ fontSize: 11, fontWeight: "bold", color: "#9A9A9A", letterSpacing: 1, marginBottom: 10 }}>学習サイクル</div>
        <div style={{ display: "flex", alignItems: "center", overflowX: "auto", gap: 0 }}>
          {["📖 単語", "→", "✏️ 手書き", "→", "✅ テスト", "→", "📝 フレーズ", "→", "💬 練習"].map((s, i) => (
            <div key={i} style={{ flexShrink: 0, textAlign: "center", color: s === "→" ? "#CCC" : "#2D2D2D", fontSize: s === "→" ? 14 : 11, padding: "0 4px", fontWeight: s === "→" ? "normal" : "bold" }}>{s}</div>
          ))}
        </div>
        <div style={{ fontSize: 11, color: "#9A9A9A", marginTop: 8 }}>※ テスト不合格 → 手書きに戻る（80%以上で合格）</div>
      </div>

      {/* Stage cards */}
      <div style={{ padding: "18px 18px 32px" }}>
        <div style={{ fontSize: 12, fontWeight: "bold", color: "#9A9A9A", letterSpacing: 1, marginBottom: 12 }}>STAGES</div>
        {STAGES.map((s, i) => {
          const cleared = clearedStages.has(i), locked = i > 0 && !clearedStages.has(i - 1);
          return (
            <div key={s.id} onClick={() => !locked && openStage(i)} style={{
              display: "flex", alignItems: "center", gap: 14,
              background: cleared ? "#F0FFF4" : "white",
              border: `3px solid ${cleared ? "#00897B" : locked ? "#DDD" : s.color}`,
              borderRadius: 22, padding: 16, marginBottom: 14,
              cursor: locked ? "not-allowed" : "pointer",
              opacity: locked ? 0.5 : 1,
              boxShadow: locked ? "none" : `0 5px 0 ${cleared ? "#00897B" : s.color}44`,
            }}>
              <div style={{ width: 58, height: 58, borderRadius: "50%", flexShrink: 0, background: cleared ? "#00897B" : locked ? "#EEE" : s.color, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 28, boxShadow: locked ? "none" : `0 4px 0 ${cleared ? "#00897B" : s.color}88` }}>
                {locked ? "🔒" : cleared ? "✅" : s.emoji}
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ fontWeight: "bold", fontSize: 16, color: "#2D2D2D" }}>{s.title}</div>
                <div style={{ fontSize: 12, color: "#9A9A9A", marginTop: 3 }}>
                  {locked ? "前のステージをクリアしよう 🔒" : cleared ? "タップしてフェーズを選んで復習できます ✨" : `単語${s.vocab.length}語・フレーズ${s.phrases.length}文`}
                </div>
              </div>
              {!locked && (
                <div style={{ background: cleared ? "#00897B" : s.color, color: "white", borderRadius: 99, padding: "5px 14px", fontSize: 12, fontWeight: "bold", flexShrink: 0 }}>
                  {cleared ? "DONE ✓" : "+100P"}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );

  // ── ステージ画面 ────────────────────────────────────────────────────────────
  return (
    <div style={{ minHeight: "100vh", background: "#F0F4FF", fontFamily: "'Helvetica Neue', Arial, sans-serif" }}>
      <style>{`@keyframes floatUp{0%{opacity:1;transform:translate(-50%,-50%)}100%{opacity:0;transform:translate(-50%,-160%)}}`}</style>
      {xpToast && <XPToast amount={xpToast} onDone={() => setXpToast(null)} />}

      <div style={{ background: stage.color, padding: "16px 18px 24px", borderRadius: "0 0 28px 28px" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 14 }}>
          <button onClick={() => setScreen("map")} style={{ background: "rgba(255,255,255,0.25)", border: "none", borderRadius: 99, width: 36, height: 36, color: "white", fontSize: 18, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}>←</button>
          <div style={{ flex: 1, fontWeight: "bold", fontSize: 17, color: "white" }}>{stage.emoji} {stage.title}</div>
          <div style={{ background: "rgba(255,255,255,0.2)", borderRadius: 99, padding: "5px 14px", color: "white", fontWeight: "bold", fontSize: 14 }}>🔵 {totalXp} P</div>
        </div>
        <div style={{ display: "flex", gap: 4 }}>
          {PHASE_ORDER.map((p, i) => (
            <div key={p} style={{ flex: 1, textAlign: "center" }}>
              <div style={{ height: 6, borderRadius: 99, background: i < phaseIdx ? "rgba(255,255,255,0.9)" : i === phaseIdx ? "white" : "rgba(255,255,255,0.3)", marginBottom: 4, boxShadow: i === phaseIdx ? "0 0 8px white" : "none", transition: "all 0.4s" }} />
              <div style={{ fontSize: 8, color: i <= phaseIdx ? "rgba(255,255,255,0.95)" : "rgba(255,255,255,0.45)", whiteSpace: "nowrap", overflow: "hidden", fontWeight: "bold" }}>
                {PHASE_LABELS[p].split(" ")[0]}
              </div>
            </div>
          ))}
        </div>
      </div>

      <div style={{ padding: 16 }}>
        {phase === "lesson"      && (
          stage.vocab.some(v => v.conj)
            ? <VerbLessonPhase stage={stage} onDone={() => setPhase("cards")} />
            : <GenericLessonPhase stage={stage} onDone={() => setPhase("cards")} />
        )}
        {phase === "cards"       && <FlashcardPhase  stage={stage} onDone={() => setPhase("handwriting")} />}
        {phase === "handwriting" && <HandwritingPhase stage={stage} onDone={() => setPhase("vocabTest")} />}
        {phase === "vocabTest"   && <VocabTestPhase  stage={stage} onPass={() => { gainXp(20); setPhase("phraseCards"); }} onRetryCards={() => setPhase("handwriting")} />}
        {phase === "phraseCards" && <PhraseCardPhase stage={stage} onDone={() => setPhase("phraseTest")} />}
        {phase === "phraseTest"  && <PhraseTestPhase stage={stage} onPass={() => { gainXp(30); setPhase("chat"); }} onRetryCards={() => setPhase("phraseCards")} />}
        {phase === "chat"        && <ChatPhase       stage={stage} onComplete={completeStage} alreadyCleared={clearedStages.has(stageIdx)} />}
      </div>
    </div>
  );
}
