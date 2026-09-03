// Service to manage and request all browser permissions (Microphone, Camera, Audio)

export interface PermissionStatusState {
  microphone: 'granted' | 'denied' | 'prompt' | 'unsupported';
  camera: 'granted' | 'denied' | 'prompt' | 'unsupported';
  allGranted: boolean;
}

class PermissionsService {
  public async checkPermissions(): Promise<PermissionStatusState> {
    if (typeof window === 'undefined' || !navigator?.mediaDevices) {
      return {
        microphone: 'unsupported',
        camera: 'unsupported',
        allGranted: false
      };
    }

    let mic: 'granted' | 'denied' | 'prompt' | 'unsupported' = 'prompt';
    let cam: 'granted' | 'denied' | 'prompt' | 'unsupported' = 'prompt';

    try {
      if (navigator.permissions && navigator.permissions.query) {
        try {
          const micQuery = await navigator.permissions.query({ name: 'microphone' as any });
          mic = micQuery.state as any;
        } catch {
          // Some browsers restrict query for mic
        }

        try {
          const camQuery = await navigator.permissions.query({ name: 'camera' as any });
          cam = camQuery.state as any;
        } catch {
          // Some browsers restrict query for camera
        }
      }
    } catch (e) {
      console.warn('Permission query not supported:', e);
    }

    return {
      microphone: mic,
      camera: cam,
      allGranted: mic === 'granted' && cam === 'granted'
    };
  }

  // Requests both Microphone and Camera permissions in a single action
  public async requestAllPermissions(): Promise<{
    success: boolean;
    audio: boolean;
    video: boolean;
    message: string;
  }> {
    if (!navigator?.mediaDevices?.getUserMedia) {
      return {
        success: false,
        audio: false,
        video: false,
        message: 'Media devices API is not supported in this browser. Please use Chrome, Edge, or Safari.'
      };
    }

    let audioSuccess = false;
    let videoSuccess = false;

    // 1. Request combined Audio and Video stream
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true, video: true });
      // Clean up test tracks
      stream.getTracks().forEach(t => t.stop());
      audioSuccess = true;
      videoSuccess = true;
      return {
        success: true,
        audio: true,
        video: true,
        message: 'All permissions granted successfully! Microphone and Camera are ready.'
      };
    } catch (err: any) {
      console.warn('Combined permission request failed, testing individually:', err);

      // Try audio alone
      try {
        const audioStream = await navigator.mediaDevices.getUserMedia({ audio: true });
        audioStream.getTracks().forEach(t => t.stop());
        audioSuccess = true;
      } catch (aErr) {
        console.warn('Audio permission error:', aErr);
      }

      // Try video alone
      try {
        const videoStream = await navigator.mediaDevices.getUserMedia({ video: true });
        videoStream.getTracks().forEach(t => t.stop());
        videoSuccess = true;
      } catch (vErr) {
        console.warn('Video permission error:', vErr);
      }

      const allOk = audioSuccess && videoSuccess;
      return {
        success: allOk,
        audio: audioSuccess,
        video: videoSuccess,
        message: allOk
          ? 'All permissions granted!'
          : audioSuccess
          ? 'Microphone permission granted! (Camera permission was skipped or denied).'
          : videoSuccess
          ? 'Camera permission granted! (Microphone permission was skipped or denied).'
          : 'Permissions were blocked. Please click the camera/lock icon in your browser address bar to allow Microphone and Camera access.'
      };
    }
  }
}

export const permissionsService = new PermissionsService();
