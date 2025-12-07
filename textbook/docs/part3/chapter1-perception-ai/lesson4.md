---
sidebar_position: 4
title: Speech and Audio Perception
description: Enabling robots to hear and understand spoken language
---

# Speech and Audio Perception

## Learning Objectives

- Understand audio signal processing for robotics
- Learn speech recognition techniques and APIs
- Implement voice command systems for robot control
- Handle noise and multiple speakers in real environments

## Introduction to Robot Hearing

Audio perception extends robot capabilities beyond visual sensing. Robots can:
- Understand spoken commands
- Detect environmental sounds (alarms, door bells)
- Localize sound sources
- Recognize speakers

### Audio Processing Pipeline

```
┌────────────┐    ┌────────────┐    ┌────────────┐    ┌────────────┐
│ Microphone │───▶│  Filtering │───▶│   Speech   │───▶│   Intent   │
│   Array    │    │    & VAD   │    │Recognition │    │  Parsing   │
└────────────┘    └────────────┘    └────────────┘    └────────────┘
```

## Audio Capture and Processing

```python
import numpy as np
import sounddevice as sd
import scipy.signal as signal

class AudioProcessor:
    """Process audio for robot perception"""

    def __init__(self, sample_rate=16000, channels=1):
        self.sample_rate = sample_rate
        self.channels = channels
        self.buffer = []

    def capture_audio(self, duration=3.0):
        """Record audio from microphone"""
        samples = int(duration * self.sample_rate)
        audio = sd.rec(samples, samplerate=self.sample_rate,
                      channels=self.channels, dtype='float32')
        sd.wait()
        return audio.flatten()

    def apply_bandpass_filter(self, audio, low_freq=80, high_freq=8000):
        """Apply bandpass filter for speech frequencies"""
        nyquist = self.sample_rate / 2
        low = low_freq / nyquist
        high = high_freq / nyquist

        b, a = signal.butter(4, [low, high], btype='band')
        filtered = signal.filtfilt(b, a, audio)

        return filtered

    def compute_spectrogram(self, audio, n_fft=512, hop_length=256):
        """Compute spectrogram for visualization/analysis"""
        frequencies, times, spectrogram = signal.spectrogram(
            audio,
            fs=self.sample_rate,
            nperseg=n_fft,
            noverlap=n_fft - hop_length
        )

        return {
            'frequencies': frequencies,
            'times': times,
            'spectrogram': spectrogram
        }

    def extract_mfcc(self, audio, n_mfcc=13):
        """Extract MFCC features for speech recognition"""
        import librosa

        mfccs = librosa.feature.mfcc(
            y=audio,
            sr=self.sample_rate,
            n_mfcc=n_mfcc
        )

        # Add delta and delta-delta features
        delta = librosa.feature.delta(mfccs)
        delta2 = librosa.feature.delta(mfccs, order=2)

        features = np.vstack([mfccs, delta, delta2])
        return features
```

## Voice Activity Detection (VAD)

Detect when someone is speaking:

```python
class VoiceActivityDetector:
    """Detect voice activity in audio stream"""

    def __init__(self, threshold=0.02, min_duration=0.3):
        self.threshold = threshold
        self.min_duration = min_duration

    def detect_speech(self, audio, sample_rate):
        """Detect speech segments in audio"""
        # Compute short-term energy
        frame_size = int(0.025 * sample_rate)  # 25ms frames
        hop_size = int(0.010 * sample_rate)    # 10ms hop

        energy = []
        for i in range(0, len(audio) - frame_size, hop_size):
            frame = audio[i:i + frame_size]
            energy.append(np.sqrt(np.mean(frame ** 2)))

        energy = np.array(energy)

        # Apply threshold
        is_speech = energy > self.threshold

        # Find speech segments
        segments = []
        in_speech = False
        start = 0

        for i, speech in enumerate(is_speech):
            if speech and not in_speech:
                start = i * hop_size / sample_rate
                in_speech = True
            elif not speech and in_speech:
                end = i * hop_size / sample_rate
                if end - start >= self.min_duration:
                    segments.append((start, end))
                in_speech = False

        return segments

    def streaming_vad(self, audio_chunk, state=None):
        """VAD for streaming audio"""
        energy = np.sqrt(np.mean(audio_chunk ** 2))

        if state is None:
            state = {'is_speaking': False, 'silence_count': 0}

        if energy > self.threshold:
            state['is_speaking'] = True
            state['silence_count'] = 0
        else:
            state['silence_count'] += 1
            if state['silence_count'] > 30:  # ~300ms of silence
                state['is_speaking'] = False

        return state['is_speaking'], state
```

