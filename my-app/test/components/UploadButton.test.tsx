import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import UploadButton from '@/app/components/UploadButton';

describe('UploadButton Component', () => {
  it('renders correctly', () => {
    render(<UploadButton onFilesSelected={vi.fn()} disabled={false} />);
    
    expect(screen.getByText(/Click or drag images here/i)).toBeInTheDocument();
    expect(screen.getByText(/Supports PNG, JPG/i)).toBeInTheDocument();
  });

  it('triggers onFilesSelected when files are chosen', () => {
    const handleFilesSelected = vi.fn();
    render(<UploadButton onFilesSelected={handleFilesSelected} disabled={false} />);
    
    const file = new File(['dummy content'], 'test.png', { type: 'image/png' });
    const input = document.querySelector('input[type="file"]') as HTMLInputElement;
    
    // Simulate file upload
    Object.defineProperty(input, 'files', {
      value: [file]
    });
    fireEvent.change(input);
    
    expect(handleFilesSelected).toHaveBeenCalledWith([file]);
  });

  it('is disabled when disabled prop is true', () => {
    const { container } = render(<UploadButton onFilesSelected={vi.fn()} disabled={true} />);
    
    const input = document.querySelector('input[type="file"]') as HTMLInputElement;
    expect(input.disabled).toBe(true);
    
    // Check for disabled styling on the wrapper
    expect(container.firstChild).toHaveClass('opacity-50', 'cursor-not-allowed');
  });

  it('filters out non-image files', () => {
    const handleFilesSelected = vi.fn();
    render(<UploadButton onFilesSelected={handleFilesSelected} disabled={false} />);
    
    const validFile = new File([''], 'test.png', { type: 'image/png' });
    const invalidFile = new File([''], 'test.pdf', { type: 'application/pdf' });
    const input = document.querySelector('input[type="file"]') as HTMLInputElement;
    
    Object.defineProperty(input, 'files', {
      value: [validFile, invalidFile]
    });
    fireEvent.change(input);
    
    // Should only call with the valid png
    expect(handleFilesSelected).toHaveBeenCalledWith([validFile]);
  });
});
