/**
 * Video Utilities for In-Browser 720p HD Optimization & Downscaling
 * 
 * If a video resolution exceeds 720p (e.g. 1080p, 2K, 4K), this downscales
 * the frames to 1280x720 HD using HTML5 Canvas & MediaRecorder at an optimized
 * 2.5 Mbps bitrate, cutting down a 136MB video to ~40-50MB before uploading.
 */

export interface VideoCompressionResult {
  file: File;
  originalSize: number;
  compressedSize: number;
  wasCompressed: boolean;
  resolution: string;
}

export async function optimizeVideoTo720p(
  inputFile: File,
  onProgress?: (percent: number, statusText: string) => void
): Promise<VideoCompressionResult> {
  return new Promise((resolve) => {
    const originalSize = inputFile.size;

    // Check if browser supports MediaRecorder with video/mp4 or video/webm
    if (typeof window === 'undefined' || !window.MediaRecorder) {
      return resolve({
        file: inputFile,
        originalSize,
        compressedSize: originalSize,
        wasCompressed: false,
        resolution: 'Original'
      });
    }

    const video = document.createElement('video');
    video.muted = true;
    video.playsInline = true;
    video.preload = 'metadata';

    const sourceUrl = URL.createObjectURL(inputFile);
    video.src = sourceUrl;

    video.onloadedmetadata = async () => {
      const origWidth = video.videoWidth || 1920;
      const origHeight = video.videoHeight || 1080;
      const duration = video.duration;

      // If video is already 720p or smaller, no downscaling needed
      if (origHeight <= 720 && origWidth <= 1280) {
        URL.revokeObjectURL(sourceUrl);
        return resolve({
          file: inputFile,
          originalSize,
          compressedSize: originalSize,
          wasCompressed: false,
          resolution: `${origWidth}x${origHeight} (Already 720p/HD)`
        });
      }

      // Calculate Target 720p Dimensions preserving aspect ratio
      const aspectRatio = origWidth / origHeight;
      let targetWidth = 1280;
      let targetHeight = 720;

      if (aspectRatio > 16 / 9) {
        targetWidth = 1280;
        targetHeight = Math.round(1280 / aspectRatio);
      } else {
        targetHeight = 720;
        targetWidth = Math.round(720 * aspectRatio);
      }

      // Ensure dimensions are even numbers for H.264 / VP8 encoders
      targetWidth = targetWidth % 2 === 0 ? targetWidth : targetWidth - 1;
      targetHeight = targetHeight % 2 === 0 ? targetHeight : targetHeight - 1;

      if (onProgress) {
        onProgress(5, `Optimizing 1080p (${origWidth}x${origHeight}) to 720p HD (${targetWidth}x${targetHeight})...`);
      }

      // Pick supported mimeType
      const possibleTypes = [
        'video/mp4;codecs=avc1',
        'video/mp4',
        'video/webm;codecs=vp9',
        'video/webm;codecs=vp8',
        'video/webm'
      ];
      let selectedMimeType = '';
      for (const t of possibleTypes) {
        if (MediaRecorder.isTypeSupported(t)) {
          selectedMimeType = t;
          break;
        }
      }

      if (!selectedMimeType) {
        URL.revokeObjectURL(sourceUrl);
        return resolve({
          file: inputFile,
          originalSize,
          compressedSize: originalSize,
          wasCompressed: false,
          resolution: `${origWidth}x${origHeight} (Direct Pass)`
        });
      }

      try {
        const canvas = document.createElement('canvas');
        canvas.width = targetWidth;
        canvas.height = targetHeight;
        const ctx = canvas.getContext('2d', { alpha: false });

        if (!ctx) throw new Error('Could not create canvas context');

        // Create stream from canvas at 30 fps
        const canvasStream = canvas.captureStream(30);

        // Capture audio if available
        let audioStream: MediaStream | null = null;
        try {
          const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
          if (AudioContextClass) {
            const audioCtx = new AudioContextClass();
            const sourceNode = audioCtx.createMediaElementSource(video);
            const destNode = audioCtx.createMediaStreamDestination();
            sourceNode.connect(destNode);
            sourceNode.connect(audioCtx.destination);
            audioStream = destNode.stream;
          }
        } catch {}

        const combinedStream = new MediaStream([
          ...canvasStream.getVideoTracks(),
          ...(audioStream ? audioStream.getAudioTracks() : [])
        ]);

        // Target 2.5 Mbps bitrate for sharp 720p HD with compact file size
        const mediaRecorder = new MediaRecorder(combinedStream, {
          mimeType: selectedMimeType,
          videoBitsPerSecond: 2500000 // 2.5 Mbps
        });

        const chunks: Blob[] = [];
        mediaRecorder.ondataavailable = (e) => {
          if (e.data && e.data.size > 0) {
            chunks.push(e.data);
          }
        };

        let isCompleted = false;

        mediaRecorder.onstop = () => {
          if (isCompleted) return;
          isCompleted = true;
          URL.revokeObjectURL(sourceUrl);

          const ext = selectedMimeType.includes('mp4') ? '.mp4' : '.webm';
          const baseName = inputFile.name.replace(/\.[^/.]+$/, '');
          const outputBlob = new Blob(chunks, { type: selectedMimeType });
          const compressedFile = new File([outputBlob], `${baseName}_720p${ext}`, {
            type: selectedMimeType,
            lastModified: Date.now()
          });

          resolve({
            file: compressedFile,
            originalSize,
            compressedSize: compressedFile.size,
            wasCompressed: true,
            resolution: `${targetWidth}x${targetHeight} (720p HD)`
          });
        };

        mediaRecorder.start(1000); // 1-second chunks

        video.currentTime = 0;
        await video.play();

        let animFrameId: number;
        const drawFrame = () => {
          if (video.paused || video.ended) return;
          ctx.drawImage(video, 0, 0, targetWidth, targetHeight);

          if (duration && duration > 0 && onProgress) {
            const pct = Math.min(95, Math.round((video.currentTime / duration) * 100));
            onProgress(pct, `Converting to 720p HD: ${pct}% complete...`);
          }

          animFrameId = requestAnimationFrame(drawFrame);
        };

        drawFrame();

        video.onended = () => {
          cancelAnimationFrame(animFrameId);
          if (mediaRecorder.state !== 'inactive') {
            mediaRecorder.stop();
          }
        };

        video.onerror = () => {
          cancelAnimationFrame(animFrameId);
          URL.revokeObjectURL(sourceUrl);
          resolve({
            file: inputFile,
            originalSize,
            compressedSize: originalSize,
            wasCompressed: false,
            resolution: 'Original'
          });
        };

      } catch (err) {
        console.warn('In-browser 720p downscaler fallback:', err);
        URL.revokeObjectURL(sourceUrl);
        resolve({
          file: inputFile,
          originalSize,
          compressedSize: originalSize,
          wasCompressed: false,
          resolution: 'Original'
        });
      }
    };

    video.onerror = () => {
      URL.revokeObjectURL(sourceUrl);
      resolve({
        file: inputFile,
        originalSize,
        compressedSize: originalSize,
        wasCompressed: false,
        resolution: 'Original'
      });
    };
  });
}
