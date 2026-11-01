const fs = require('fs');
const path = require('path');
const { GoogleGenAI } = require('@google/genai');
require('dotenv').config();

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
  httpOptions: { headers: { 'User-Agent': 'aistudio-build' } }
});

const SLIDES = [
  {
    num: 1,
    text: 'Cô chào tất cả các con yêu quý! Hôm nay, cô và các con sẽ cùng nhau bước vào hành trình phiêu lưu kỳ diệu: Giải Cứu Vương Quốc Âm Thanh nhé! Các con đã sẵn sàng cùng cô lên đường chưa nào?'
  },
  {
    num: 2,
    text: 'Các con ơi, ngày xửa ngày xưa, tại Vương quốc Âm Thanh có muôn loài ca hát ríu rít, vui nhộn biết bao. Thế rồi, một ngày nọ, bác phù thủy Gió Xoáy đã lấy mất những âm thanh kỳ diệu, làm vương quốc im lặng quá! Chúng mình hãy cùng cô và bạn Thỏ Bông đi tìm lại âm thanh cho vương quốc nhé!'
  },
  {
    num: 3,
    text: 'Cách chơi cùng cô thật là dễ dàng này: Bước một, các con hãy bấm vào chiếc loa tròn để lắng nghe âm thanh. Bước hai, các con chọn hình ảnh phát ra âm thanh đúng nhé. Khi vượt qua mỗi vùng đất, cô sẽ tặng cho các con một mảnh chìa khóa phép thuật đấy!'
  },
  {
    num: 4,
    text: 'Chúng mình đã tới Khu Rừng Tiếng Hát rồi các con ơi! Các bạn động vật ở đây đang bị mất tiếng kêu, buồn thiu à. Các con hãy bấm vào chiếc loa kỳ diệu và đoán xem đây là tiếng kêu của bạn nào để giúp bạn ấy nhé!'
  },
  {
    num: 5,
    text: 'Ôi tuyệt vời quá! Bé yêu của cô thật là thông minh! Các bạn động vật đã tìm lại được tiếng kêu rồi. Cô tặng con mảnh chìa khóa đầu tiên: Chiếc Lông Vũ Âm Thanh kỳ diệu này nhé!'
  },
  {
    num: 6,
    text: 'Bây giờ, cô mời các con cùng bước sang Vùng Đất Thiên Nhiên Kỳ Thú nhé! Nơi đây có tiếng mưa rơi tí tách, tiếng gió thổi vi vu, tiếng sấm đùng đoàng và tiếng sóng biển rì rào. Các con hãy lắng tai nghe thật kỹ nào!'
  },
  {
    num: 7,
    text: 'Chính xác rồi con yêu ơi! Con hãy nghe cô đố thêm nhé: Tiếng mưa rơi tí tách từng giọt trên lá cây khác với tiếng sóng biển cuộn tròn vỗ bờ như thế nào nhỉ? Thiên nhiên đã bừng nở rộn ràng trở lại, và cô tặng con Giọt Nước Phép Thuật nè!'
  },
  {
    num: 8,
    text: 'Cô chào mừng các con tới Thung Lũng Cuộc Sống! Nơi đây có tiếng chuông xe đạp kính coong, tiếng chuông trường đoong đoong gọi vào lớp và tiếng đồng hồ báo thức quen thuộc. Các con hãy lắng nghe và tìm giúp cô nhé!'
  },
  {
    num: 9,
    text: 'Leng keng leng keng! Hoan hô bé yêu của cô! Con đã đánh thức tất cả các đồ vật reo vang rộn rã rồi! Đây là Chiếc Chuông Vàng lấp lánh cô dành tặng cho con!'
  },
  {
    num: 10,
    text: 'Các con ơi, trước mắt chúng mình là Cánh Cổng Lâu Đài Hòa Âm rồi! Thử thách cuối cùng để mở cổng: Con hãy nghe và phân loại xem âm thanh này thuộc nhóm Động vật, Thiên nhiên hay Cuộc sống nhé! Cô tin chắc con sẽ làm được!'
  },
  {
    num: 11,
    text: 'Kỳ diệu quá các con ơi! Cả bốn mảnh chìa khóa phép thuật đã bay về và hợp nhất lại rồi! Cánh cổng lâu đài mở toang đón cô trò mình vào trong, âm thanh vang lừng khắp bốn phương kìa!'
  },
  {
    num: 12,
    text: 'Xin chúc mừng bé yêu của cô! Con đã xuất sắc hoàn thành tất cả thử thách và giải cứu Vương Quốc Âm Thanh rồi! Cô trao tặng con Huy Hiệu và Giấy Khen Nhà Thám Hiểm Tài Ba nhé! Con hãy cùng cô reo mừng nào!'
  }
];

const TEACHER_STYLE = 'Giọng cô giáo mầm non Việt Nam vô cùng ngọt ngào, dịu dàng, ấm áp, có ngữ điệu lôi cuốn, giọng cười tươi tắn, biểu cảm truyền cảm xúc yêu thương dạt dào cho các bạn nhỏ 4-5 tuổi, phát âm tròn vành rõ chữ, chậm rãi và tự nhiên như người thật kể chuyện cổ tích.';
const BUNNY_STYLE = 'Giọng bạn thỏ bông hoạt hình siêu dễ thương, trong trẻo, vui tươi, ngọt ngào, hóm hỉnh, ngữ điệu nhí nhảnh đáng yêu kể chuyện cho các bé thiếu nhi.';

const OUT_DIR = path.resolve(__dirname, '../src/assets/audio/narrations');
if (!fs.existsSync(OUT_DIR)) {
  fs.mkdirSync(OUT_DIR, { recursive: true });
}

async function generateClip(slideNum, text, persona, voiceName, style) {
  const filePath = path.join(OUT_DIR, `slide_${slideNum}_${persona}.wav`);
  if (fs.existsSync(filePath)) {
    console.log(`[Skip] Already exists: slide_${slideNum}_${persona}.wav`);
    return;
  }

  console.log(`[Generating] Slide ${slideNum} (${persona})...`);
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash-tts',
      contents: [
        {
          role: 'user',
          parts: [
            {
              text: text,
              speechMetadata: { style: style }
            }
          ]
        }
      ],
      config: {
        responseModalities: ['AUDIO'],
        speechConfig: {
          voiceConfig: {
            prebuiltVoiceConfig: { voiceName: voiceName }
          }
        }
      }
    });

    const base64Audio = response.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data;
    if (base64Audio) {
      fs.writeFileSync(filePath, Buffer.from(base64Audio, 'base64'));
      console.log(`[Success] Saved slide_${slideNum}_${persona}.wav (${base64Audio.length} b64 chars)`);
    } else {
      console.warn(`[Warning] No audio returned for slide_${slideNum}_${persona}`);
    }
  } catch (err) {
    console.error(`[Error] slide_${slideNum}_${persona}:`, err.message);
  }
}

async function main() {
  console.log('=== STARTING HIGH-FIDELITY STORYTELLING TTS GENERATION ===');
  for (const s of SLIDES) {
    await generateClip(s.num, s.text, 'teacher', 'Kore', TEACHER_STYLE);
    await new Promise(r => setTimeout(r, 2500));
    await generateClip(s.num, s.text, 'bunny', 'Puck', BUNNY_STYLE);
    await new Promise(r => setTimeout(r, 2500));
  }
  console.log('=== FINISHED GENERATION! ===');
}

main();
