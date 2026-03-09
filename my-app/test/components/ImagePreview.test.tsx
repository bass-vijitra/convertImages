import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import ImagePreview from '@/app/components/ImagePreview';
import { ImageFile } from '@/app/types';

describe('ImagePreview Component', () => {
  const mockImages: ImageFile[] = [
    {
      id: '1',
      file: new File([''], 'test1.png', { type: 'image/png' }),
      name: 'test1.png',
      size: 1024 * 500, // 500KB
      preview: 'blob:mock1',
      status: 'pending'
    },
    {
      id: '2',
      file: new File([''], 'test2.jpg', { type: 'image/jpeg' }),
      name: 'test2.jpg',
      size: 1024 * 1024 * 2.5, // 2.5MB
      preview: 'blob:mock2',
      status: 'pending'
    }
  ];

  it('renders list of images with correct labels and sizes', () => {
    render(<ImagePreview images={mockImages} onRemove={vi.fn()} disabled={false} />);
    
    expect(screen.getByText('test1.png')).toBeInTheDocument();
    expect(screen.getByText('500.0 KB')).toBeInTheDocument();
    
    expect(screen.getByText('test2.jpg')).toBeInTheDocument();
    expect(screen.getByText('2.5 MB')).toBeInTheDocument();
  });

  it('triggers onRemove when delete button is clicked', () => {
    const handleRemove = vi.fn();
    render(<ImagePreview images={mockImages} onRemove={handleRemove} disabled={false} />);
    
    // Get all delete buttons
    const deleteButtons = screen.getAllByRole('button');
    expect(deleteButtons).toHaveLength(2);
    
    // Click the first one
    fireEvent.click(deleteButtons[0]);
    expect(handleRemove).toHaveBeenCalledWith('1');
  });

  it('hides the remove button when disabled is true', () => {
    render(<ImagePreview images={mockImages} onRemove={vi.fn()} disabled={true} />);
    
    const deleteButtons = screen.queryAllByRole('button');
    expect(deleteButtons).toHaveLength(0); // Buttons shouldn't render
  });
});
