import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import ConvertButton from '@/app/components/ConvertButton';

describe('ConvertButton Component', () => {
  const defaultProps = {
    onConvert: vi.fn(),
    onDownload: vi.fn(),
    imageCount: 0,
    isConverting: false,
    isComplete: false,
    successCount: 0,
  };

  it('returns null when imageCount is 0', () => {
    const { container } = render(<ConvertButton {...defaultProps} />);
    expect(container).toBeEmptyDOMElement();
  });

  it('shows Convert button in default state with > 0 images', () => {
    render(<ConvertButton {...defaultProps} imageCount={2} />);
    
    const btn = screen.getByRole('button');
    expect(btn).toHaveTextContent(/Convert to WebP/i);
    expect(btn).toHaveTextContent(/2 images/i);
    
    fireEvent.click(btn);
    expect(defaultProps.onConvert).toHaveBeenCalled();
  });

  it('shows converting state with a spinner when isConverting is true', () => {
    render(<ConvertButton {...defaultProps} imageCount={1} isConverting={true} />);
    
    const btn = screen.getByRole('button');
    expect(btn).toHaveTextContent(/Converting.../i);
    expect(btn).toBeDisabled();
  });

  it('shows Download ZIP button when isComplete and successCount > 0', () => {
    render(
      <ConvertButton 
        {...defaultProps} 
        imageCount={1} 
        isComplete={true} 
        successCount={1} 
      />
    );
    
    const btn = screen.getByRole('button');
    expect(btn).toHaveTextContent(/Download ZIP/i);
    expect(btn).not.toBeDisabled();
    
    fireEvent.click(btn);
    expect(defaultProps.onDownload).toHaveBeenCalled();
  });
});
