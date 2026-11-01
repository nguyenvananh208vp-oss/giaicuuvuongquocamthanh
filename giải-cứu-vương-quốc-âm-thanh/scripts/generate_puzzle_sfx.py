import math
import random
import struct
import wave
import subprocess
import os

SAMPLE_RATE = 44100
OUT_DIR = "/app/applet/public/assets/audio/effects"
os.makedirs(OUT_DIR, exist_ok=True)

def write_wav(filename, samples, sample_rate=SAMPLE_RATE):
    # Normalize samples to [-0.95, 0.95]
    max_amp = max(max(abs(s) for s in samples), 0.0001)
    scale = 0.95 / max_amp if max_amp > 0.95 else 1.0

    wav_path = os.path.join(OUT_DIR, filename + ".wav")
    with wave.open(wav_path, "w") as wf:
        wf.setnchannels(1)
        wf.setsampwidth(2)
        wf.setframerate(sample_rate)
        int_data = bytearray()
        for s in samples:
            val = int(max(-32767, min(32767, s * scale * 32767)))
            int_data.extend(struct.pack("<h", val))
        wf.writeframes(int_data)

    # Convert to MP3 using ffmpeg with smooth fade out at 2.7s-3.0s
    mp3_path = os.path.join(OUT_DIR, filename + ".mp3")
    cmd = [
        "ffmpeg", "-y", "-i", wav_path,
        "-af", "afade=t=out:st=2.7:d=0.3",
        "-b:a", "192k", mp3_path
    ]
    subprocess.run(cmd, stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL)
    if os.path.exists(wav_path):
        os.remove(wav_path)
    print(f"Generated 3.0s audio: {mp3_path}")

# 1. Rain (3.0s)
def gen_rain():
    duration = 3.0
    total_samples = int(SAMPLE_RATE * duration)
    samples = [0.0] * total_samples

    noise_val = 0.0
    for i in range(total_samples):
        r = random.uniform(-1, 1)
        noise_val = noise_val * 0.92 + r * 0.08
        env = math.sin(math.pi * i / total_samples) ** 0.5
        samples[i] += noise_val * 0.12 * env

    num_drops = 65
    for _ in range(num_drops):
        start_t = random.uniform(0.05, 2.85)
        start_idx = int(start_t * SAMPLE_RATE)
        drop_dur = random.uniform(0.04, 0.08)
        drop_samples = int(drop_dur * SAMPLE_RATE)
        f_start = random.uniform(1600, 2400)
        f_end = f_start * 0.55
        amp = random.uniform(0.25, 0.6)

        phase = 0.0
        for di in range(drop_samples):
            idx = start_idx + di
            if idx >= total_samples:
                break
            progress = di / drop_samples
            freq = f_start + (f_end - f_start) * (progress ** 0.6)
            phase += 2 * math.pi * freq / SAMPLE_RATE
            env = math.exp(-di / (0.012 * SAMPLE_RATE)) * math.sin(math.pi * progress)
            samples[idx] += math.sin(phase) * amp * env

    write_wav("rain", samples)

# 2. Wind (3.0s)
def gen_wind():
    duration = 3.0
    total_samples = int(SAMPLE_RATE * duration)
    samples = [0.0] * total_samples

    val1 = 0.0
    val2 = 0.0
    for i in range(total_samples):
        t = i / SAMPLE_RATE
        r = random.uniform(-1, 1)
        center_freq = 300 + 400 * math.sin(math.pi * t / duration)
        resonance_q = 0.08 + 0.04 * math.sin(math.pi * t / duration)
        val1 = val1 * (1.0 - resonance_q) + r * resonance_q
        val2 = val2 * 0.94 + val1 * 0.06

        whistle_f = 450 + 260 * math.sin(math.pi * t / duration)
        whistle = math.sin(2 * math.pi * whistle_f * t) * 0.15

        env = math.sin(math.pi * t / duration) ** 1.1
        samples[i] = (val2 * 0.75 + whistle) * env

    write_wav("wind", samples)

# 3. Thunder (3.0s)
def gen_thunder():
    duration = 3.0
    total_samples = int(SAMPLE_RATE * duration)
    samples = [0.0] * total_samples

    crack_idx = int(0.05 * SAMPLE_RATE)
    for i in range(int(0.15 * SAMPLE_RATE)):
        idx = crack_idx + i
        if idx < total_samples:
            env = math.exp(-i / (0.025 * SAMPLE_RATE))
            samples[idx] += random.uniform(-1, 1) * 0.85 * env

    low_noise = 0.0
    for i in range(total_samples):
        t = i / SAMPLE_RATE
        if t < 0.05:
            continue
        r = random.uniform(-1, 1)
        low_noise = low_noise * 0.985 + r * 0.015
        rumble_freq = 55 + 25 * math.sin(2 * math.pi * 5 * t)
        sine_rumble = math.sin(2 * math.pi * rumble_freq * t) * 0.4
        decay = math.exp(-(t - 0.05) / 0.95)
        am = 0.7 + 0.3 * math.sin(2 * math.pi * 8 * t)
        samples[i] += (low_noise * 2.5 + sine_rumble) * decay * am

    write_wav("thunder", samples)

