/*
 * AURA TAROT — 카드 해석 데이터베이스 (분리 DB)
 * 출처: A. E. Waite, 『The Pictorial Key to the Tarot』(1911, 퍼블릭 도메인) 한국어 완역본
 *   - upright/reversed: 제3부 §3 「대아르카나와 그 점술적 의미」
 *   - symbol         : 제2부 §2 「메이저 트럼프와 그 내면적 상징주의」
 * 카드 이미지: Wikimedia Commons (Rider–Waite–Smith, 삽화 Pamela Colman Smith, 퍼블릭 도메인)
 *
 * [해석 조립 구조]
 *   1) 해석부(head)  = tones[].template : 도입부(말투) + 키워드/상징(명사구) + {orientNote}
 *   2) 코칭부         = tones[].coachUp/coachDown 에 focus[category][up|down] 를 끼워 넣음
 *   → 분야 × 정/역방향 × 연령대 말투로 변주.
 *
 * [표현 다양화] orientNoteUp/Down, coachUp/coachDown 은 '여러 표현의 배열'이다.
 *   composeReading()의 pickOne()이 매 리딩마다 배열에서 하나를 무작위로 골라 뿌린다.
 *   (문자열 하나만 넣어도 하위 호환으로 동작한다.)
 *
 * [어조 설계] meaning / symbol / focus 는 '말투 없는 명사구'로만 저장한다.
 *   focus 는 반드시 '~것'(명사형)으로 끝내 "{focus}이/으로" 조사와 자연스럽게 잇는다.
 *
 * 내용은 순수 JSON 구조입니다. 로컬에서 HTML을 더블클릭으로 열어도 동작하도록
 * (file:// 환경의 fetch 제약 회피) 전역 변수에 담아 두었습니다.
 */