## Speech Recognition

### Using Whisper for Local Recognition

```python
class WhisperSpeechRecognizer:
    """Speech recognition using OpenAI Whisper"""

    def __init__(self, model_size='base'):
        import whisper
        self.model = whisper.load_model(model_size)

    def transcribe(self, audio_path):
        """Transcribe audio file"""
        result = self.model.transcribe(audio_path)
        return {
            'text': result['text'],
            'language': result['language'],
            'segments': result['segments']
        }

    def transcribe_array(self, audio, sample_rate=16000):
        """Transcribe numpy array"""
        # Whisper expects float32 audio at 16kHz
        if sample_rate != 16000:
            import librosa
            audio = librosa.resample(audio, orig_sr=sample_rate, target_sr=16000)

        result = self.model.transcribe(audio.astype(np.float32))
        return result['text']


class GoogleSpeechRecognizer:
    """Speech recognition using Google Cloud"""

    def __init__(self, credentials_path=None):
        from google.cloud import speech
        self.client = speech.SpeechClient()
        self.config = speech.RecognitionConfig(
            encoding=speech.RecognitionConfig.AudioEncoding.LINEAR16,
            sample_rate_hertz=16000,
            language_code='en-US',
            enable_automatic_punctuation=True
        )

    def transcribe(self, audio_bytes):
        """Transcribe audio bytes"""
        from google.cloud import speech

        audio = speech.RecognitionAudio(content=audio_bytes)
        response = self.client.recognize(config=self.config, audio=audio)

        results = []
        for result in response.results:
            results.append({
                'text': result.alternatives[0].transcript,
                'confidence': result.alternatives[0].confidence
            })

        return results
```

## Intent Recognition

Convert speech to robot commands:

```python
class IntentRecognizer:
    """Recognize intents from transcribed speech"""

    def __init__(self):
        self.intents = {
            'move': ['go', 'move', 'walk', 'drive', 'navigate'],
            'stop': ['stop', 'halt', 'freeze', 'pause'],
            'pick': ['pick', 'grab', 'grasp', 'take', 'get'],
            'place': ['place', 'put', 'drop', 'set'],
            'look': ['look', 'see', 'find', 'locate', 'search'],
            'greeting': ['hello', 'hi', 'hey'],
            'status': ['status', 'state', 'battery', 'position']
        }

        self.directions = {
            'forward': ['forward', 'ahead', 'straight'],
            'backward': ['backward', 'back', 'reverse'],
            'left': ['left'],
            'right': ['right'],
            'up': ['up'],
            'down': ['down']
        }

        self.objects = {
            'cup': ['cup', 'mug', 'glass'],
            'ball': ['ball', 'sphere'],
            'box': ['box', 'cube', 'container'],
            'bottle': ['bottle'],
            'phone': ['phone', 'mobile', 'cellphone']
        }

    def parse_command(self, text):
        """Parse text into intent and parameters"""
        text = text.lower().strip()
        words = text.split()

        result = {
            'intent': None,
            'direction': None,
            'object': None,
            'raw_text': text
        }

        # Find intent
        for intent, keywords in self.intents.items():
            if any(kw in words for kw in keywords):
                result['intent'] = intent
                break

        # Find direction
        for direction, keywords in self.directions.items():
            if any(kw in words for kw in keywords):
                result['direction'] = direction
                break

        # Find object
        for obj, keywords in self.objects.items():
            if any(kw in text for kw in keywords):
                result['object'] = obj
                break

        return result


class VoiceCommandSystem:
    """Complete voice command system for robots"""

    def __init__(self):
        self.audio_processor = AudioProcessor()
        self.vad = VoiceActivityDetector()
        self.recognizer = WhisperSpeechRecognizer('base')
        self.intent_parser = IntentRecognizer()

    def listen_for_command(self, timeout=5.0):
        """Listen for and parse a voice command"""
        print("Listening...")

        # Record audio
        audio = self.audio_processor.capture_audio(timeout)

        # Check for speech
        segments = self.vad.detect_speech(audio, self.audio_processor.sample_rate)

        if not segments:
            return {'success': False, 'error': 'No speech detected'}

        # Transcribe
        text = self.recognizer.transcribe_array(audio)

        if not text.strip():
            return {'success': False, 'error': 'Could not transcribe'}

        # Parse intent
        command = self.intent_parser.parse_command(text)
        command['success'] = command['intent'] is not None

        return command

    def execute_command(self, command, robot):
        """Execute parsed command on robot"""
        if not command['success']:
            return False

        intent = command['intent']

        if intent == 'move':
            direction = command['direction'] or 'forward'
            robot.move(direction)

        elif intent == 'stop':
            robot.stop()

        elif intent == 'pick':
            obj = command['object']
            if obj:
                robot.pick(obj)

        elif intent == 'look':
            obj = command['object']
            robot.look_for(obj)

        return True
```

