import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import FileSizeControl from '@/app/components/FileSizeControl';
import { ImageFile } from '@/app/types';

describe('FileSizeControl Component', () => {
  const mockImages: ImageFile[] = [
    {
      id: '1',
      file: new File([''], 'test1.png', { type: 'image/png' }),
      name: 'test1.png',
      size: 1024 * 500,
      preview: 'blob:mock1',
      status: 'pending',
      targetSizeKB: 300,
    },
    {
      id: '2',
      file: new File([''], 'test2.jpg', { type: 'image/jpeg' }),
      name: 'test2.jpg',
      size: 1024 * 1024,
      preview: 'blob:mock2',
      status: 'pending',
      targetSizeKB: 300,
    },
  ];

  it('returns null when no images', () => {
    const { container } = render(
      <FileSizeControl
        images={[]}
        onSetAllMin={vi.fn()}
        onSetAllMax={vi.fn()}
        onSetTargetSize={vi.fn()}
      />
    );
    expect(container).toBeEmptyDOMElement();
  });

  it('renders header and bulk buttons', () => {
    render(
      <FileSizeControl
        images={mockImages}
        onSetAllMin={vi.fn()}
        onSetAllMax={vi.fn()}
        onSetTargetSize={vi.fn()}
      />
    );

    expect(screen.getByText('Target File Size')).toBeInTheDocument();
    expect(screen.getByText(/Set All to Min/i)).toBeInTheDocument();
    expect(screen.getByText(/Set All to Max/i)).toBeInTheDocument();
  });

  it('renders per-image rows with filenames', () => {
    render(
      <FileSizeControl
        images={mockImages}
        onSetAllMin={vi.fn()}
        onSetAllMax={vi.fn()}
        onSetTargetSize={vi.fn()}
      />
    );

    expect(screen.getByText('test1.png')).toBeInTheDocument();
    expect(screen.getByText('test2.jpg')).toBeInTheDocument();
  });

  it('calls onSetAllMin when Set All to Min is clicked', () => {
    const handleSetAllMin = vi.fn();
    render(
      <FileSizeControl
        images={mockImages}
        onSetAllMin={handleSetAllMin}
        onSetAllMax={vi.fn()}
        onSetTargetSize={vi.fn()}
      />
    );

    fireEvent.click(screen.getByText(/Set All to Min/i));
    expect(handleSetAllMin).toHaveBeenCalledTimes(1);
  });

  it('calls onSetAllMax when Set All to Max is clicked', () => {
    const handleSetAllMax = vi.fn();
    render(
      <FileSizeControl
        images={mockImages}
        onSetAllMin={vi.fn()}
        onSetAllMax={handleSetAllMax}
        onSetTargetSize={vi.fn()}
      />
    );

    fireEvent.click(screen.getByText(/Set All to Max/i));
    expect(handleSetAllMax).toHaveBeenCalledTimes(1);
  });

  it('calls onSetTargetSize when input changes', () => {
    const handleSetTargetSize = vi.fn();
    render(
      <FileSizeControl
        images={mockImages}
        onSetAllMin={vi.fn()}
        onSetAllMax={vi.fn()}
        onSetTargetSize={handleSetTargetSize}
      />
    );

    // Find the numeric inputs
    const inputs = screen.getAllByRole('spinbutton');
    expect(inputs).toHaveLength(2);

    // Change the first input
    fireEvent.change(inputs[0], { target: { value: '150' } });
    expect(handleSetTargetSize).toHaveBeenCalledWith('1', 150);
  });

  it('fires onSetTargetSize on blur with current value', () => {
    const handleSetTargetSize = vi.fn();
    render(
      <FileSizeControl
        images={mockImages}
        onSetAllMin={vi.fn()}
        onSetAllMax={vi.fn()}
        onSetTargetSize={handleSetTargetSize}
      />
    );

    const inputs = screen.getAllByRole('spinbutton') as HTMLInputElement[];

    // Blur without changing — should fire with the current prop value (300)
    fireEvent.blur(inputs[0]);
    expect(handleSetTargetSize).toHaveBeenLastCalledWith('1', 300);
  });

  it('disables inputs when disabled prop is true', () => {
    render(
      <FileSizeControl
        images={mockImages}
        onSetAllMin={vi.fn()}
        onSetAllMax={vi.fn()}
        onSetTargetSize={vi.fn()}
        disabled={true}
      />
    );

    const inputs = screen.getAllByRole('spinbutton');
    inputs.forEach((input) => {
      expect(input).toBeDisabled();
    });

    const buttons = screen.getAllByRole('button');
    buttons.forEach((btn) => {
      expect(btn).toBeDisabled();
    });
  });
});