# 4. Ocean waves (3.0s)
def gen_ocean():
    duration = 3.0
    total_samples = int(SAMPLE_RATE * duration)
    samples = [0.0] * total_samples

    filt_noise = 0.0
    for i in range(total_samples):
        t = i / SAMPLE_RATE
        r = random.uniform(-1, 1)
        filt_noise = filt_noise * 0.91 + r * 0.09
        if t < 1.3:
            env = (t / 1.3) ** 1.8
        else:
            env = math.exp(-(t - 1.3) / 0.85)
        samples[i] = filt_noise * env * 0.85

    write_wav("ocean", samples)

# 5. School bell (3.0s)
def gen_school_bell():
    duration = 3.0
    total_samples = int(SAMPLE_RATE * duration)
    samples = [0.0] * total_samples

    strikes = [0.0, 0.75, 1.5, 2.25]
    harmonics = [(440, 0.5), (880, 0.3), (1320, 0.15), (1760, 0.08), (2640, 0.04)]

    for strike_t in strikes:
        start_idx = int(strike_t * SAMPLE_RATE)
        for i in range(int(0.72 * SAMPLE_RATE)):
            idx = start_idx + i
            if idx >= total_samples:
                break
            t = i / SAMPLE_RATE
            val = 0.0
            for freq, weight in harmonics:
                decay = math.exp(-t / (0.38 * (440 / freq) ** 0.5))
                val += math.sin(2 * math.pi * freq * t) * weight * decay
            samples[idx] += val

    write_wav("school_bell", samples)

# 6. Bicycle bell (3.0s)
def gen_bicycle_bell():
    duration = 3.0
    total_samples = int(SAMPLE_RATE * duration)
    samples = [0.0] * total_samples

    strikes = [
        (0.0, 2400), (0.12, 2750),
        (0.7, 2400), (0.82, 2750),
        (1.4, 2400), (1.52, 2750),
        (2.1, 2400), (2.22, 2750),
    ]

    for strike_t, freq in strikes:
        start_idx = int(strike_t * SAMPLE_RATE)
        for i in range(int(0.38 * SAMPLE_RATE)):
            idx = start_idx + i
            if idx >= total_samples:
                break
            t = i / SAMPLE_RATE
            mod = 1.0 + 0.3 * math.sin(2 * math.pi * 850 * t)
            decay = math.exp(-t / 0.15)
            s = math.sin(2 * math.pi * freq * t) * mod * decay * 0.5
            samples[idx] += s

    write_wav("bicycle_bell", samples)

# 7. Telephone (3.0s)
def gen_telephone():
    duration = 3.0
    total_samples = int(SAMPLE_RATE * duration)
    samples = [0.0] * total_samples

    bursts = [0.0, 0.95, 1.9]
    for b_start in bursts:
        start_idx = int(b_start * SAMPLE_RATE)
        burst_len = int(0.68 * SAMPLE_RATE)
        for i in range(burst_len):
            idx = start_idx + i
            if idx >= total_samples:
                break
            t = i / SAMPLE_RATE
            cadence = 0.5 + 0.5 * math.sin(2 * math.pi * 20 * t)
            bell1 = math.sin(2 * math.pi * 353 * t)
            bell2 = math.sin(2 * math.pi * 440 * t)
            bell_harm = math.sin(2 * math.pi * 1059 * t) * 0.3
            samples[idx] += (bell1 + bell2 + bell_harm) * cadence * 0.32

    write_wav("telephone", samples)

# 8. Clapping (3.0s)
def gen_clapping():
    duration = 3.0
    total_samples = int(SAMPLE_RATE * duration)
    samples = [0.0] * total_samples

    for _ in range(95):
        t_start = random.uniform(0.02, 2.85)
        start_idx = int(t_start * SAMPLE_RATE)
        clap_samples = int(random.uniform(0.015, 0.035) * SAMPLE_RATE)
        freq = random.uniform(800, 1600)
        amp = random.uniform(0.2, 0.6)

        filt = 0.0
        for i in range(clap_samples):
            idx = start_idx + i
            if idx >= total_samples:
                break
            r = random.uniform(-1, 1)
            filt = filt * 0.7 + r * 0.3
            decay = math.exp(-i / (0.007 * SAMPLE_RATE))
            samples[idx] += (filt + math.sin(2 * math.pi * freq * (i / SAMPLE_RATE)) * 0.4) * amp * decay

    write_wav("clapping", samples)