## Sound Source Localization

Determine where sounds come from:

```python
class SoundLocalizer:
    """Localize sound sources using microphone array"""

    def __init__(self, mic_positions, sample_rate=16000):
        """
        mic_positions: Nx3 array of microphone positions in meters
        """
        self.mic_positions = np.array(mic_positions)
        self.sample_rate = sample_rate
        self.speed_of_sound = 343.0  # m/s

    def gcc_phat(self, sig1, sig2, max_delay=None):
        """Generalized Cross-Correlation with Phase Transform"""
        n = len(sig1) + len(sig2)

        # FFT
        SIG1 = np.fft.rfft(sig1, n=n)
        SIG2 = np.fft.rfft(sig2, n=n)

        # GCC-PHAT
        R = SIG1 * np.conj(SIG2)
        R /= (np.abs(R) + 1e-10)

        # IFFT
        cc = np.fft.irfft(R, n=n)

        # Find max
        if max_delay is None:
            max_delay = len(sig1) // 2

        cc = np.concatenate([cc[-max_delay:], cc[:max_delay+1]])
        delay = np.argmax(np.abs(cc)) - max_delay

        return delay / self.sample_rate

    def estimate_direction(self, audio_channels):
        """Estimate sound direction from multi-channel audio"""
        n_mics = len(audio_channels)

        # Compute time delays between microphone pairs
        delays = []
        for i in range(n_mics):
            for j in range(i + 1, n_mics):
                delay = self.gcc_phat(audio_channels[i], audio_channels[j])
                delays.append({
                    'mics': (i, j),
                    'delay': delay
                })

        # Estimate direction using TDOA
        # Simplified: use delay between first two mics
        if len(delays) > 0:
            d = delays[0]['delay'] * self.speed_of_sound
            mic_dist = np.linalg.norm(
                self.mic_positions[0] - self.mic_positions[1]
            )

            # Angle from mic array axis
            if abs(d) <= mic_dist:
                angle = np.arcsin(d / mic_dist)
            else:
                angle = np.sign(d) * np.pi / 2

            return np.degrees(angle)

        return None
```

## Key Takeaways

:::tip Summary
- **Audio processing** includes filtering, feature extraction (MFCC), and VAD
- **Speech recognition** converts audio to text using models like Whisper
- **Intent recognition** parses text into actionable robot commands
- **Voice command systems** combine VAD, ASR, and intent parsing
- **Sound localization** uses microphone arrays to find sound sources
- Handle **noise and multiple speakers** in real environments
:::

## Practice Exercises

1. **Voice-Controlled Robot**: Build a system that responds to basic voice commands.

2. **Keyword Spotting**: Implement wake word detection for your robot.

3. **Sound Localization**: Set up a microphone array and estimate sound direction.

4. **Multilingual Support**: Extend the system to handle multiple languages.

## Further Reading

- Jurafsky & Martin "Speech and Language Processing"
- OpenAI Whisper Documentation
- Google Cloud Speech-to-Text API
- ROS Audio Commons Package
