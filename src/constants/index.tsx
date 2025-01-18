export const MAX_FILE_SIZE_MB = 1 // 5MB
export const MAX_FILE_SIZE = MAX_FILE_SIZE_MB * 1024 * 1024; // 5MB

export enum ProcessStatus {
  PREPARATION = 'preparation',
  UPLOADING_IMAGE = 'uploading',
  PROCESSING_IMAGE = 'processing',
  PROCESSING_FINISHED = 'succeed',
  PROCESSING_FAILED = 'failed',
}