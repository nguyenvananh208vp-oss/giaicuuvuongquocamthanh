const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');
const { MsEdgeTTS, OUTPUT_FORMAT } = require('msedge-tts');

const SLIDES = [
  {
    num: 1,
    teacher: 'Cô chào tất cả các bé yêu quý của cô! Các con ơi... Hôm nay, cô và các con sẽ cùng nhau bước vào chuyến phiêu lưu kỳ diệu: Giải Cứu Vương Quốc Âm Thanh nhé! Các con đã sẵn sàng cùng cô lên đường chưa nào?',
    bunny: 'Chào các bạn nhỏ thân yêu! Các bạn ơi... Hôm nay chúng mình cùng bước vào hành trình phiêu lưu kỳ diệu: Giải Cứu Vương Quốc Âm Thanh nhé! Các bạn đã sẵn sàng cùng Thỏ Bông lên đường chưa nào?'
  },
  {
    num: 2,
    teacher: 'Các con ơi, ngày xửa ngày xưa... tại Vương quốc Âm thanh, muôn loài ca hát ríu rít, vui nhộn biết bao nhiêu! Thế rồi một ngày nọ, bác phù thủy Gió Xoáy đã lấy mất những âm thanh kỳ diệu, làm vương quốc buồn thiu, im lặng quá! Chúng mình hãy cùng cô và bạn Thỏ Bông, đi tìm lại âm thanh cho vương quốc nhé!',
    bunny: 'Các bạn ơi, ngày xửa ngày xưa... tại Vương quốc Âm thanh, muôn loài ca hát ríu rít, vui nhộn biết bao! Thế rồi một ngày nọ, bác phù thủy Gió Xoáy đã lấy mất những âm thanh kỳ diệu, làm vương quốc im lặng quá! Chúng mình hãy cùng Thỏ Bông đi tìm lại âm thanh cho vương quốc nhé!'
  },
  {
    num: 3,
    teacher: 'Cách chơi cùng cô thật là vui và dễ nhé: Đầu tiên, các con hãy bấm vào chiếc loa tròn để lắng nghe âm thanh... Sau đó, con chọn hình ảnh phát ra âm thanh đúng nha! Cứ mỗi khi vượt qua một vùng đất, cô sẽ tặng cho con một mảnh chìa khóa phép thuật lấp lánh đấy!',
    bunny: 'Cách chơi cùng Thỏ Bông thật là dễ dàng nè: Bước một, các bạn bấm vào chiếc loa tròn để lắng nghe âm thanh... Bước hai, chọn hình ảnh phát ra âm thanh đúng nhé! Vượt qua mỗi vùng đất, các bạn sẽ nhận được một mảnh chìa khóa phép thuật đấy!'
  },
  {
    num: 4,
    teacher: 'Ôi, cô trò mình đã tới Khu Rừng Tiếng Hát rồi các con ơi! Các bạn động vật ở đây đang bị mất tiếng kêu, bạn nào cũng buồn thiu à... Các con hãy bấm vào chiếc loa xinh, rồi đoán xem đây là tiếng kêu của bạn nào để giúp bạn ấy nhé!',
    bunny: 'Chúng mình đã tới Khu Rừng Tiếng Hát rồi các bạn ơi! Các bạn động vật ở đây đang bị mất tiếng kêu, buồn thiu à... Các bạn hãy bấm vào chiếc loa kỳ diệu và đoán xem đây là tiếng kêu của bạn nào để giúp bạn ấy nhé!'
  },
  {
    num: 5,
    teacher: 'Tuyệt vời quá! Bé yêu của cô giỏi ơi là giỏi! Các bạn động vật đã tìm lại được tiếng kêu vui vẻ rồi nè! Cô tặng con mảnh chìa khóa đầu tiên: Chiếc Lông Vũ Âm Thanh kỳ diệu này nhé!',
    bunny: 'Ôi hoan hô các bạn ơi! Các bạn thật là giỏi giang và thông minh! Các bạn động vật đã tìm lại được tiếng kêu rồi! Thỏ Bông xin tặng các bạn mảnh chìa khóa đầu tiên: Chiếc Lông Vũ Âm Thanh kỳ diệu này nhé!'
  },
  {
    num: 6,
    teacher: 'Bây giờ, cô mời các con cùng bước sang Vùng Đất Thiên Nhiên Kỳ Thú nha! Nơi đây có tiếng mưa rơi tí tách tí tách, tiếng gió thổi vi vu, tiếng sấm đùng đoàng và tiếng sóng biển rì rào... Các con hãy lắng tai nghe thật kỹ cùng cô nào!',
    bunny: 'Bây giờ, mời các bạn cùng bước sang Vùng Đất Thiên Nhiên Kỳ Thú nhé! Nơi đây có tiếng mưa rơi tí tách, tiếng gió thổi vi vu, tiếng sấm đùng đoàng và tiếng sóng biển rì rào... Các bạn hãy lắng tai nghe thật kỹ nào!'
  },
  {
    num: 7,
    teacher: 'Đúng rồi, bé của cô thông minh quá! Cô đố các con nhé: Tiếng mưa rơi tí tách từng giọt trên lá cây khác với tiếng sóng biển cuộn tròn vỗ bờ như thế nào nhỉ? Thiên nhiên lại nở hoa rộn ràng rồi, cô tặng con Giọt Nước Phép Thuật nè!',
    bunny: 'Chính xác rồi các bạn ơi! Thỏ Bông đố thêm nhé: Tiếng mưa rơi tí tách từng giọt trên lá cây khác với tiếng sóng biển cuộn tròn vỗ bờ như thế nào nhỉ? Thiên nhiên đã bừng nở rộn ràng trở lại, và Thỏ Bông tặng các bạn Giọt Nước Phép Thuật nè!'
  },
  {
    num: 8,
    teacher: 'Cô chào mừng các con tới Thung Lũng Cuộc Sống rộn ràng! Ở đây có tiếng chuông xe đạp kính coong kính coong, tiếng chuông trường đoong đoong gọi vào lớp, và tiếng đồng hồ báo thức reo vang... Các con hãy lắng nghe và tìm giúp cô nhé!',
    bunny: 'Chào mừng các bạn tới Thung Lũng Cuộc Sống! Nơi đây có tiếng chuông xe đạp kính coong, tiếng chuông trường đoong đoong gọi vào lớp và tiếng đồng hồ báo thức quen thuộc... Các bạn hãy lắng nghe và tìm giúp Thỏ Bông nhé!'
  },
  {
    num: 9,
    teacher: 'Leng keng leng keng! Hoan hô bé yêu của cô, con giỏi quá đi thôi! Con đã đánh thức tất cả các đồ vật reo vang rộn rã rồi! Đây là Chiếc Chuông Vàng lấp lánh cô dành tặng cho con nè!',
    bunny: 'Leng keng leng keng! Hoan hô các bạn nhỏ tuyệt vời! Các bạn đã đánh thức tất cả các đồ vật reo vang rộn rã rồi! Đây là Chiếc Chuông Vàng lấp lánh Thỏ Bông dành tặng cho các bạn!'
  },
  {
    num: 10,
    teacher: 'Các con ơi, trước mắt chúng mình đã là Cánh Cổng Lâu Đài Hòa Âm rồi! Thử thách cuối cùng để mở cổng: Con hãy nghe và phân loại xem âm thanh này thuộc nhóm Động vật, Thiên nhiên hay Cuộc sống nhé! Cô tin chắc chắn con sẽ làm được thật xuất sắc!',
    bunny: 'Các bạn ơi, trước mắt chúng mình là Cánh Cổng Lâu Đài Hòa Âm rồi! Thử thách cuối cùng để mở cổng: Hãy nghe và phân loại xem âm thanh này thuộc nhóm Động vật, Thiên nhiên hay Cuộc sống nhé! Thỏ Bông tin chắc các bạn sẽ làm được!'
  },
  {
    num: 11,
    teacher: 'Kỳ diệu quá các con ơi! Cả bốn mảnh chìa khóa phép thuật đã bay về và hợp nhất lại rồi! Cánh cổng lâu đài mở toang đón cô trò mình vào trong, âm thanh vang lừng vui tươi khắp bốn phương kìa!',
    bunny: 'Kỳ diệu quá các bạn ơi! Cả bốn mảnh chìa khóa phép thuật đã bay về và hợp nhất lại rồi! Cánh cổng lâu đài mở toang đón chúng mình vào trong, âm thanh vang lừng khắp bốn phương kìa!'
  },
  {
    num: 12,
    teacher: 'Xin chúc mừng bé yêu của cô! Con đã xuất sắc hoàn thành tất cả các thử thách và giải cứu Vương Quốc Âm Thanh rồi! Cô trao tặng con Huy Hiệu và Giấy Khen Nhà Thám Hiểm Tài Ba nhé! Con hãy cùng cô reo mừng thật to nào: Hoan hô!',
    bunny: 'Xin chúc mừng tất cả các bạn nhỏ! Chúng mình đã xuất sắc hoàn thành tất cả thử thách và giải cứu Vương Quốc Âm Thanh rồi! Thỏ Bông xin trao tặng Huy Hiệu và Giấy Khen Nhà Thám Hiểm Tài Ba nhé! Hoan hô nào!'
  }
];