window.TAROT_DECK = {
  "meta": {
    "source": "A. E. Waite, The Pictorial Key to the Tarot (1911), 한국어 완역본",
    "deck": "Rider–Waite–Smith Major Arcana (22)",
    "illustrator": "Pamela Colman Smith (1878–1951)"
  },

  "categories": {
    "relationship": "연애·관계",
    "career": "커리어·의사결정",
    "growth": "자기이해·성장",
    "finance": "재정(참고용)"
  },

  "// focus": "분야별 코칭 초점 — 정방향(up)/역방향(down), 반드시 '~것'으로 끝냄",
  "focus": {
    "relationship": {
      "up": "상대의 마음을 헤아리고 진심을 솔직하게 표현하는 것",
      "down": "서운함을 쌓아두기보다 오해를 먼저 차분히 풀어가는 것"
    },
    "career": {
      "up": "이 흐름을 구체적인 실행과 결정으로 옮기는 것",
      "down": "성급한 결정을 잠시 미루고 상황과 우선순위를 다시 점검하는 것"
    },
    "growth": {
      "up": "최근의 깨달음을 나만의 습관과 리듬으로 만들어 가는 것",
      "down": "자신을 몰아세우기보다 내면의 소리에 먼저 귀 기울이는 것"
    },
    "finance": {
      "up": "빠른 기회를 좇기보다 안정적인 계획을 차근히 다지는 것",
      "down": "무리한 지출이나 결정을 삼가고 여유 자금을 확보하는 것"
    }
  },

  "tones": {
    "10-20s": {
      "badge": "10대~20대 초반 · 친근/공감형 톤",
      "template": "{ctx} 고민으로 뽑은 '{name}', {orient}으로 나왔어! 🌟 이 카드는 {meaningEul} 말해주고 있어. 원래 이 카드는 {symbolEul} 상징하거든. {orientNote}",
      "orientNoteUp": [
        "지금은 이 기운이 너에게 활짝 열려 있는 느낌이야.",
        "이 카드의 좋은 에너지가 지금 너 쪽으로 흐르고 있어.",
        "지금은 이 기운이 제법 순하게 너를 밀어주는 때야."
      ],
      "orientNoteDown": [
        "다만 지금은 그 기운이 살짝 막혀 있거나 안으로 감춰진 상태야.",
        "지금은 이 힘이 제 모습을 다 못 내고 잠깐 숨어 있는 느낌이야.",
        "지금은 그 에너지가 밖보다 안쪽으로 향하고 있는 것 같아."
      ],
      "coachUp": [
        "지금은 {focus}이 특히 힘이 될 거야. 마음이 이끄는 대로 작은 것부터 하나씩 해보자 — 넌 충분히 잘하고 있어!",
        "{focus}, 그거 하나면 충분해. 조급해할 것 없어 — 너의 속도로 가도 돼!",
        "지금 너한텐 {focus}이 딱이야. 겁내지 말고 딱 한 발만 내디뎌 보자 — 분명 좋아질 거야!",
        "{focus}에 집중해 봐. 작은 시도가 쌓이면 생각보다 멀리 갈 수 있어 — 내가 응원할게!"
      ],
      "coachDown": [
        "지금은 {focus}이 필요한 때야. 조급해하지 말고 방향만 살짝 바꿔보자 — 그래도 충분히 풀려!",
        "잠깐 숨 고르고 {focus}부터 해보자. 서두르지 않아도 돼 — 지금도 잘 가고 있어.",
        "{focus}이 지금은 더 중요해. 무리하지 말고 천천히, 너부터 먼저 챙기자.",
        "지금은 한 템포 쉬어도 괜찮아. {focus}에 마음을 두면 금방 실마리가 보일 거야."
      ]
    },
    "20-30s": {
      "badge": "20대~30대 · 신뢰감 있는 조언자 톤",
      "template": "{ctx} 측면에서 '{name}' 카드가 {orient}으로 나왔습니다. 이 카드는 {meaningEul} 의미하며, 본래 {symbolEul} 상징합니다. {orientNote}",
      "orientNoteUp": [
        "지금은 그 힘이 밖으로 순조롭게 발현되는 흐름입니다.",
        "이 카드의 기운이 지금은 제대로 힘을 내고 있습니다.",
        "지금은 그 에너지가 현실로 이어지기 좋은 국면입니다."
      ],
      "orientNoteDown": [
        "다만 역방향인 지금은 그 힘이 제 방향을 찾지 못하거나 안으로 향하고 있습니다.",
        "다만 지금은 그 기운이 겉으로 드러나지 못하고 안에서 맴도는 상태입니다.",
        "다만 지금은 그 힘이 온전히 발휘되기보다 잠시 지연되고 있습니다."
      ],
      "coachUp": [
        "지금은 {focus}이 성과로 이어집니다. 운에만 기대기보다 스스로의 판단과 실행을 더해 보시길 권합니다.",
        "지금 흐름에서는 {focus}이 결정적입니다. 작은 실행이라도 오늘부터 시작해 보세요.",
        "{focus}에 집중하면 지금의 기회를 온전히 살릴 수 있습니다. 방향은 이미 나쁘지 않습니다.",
        "지금은 {focus}이 가장 확실한 한 수입니다. 자신의 강점을 믿고 밀어붙여도 좋습니다."
      ],
      "coachDown": [
        "지금은 {focus}이 먼저입니다. 속도를 늦추고 원인을 점검하면 충분히 방향을 되돌릴 수 있습니다.",
        "무리한 전진보다 {focus}이 지금은 더 현명합니다. 한 박자 쉬어가며 정비해 보세요.",
        "지금은 {focus}에 무게를 두시길 권합니다. 서두른 결정은 잠시 미루는 편이 안전합니다.",
        "{focus}으로 기반을 다진 뒤 움직이면 리스크가 크게 줄어듭니다. 조급함만 내려놓으세요."
      ]
    },
    "40-50s": {
      "badge": "40대~50대 · 차분하고 정제된 문어체 톤",
      "template": "{ctx}의 흐름 속에서 '{name}' 카드가 {orient}으로 놓였습니다. 이 카드는 {meaningEul} 전하며, 오래도록 {symbolEul} 상징해 온 카드입니다. {orientNote}",
      "orientNoteUp": [
        "지금은 그 기운이 온전히 제 모습으로 드러나는 때입니다.",
        "이 카드의 기운이 지금은 바르게 흐르고 있습니다.",
        "지금은 그 힘이 오랜 흐름 끝에 제자리를 찾아가는 국면입니다."
      ],
      "orientNoteDown": [
        "다만 지금은 그 기운이 가려지거나 더디게 흐르고 있음을 살펴야 합니다.",
        "다만 지금은 그 힘이 제자리를 찾지 못하고 안으로 잠겨 있습니다.",
        "다만 지금은 그 기운이 온전히 드러나기까지 시간이 필요한 때입니다."
      ],
      "coachUp": [
        "지금은 {focus}이 오랜 흐름을 결실로 이끕니다. 중심을 지키며 신중히 나아가는 것이 지혜로울 것입니다.",
        "지금의 국면에서는 {focus}이 가장 단단한 토대가 됩니다. 서두르지 않아도 길은 열립니다.",
        "{focus}에 무게를 두실 때, 그동안의 노력이 비로소 모습을 드러낼 것입니다.",
        "지금은 {focus}이 방향을 밝혀 줍니다. 흔들림 없이 한 걸음씩 내디디시면 됩니다."
      ],
      "coachDown": [
        "지금은 {focus}이 요구되는 때입니다. 조급한 결정보다 한 걸음 물러나 기준을 다시 세우는 것이 좋겠습니다.",
        "지금은 {focus}에 마음을 두실 때입니다. 성급함을 내려놓으면 실마리가 분명해질 것입니다.",
        "무리한 변화보다 {focus}이 지금은 더 온당합니다. 잠시 흐름을 지켜보시길 권합니다.",
        "{focus}으로 내실을 다진 뒤 움직이셔도 늦지 않습니다. 조급함이 가장 큰 적입니다."
      ]
    },
    "60s+": {
      "badge": "60대 이상 · 존중어 기반의 명확한 톤",
      "template": "{ctx}에 관하여 '{name}' 카드가 {orient}으로 나왔습니다. 이 카드는 {meaningEul} 뜻하며, 예로부터 {symbolEul} 상징합니다. {orientNote}",
      "orientNoteUp": [
        "지금은 그 기운이 바르게 자리를 잡고 있습니다.",
        "이 카드의 기운이 지금은 순하게 흐르고 있습니다.",
        "지금은 그 힘이 편안하게 제 역할을 하고 있습니다."
      ],
      "orientNoteDown": [
        "다만 지금은 그 기운이 잠시 뒤로 물러나 있는 때입니다.",
        "다만 지금은 그 힘이 잠시 숨을 고르고 있는 듯합니다.",
        "다만 지금은 그 기운이 온전히 드러나기 전의 고요한 때입니다."
      ],
      "coachUp": [
        "지금은 {focus}이 큰 힘이 됩니다. 쌓아오신 경륜을 믿고 평안하게 이끌어 가시면 충분합니다.",
        "지금은 {focus}이 좋은 결실로 이어집니다. 마음 편히, 하시던 대로 이어가시면 됩니다.",
        "{focus}에 마음을 두시면 흐름이 한결 순조로워집니다. 서두르지 않으셔도 됩니다.",
        "지금은 {focus}이 든든한 버팀목이 됩니다. 지금의 평안을 그대로 지켜 가시길 바랍니다."
      ],
      "coachDown": [
        "지금은 {focus}이 필요한 시기입니다. 서두르지 않으셔도 되며, 주변을 살피시면 능히 헤쳐 나가실 수 있습니다.",
        "지금은 {focus}에 무게를 두실 때입니다. 무리하지 마시고 천천히 살펴 가시면 됩니다.",
        "잠시 걸음을 늦추고 {focus}부터 살피시길 권합니다. 조급함만 내려놓으시면 충분합니다.",
        "지금은 {focus}이 마음을 지켜 줍니다. 서두르지 마시고 편안히 때를 기다리셔도 좋습니다."
      ]
    }
  },

  "cards": [
    {
      "id": 0,
      "name": "00. THE FOOL (바보)",
      "img": "https://upload.wikimedia.org/wikipedia/commons/9/90/RWS_Tarot_00_Fool.jpg",
      "symbol": "물질 세계로 떠나는 영혼의 여정, 무한한 가능성과 수용성",
      "upright": "어리석음, 무모함, 무한한 가능성",
      "reversed": "성급한 결정, 낭비, 부주의"
    },
    {
      "id": 1,
      "name": "01. THE MAGICIAN (마술사)",
      "img": "https://upload.wikimedia.org/wikipedia/commons/d/de/RWS_Tarot_01_Magician.jpg",
      "symbol": "뜻을 현실에 구현하는 신성한 의지와 능동적 창조력의 매개자",
      "upright": "숙련, 외교, 수완, 기교, 자신감",
      "reversed": "정신적 불안정, 불명예, 동요"
    },
    {
      "id": 2,
      "name": "02. THE HIGH PRIESTESS (여교황)",
      "img": "https://upload.wikimedia.org/wikipedia/commons/8/88/RWS_Tarot_02_High_Priestess.jpg",
      "symbol": "베일에 싸인 지혜와 직관, 아직 드러나지 않은 비밀의 수호자",
      "upright": "비밀, 미지의 미래, 침묵, 지혜",
      "reversed": "감춰진 열정, 피상적 지식, 자만"
    },
    {
      "id": 3,
      "name": "03. THE EMPRESS (여제)",
      "img": "https://upload.wikimedia.org/wikipedia/commons/d/d2/RWS_Tarot_03_Empress.jpg",
      "symbol": "풍요와 생명력, 영적 구상이 물질로 만개하는 신성한 모성",
      "upright": "결실, 주도권, 오랜 지속, 풍요",
      "reversed": "드러나는 진실, 우유부단, 지체"
    },
    {
      "id": 4,
      "name": "04. THE EMPEROR (황제)",
      "img": "https://upload.wikimedia.org/wikipedia/commons/c/c3/RWS_Tarot_04_Emperor.jpg",
      "symbol": "세속적 질서와 체계, 합리적 통치력을 지닌 능동적 권위",
      "upright": "안정, 권력, 보호, 세속적 실현",
      "reversed": "관대함, 혼란의 완화, 미숙함"
    },
    {
      "id": 5,
      "name": "05. THE HIEROPHANT (교황)",
      "img": "https://upload.wikimedia.org/wikipedia/commons/8/8d/RWS_Tarot_05_Hierophant.jpg",
      "symbol": "영적 가르침의 전수자, 신성과 인간을 잇는 제도적 중재자",
      "upright": "결혼, 동맹, 인연, 영적 스승",
      "reversed": "사회적 화합, 관대함, 약함"
    },
    {
      "id": 6,
      "name": "06. THE LOVERS (연인)",
      "img": "https://upload.wikimedia.org/wikipedia/commons/3/3a/TheLovers.jpg",
      "symbol": "이원성의 조화와 신성한 결합, 영혼의 도덕적 선택",
      "upright": "끌림, 사랑, 극복된 시련",
      "reversed": "실패, 어긋난 계획, 좌절"
    },
    {
      "id": 7,
      "name": "07. THE CHARIOT (전차)",
      "img": "https://upload.wikimedia.org/wikipedia/commons/9/9b/RWS_Tarot_07_Chariot.jpg",
      "symbol": "순수한 의지력과 지성적 정복, 현상계에서의 승리",
      "upright": "구원, 섭리, 분투, 승리",
      "reversed": "소요, 다툼, 패배"
    },
    {
      "id": 8,
      "name": "08. STRENGTH (힘)",
      "img": "https://upload.wikimedia.org/wikipedia/commons/f/f5/RWS_Tarot_08_Strength.jpg",
      "symbol": "본능과 열정을 다스린 고차원적 자아의 온화한 힘",
      "upright": "권능, 행동, 용기, 관대함",
      "reversed": "독선, 나약함, 불화"
    },
    {
      "id": 9,
      "name": "09. THE HERMIT (은자)",
      "img": "https://upload.wikimedia.org/wikipedia/commons/4/4d/RWS_Tarot_09_Hermit.jpg",
      "symbol": "등불을 든 스승, 준비된 이에게 빛을 비추는 지혜의 달성",
      "upright": "신중, 경계, 지혜의 달성",
      "reversed": "은폐, 지나친 두려움, 무모함"
    },
    {
      "id": 10,
      "name": "10. WHEEL OF FORTUNE (운명의 바퀴)",
      "img": "https://upload.wikimedia.org/wikipedia/commons/3/3c/RWS_Tarot_10_Wheel_of_Fortune.jpg",
      "symbol": "영원한 우주의 순환과 신성한 섭리, 변화의 리듬",
      "upright": "운명, 행운, 큰 행운, 행복",
      "reversed": "과잉, 넘침, 흐름의 가속"
    },
    {
      "id": 11,
      "name": "11. JUSTICE (정의)",
      "img": "https://upload.wikimedia.org/wikipedia/commons/e/e0/RWS_Tarot_11_Justice.jpg",
      "symbol": "인과율의 공평한 적용, 도덕적·신성한 법칙의 균형",
      "upright": "공평, 청렴, 정당한 승리",
      "reversed": "법적 엄격함, 편견, 불공정"
    },
    {
      "id": 12,
      "name": "12. THE HANGED MAN (매달린 남자)",
      "img": "https://upload.wikimedia.org/wikipedia/commons/2/2b/RWS_Tarot_12_Hanged_Man.jpg",
      "symbol": "의식의 반전, 신성한 희생과 부활의 신비",
      "upright": "지혜, 신중, 직관, 희생",
      "reversed": "이기심, 헛된 예언, 집착"
    },
    {
      "id": 13,
      "name": "13. DEATH (죽음)",
      "img": "https://upload.wikimedia.org/wikipedia/commons/d/d7/RWS_Tarot_13_Death.jpg",
      "symbol": "하위에서 상위 차원으로의 변형, 재생과 부활",
      "upright": "종말, 변형, 새로운 시작",
      "reversed": "무기력, 정체, 지연"
    },
    {
      "id": 14,
      "name": "14. TEMPERANCE (절제)",
      "img": "https://upload.wikimedia.org/wikipedia/commons/f/f8/RWS_Tarot_14_Temperance.jpg",
      "symbol": "영혼과 육체의 조화, 원소들의 균형 잡힌 결합",
      "upright": "절제, 조화, 순응, 조합",
      "reversed": "불화, 갈등, 이해의 대립"
    },
    {
      "id": 15,
      "name": "15. THE DEVIL (악마)",
      "img": "https://upload.wikimedia.org/wikipedia/commons/5/55/RWS_Tarot_15_Devil.jpg",
      "symbol": "물질적 속박과 본능적 예속, 문턱의 파수꾼",
      "upright": "속박, 격정, 물질적 유혹",
      "reversed": "속박에서의 해방, 사슬 끊기"
    },
    {
      "id": 16,
      "name": "16. THE TOWER (탑)",
      "img": "https://upload.wikimedia.org/wikipedia/commons/5/53/RWS_Tarot_16_Tower.jpg",
      "symbol": "오만과 거짓 교리의 붕괴, 불의의 깨달음",
      "upright": "파국, 수치, 결핍, 자만의 붕괴",
      "reversed": "덜한 파국, 억압, 지연된 위기"
    },
    {
      "id": 17,
      "name": "17. THE STAR (별)",
      "img": "https://upload.wikimedia.org/wikipedia/commons/d/db/RWS_Tarot_17_Star.jpg",
      "symbol": "베일을 벗은 진리, 영원한 희망과 신성한 은혜",
      "upright": "희망, 밝은 전망, 영감",
      "reversed": "오만, 비관, 무력감"
    },
    {
      "id": 18,
      "name": "18. THE MOON (달)",
      "img": "https://upload.wikimedia.org/wikipedia/commons/7/7f/RWS_Tarot_18_Moon.jpg",
      "symbol": "무의식의 두려움과 환상, 반사된 지적 빛",
      "upright": "숨은 적, 환상, 기만, 두려움",
      "reversed": "작은 동요, 사소한 기만의 해소"
    },
    {
      "id": 19,
      "name": "19. THE SUN (태양)",
      "img": "https://upload.wikimedia.org/wikipedia/commons/1/17/RWS_Tarot_19_Sun.jpg",
      "symbol": "영적 의식의 직접적인 빛, 온전한 해방과 기쁨",
      "upright": "행복, 성취, 결실, 기쁨",
      "reversed": "한풀 꺾인 기쁨, 지연된 성공"
    },
    {
      "id": 20,
      "name": "20. JUDGEMENT (심판)",
      "img": "https://upload.wikimedia.org/wikipedia/commons/d/dd/RWS_Tarot_20_Judgement.jpg",
      "symbol": "영적 변형의 완성, 대작업(Great Work)의 완수",
      "upright": "결단, 재탄생, 영적 변형",
      "reversed": "우유부단, 지연, 미룸"
    },
    {
      "id": 21,
      "name": "21. THE WORLD (세계)",
      "img": "https://upload.wikimedia.org/wikipedia/commons/f/ff/RWS_Tarot_21_World.jpg",
      "symbol": "우주의 완성, 신성한 비전 속 영혼의 환희",
      "upright": "보장된 성공, 완결, 완성, 결실",
      "reversed": "정체, 고정, 지연"
    }
  ]
};
