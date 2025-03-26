export enum ProcessStatus {
  PREPARATION = 'preparation',
  UPLOADING_IMAGE = 'uploading',
  PROCESSING_IMAGE = 'processing',
  PROCESSING_FINISHED = 'succeed',
  PROCESSING_FAILED = 'failed',
}

export type ImageEventData = {
  status: EventStatus;
  presigned_url?: string;
  error?: string;
}

export type EventStatus = 'success' | 'failed';

export type FinishStatus = ProcessStatus.PROCESSING_FAILED | ProcessStatus.PROCESSING_FINISHED;