const OUT_DIR = path.resolve(__dirname, '../src/assets/audio/narrations');
if (!fs.existsSync(OUT_DIR)) {
  fs.mkdirSync(OUT_DIR, { recursive: true });
}

async function synthesizeText(text, persona) {
  const tts = new MsEdgeTTS();
  await tts.setMetadata('vi-VN-HoaiMyNeural', OUTPUT_FORMAT.AUDIO_24KHZ_96KBITRATE_MONO_MP3);

  // Natural kindergarten teacher prosody: lively pitch, natural pace with natural pauses
  const options = persona === 'teacher'
    ? { pitch: '+2Hz', rate: '-2%', volume: '+0%' }
    : { pitch: '+11Hz', rate: '-1%', volume: '+0%' };

  return new Promise((resolve, reject) => {
    try {
      const { audioStream } = tts.toStream(text, options);
      const chunks = [];
      audioStream.on('data', chunk => chunks.push(chunk));
      audioStream.on('end', () => {
        tts.close();
        resolve(Buffer.concat(chunks));
      });
      audioStream.on('error', err => {
        tts.close();
        reject(err);
      });
    } catch (err) {
      tts.close();
      reject(err);
    }
  });
}

async function main() {
  console.log('Generating authentic preschool teacher & bunny narration audio for all 12 slides...');

  for (const slide of SLIDES) {
    for (const persona of ['teacher', 'bunny']) {
      const text = persona === 'teacher' ? slide.teacher : slide.bunny;
      const mp3Path = path.join(OUT_DIR, `slide_${slide.num}_${persona}.mp3`);
      const wavPath = path.join(OUT_DIR, `slide_${slide.num}_${persona}.wav`);

      console.log(`Generating Slide ${slide.num} (${persona})...`);
      let success = false;
      for (let attempt = 1; attempt <= 3; attempt++) {
        try {
          const mp3Buffer = await synthesizeText(text, persona);
          if (mp3Buffer && mp3Buffer.length > 5000) {
            fs.writeFileSync(mp3Path, mp3Buffer);
            execSync(`ffmpeg -y -i "${mp3Path}" -acodec pcm_s16le -ar 24000 -ac 1 "${wavPath}" 2>/dev/null`);
            console.log(`✓ Slide ${slide.num} (${persona}): OK (${mp3Buffer.length} bytes)`);
            success = true;
            break;
          }
        } catch (err) {
          console.warn(`Attempt ${attempt} for slide ${slide.num} (${persona}) failed:`, err.message);
          await new Promise(r => setTimeout(r, 600));
        }
      }

      if (!success) {
        console.error(`FAILED to generate Slide ${slide.num} (${persona}) after 3 attempts!`);
      }
    }
  }

  console.log('All 12 slides updated with warm teacher & bunny voiceover!');
}

main();
