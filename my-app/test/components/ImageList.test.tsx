import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import ImageList from '@/app/components/ImageList';
import { ImageFile } from '@/app/types';

describe('ImageList Component', () => {
  const mockImages: ImageFile[] = [
    {
      id: '1',
      file: new File([''], 'test1.png', { type: 'image/png' }),
      name: 'test1.png',
      size: 1024,
      preview: 'blob:mock1',
      status: 'pending'
    },
    {
      id: '2',
      file: new File([''], 'test2.jpg', { type: 'image/jpeg' }),
      name: 'test2.jpg',
      size: 2048,
      preview: 'blob:mock2',
      status: 'converting'
    },
    {
      id: '3',
      file: new File([''], 'test3.jpg', { type: 'image/jpeg' }),
      name: 'test3.jpg',
      size: 4096,
      preview: 'blob:mock3',
      status: 'success'
    },
    {
      id: '4',
      file: new File([''], 'test4.png', { type: 'image/png' }),
      name: 'test4.png',
      size: 8192,
      preview: 'blob:mock4',
      status: 'error',
      errorMessage: 'Conversion failed'
    }
  ];

  it('returns null with empty list', () => {
    const { container } = render(<ImageList images={[]} />);
    expect(container).toBeEmptyDOMElement();
  });

  it('renders all image names, summaries, and statuses correctly', () => {
    render(<ImageList images={mockImages} />);

    // Check summaries (Total, Success tick, Error text)
    expect(screen.getByText((content, element) => content.includes('Total:'))).toBeInTheDocument();
    expect(screen.getAllByText(/^4$/).length).toBeGreaterThan(0); // length
    expect(screen.getByText('✓ 1')).toBeInTheDocument(); // success count
    expect(screen.getByText('✗ 1')).toBeInTheDocument(); // error count
    
    // Check pending item
    expect(screen.getByText('test1.png')).toBeInTheDocument();
    expect(screen.getByText('Pending')).toBeInTheDocument();

    // Check converting item
    expect(screen.getByText('test2.jpg')).toBeInTheDocument();
    expect(screen.getByText('Converting...')).toBeInTheDocument();

    // Check success item
    expect(screen.getByText('test3.jpg')).toBeInTheDocument();
    expect(screen.getByText('Success')).toBeInTheDocument();

    // Check error item and message
    expect(screen.getByText('test4.png')).toBeInTheDocument();
    expect(screen.getByText('Failed')).toBeInTheDocument();
  });
});
