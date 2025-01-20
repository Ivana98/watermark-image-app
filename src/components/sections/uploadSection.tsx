import { ReactElement, useCallback, useState } from 'react';
import DragAndDropSection from '../baseComponents/dragAndDropSection';
import Button from '../baseComponents/button';
import Input from '../baseComponents/input';
import Alert from '../baseComponents/alert';
import Divider from '../baseComponents/divider';
import { MAX_FILE_SIZE, MAX_FILE_SIZE_MB } from 'src/constants';
import ImageDetails from '../baseComponents/imageDetails';

type UploadSectionProps = {
  onUpload: (selectedFile: File, watermarkText: string) => void;
};

const UploadSection = ({ onUpload }: UploadSectionProps): ReactElement => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [watermarkText, setWatermarkText] = useState('');

  const [invalidFormatMessage, setInvalidFormatMessage] = useState<string | null>(null);
  const [invalidSizeMessage, setInvalidSizeMessage] = useState<string | null>(null);

  const handleFileChanged = useCallback((files?: FileList) => {
    if (files && files.length > 0) {
      const validFormats = ['image/jpeg', 'image/png', 'image/webp'];
      const file = files[0];

      setInvalidFormatMessage(null);
      setInvalidSizeMessage(null);
      setSelectedFile(null);

      if (!validFormats.includes(file.type)) {
        const fileName = file.name.split('.')?.[1];
        setInvalidFormatMessage(`Uploaded file type (${fileName}) is not supported.`);
        return;
      }

      if (file.size > MAX_FILE_SIZE) {
        const fileSize = (file.size / (1024 * 1024)).toFixed(2);
        setInvalidSizeMessage(`File size (${fileSize} MB) exceeds the limit of ${MAX_FILE_SIZE_MB} MB.`);
        return;
      }

      setSelectedFile(file);
    }
  }, []);

  const onInputChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => setWatermarkText(e.target.value), []);
  const onRemoveFile = useCallback(() => setSelectedFile(null), []);
  const onCloseInvalidFormatAlert = useCallback(() => setInvalidFormatMessage(null), []);
  const onCloseInvalidSizeAlert = useCallback(() => setInvalidSizeMessage(null), []);

  return (
    <div className="w-full h-fit flex flex-col gap-6">
      <h3 className="text-lg">Chose photo and add watermark</h3>
      <div className="flex flex-col gap-4">
        <DragAndDropSection handleFileChanged={handleFileChanged} />
        {selectedFile && <ImageDetails file={selectedFile} onRemove={onRemoveFile} />}
        {invalidFormatMessage && (
          <Alert
            alertType="error"
            title="Invalid file type"
            message={invalidFormatMessage}
            onClose={onCloseInvalidFormatAlert}
          />
        )}
        {invalidSizeMessage && (
          <Alert
            alertType="error"
            title="File is too large"
            message={invalidSizeMessage}
            onClose={onCloseInvalidSizeAlert}
          />
        )}
        <Divider text="Customize your watermark" />
        <Input
          labelText="Watermark text:"
          labelIconVariant="signature"
          id="watermark-text"
          maxLength={32}
          placeholder="Watermarky"
          value={watermarkText}
          onChange={onInputChange}
        />
      </div>
      <div className="flex justify-end">
        <Button
          variant="filled"
          text="Upload"
          IconVariant="upload"
          disabled={!(watermarkText && !!selectedFile)}
          onClick={() => onUpload(selectedFile, watermarkText)}
        />
      </div>
    </div>
  );
};

export default UploadSection;
