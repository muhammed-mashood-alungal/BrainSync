// audio-processor.js
class AudioLevelProcessor extends AudioWorkletProcessor {
    constructor() {
      super();
      this.volume = 0;
      this.updateInterval = 25; // Update every 25 frames (around 5 times per second at 48kHz)
      this.nextUpdateFrame = this.updateInterval;
    }
    
    process(inputs, outputs, parameters) {
      const input = inputs[0];
      
      if (input.length > 0) {
        const samples = input[0];
        let sum = 0;
        
        // Calculate the average volume across the samples
        for (let i = 0; i < samples.length; i++) {
          sum += Math.abs(samples[i]);
        }
        this.volume = sum / samples.length;
        
        // Send the volume level to the main thread periodically
        this.nextUpdateFrame--;
        if (this.nextUpdateFrame === 0) {
          this.nextUpdateFrame = this.updateInterval;
          
          // Convert to scale similar to the byte frequency data
          const average = Math.floor(this.volume * 100);
          this.port.postMessage({ average });
        }
      }
      
      return true;
    }
  }
  
  registerProcessor('audio-level-processor', AudioLevelProcessor)