# 9. Duck quack (3.0s)
def gen_duck():
    duration = 3.0
    total_samples = int(SAMPLE_RATE * duration)
    samples = [0.0] * total_samples

    quacks = [0.0, 0.45, 0.9, 1.5, 1.95, 2.4]
    for q_t in quacks:
        start_idx = int(q_t * SAMPLE_RATE)
        dur = 0.28
        dur_samples = int(dur * SAMPLE_RATE)
        for i in range(dur_samples):
            idx = start_idx + i
            if idx >= total_samples:
                break
            t = i / SAMPLE_RATE
            p = t / dur
            f0 = 320 - 90 * p
            val = 0.0
            for h in range(1, 8):
                h_freq = f0 * h
                formant = math.exp(-((h_freq - 1100) / 450) ** 2) * 1.5 + 0.2
                val += (1.0 / h) * math.sin(2 * math.pi * h_freq * t) * formant
            env = math.sin(math.pi * p) ** 0.8
            samples[idx] += val * env * 0.35

    write_wav("duck", samples)

# 10. Pig oink (3.0s)
def gen_pig():
    duration = 3.0
    total_samples = int(SAMPLE_RATE * duration)
    samples = [0.0] * total_samples

    oinks = [0.0, 0.45, 0.95, 1.55, 2.05, 2.5]
    for o_t in oinks:
        start_idx = int(o_t * SAMPLE_RATE)
        dur = 0.28
        dur_samples = int(dur * SAMPLE_RATE)
        for i in range(dur_samples):
            idx = start_idx + i
            if idx >= total_samples:
                break
            t = i / SAMPLE_RATE
            p = t / dur
            f0 = 135 - 35 * p
            mod = math.sin(2 * math.pi * 38 * t) * 30
            val = math.sin(2 * math.pi * (f0 + mod) * t) + 0.5 * math.sin(2 * math.pi * (f0 * 2 + mod) * t)
            env = math.sin(math.pi * p) ** 0.85
            samples[idx] += val * env * 0.4

    write_wav("pig", samples)

# 11. Cow moo (3.0s)
def gen_cow():
    duration = 3.0
    total_samples = int(SAMPLE_RATE * duration)
    samples = [0.0] * total_samples

    moos = [(0.0, 1.4), (1.5, 1.4)]
    for start_t, dur in moos:
        start_idx = int(start_t * SAMPLE_RATE)
        dur_samples = int(dur * SAMPLE_RATE)
        for i in range(dur_samples):
            idx = start_idx + i
            if idx >= total_samples:
                break
            t = i / SAMPLE_RATE
            p = t / dur
            if p < 0.35:
                f0 = 125 + 20 * (p / 0.35)
            else:
                f0 = 145 - 30 * ((p - 0.35) / 0.65)
            vibrato = math.sin(2 * math.pi * 5.5 * t) * 2.5
            val = 0.0
            for h in range(1, 6):
                hf = (f0 + vibrato) * h
                formant = math.exp(-((hf - 480) / 280) ** 2) * 1.8 + 0.3
                val += (1.0 / (h ** 0.8)) * math.sin(2 * math.pi * hf * t) * formant
            env = math.sin(math.pi * p) ** 0.6
            samples[idx] += val * env * 0.32

    write_wav("cow", samples)

# 12. Waterfall (3.0s)
def gen_waterfall():
    duration = 3.0
    total_samples = int(SAMPLE_RATE * duration)
    samples = [0.0] * total_samples

    f_low = 0.0
    f_high = 0.0
    for i in range(total_samples):
        t = i / SAMPLE_RATE
        r = random.uniform(-1, 1)
        f_low = f_low * 0.95 + r * 0.05
        f_high = f_high * 0.75 + r * 0.25
        env = math.sin(math.pi * t / duration) ** 0.5
        samples[i] = (f_low * 1.8 + f_high * 0.25) * env * 0.65

    write_wav("waterfall", samples)

# 13. Alarm clock (3.0s)
def gen_alarm():
    duration = 3.0
    total_samples = int(SAMPLE_RATE * duration)
    samples = [0.0] * total_samples

    strikes = 28
    for s in range(strikes):
        t_start = s * 0.1
        start_idx = int(t_start * SAMPLE_RATE)
        for i in range(int(0.08 * SAMPLE_RATE)):
            idx = start_idx + i
            if idx >= total_samples:
                break
            t = i / SAMPLE_RATE
            bell1 = math.sin(2 * math.pi * 1850 * t)
            bell2 = math.sin(2 * math.pi * 2300 * t)
            decay = math.exp(-t / 0.025)
            samples[idx] += (bell1 + bell2) * 0.35 * decay

    write_wav("alarm_clock", samples)

if __name__ == "__main__":
    gen_rain()
    gen_wind()
    gen_thunder()
    gen_ocean()
    gen_school_bell()
    gen_bicycle_bell()
    gen_telephone()
    gen_clapping()
    gen_duck()
    gen_pig()
    gen_cow()
    gen_waterfall()
    gen_alarm()
    print("All 13 sound effects successfully generated to 3.0 seconds!")
